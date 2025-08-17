import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useAppStore } from '../store/appStore';
import axios from 'axios';

declare global {
  interface Window {
    _debugLog?: string[];
  }
}

interface AppState {
  currentApplicationId: string;
  sessionId: string;
  setCurrentView: (view: string) => void;
  // ... other store properties
}

const RawResults: React.FC = () => {
  const { sessionId, currentApplicationId, setCurrentView } = useAppStore();
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('Basic log test - should appear in browser console');
  console.warn('Warning test - should appear in browser console');
  console.error('Error test - should appear in browser console');
  console.log('Current environment:', process.env.NODE_ENV);
  console.log('RawResults component mounted');

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      // Fail-safe logging methods
      if (!window._debugLog) window._debugLog = [];
      window._debugLog.push(`Fetching results at ${new Date().toISOString()}`);
      
      // Multiple logging channels
      console.log('[DEBUG] Fetching results:', { currentApplicationId, sessionId });
      console.info('[INFO] API URL:', `/api/application/${currentApplicationId}/results?session_id=${sessionId}`);
      console.warn('[WARN] Test warning message');
      
      // Direct DOM logging as fallback
      const debugEl = document.getElementById('debug-output') || document.createElement('div');
      debugEl.id = 'debug-output';
      debugEl.textContent += `\nFetching ${currentApplicationId} at ${new Date().toLocaleTimeString()}`;
      document.body.appendChild(debugEl);
      
      console.log('Full API URL:', `/api/application/${currentApplicationId}/results?session_id=${sessionId}`);
      console.log('API Request:', {
        url: `/api/application/${currentApplicationId}/results?session_id=${sessionId}`,
        method: 'GET',
        ids: { currentApplicationId, sessionId }
      });
      
      if (!currentApplicationId || !sessionId) {
        console.error('Missing IDs:', { currentApplicationId, sessionId });
        setError('Missing application ID or session ID');
        return;
      }
      
      const response = await axios.get(
        `/api/application/${currentApplicationId}/results?session_id=${sessionId}`
      );
      console.log('API Response:', response);
      setResults(response.data);
    } catch (err: any) {
      console.error('Error fetching results:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to load results';
      setError(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        variant="outlined" 
        onClick={() => setCurrentView('results')}
        sx={{ mb: 2 }}
      >
        Back to Formatted Results
      </Button>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Raw JSON Results
        </Typography>
        <pre style={{ overflowX: 'auto' }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </Paper>
    </Box>
  );
};

export default RawResults;
