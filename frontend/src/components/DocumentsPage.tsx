import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  AccountBalanceWallet as WalletIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Description as FormIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAppStore } from '../store/appStore';

const DocumentsPage: React.FC = () => {
  const { setCurrentView } = useAppStore();

  const documentCategories = [
    {
      title: "Personal Identity & Address",
      subtitle: "KYC Verification Documents",
      icon: <PersonIcon />,
      color: '#2196f3',
      documents: [
        { name: "PAN Card", required: true, note: "Primary identity proof" },
        { name: "Aadhaar Card", required: true, note: "Biometric verification" },
        { name: "Passport", required: false, note: "Alternative ID proof" },
        { name: "Driving License", required: false, note: "Additional verification" },
        { name: "Utility Bills", required: true, note: "Address verification" },
        { name: "Rental Agreement", required: false, note: "If renting property" }
      ]
    },
    {
      title: "Financial & Income Proof",
      subtitle: "Earnings & Financial Stability",
      icon: <BusinessIcon />,
      color: '#4caf50',
      documents: [
        { name: "Salary Slips", required: true, note: "Last 3 months" },
        { name: "Form 16 / IT Returns", required: true, note: "Last 2 years" },
        { name: "Bank Statements", required: true, note: "Last 6 months" },
        { name: "Employment Certificate", required: true, note: "Current employer" },
        { name: "Business Income Proof", required: false, note: "For self-employed" }
      ]
    },
    {
      title: "Property & Legal Documents",
      subtitle: "Real Estate & Legal Compliance",
      icon: <HomeIcon />,
      color: '#ff9800',
      documents: [
        { name: "Sale Deed", required: true, note: "Property ownership" },
        { name: "Property Tax Receipts", required: true, note: "Tax compliance" },
        { name: "NOC from Society/Builder", required: true, note: "Clearance certificate" },
        { name: "Building Approval Plans", required: true, note: "Construction compliance" },
        { name: "Encumbrance Certificate", required: true, note: "Legal clearance" }
      ]
    },
    {
      title: "Additional Requirements",
      subtitle: "Supporting Documents & Proofs",
      icon: <WalletIcon />,
      color: '#9c27b0',
      documents: [
        { name: "Down Payment Proof", required: true, note: "Financial capability" },
        { name: "Insurance Documents", required: false, note: "Property protection" },
        { name: "Co-applicant Documents", required: false, note: "If joint application" },
        { name: "Guarantor Documents", required: false, note: "If required by bank" }
      ]
    }
  ];

  const eligibilityCriteria = [
    { factor: "Age Range", criteria: "18-70 years", icon: <PersonIcon />, color: '#2196f3' },
    { factor: "Employment Type", criteria: "Salaried / Self Employed", icon: <BusinessIcon />, color: '#4caf50' },
    { factor: "Nationality", criteria: "Resident Indian", icon: <InfoIcon />, color: '#ff9800' },
    { factor: "Loan Tenure", criteria: "Up to 30 years", icon: <CheckIcon />, color: '#9c27b0' },
  ];

  const selfEmployedTypes = [
    {
      category: "Professional Self-Employed",
      icon: <BusinessIcon />,
      color: '#4caf50',
      description: "Qualified professionals with recognized degrees",
      examples: ["Medical Practitioners", "Legal Professionals", "Chartered Accountants", "Architects & Engineers", "Management Consultants", "IT Consultants"]
    },
    {
      category: "Business Self-Employed",
      icon: <PersonIcon />,
      color: '#ff9800',
      description: "Business owners and entrepreneurs",
      examples: ["Retail Traders", "Manufacturers", "Service Providers", "Commission Agents", "Contractors", "Real Estate Developers"]
    }
  ];

  const quickTips = [
    "Ensure all documents are clear and legible",
    "Keep original documents ready for verification",
    "Documents should not be older than specified periods",
    "Submit additional documents if requested by bank"
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Header Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        py: 4
      }}>
        <Container maxWidth="xl">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setCurrentView('home')}
            sx={{ 
              mb: 3,
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
            variant="outlined"
          >
            Back to Home
          </Button>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 700,
            mb: 2
          }}>
            Loan Application Requirements
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 800 }}>
            Complete guide to documents and eligibility criteria for your home loan application
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Document Categories */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" sx={{ 
            fontWeight: 600,
            mb: 4,
            textAlign: 'center'
          }}>
            Required Documentation
          </Typography>
          <Grid container spacing={4}>
            {documentCategories.map((category, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ 
                  height: '100%',
                  border: `2px solid ${category.color}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${category.color}30`,
                    borderColor: category.color
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar sx={{ 
                        width: 50, 
                        height: 50, 
                        mr: 2,
                        bgcolor: category.color
                      }}>
                        {category.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="h3" sx={{ 
                          fontWeight: 600,
                          color: category.color
                        }}>
                          {category.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <List dense>
                      {category.documents.map((doc, docIndex) => (
                        <ListItem key={docIndex} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {doc.required ? (
                              <CheckIcon color="success" fontSize="small" />
                            ) : (
                              <InfoIcon color="info" fontSize="small" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {doc.name}
                                </Typography>
                                {doc.required && (
                                  <Chip 
                                    label="Required" 
                                    size="small" 
                                    color="error" 
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            }
                            secondary={doc.note}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Eligibility Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h3" sx={{ 
            fontWeight: 600,
            mb: 4,
            textAlign: 'center'
          }}>
            Eligibility Criteria
          </Typography>
          
          {/* Eligibility Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {eligibilityCriteria.map((criteria, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper sx={{ 
                  p: 3,
                  textAlign: 'center',
                  border: `2px solid ${criteria.color}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: criteria.color
                  }
                }}>
                  <Avatar sx={{ 
                    width: 50, 
                    height: 50, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: criteria.color
                  }}>
                    {criteria.icon}
                  </Avatar>
                  <Typography variant="h6" component="h4" sx={{ 
                    fontWeight: 600,
                    mb: 1
                  }}>
                    {criteria.factor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {criteria.criteria}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Self Employed Types */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            Self-Employed Categories
          </Typography>
          <Grid container spacing={3}>
            {selfEmployedTypes.map((type, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ 
                  border: `2px solid ${type.color}20`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: type.color
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        width: 50, 
                        height: 50, 
                        mr: 2,
                        bgcolor: type.color
                      }}>
                        {type.icon}
                      </Avatar>
                      <Typography variant="h6" component="h4" sx={{ 
                        fontWeight: 600,
                        color: type.color
                      }}>
                        {type.category}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {type.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {type.examples.map((example, exIndex) => (
                        <Chip 
                          key={exIndex}
                          label={example} 
                          size="small" 
                          variant="outlined"
                          sx={{ borderColor: type.color, color: type.color }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Quick Tips */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            Application Tips
          </Typography>
          <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
            <Grid container spacing={2}>
              {quickTips.map((tip, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {tip}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* Action Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Ready to Proceed?
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<FormIcon />}
              onClick={() => setCurrentView('application')}
              sx={{ px: 4, py: 1.5 }}
            >
              Start Application
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<DownloadIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              Download Guide
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<AssignmentIcon />}
              onClick={() => setCurrentView('chat')}
              sx={{ px: 4, py: 1.5 }}
            >
              Ask Questions
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DocumentsPage;