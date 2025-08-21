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
  AccountBalance as BankIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
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

  const [selection, setSelection] = useState<'customer' | 'portfolio' | null>(null);
  const [tokenId, setTokenId] = useState('');
  const [tokenIdError, setTokenIdError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSeenModal, setHasSeenModal] = useState(false);
  
  const tokenIdInputRef = useRef<HTMLInputElement>(null);

  // Check if user has seen the modal before
  useEffect(() => {
    const seen = localStorage.getItem('homeLoanWelcomeSeen');
    if (seen) {
      setHasSeenModal(true);
      setShowWelcomeModal(false);
    }
  }, [setShowWelcomeModal]);

  // Auto-focus token ID input when customer search is selected
  useEffect(() => {
    if (selection === 'customer' && tokenIdInputRef.current) {
      setTimeout(() => tokenIdInputRef.current?.focus(), 100);
    }
  }, [selection]);

  // Token ID validation
  const validateTokenId = (id: string): boolean => {
    const idPattern = /^HL\d{13}$/;
    if (!idPattern.test(id)) {
      setTokenIdError('Token must be in format: HL followed by 13 digits');
      return false;
    }
    setTokenIdError('');
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
    if (selection === 'customer') {
      if (!validateTokenId(tokenId)) return;
      
      setIsLoading(true);
      // Simulate token lookup (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      
      setCustomerType('existing');
      setSessionId(tokenId.trim());
      setCurrentView('chat');
    } else if (selection === 'portfolio') {
      setCustomerType('new');
      setCurrentView('application');
    }
    
    localStorage.setItem('homeLoanWelcomeSeen', 'true');
    setShowWelcomeModal(false);
  };

  const handleTokenIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setTokenId(value);
    if (tokenIdError) validateTokenId(value);
  };

  const isContinueDisabled = selection === null || (selection === 'customer' && !tokenId.trim()) || isLoading;

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
          <BankIcon />
          <Typography variant="h6">Welcome to Loan Management System</Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          How would you like to access the loan management system today?
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Choose your access method:
          </Typography>
          <ToggleButtonGroup
            value={selection}
            exclusive
            onChange={(_, val) => {
              setSelection(val);
              setTokenId('');
              setTokenIdError('');
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
            <ToggleButton value="customer">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <SearchIcon />
                <Typography variant="body2">Loan Token Search</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Look up specific application
                </Typography>
              </Box>
            </ToggleButton>
            <ToggleButton value="portfolio">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <BusinessIcon />
                <Typography variant="body2">Portfolio Overview</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  View all applications
                </Typography>
              </Box>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {selection === 'customer' && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#f8f9fa', 
            borderRadius: 2, 
            border: '1px solid #e9ecef' 
          }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
              <SearchIcon sx={{ mr: 1, fontSize: 20 }} />
              Loan Application Lookup
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              Enter a loan token to access the application details and documents.
            </Typography>
            <TextField
              fullWidth
              placeholder="HL1234567890123"
              value={tokenId}
              onChange={handleTokenIdChange}
              inputRef={tokenIdInputRef}
              error={!!tokenIdError}
              helperText={tokenIdError || "Format: HL followed by 13 digits"}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  }
                }
              }}
            />
            {tokenId && !tokenIdError && (
              <Chip 
                label="Valid token format" 
                color="success" 
                size="small" 
                sx={{ mt: 1 }} 
              />
            )}
          </Box>
        )}

        {selection === 'portfolio' && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#e8f5e8', 
            borderRadius: 2, 
            border: '1px solid #c8e6c9' 
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#2e7d32' }}>
              <BusinessIcon sx={{ mr: 1, fontSize: 20 }} />
              Portfolio Management
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Access the complete loan portfolio overview, analytics, and management tools.
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