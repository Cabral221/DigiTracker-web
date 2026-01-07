import { useDispatch, useSelector } from 'react-redux'; // Ajout de useSelector
import { useNavigate } from 'react-router-dom';
import {
 Button, Typography, Box, Paper, Stack, Divider
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SecurityIcon from '@mui/icons-material/Security';
import { sessionActions } from '../../store'; // Ajusté selon votre import MainPage

const SubscriptionPrompt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 1. On récupère l'utilisateur pour pré-remplir l'email sur Stripe
  const user = useSelector((state) => state.session.user);

  const handleSubscribe = () => {
    const stripeLink = 'https://buy.stripe.com/test_00wcMYe9Y4FJ11a3WL0ZW00';
    // On ajoute l'email en paramètre pour simplifier le paiement du client
    const emailParam = user && user.email ? `?prefilled_email=${encodeURIComponent(user.email)}` : '';
    window.location.href = stripeLink + emailParam;
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/session', { method: 'DELETE' });
      dispatch(sessionActions.updateUser(null));
      navigate('/login');
    } catch (error) {
      console.error("Erreur déconnexion:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#eceff1" // Couleur de fond légèrement plus pro
    >
      <Paper elevation={6} sx={{ padding: 5, textAlign: 'center', maxWidth: 480, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          WayTracker Sénégal 🚌
        </Typography>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Abonnement Annuel Requis
        </Typography>

        <Typography variant="body1" color="textSecondary" paragraph>
          Accédez à la cartographie en temps réel et au suivi illimité de vos appareils pour seulement 1 an de service.
        </Typography>

        <Box bgcolor="#e3f2fd" p={2} borderRadius={2} mb={3}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                <SecurityIcon color="primary" fontSize="small" />
                <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                    PAIEMENT SÉCURISÉ VIA STRIPE
                </Typography>
            </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            startIcon={<PaymentIcon />}
            onClick={handleSubscribe}
            sx={{ py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
          >
            S'abonner maintenant
          </Button>

          <Button
            variant="text"
            color="inherit"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
            sx={{ textTransform: 'none' }}
          >
            Se déconnecter
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default SubscriptionPrompt;
