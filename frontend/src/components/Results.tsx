import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Avatar,
  Badge,
  Tabs,
  Tab,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Home as HomeIcon,
  CreditCard as CreditCardIcon,
  Description as DocumentIcon,
  Person as PersonIcon,
  AttachMoney as LoanIcon,
  Timeline as TimelineIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Star as StarIcon,
  CloudUpload as UploadIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { useAppStore } from '../store/appStore';
import axios from 'axios';
import { styled } from '@mui/material/styles';

// Custom styled components
const GradientPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  padding: theme.spacing(4),
  borderRadius: '12px',
  marginBottom: theme.spacing(4),
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
}));

const MetricCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  borderLeft: '4px solid',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
  }
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '0.9rem',
  padding: theme.spacing(1),
  borderRadius: '8px'
}));

interface AnalysisResults {
  creditScore?: {
    score: number;
    category: string;
    message: string;
    riskAssessment?: {
      riskLevel: string;
      riskFactors: string[];
      riskMitigationSuggestions?: string[];
    };
  };
  propertyValuation?: {
    estimatedValue: number;
    pricePerSqft: number;
    confidenceScore?: number;
    propertyData: {
      area: string;
      propertyType: string;
      sizeSqft: number;
      ageYears: number;
      condition: string;
    };
  };
  documentValidation?: {
    applicantName: string;
    panNumber: string;
    dateOfBirth: string;
    grossMonthlySalary: number;
    validation: {
      overallStatus: string;
      checks: Array<{
        check: string;
        status: string;
        value?: string;
        reason?: string;
      }>;
    };
  };
  eligibility?: {
    status: string;
    message?: string;
  };
  approvalRecommendation?: {
    recommendation: string;
    table: Array<{
      option: string;
      loan_amount: string;
      interest_rate: string;
      tenure: string;
      monthly_emi: string;
      eligibility: string;
    }>;
  };
}

const Results: React.FC = () => {
  const { processingResult, sessionId, setCurrentView, currentApplicationId } = useAppStore();
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedResults, setStoredResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showRawJson, setShowRawJson] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      
      if (!currentApplicationId || !sessionId) {
        setError('Missing application ID or session ID');
        return;
      }
      
      const response = await axios.get(
        `/api/application/${currentApplicationId}/results?session_id=${sessionId}`
      );
      setAnalysisResults(response.data);
    } catch (err: any) {
      console.error('Error fetching results:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to load results';
      setError(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Fetching results for:', { currentApplicationId, sessionId });
    fetchResults();
  }, [currentApplicationId, sessionId]);

  useEffect(() => {
    console.log('Processing results data:', processingResult);
    if (processingResult) {
      setAnalysisResults(processingResult);
    }
  }, [processingResult]);

  useEffect(() => {
    console.log('Current analysis results:', analysisResults);
    if (analysisResults) {
      setAnalysisResults(analysisResults);
    }
  }, [analysisResults]);

  const getStatusColor = (status?: string) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'success': 
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'failure': 
      case 'denied': 
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderProgressSteps = () => {
    const steps = [
      { label: 'Document Verification', icon: <DocumentIcon />, completed: true },
      { label: 'Credit Check', icon: <CreditCardIcon />, completed: true },
      { label: 'Property Valuation', icon: <HomeIcon />, completed: true },
      { label: 'Eligibility', icon: <VerifiedIcon />, completed: analysisResults?.eligibility?.status !== 'error' },
      { label: 'Approval', icon: <CheckIcon />, completed: analysisResults?.eligibility?.status === 'approved' }
    ];

    return (
      <Box sx={{ mb: 4 }}>
        <LinearProgress 
          variant="determinate" 
          value={analysisResults?.eligibility?.status !== 'error' ? 100 : 80} 
          sx={{ height: 8, borderRadius: 4, mb: 2 }}
        />
        <Grid container spacing={2}>
          {steps.map((step, index) => (
            <Grid item xs={12} sm key={index}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                bgcolor: step.completed ? 'success.light' : 'action.selected'
              }}>
                <Avatar sx={{ 
                  bgcolor: step.completed ? 'success.main' : 'action.disabled',
                  mr: 2,
                  width: 32,
                  height: 32
                }}>
                  {step.icon}
                </Avatar>
                <Typography variant="body2" fontWeight="medium">
                  {step.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderCreditScoreCard = () => {
    if (!analysisResults?.creditScore) return null;
    
    const score = analysisResults.creditScore.score;
    let color = '#F44336';
    if (score >= 750) color = '#4CAF50';
    else if (score >= 650) color = '#8BC34A';
    else if (score >= 550) color = '#FFC107';

    return (
      <Card sx={{ p: 3, borderRadius: '12px' }}>
        <Typography variant="h6" gutterBottom>
          <CreditCardIcon sx={{ mr: 1 }} /> Your Credit Score
        </Typography>
        
        {/* Credit score visualization */}
        <Box sx={{
          width: 150,
          height: 150,
          margin: '0 auto 16px',
          borderRadius: '50%',
          background: `conic-gradient(${color} 0% ${score/10}%, #e0e0e0 ${score/10}% 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <Box sx={{
            background: 'white',
            width: 120,
            height: 120,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Typography variant="h3" fontWeight="bold" sx={{ color }}>
              {analysisResults?.creditScore?.score ?? 0}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="h6" sx={{ color, mb: 1 }}>
          {analysisResults?.creditScore?.category ?? 'Not rated'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {analysisResults?.creditScore?.message ?? 'Credit score information not available'}
        </Typography>
      </Card>
    );
  };

  if (loading) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Loading results...</Typography>
    </Box>
  );

  if (error) return (
    <Box sx={{ p: 4 }}>
      <Alert severity="error">
        <Typography variant="h6">Error loading results</Typography>
        <Typography>{error}</Typography>
      </Alert>
    </Box>
  );

  if (!analysisResults) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography>No results available</Typography>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <GradientPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              📊 Loan Application Dashboard
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Your personalized loan recommendations and analysis
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <StatusChip
              icon={analysisResults?.eligibility?.status !== 'error' ? 
                <CheckIcon /> : <CancelIcon />}
              label={analysisResults?.eligibility?.status?.toUpperCase() || 'ERROR'}
              color={getStatusColor(analysisResults?.eligibility?.status || 'error') as any}
              sx={{ fontSize: '1rem', px: 2, py: 1 }}
            />
            <Button 
              variant="contained" 
              onClick={() => setCurrentView('rawResults')}
              startIcon={<CodeIcon />}
              sx={{ 
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              View Raw Data
            </Button>
          </Box>
        </Box>
      </GradientPaper>

      {/* Raw JSON */}
      {showRawJson && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Raw JSON Data</Typography>
          <pre style={{ overflowX: 'auto' }}>
            {JSON.stringify(analysisResults, null, 2)}
          </pre>
        </Paper>
      )}

      {/* Application Progress */}
      {renderProgressSteps()}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <MetricCard sx={{ borderLeftColor: '#2196F3' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TimelineIcon sx={{ mr: 1, color: '#2196F3' }} />
              <Typography variant="subtitle1">Credit Score</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {analysisResults?.creditScore?.score?.toLocaleString('en-IN') ?? 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {analysisResults?.creditScore?.category ?? 'Not rated'}
            </Typography>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <MetricCard sx={{ borderLeftColor: '#4CAF50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <HomeIcon sx={{ mr: 1, color: '#4CAF50' }} />
              <Typography variant="subtitle1">Property Value</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(analysisResults?.propertyValuation?.estimatedValue ?? 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {analysisResults?.propertyValuation?.pricePerSqft ? `${formatCurrency(analysisResults.propertyValuation.pricePerSqft)}/sq.ft` : 'Not available'}
            </Typography>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <MetricCard sx={{ borderLeftColor: '#9C27B0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LoanIcon sx={{ mr: 1, color: '#9C27B0' }} />
              <Typography variant="subtitle1">Monthly Income</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(analysisResults?.documentValidation?.grossMonthlySalary ?? 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gross monthly salary
            </Typography>
          </MetricCard>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <MetricCard sx={{ borderLeftColor: '#FF9800' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WarningIcon sx={{ mr: 1, color: '#FF9800' }} />
              <Typography variant="subtitle1">Risk Level</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {analysisResults?.creditScore?.riskAssessment?.riskLevel ?? 'Medium'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on your profile
            </Typography>
          </MetricCard>
        </Grid>
      </Grid>

      {/* Tabs Navigation */}
      <Tabs 
        value={activeTab} 
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 3,
          '& .MuiTabs-indicator': {
            height: 4,
            borderRadius: '2px 2px 0 0'
          }
        }}
      >
        <Tab label="Overview" icon={<AssessmentIcon />} iconPosition="start" />
        <Tab label="Documents" icon={<DocumentIcon />} iconPosition="start" />
        <Tab label="Property" icon={<HomeIcon />} iconPosition="start" />
        <Tab label="Credit" icon={<CreditCardIcon />} iconPosition="start" />
        <Tab label="Recommendations" icon={<StarIcon />} iconPosition="start" />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ mb: 4 }}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} /> Applicant Details
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Applicant Name" 
                        secondary={analysisResults?.documentValidation?.applicantName ?? 'Not available'} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText 
                        primary="PAN Number" 
                        secondary={analysisResults?.documentValidation?.panNumber ?? 'Not available'} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText 
                        primary="Date of Birth" 
                        secondary={analysisResults?.documentValidation?.dateOfBirth ?? 'Not available'} 
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText 
                        primary="Monthly Income" 
                        secondary={formatCurrency(analysisResults?.documentValidation?.grossMonthlySalary ?? 0)} 
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <VerifiedIcon sx={{ mr: 1 }} /> Document Validation
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Overall Status" 
                        secondary={
                          <Chip 
                            label={analysisResults?.documentValidation?.validation?.overallStatus ?? 'Pending'} 
                            color={getStatusColor(analysisResults?.documentValidation?.validation?.overallStatus || 'pending')} 
                            size="small" 
                          />
                        } 
                      />
                    </ListItem>
                    <Divider component="li" />
                    {analysisResults?.documentValidation?.validation?.checks?.map((check, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText 
                            primary={check.check}
                            secondary={check.status === 'Success' ? 
                              <Chip label="Valid" color="success" size="small" /> :
                              <Box>
                                <Chip label={check.status} color={getStatusColor(check.status)} size="small" sx={{ mb: 1 }} />
                                {check.reason && <Typography variant="body2" color="text.secondary">{check.reason}</Typography>}
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < (analysisResults.documentValidation?.validation?.checks?.length ?? 0) - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Card sx={{ p: 3, borderRadius: '12px' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DocumentIcon sx={{ mr: 1 }} /> Document Verification
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderLeft: '4px solid #4CAF50', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Badge color="success" badgeContent="✓" sx={{ mr: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.light' }}>
                        <DocumentIcon color="success" />
                      </Avatar>
                    </Badge>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Aadhaar Card
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Status: Valid
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Name: {analysisResults?.documentValidation?.applicantName ?? 'Not available'}
                  </Typography>
                  <Typography variant="body2">
                    DOB: {analysisResults?.documentValidation?.dateOfBirth ?? 'Not available'}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderLeft: '4px solid #4CAF50', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Badge color="success" badgeContent="✓" sx={{ mr: 2 }}>
                      <Avatar sx={{ bgcolor: 'success.light' }}>
                        <DocumentIcon color="success" />
                      </Avatar>
                    </Badge>
                    <Typography variant="subtitle1" fontWeight="medium">
                      PAN Card
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Status: Valid
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    PAN: {analysisResults?.documentValidation?.panNumber ?? 'Not available'}
                  </Typography>
                  <Typography variant="body2">
                    Name: {analysisResults?.documentValidation?.applicantName ?? 'Not available'}
                  </Typography>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderLeft: '4px solid #F44336', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Badge color="error" badgeContent="✗" sx={{ mr: 2 }}>
                      <Avatar sx={{ bgcolor: 'error.light' }}>
                        <DocumentIcon color="error" />
                      </Avatar>
                    </Badge>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Company ID
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Status: Invalid
                  </Typography>
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Company ID card is expired or validity date could not be read.
                  </Alert>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderLeft: '4px solid #FF9800', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Badge color="warning" badgeContent="!" sx={{ mr: 2 }}>
                      <Avatar sx={{ bgcolor: 'warning.light' }}>
                        <DocumentIcon color="warning" />
                      </Avatar>
                    </Badge>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Payslip
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Status: Warning
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Salary: {formatCurrency(analysisResults?.documentValidation?.grossMonthlySalary ?? 0)}
                  </Typography>
                  <Alert severity="warning" sx={{ mt: 1 }}>
                    Payslip is not recent or date could not be parsed.
                  </Alert>
                </Card>
              </Grid>
            </Grid>
          </Card>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <HomeIcon sx={{ mr: 1 }} /> Property Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography>
                        {analysisResults?.propertyValuation?.propertyData?.area ?? 'Not available'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Type
                      </Typography>
                      <Typography>
                        {analysisResults?.propertyValuation?.propertyData?.propertyType ?? 'Not available'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Size
                      </Typography>
                      <Typography>
                        {analysisResults?.propertyValuation?.propertyData?.sizeSqft ?? 'Not available'} sq.ft
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Age
                      </Typography>
                      <Typography>
                        {analysisResults?.propertyValuation?.propertyData?.ageYears ?? 'Not available'} years
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Condition
                      </Typography>
                      <Typography>
                        {analysisResults?.propertyValuation?.propertyData?.condition ?? 'Condition not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Confidence Score
                      </Typography>
                      <Typography>
                        {analysisResults?.propertyValuation?.confidenceScore ? 
                          `${(analysisResults.propertyValuation.confidenceScore * 100).toFixed(0)}%` : 'Not available'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: '12px',
                background: 'linear-gradient(145deg, #e8f5e9 0%, #ffffff 100%)'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <LoanIcon sx={{ mr: 1 }} /> Valuation Summary
                  </Typography>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(analysisResults?.propertyValuation?.estimatedValue ?? 0)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Estimated Property Value
                    </Typography>
                  </Box>
                  <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                    <Grid item xs={4}>
                      <Typography variant="h6">
                        {formatCurrency(analysisResults?.propertyValuation?.pricePerSqft ?? 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Per Sq.Ft
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6">
                        {analysisResults?.propertyValuation?.propertyData?.sizeSqft ?? 'Not available'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sq.Ft
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6">
                        {analysisResults?.propertyValuation?.confidenceScore ? 
                          `${(analysisResults.propertyValuation.confidenceScore * 100).toFixed(0)}%` : 'Not available'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Confidence
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && renderCreditScoreCard()}

        {activeTab === 4 && (
          <Box>
            <Card sx={{ mb: 3, p: 3, borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ mr: 1 }} /> Loan Recommendation
              </Typography>
              <Typography paragraph>
                {analysisResults?.approvalRecommendation?.recommendation ?? 'No recommendation available.'}
              </Typography>
            </Card>

            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssessmentIcon sx={{ mr: 1 }} /> Available Loan Options
            </Typography>
            
            <TableContainer component={Paper} sx={{ borderRadius: '12px', mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Option</TableCell>
                    <TableCell align="right">Loan Amount</TableCell>
                    <TableCell align="right">Interest Rate</TableCell>
                    <TableCell align="right">Tenure (years)</TableCell>
                    <TableCell align="right">Monthly EMI</TableCell>
                    <TableCell align="right">Eligibility</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analysisResults?.approvalRecommendation?.table?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">{row.option}</TableCell>
                      <TableCell align="right">{row.loan_amount}</TableCell>
                      <TableCell align="right">{row.interest_rate}</TableCell>
                      <TableCell align="right">{row.tenure}</TableCell>
                      <TableCell align="right">{row.monthly_emi}</TableCell>
                      <TableCell align="right">
                        <Chip 
                          label={row.eligibility} 
                          color={row.eligibility === 'Eligible' ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Card sx={{ p: 3, borderRadius: '12px' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ mr: 1 }} /> Risk Mitigation Suggestions
              </Typography>
              <List>
                {analysisResults?.creditScore?.riskAssessment?.riskMitigationSuggestions?.map((suggestion, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`• ${suggestion}`} />
                  </ListItem>
                )) ?? (
                  <Typography variant="body2" color="text.secondary">No risk mitigation suggestions available</Typography>
                )}
              </List>
            </Card>
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ p: 3 }}>
        {/* existing buttons except raw JSON toggle */}
      </Box>
    </Container>
  );
};

export default Results;