import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  Chat as ChatIcon,
  Description as FormIcon,
  CloudUpload as UploadIcon,
  Assessment as ResultsIcon,
  Support as SupportIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import { useAppStore } from '../store/appStore';
import WelcomeModal from './WelcomeModal';

const HomePage: React.FC = () => {
  const { setCurrentView, resetWelcomeModal } = useAppStore();

  // Dashboard counters - these would typically come from an API
  const dashboardStats = [
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: "Total Applicants",
      value: "1,247",
      color: 'primary.main',
      description: "Active applications"
    },
    {
      icon: <WarningIcon sx={{ fontSize: 40 }} />,
      title: "Human Escalation",
      value: "23",
      color: 'warning.main',
      description: "Requires review"
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      title: "Passed",
      value: "892",
      color: 'success.main',
      description: "Approved applications"
    },
    {
      icon: <CreditCardIcon sx={{ fontSize: 40 }} />,
      title: "Granted Loans",
      value: "756",
      color: 'info.main',
      description: "Loans disbursed"
    }
  ];

  const features = [
    {
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      title: "Customer Support AI",
      description: "Access customer information and provide support through our intelligent AI system for loan queries.",
      action: "Open Chat",
      onClick: () => setCurrentView('chat'),
      color: 'primary.main'
    },
    {
      icon: <FormIcon sx={{ fontSize: 40 }} />,
      title: "Application Review",
      description: "Review and process existing loan applications with our streamlined workflow management system.",
      action: "Review Apps",
      onClick: () => setCurrentView('application'),
      color: 'secondary.main'
    },
    {
      icon: <UploadIcon sx={{ fontSize: 40 }} />,
      title: "Customer Document Management",
      description: "Access and manage customer documents efficiently in our secure repository with Australian compliance standards.",
      action: "View Documents",
      onClick: () => setCurrentView('upload'),
      color: 'success.main'
    },
    {
      icon: <ResultsIcon sx={{ fontSize: 40 }} />,
      title: "Portfolio Analytics",
      description: "Track loan performance, generate APRA reports, and analyze portfolio metrics across Australian markets.",
      action: "View Analytics",
      onClick: () => setCurrentView('results'),
      color: 'info.main'
    }
  ];

  const benefits = [
    {
      icon: <SupportIcon />,
      title: "Efficient Processing",
      description: "Streamlined workflow for faster loan processing and customer satisfaction across Australian time zones"
    },
    {
      icon: <SupportIcon />,
      title: "AI-Powered Insights",
      description: "Advanced analytics and AI recommendations for better decision making in Australian market conditions"
    },
    {
      icon: <SupportIcon />,
      title: "Secure Platform",
      description: "Bank-grade security ensuring data protection and compliance with Australian privacy laws and APRA requirements"
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        py: 8,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" sx={{ 
                fontWeight: 700,
                mb: 3,
                lineHeight: 1.2
              }}>
                Home Loan Management
                <br />
                <span style={{ color: '#90caf9' }}>Dashboard</span>
              </Typography>
              <Typography variant="h5" sx={{ 
                mb: 4,
                opacity: 0.9,
                fontWeight: 300
              }}>
                Manage home loan applications, review documents, and process approvals in compliance with Australian banking regulations and APRA guidelines.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ChatIcon />}
                  onClick={() => setCurrentView('chat')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    boxShadow: 3,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 6,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Open Chat
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AssignmentIcon />}
                  onClick={() => setCurrentView('application')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    boxShadow: 3,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 6,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  View Applications
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<FormIcon />}
                  onClick={() => setCurrentView('docs')}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    boxShadow: 3,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 6,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  View Documents
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PersonIcon />}
                  onClick={resetWelcomeModal}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 3,
                    boxShadow: 3,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 6,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Welcome
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
              <Avatar sx={{ 
                width: 200, 
                height: 200, 
                mx: 'auto',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '4px solid rgba(255,255,255,0.3)'
              }}>
                <BankIcon sx={{ fontSize: 100 }} />
              </Avatar>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Dashboard Counters Section */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 600,
            mb: 2
          }}>
            Loan Portfolio Overview
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Real-time statistics of home loan applications and processing status across all Australian states
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {dashboardStats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card sx={{ 
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                }
              }}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 3,
                  bgcolor: stat.color
                }}>
                  {stat.icon}
                </Avatar>
                <Typography variant="h2" component="div" sx={{ 
                  fontWeight: 700,
                  mb: 1,
                  color: stat.color
                }}>
                  {stat.value}
                </Typography>
                <Typography variant="h6" component="h3" sx={{ 
                  fontWeight: 600,
                  mb: 1
                }}>
                  {stat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 600,
            mb: 2
          }}>
            Banking Tools & Features
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Comprehensive tools to manage home loan applications and customer relationships in compliance with Australian regulations
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card sx={{ 
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                }
              }}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 3,
                  bgcolor: feature.color
                }}>
                  {feature.icon}
                </Avatar>
                <Typography variant="h5" component="h3" sx={{ 
                  fontWeight: 600,
                  mb: 2
                }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {feature.description}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={feature.onClick}
                  sx={{ borderRadius: 2 }}
                >
                  {feature.action}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="xl">
                  <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 600,
            mb: 2
          }}>
            Why Choose Our Platform?
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Built for banking professionals to deliver exceptional service and maintain regulatory compliance in Australia
          </Typography>
        </Box>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper sx={{ 
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  backgroundColor: 'white'
                }}>
                  <Avatar sx={{ 
                    width: 60, 
                    height: 60, 
                    mx: 'auto', 
                    mb: 3,
                    bgcolor: 'primary.main'
                  }}>
                    {benefit.icon}
                  </Avatar>
                  <Typography variant="h5" component="h3" sx={{ 
                    fontWeight: 600,
                    mb: 2
                  }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Quick Actions Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 600,
            mb: 2
          }}>
            Quick Actions
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Access frequently used Australian banking functions and regulatory compliance tools
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              textAlign: 'center',
              p: 4,
              height: '100%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
              }
            }} onClick={() => setCurrentView('chat')}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 3,
                bgcolor: 'primary.main'
              }}>
                <ChatIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" component="h3" sx={{ 
                fontWeight: 600,
                mb: 2
              }}>
                Customer Support
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Access customer information and provide professional support for Australian home loan queries through our AI system.
              </Typography>
              <Button variant="contained" fullWidth sx={{ borderRadius: 2 }}>
                Open Chat
              </Button>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              textAlign: 'center',
              p: 4,
              height: '100%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
              }
            }} onClick={() => setCurrentView('application')}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 3,
                bgcolor: 'secondary.main'
              }}>
                <FormIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" component="h3" sx={{ 
                fontWeight: 600,
                mb: 2
              }}>
                View Applications
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Access and review existing Australian home loan applications with our comprehensive workflow management system.
              </Typography>
              <Button variant="contained" fullWidth sx={{ borderRadius: 2 }}>
                View Applications
              </Button>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ 
              textAlign: 'center',
              p: 4,
              height: '100%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
              }
            }}>
              <Avatar sx={{ 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 3,
                bgcolor: 'success.main'
              }}>
                <ResultsIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" component="h3" sx={{ 
                fontWeight: 600,
                mb: 2
              }}>
                Generate Reports
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create comprehensive reports and analytics for Australian loan portfolio management and APRA compliance.
              </Typography>
              <Button variant="outlined" fullWidth sx={{ borderRadius: 2 }}>
                Generate Report
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ 
        backgroundColor: 'primary.main',
        color: 'white',
        py: 4
      }}>
        <Container maxWidth="xl">
                      <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                SECURE • APRA COMPLIANT • EFFICIENT
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Banking Platform for Australia Powered by Advanced AI Technology
              </Typography>
            </Box>
        </Container>
      </Box>

      <WelcomeModal />
    </Box>
  );
};

export default HomePage;