# Home Loans RAG React Application

A modern React-based frontend for home loan processing, featuring AI-powered document validation and application assistance.

## 🚀 Key Features

- **AI Chat Assistant**: Conversational interface for loan queries
- **Document Processing**: Secure upload and validation of financial documents
- **Application Wizard**: Step-by-step loan application form
- **Real-time Tracking**: Dashboard for application status

## 🛠️ Technical Stack

- React 18 with TypeScript
- Material-UI v5 components
- React Router v6
- Axios for API integration
- React Query for data management

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Application views
│   ├── store/       # State management
│   ├── utils/       # Helper functions
│   ├── App.tsx      # Root component
│   └── index.tsx    # Entry point
```

## 🏁 Getting Started

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run development server:
```bash
npm start
```

3. Open http://localhost:3000 in your browser

## 🔗 Backend Integration

The frontend communicates with:
- Document validation service
- AI chat service
- Loan application API

# Home Loan AI Assistant - React Frontend

## Project Overview
A comprehensive home loan processing platform featuring:
- **React-based** user interface with Material-UI components
- **AI-powered** document validation and processing
- **Multi-agent** backend system for loan evaluation
- **Real-time** application tracking dashboard

## Core Components

### Frontend Features
- Interactive chat interface with loan specialists
- Document upload with instant validation feedback
- Step-by-step application form with auto-save
- Responsive design for all device types

### Technical Architecture
- **Frontend**: React 18 + TypeScript + Material-UI
- **State Management**: Redux Toolkit
- **API Integration**: Axios with JWT authentication
- **Build System**: Vite + ESLint + Prettier

### Backend Integration
The React frontend seamlessly connects to:
- Document processing pipeline
- AI valuation agents
- Loan approval workflow engine
- Customer data management system





# Home Loan Application System-Technical Backend

A goal-seeking, agentic AI system that automates and accelerates the home loan application process using **LangGraph** for agent orchestration, **React** and **FastAPI** for the user interface, and **AWS Bedrock** with **S3** for enhanced capabilities.

## 🏗️ System Architecture

The system consists of 6 specialized agents working in a coordinated workflow:

1. **Intake Agent** - Conversational bot to collect user intent and basic details (AWS Bedrock + S3)
2. **Document Validator Agent** - OCR + logic-based verification of PAN, ID, payslip, and property title
3. **Credit Score Agent** - Integrates with mock credit bureau to fetch and interpret score
4. **Property Valuation Agent** - Pulls data from a mock CoreLogic-style API
5. **Eligibility Agent** - Applies bank-specific lending rules (LTV, DTI, employment status)
6. **Approval Recommender Agent** - Suggests approve/reject/escalate with reasoning

## 🔄 Workflow

```
User Input → Intake Agent → Parallel Processing → Eligibility → Approval
                                    ↓
                    [Document Validator, Credit Score, Property Valuation]
```

1. **Intake Agent** collects user information via Streamlit chatbot with AWS Bedrock
2. **Document Validator**, **Credit Score**, and **Property Valuation** agents work in parallel
3. **Eligibility Agent** evaluates loan eligibility based on all results
4. **Approval Recommender Agent** provides final recommendation
5. **S3 Storage** securely stores completed applications

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- AWS Account with Bedrock and S3 access
- AWS credentials configured

## 🤖 Agent Details

### Intake Agent (Enhanced with AWS Bedrock + S3)
- **Purpose**: Collects comprehensive user information through natural conversation
- **Features**: 
  - AWS Bedrock integration for enhanced LLM capabilities
  - S3 storage for secure application data
  - Enhanced field validation and data extraction
  - Improved conversational flow with intent recognition
  - Progressive information gathering
  - Validation and confirmation

### Document Validator Agent
- **Purpose**: Validates uploaded documents using OCR and verification logic
- **Features**:
  - PAN card validation
  - ID proof verification
  - Payslip analysis
  - Property title verification
  - Fraud detection

### Credit Score Agent
- **Purpose**: Fetches and analyzes credit scores from multiple bureaus
- **Features**:
  - Multi-bureau credit score aggregation
  - Risk assessment
  - Payment history analysis
  - Credit utilization evaluation

### Property Valuation Agent
- **Purpose**: Determines property value using market data and comparable sales
- **Features**:
  - Comparable sales analysis
  - Market trend evaluation
  - Location-based adjustments
  - Multiple valuation methods

### Eligibility Agent
- **Purpose**: Applies lending rules and determines eligibility
- **Features**:
  - LTV (Loan-to-Value) ratio calculation
  - DTI (Debt-to-Income) ratio analysis
  - Employment verification
  - Risk scoring

### Approval Recommender Agent
- **Purpose**: Makes final approval decisions with reasoning
- **Features**:
  - Risk-based decision making
  - Conditional approval logic
  - Escalation criteria
  - Detailed reasoning

## 🔧 Configuration

The system is highly configurable through `config.py`:

- **Lending Rules**: LTV ratios, DTI limits, credit score requirements
- **Agent Settings**: Timeouts, confidence thresholds, retry attempts
- **AWS Configuration**: Bedrock model selection, S3 bucket settings
- **Workflow Settings**: Execution timeouts, parallel processing limits

## 🎯 Key Features

- **AWS Bedrock Integration**: Enhanced LLM capabilities with Claude 3 Sonnet
- **S3 Storage**: Secure storage of application data in AWS S3
- **Conversational Interface**: Natural language interaction with the Intake Agent
- **Parallel Processing**: Multiple agents work simultaneously for efficiency
- **Comprehensive Validation**: Document, credit, and property verification
- **Risk Assessment**: Multi-factor risk analysis and scoring
- **Configurable Rules**: Flexible lending criteria and thresholds
- **Detailed Reporting**: Complete audit trail and reasoning
