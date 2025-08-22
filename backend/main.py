from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import os
import tempfile
import json
from datetime import datetime
import logging
import re
import io

# Import existing modules
from s3_manager import S3ApplicationManager
from orchestration_agent import HomeLoanOrchestrator
from chatbot import HomeLoanChatbot
from utils import *

app = FastAPI(title="Home Loan Assistant API", version="1.0.0")

# Use uvicorn's logger so messages appear in server console
logger = logging.getLogger("uvicorn.error")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize managers
s3_manager = S3ApplicationManager()
orchestrator = HomeLoanOrchestrator()
chatbot = HomeLoanChatbot()

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    session_id: str

class ChatResponse(BaseModel):
    response: str
    show_form_button: bool = False
    show_upload_button: bool = False
    show_update_button: bool = False
    show_cancel_button: bool = False

class ApplicationForm(BaseModel):
    # Personal Information
    full_name: str
    date_of_birth: str
    phone: str
    email: str
    pan_number: str
    aadhar_number: int
    marital_status: str
    existing_loan_amount: float
    
    # Employment Information
    employment_status: str
    employer_name: str
    job_title: str
    employment_duration_years: int
    employment_duration_months: int
    monthly_income: float
    additional_income: float
    
    '''# Financial Information
    monthly_debt_payments: float
    credit_score: int
    down_payment: float
    savings_amount: float
    checking_balance: float
    investment_accounts: float
    retirement_accounts: float'''
    
    # Property Information
    property_type: str
    property_value: float
    property_address: str
    property_city: str
    property_state: str
    property_zip: str
    loan_purpose: str
    loan_amount: float
    loan_term: int

class ApplicationResponse(BaseModel):
    success: bool
    message: str
    application_id: Optional[str] = None

class FileMetadata(BaseModel):
    name: str
    type: str
    size: int

class DocumentResponse(BaseModel):
    name: str
    s3_path: str
    size: int
    last_modified: str
    file_id: str
    type: str

# In-memory storage for session data (replace with Redis in production)
sessions = {}


@app.get("/")
async def root():
    return {"message": "Home Loan Assistant API"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(chat_data: ChatMessage):
    """Handle chat interactions"""
    try:
        # Initialize session if not exists
        if chat_data.session_id not in sessions:
            sessions[chat_data.session_id] = {
                "chat_history": [{
                    "role": "assistant",
                    "content": "Hello! I'm your Home Loan Assistant. I can help you with information about home loans, eligibility, interest rates, and more. How can I assist you today?"
                }],
                "applications": {},
                "show_form_button": False,
                "show_upload_button": False,
                "show_update_button": False,
                "show_cancel_button": False,
                "current_application_id": None
            }
        
        session = sessions[chat_data.session_id]
        
        # First process application ID if present
        clean_msg = chat_data.message.replace(" ", "").upper()
        stripped_msg = chat_data.message.strip().upper()

        # Case 1: Message is exactly an application ID (with or without spaces)
        if re.fullmatch(r'HL\d{13}', clean_msg):
            session["current_application_id"] = clean_msg
            if clean_msg not in session["applications"]:
                session["applications"][clean_msg] = {"status": "standalone_id"}

        # Case 2: Application ID found within a larger message
        elif "HL" in stripped_msg:
            app_id_match = re.search(r'(?:^|\s)(H\s*L\s*(?:\d\s*){13})(?:$|\s)', stripped_msg)
            if app_id_match:
                clean_id = re.sub(r'\s+', '', app_id_match.group(1))
                if re.fullmatch(r'HL\d{13}', clean_id):
                    session["current_application_id"] = clean_id
                    if clean_id not in session["applications"]:
                        session["applications"][clean_id] = {"status": "found_in_chat"}
        
        # Then add user message to history
        session["chat_history"].append({
            "role": "user", 
            "content": chat_data.message
        })
        
        # Get response from chatbot
        response = chatbot.get_response(chat_data.message, session["chat_history"])
        print("response 56776567876",response)
        # Add assistant response to history
        session["chat_history"].append({
            "role": "assistant",
            "content": response
        })
        
        # Determine button visibility
        print(session)
        print(chat_data.message)
        user_wants_to_apply = "apply" in chat_data.message.lower() or "application" in chat_data.message.lower()
        assistant_suggests_apply = "application" in response.lower()
        user_wants_to_upload = "upload" in chat_data.message.lower() or "document" in chat_data.message.lower()

        # Show form button if user wants to apply or assistant suggests it
        session["show_form_button"] = user_wants_to_apply or assistant_suggests_apply

        # Show upload button if user asks to upload or if they have a pending application
        has_pending_application = session.get("application_status") == "pending_documents"
        session["show_upload_button"] = user_wants_to_upload or has_pending_application
        
        return ChatResponse(
            response=response,
            show_form_button=session["show_form_button"],
            show_upload_button=session["show_upload_button"],
            show_update_button=session["show_update_button"],
            show_cancel_button=session["show_cancel_button"]
        )
        
    except Exception as e:
        print(f"Chat error - Session: {chat_data.session_id if 'chat_data' in locals() else 'N/A'}")
        print(f"Error type: {type(e).__name__}")
        print(f"Error details: {str(e)}")
        print(f"Traceback: {e.__traceback__}")
        raise HTTPException(500, "Failed to process chat message")

@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history and button states for a session"""
    if session_id not in sessions:
        # Return a default state if session doesn't exist
        return {
            "history": [{
                "role": "assistant",
                "content": "Hello! I'm your Home Loan Assistant. How can I assist you today?"
            }],
            "show_upload_button": False
        }
    
    session = sessions[session_id]
    return {
        "history": session.get("chat_history", []),
        "show_form_button": session.get("show_form_button", False),
        "show_upload_button": session.get("show_upload_button", False),
        "show_update_button": session.get("show_update_button", False),
        "show_cancel_button": session.get("show_cancel_button", False)
    }

@app.get("/api/session/{session_id}")
async def get_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(404, "Session not found")
    return sessions[session_id]

@app.get('/api/session/{session_id}')
async def get_session_data(session_id: str):
    if session_id not in sessions:
        raise HTTPException(404, 'Session not found')
    
    return {
        'current_application_id': sessions[session_id].get('current_application_id'),
        'chat_history': sessions[session_id].get('chat_history', [])
    }

@app.post("/api/application", response_model=ApplicationResponse)
async def submit_application(request: Request, session_id: str = Form(...)):
    """Submit loan application (accepts multipart form data from the frontend)."""
    try:
        # Read all fields submitted as multipart/form-data
        form = await request.form()
        # Convert to a plain dict and exclude session_id (already captured)
        form_data = {k: v for k, v in form.items() if k != "session_id"}

        # Generate application ID using HL<timestamp> format
        # Reuse the existing generate_token() logic from utils.py
        application_id = generate_token()

        # Store application in session
        if session_id not in sessions:
            sessions[session_id] = {"applications": {}}

        sessions[session_id]["applications"][application_id] = form_data

        # Persist the application to S3 so it appears under:
        # s3://sarma-1/customers_data/<application_id>/<application_id>_basic_info.json
        try:
            s3_payload = {
                **form_data,
                "application_id": application_id,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
            s3_manager.save_application(application_id, s3_payload)
        except Exception as e:
            # Do not fail the request if S3 persistence fails; just proceed
            pass

        # Store application status as 'pending_documents' - workflow runs after upload
        sessions[session_id]["application_status"] = "pending_documents"
        sessions[session_id]["current_application_id"] = application_id
        
        # Add a chat message about successful submission and next steps
        if "chat_history" not in sessions[session_id]:
            sessions[session_id]["chat_history"] = []
        
        sessions[session_id]["chat_history"].append({
            "role": "assistant",
            "content": f"🎉 Great! Your loan application has been submitted successfully.\n\n📋 **Your Application ID:** {application_id}\n\n📄 **Next Step:** Please upload your required documents (income proof, ID proof, address proof, etc.) to complete your application. Click the 'Upload Documents' button below to get started."
        })
        print(sessions)
        # Set flags to show upload button in chat
        sessions[session_id]["show_upload_button"] = True
        sessions[session_id]["show_form_button"] = False
        
        return ApplicationResponse(
            success=True,
            message=f"Application submitted! Your ID is {application_id}. Please proceed to upload documents.",
            application_id=application_id
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/application/{application_id}/documents")
async def upload_document(
    application_id: str,
    file: UploadFile = File(...),
    session_id: str = Form(...),
    doc_type: str = Form(...),
):
    """Upload a document to S3 and associate with current application"""
    try:
        if not file:
            raise HTTPException(400, "No file provided")
            
        if session_id not in sessions:
            raise HTTPException(404, "Session not found")
            
        session_app_id = sessions[session_id].get("current_application_id")
        if not session_app_id:
            raise HTTPException(400, "No active application found")
        
        if application_id != session_app_id:
            raise HTTPException(400, "Application ID mismatch")
        print(file,application_id,doc_type)
        print(f"Uploading {doc_type} document for application {application_id}")
        
        try:
            # Handle both FastAPI UploadFile and regular file objects
            if hasattr(file, 'file'):  # FastAPI UploadFile
                # Create a copy of the file content before passing to S3
                file_content = file.file.read()
                file_obj = io.BytesIO(file_content)
                file_obj.name = file.filename  # Preserve original filename
            else:
                file_obj = file
                
            result = s3_manager.upload_document(application_id, file_obj, doc_type)
            print("result",result)
            return {"status": "success", "s3_path": result}
        except Exception as s3_error:
            print(f"S3 upload failed: {str(s3_error)}")
            raise HTTPException(500, "Failed to upload document to storage")
        
        # Store document metadata in session
        if "documents" not in sessions[session_id]:
            sessions[session_id]["documents"] = {}
        sessions[session_id]["documents"][result["file_id"]] = {
            "name": file.filename,
            "type": file.content_type,
            "size": result["size"],
            "s3_path": result["s3_path"]
        }
        
        return result
    except Exception as e:
        raise HTTPException(500, str(e))

@app.get("/api/documents/{token}")
async def list_documents(token: str):
    try:
        # Get documents from S3 for this application token
        documents = s3_manager.list_documents(token)
        return {"documents": documents}
    except Exception as e:
        raise HTTPException(500, f"Failed to list documents: {str(e)}")

@app.delete("/api/documents/{file_id}")
async def delete_document(
    file_id: str,  # Format: {token}_{doc_type}.ext (e.g. HL1755006612900_company.jpg)
    session_id: str = Query(..., description="The application token ID")
):
    """Delete a document"""
    print(f"Delete request - full_filename: {file_id}, token_id: {session_id}")
    try:
        # Verify the file_id starts with the session_id (token)
        if not file_id.startswith(session_id):
            raise HTTPException(400, "File does not belong to this application")
            
        print(f"Deleting document {file_id} for token {session_id}")
        s3_manager.delete_document(file_id,session_id)
        return {"status": "success"}
    except Exception as e:
        print(f"Delete failed: {str(e)}")
        raise HTTPException(500, f"Failed to delete document: {str(e)}")

@app.post("/api/application/{application_id}/process")
async def process_application(
    application_id: str,
    session_id: str = Form(...)
):
    """Process application with step-by-step workflow"""
    try:
        logger.info(f"Processing application {application_id} for session {session_id}")
        # 1. Validate application exists
        application_form = s3_manager.get_application(application_id)
        if not application_form:
            raise HTTPException(404, "Application form not found")
            
        # 2. Get and validate documents
        documents = s3_manager.list_documents(application_id)
        if len(documents) < 4:  # PAN, Aadhaar, CompanyID, Payslip
            raise HTTPException(400, "Please upload all required documents first")
            
        # Transform documents into required format
        document_paths = {
            doc['name'].split('.')[0]: doc['s3_path'] 
            for doc in documents
        }
        
        # 3. Prepare data for orchestrator
        applicant_data = {
            "application_id": application_id,
            "applicant_name": application_form.get("full_name"),
            "loan_amount": float(application_form.get("required_loan_amount", 0)),
            "monthly_income": float(application_form.get("monthly_income", 0)),
            "employment_status": application_form.get("employment_status"),
            "company_name": application_form.get("company_name"),
            "property_value": application_form.get("property_value"),
            "property_details": {
                "size_sqft": float(application_form.get("property_size_sqft", 0)),
                "property_type": application_form.get("property_type"),
                "city": application_form.get("property_location_city"),
                "area": application_form.get("property_location_area"),
                "age_years": int(application_form.get("property_age_years", 0)),
                "condition": application_form.get("property_condition")
            },
            "pan_number": application_form.get("pan_number"),
            "aadhar_number": application_form.get("aadhar_number")
        }
        logger.info(f"Applicant data prepared for {application_id}")
        # 4. Run orchestrator workflow
        result = orchestrator.run_workflow(applicant_data, document_paths)
        logger.info(f"Workflow completed for {application_id}")
        # Persist results JSON to S3 under {token}/{token}_results.json
        try:
            saved = s3_manager.save_results(application_id, result)
            if not saved:
                logger.error(f"Results not saved for {application_id}: save_results returned False")
            else:
                logger.info(f"Results saved to S3 for {application_id}")
        except Exception as e:
            # Do not fail processing if S3 persistence fails
            logger.exception(f"Exception while saving results for {application_id}: {e}")
        
        # 5. Update session and return results
        if session_id in sessions:
            sessions[session_id]["application_status"] = "processed"
            print("result",result)
            sessions[session_id]["processing_result"] = result
            
        return {
            "success": True,
            "message": "Application processed successfully",
            "result": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Failed to process application: {str(e)}")

@app.get('/api/application/{application_id}/results')
async def get_application_results(application_id: str, session_id: str = Query(..., description="The application token ID")):
    """Return raw JSON results for an application"""
    try:
        if not sessions.get(session_id, {}).get('processing_result'):
            raise HTTPException(404, 'No results found for this application')
        return sessions[session_id]['processing_result']
    except Exception as e:
        raise HTTPException(500, f'Failed to fetch results: {str(e)}')
