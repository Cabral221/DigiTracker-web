import React from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch } from 'react-redux';
import { sessionActions } from '../../store';
import { useNavigate } from 'react-router-dom';

const SubscriptionExpiryGuard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('/api/session', { method: 'DELETE' });
    dispatch(sessionActions.updateUser(null));
    navigate('/login');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(77, 180, 18, 0.75)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Paper elevation={10} sx={{ p: 4, maxWidth: 400, textAlign: 'center', borderRadius: 4 }}>
        <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Accès Suspendu
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Votre abonnement SenBus est arrivé à terme. Vos données sont conservées, mais l'accès à la carte nécessite un renouvellement.
        </Typography>
        
        <Stack spacing={2}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large"
            onClick={() => navigate('/offres')} // Redirige vers vos offres
          >
            Voir les tarifs de renouvellement
          </Button>
          
          <Button 
            variant="outlined" 
            color="inherit" 
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SubscriptionExpiryGuard;