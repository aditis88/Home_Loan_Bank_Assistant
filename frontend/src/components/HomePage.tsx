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
} from '@mui/icons-material';
import { useAppStore } from '../store/appStore';
import WelcomeModal from './WelcomeModal';

const HomePage: React.FC = () => {
  const { setCurrentView, resetWelcomeModal } = useAppStore();

  const features = [
    {
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      title: "AI Chat Assistant",
      description: "Get instant answers to all your home loan queries with our intelligent AI assistant.",
      action: "Start Chat",
      onClick: () => setCurrentView('chat'),
      color: 'primary.main'
    },
    {
      icon: <FormIcon sx={{ fontSize: 40 }} />,
      title: "Online Application",
      description: "Apply for your home loan online with our streamlined application process.",
      action: "Apply Now",
      onClick: () => setCurrentView('application'),
      color: 'secondary.main'
    },
    {
      icon: <UploadIcon sx={{ fontSize: 40 }} />,
      title: "Document Upload",
      description: "Securely upload and manage your loan documents in one place.",
      action: "Upload Documents",
      onClick: () => setCurrentView('upload'),
      color: 'success.main'
    },
    {
      icon: <ResultsIcon sx={{ fontSize: 40 }} />,
      title: "Track Progress",
      description: "Monitor your loan application status and get real-time updates.",
      action: "View Status",
      onClick: () => setCurrentView('results'),
      color: 'info.main'
    }
  ];

  const benefits = [
    {
      icon: <SupportIcon />,
      title: "Secure & Safe",
      description: "Bank-grade security for all your data and transactions"
    },
    {
      icon: <SupportIcon />,
      title: "Fast Processing",
      description: "Quick approval process with minimal documentation"
    },
    {
      icon: <SupportIcon />,
      title: "Trusted Platform",
      description: "Used by thousands of customers for their home loans"
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
                Your Dream Home
                <br />
                <span style={{ color: '#90caf9' }}>Starts Here</span>
              </Typography>
              <Typography variant="h5" sx={{ 
                mb: 4,
                opacity: 0.9,
                fontWeight: 300
              }}>
                Get the best home loan rates and professional assistance to make your home ownership dream a reality.
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
                  Start Chat
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
                  Apply Now
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
                  Docs
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

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 600,
            mb: 2
          }}>
            Why Choose Our Home Loan Assistant?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Experience the future of home loan processing with our AI-powered platform
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
              Trusted by Thousands
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Join our satisfied customers who have achieved their home ownership dreams
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
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Choose your preferred way to begin your home loan journey
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
                Chat with AI Assistant
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Get instant answers to all your questions about home loans, eligibility, and requirements.
              </Typography>
              <Button variant="contained" fullWidth sx={{ borderRadius: 2 }}>
                Start Chat
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
                Apply Online
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Complete your home loan application online with our user-friendly form.
              </Typography>
              <Button variant="contained" fullWidth sx={{ borderRadius: 2 }}>
                Apply Now
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
                <PhoneIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" component="h3" sx={{ 
                fontWeight: 600,
                mb: 2
              }}>
                Call Back Request
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Request a call back from our loan experts for personalized assistance.
              </Typography>
              <Button variant="outlined" fullWidth sx={{ borderRadius: 2 }}>
                Request Call Back
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
              SECURE • RELIABLE • FAST
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Powered by Advanced AI Technology
            </Typography>
          </Box>
        </Container>
      </Box>

      <WelcomeModal />
    </Box>
  );
};

export default HomePage;