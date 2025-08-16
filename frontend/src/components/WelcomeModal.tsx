import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useAppStore } from '../store/appStore';

const WelcomeModal: React.FC = () => {
  const {
    showWelcomeModal,
    setShowWelcomeModal,
    setCurrentView,
    setCustomerType,
    setSessionId,
  } = useAppStore();

  const [selection, setSelection] = useState<'existing' | 'new' | null>(null);
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);
  
  const tokenInputRef = useRef<HTMLInputElement>(null);

  // Check if user has seen the modal before
  useEffect(() => {
    const seen = localStorage.getItem('homeLoanWelcomeSeen');
    if (seen) {
      setHasSeenModal(true);
      setShowWelcomeModal(false);
    }
  }, [setShowWelcomeModal]);

  // Auto-focus token input when existing customer is selected
  useEffect(() => {
    if (selection === 'existing' && tokenInputRef.current) {
      setTimeout(() => tokenInputRef.current?.focus(), 100);
    }
  }, [selection]);

  // Token validation
  const validateToken = (token: string): boolean => {
    const tokenPattern = /^HL\d{13}$/;
    if (!tokenPattern.test(token)) {
      setTokenError('Token must be in format: HL followed by 13 digits');
      return false;
    }
    setTokenError('');
    return true;
  };

  const handleClose = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('homeLoanWelcomeSeen', 'true');
  };

  const handleSkip = () => {
    setShowWelcomeModal(false);
    setCurrentView('home');
    localStorage.setItem('homeLoanWelcomeSeen', 'true');
  };

  const handleContinue = async () => {
    if (selection === 'existing') {
      if (!validateToken(token)) return;
      
      setIsLoading(true);
      // Simulate token validation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      
      setCustomerType('existing');
      setSessionId(token.trim());
      setCurrentView('chat');
    } else if (selection === 'new') {
      setCustomerType('new');
      setCurrentView('application');
    }
    
    localStorage.setItem('homeLoanWelcomeSeen', 'true');
    setShowWelcomeModal(false);
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setToken(value);
    if (tokenError) validateToken(value);
  };

  const isContinueDisabled = selection === null || (selection === 'existing' && !token.trim()) || isLoading;

  if (hasSeenModal) return null;

  return (
    <Dialog 
      open={showWelcomeModal} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        borderRadius: '12px 12px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HomeIcon />
          <Typography variant="h6">Welcome to Home Loan Assistant</Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          To provide you with the best experience, please let us know how we can help you today.
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Are you an existing customer or starting fresh?
          </Typography>
          <ToggleButtonGroup
            value={selection}
            exclusive
            onChange={(_, val) => {
              setSelection(val);
              setToken('');
              setTokenError('');
            }}
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                py: 2,
                px: 3,
                borderRadius: 2,
                border: '2px solid #e0e0e0',
                '&.Mui-selected': {
                  borderColor: '#1976d2',
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                },
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                }
              }
            }}
          >
            <ToggleButton value="new">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                <Typography variant="body2">New Customer</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Start your application
                </Typography>
              </Box>
            </ToggleButton>
            <ToggleButton value="existing">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <BusinessIcon />
                <Typography variant="body2">Existing Customer</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Continue with token
                </Typography>
              </Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {selection === 'existing' && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#f8f9fa', 
            borderRadius: 2, 
            border: '1px solid #e9ecef' 
          }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
              <BusinessIcon sx={{ mr: 1, fontSize: 20 }} />
              Retrieve Your Application
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Enter your application token to access your existing application and continue where you left off.
            </Typography>
            <TextField
              fullWidth
              placeholder="HL1234567890123"
              value={token}
              onChange={handleTokenChange}
              inputRef={tokenInputRef}
              error={!!tokenError}
              helperText={tokenError || "Format: HL followed by 13 digits"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1976d2',
                    }
                  }
                }
              }}
            />
            {token && !tokenError && (
              <Chip 
                label="Valid token format" 
                color="success" 
                size="small" 
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        )}

        {selection === 'new' && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#e8f5e8', 
            borderRadius: 2, 
            border: '1px solid #c8e6c9' 
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#2e7d32' }}>
              <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
              New Application Process
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              We'll guide you through the complete home loan application process step by step.
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button 
          onClick={handleSkip} 
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Skip for now
        </Button>
        <Button 
          variant="contained" 
          onClick={handleContinue} 
          disabled={isContinueDisabled}
          sx={{ 
            borderRadius: 2,
            minWidth: 120,
            '&:disabled': {
              backgroundColor: '#e0e0e0',
            }
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Continue'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeModal;