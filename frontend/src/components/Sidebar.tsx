import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Description as FormIcon,
  CloudUpload as UploadIcon,
  Assessment as ResultsIcon,
  Home as HomeIcon,
  AccountBalance as BankIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useAppStore } from '../store/appStore';

const DRAWER_WIDTH = 280;

const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = useAppStore();

  const menuItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon />, view: 'home' as const },
    { id: 'chat', label: 'Chat Assistant', icon: <ChatIcon />, view: 'chat' as const },
    { id: 'docs', label: 'Documents', icon: <AssignmentIcon />, view: 'docs' as const },
    { id: 'application', label: 'Loan Application', icon: <FormIcon />, view: 'application' as const },
    { id: 'upload', label: 'Document Upload', icon: <UploadIcon />, view: 'upload' as const },
    { id: 'results', label: 'Results & Analysis', icon: <ResultsIcon />, view: 'results' as const },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <Avatar sx={{ 
          width: 60, 
          height: 60, 
          mx: 'auto', 
          mb: 2,
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          <BankIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Typography variant="h5" component="div" sx={{ 
          fontWeight: 700,
          mb: 0.5,
          letterSpacing: '0.5px'
        }}>
          Home Loan Assistant
        </Typography>
        <Typography variant="body2" sx={{ 
          opacity: 0.9,
          fontWeight: 300
        }}>
          Professional Banking Solutions
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={currentView === item.view}
              onClick={() => setCurrentView(item.view)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s ease',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: currentView === item.view ? 'white' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: currentView === item.view ? 600 : 500,
                  letterSpacing: '0.3px',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', p: 3 }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ 
            display: 'block', 
            fontWeight: 500,
            letterSpacing: '0.5px'
          }}>
            SECURE • RELIABLE • FAST
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ 
            display: 'block', 
            mt: 0.5,
            opacity: 0.7
          }}>
            Powered by Advanced AI
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
