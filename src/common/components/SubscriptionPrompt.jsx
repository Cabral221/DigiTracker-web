import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Paper, Stack } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { sessionActions } from '../../store/session'; // Vérifiez le chemin vers votre store

const SubscriptionPrompt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubscribe = () => {
    window.location.href = 'https://buy.stripe.com/test_00wcMYe9Y4FJ11a3WL0ZW00';
  };

  const handleLogout = async () => {
    // 1. Appel à l'API de déconnexion de Traccar
    await fetch('/api/session', { method: 'DELETE' });
    // 2. Mise à jour de l'état Redux pour rediriger vers la page de login
    dispatch(sessionActions.updateUser(null));
    navigate('/login');
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', maxWidth: 450 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Abonnement Requis 🚀
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Accédez à la cartographie en temps réel des bus de transport urbain et au plateforme de suivi illimité de vos appareils.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          {/* Bouton S'abonner */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<PaymentIcon />}
            onClick={handleSubscribe}
          >
            S'abonner
          </Button>

          {/* Bouton Déconnexion */}
          <Button
            variant="outlined"
            color="error"
            size="large"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SubscriptionPrompt;