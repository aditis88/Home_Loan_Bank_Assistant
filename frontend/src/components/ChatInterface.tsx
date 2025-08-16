import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Container,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  SmartToy as BotIcon,
  Description as FormIcon,
  CloudUpload as UploadIcon,
  AccountBalance as BankIcon,
  Support as SupportIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { sendChatMessage } from '../services/api';

const ChatInterface: React.FC = () => {
  const {
    chatHistory,
    addChatMessage,
    sessionId,
    isLoading,
    setIsLoading,
    showUploadButton,
    setUIButtons,
    setCurrentView,
    setSessionId,
  } = useAppStore();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expectingToken, setExpectingToken] = useState(false);
  const [initialOptionsUsed, setInitialOptionsUsed] = useState(false);
  const [shouldShowOptions, setShouldShowOptions] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/chat/history/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          useAppStore.setState({
            chatHistory: data.history,
            showFormButton: data.show_form_button,
            showUploadButton: data.show_upload_button,
            showUpdateButton: data.show_update_button,
            showCancelButton: data.show_cancel_button
          });
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    if (sessionId) {
      fetchHistory();
    }
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (expectingToken) {
      const tokenVal = message.trim();
      addChatMessage({ role: 'user', content: tokenVal });
      setSessionId(tokenVal);
      setMessage('');
      setExpectingToken(false);
      setUIButtons({ showUploadButton: true }); 
      addChatMessage({ 
        role: 'assistant', 
        content: `Thank you. You can now upload documents for application ${tokenVal}.`
      });
      navigate('/documents');
      return;
    }

    const userMessage = { role: 'user' as const, content: message };
    addChatMessage(userMessage);
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(userMessage.content, sessionId);
      const assistantMessage = { role: 'assistant' as const, content: response.response };
      addChatMessage(assistantMessage);
      setUIButtons({
        showFormButton: response.show_form_button,
        showUploadButton: response.show_upload_button,
        showUpdateButton: response.show_update_button,
        showCancelButton: response.show_cancel_button,
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleGoToForm = () => {
    setUIButtons({ showFormButton: false });
    setInitialOptionsUsed(true);
    setCurrentView('application');
  };

  const handleOpenExisting = () => {
    addChatMessage({
      role: 'assistant',
      content: 'Please enter your application token.',
    });
    setExpectingToken(true);
    setInitialOptionsUsed(true);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 3 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 600,
          mb: 1
        }}>
          Chat Assistant
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get instant assistance with your home loan queries
        </Typography>
      </Box>

      {/* Main Content Area */}
      <Grid container spacing={4} sx={{ flex: 1 }}>
        {/* Chat Section */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
              {/* Chat Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', mb: 3 }}>
                {chatHistory.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      mb: 2,
                      alignItems: 'flex-start',
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main',
                        mx: 1,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {msg.role === 'user' ? <PersonIcon fontSize="small" /> : <BotIcon fontSize="small" />}
                    </Avatar>
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        backgroundColor: msg.role === 'user' ? 'primary.main' : 'grey.50',
                        color: msg.role === 'user' ? 'white' : 'text.primary',
                        borderRadius: 3,
                        boxShadow: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
                
                {isLoading && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mx: 1, width: 40, height: 40 }}>
                      <BotIcon fontSize="small" />
                    </Avatar>
                    <Paper sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Processing your request...
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                )}
                
                <div ref={messagesEndRef} />
              </Box>

              {/* Action Buttons */}
              {chatHistory.length > 0 &&
                chatHistory[chatHistory.length - 1].role === 'assistant' &&
                chatHistory[chatHistory.length - 1].content.includes('Are you an existing customer?') &&
                !initialOptionsUsed && (
                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<FormIcon />}
                    onClick={handleGoToForm}
                    sx={{ 
                      borderRadius: 2,
                      px: 4,
                      py: 1.5
                    }}
                  >
                    New Customer - Apply Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<UploadIcon />}
                    onClick={handleOpenExisting}
                    sx={{ 
                      borderRadius: 2,
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Existing Customer - Enter Token
                  </Button>
                </Box>
              )}

              {/* Upload Documents Button */}
              {showUploadButton && (
                <Box sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<UploadIcon />}
                    onClick={() => setCurrentView('upload')}
                    sx={{ 
                      borderRadius: 2,
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Upload Documents
                  </Button>
                </Box>
              )}

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {/* Message Input */}
              <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    disabled={isLoading}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'white',
                      },
                    }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      p: 1.5,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'grey.300',
                        color: 'grey.500',
                      },
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                  </IconButton>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Apply Online Card */}
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'primary.main'
                }}>
                  <FormIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Apply Online
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Get the best interest rates on your Home Loan!
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleGoToForm}
                  sx={{ borderRadius: 2 }}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            {/* Instant Call Back Card */}
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'secondary.main'
                }}>
                  <PhoneIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Instant Call Back
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Our loan expert can meet you at your doorstep.
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Request Call Back
                </Button>
              </CardContent>
            </Card>

            {/* Locate Branch Card */}
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Avatar sx={{ 
                  width: 60, 
                  height: 60, 
                  mx: 'auto', 
                  mb: 2,
                  bgcolor: 'success.main'
                }}>
                  <BankIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Visit Branch
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Find the branch nearest to you.
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Locate Us
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatInterface;
