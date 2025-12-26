import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container, Typography, Button, Box, Card, CardContent, 
  List, ListItem, ListItemIcon, ListItemText, Link, Radio, 
  RadioGroup, FormControlLabel, FormControl, Grid, Paper, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useNavigate } from 'react-router-dom';
import LogoImage from '../login/LogoImage';

const OffresPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [paymentMethod, setPaymentMethod] = useState('wave');
  
  // REDIRECTION SI NON CONNECTÉ
  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirige vers la page de connexion de Traccar
    }
  }, [user, navigate]);

  // Si l'utilisateur n'est pas encore chargé, on n'affiche rien (ou un spinner)
  if (!user) {
    return null; 
  }

  const handlePayment = () => {
    // 3. Définition de l'URL de base
    const endpoint = paymentMethod === 'wave' 
        ? '#' 
        : 'https://buy.stripe.com/test_00wcMYe9Y4FJ11a3WL0ZW00';

    if (endpoint === '#') {
      alert("Le paiement Wave sera bientôt disponible !");
      return;
    }

    // 4. Construction propre des paramètres (Vérification si user existe)
    // On ajoute l'email pour que le client n'ait pas à le retaper sur Stripe
    // On ajoute aussi l'ID utilisateur en 'client_reference_id' pour le Webhook plus tard
    const params = new URLSearchParams();
    if (user) {
      params.append('prefilled_email', user.email);
      params.append('client_reference_id', user.id); 
    }

    // 5. Redirection finale
    window.location.href = `${endpoint}?${params.toString()}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* SECTION PRINCIPALE (CONTENU) */}
      <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 8, mb: 6, flex: 1 }}>
        <Grid container spacing={isMobile ? 4 : 8} alignItems="center">
          
          {/* GAUCHE : BRANDING */}
          <Grid item xs={12} md={7} size={isMobile ? 12 : 6}>
            <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
              <LogoImage color="#00853F" />
              <Typography variant={isMobile ? "h4" : "h2"} fontWeight="bold" sx={{ mt: 2, mb: 1, color: '#00853F' }}>
                SenBus Manager
              </Typography>
              <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
                Le standard de gestion pour les transporteurs au Sénégal.
              </Typography>

              <List sx={{ display: 'inline-block', textAlign: 'left' }}>
                {[
                  { text: "Flotte jusqu'à 5 véhicules", icon: <DirectionsBusIcon sx={{ color: '#00853F' }} /> },
                  { text: "Coupure moteur à distance", icon: <SecurityIcon sx={{ color: '#00853F' }} /> },
                  { text: "Rapports de vitesse et trajets", icon: <SpeedIcon sx={{ color: '#00853F' }} /> },
                  { text: "Support prioritaire 24/7", icon: <CheckCircleIcon sx={{ color: '#00853F' }} /> },
                ].map((item, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ fontWeight: 500, color: '#00853F' }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          {/* DROITE : PAIEMENT */}
          <Grid item xs={12} md={5} size={isMobile ? 12 : 6}>
            <Card elevation={8} sx={{ borderRadius: 4 }}>
              <Box sx={{ backgroundColor: '#00853F', py: 1.5, textAlign: 'center' }}>
                <Typography variant="button" color="white" fontWeight="bold">FORFAIT ANNUEL</Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="h3" fontWeight="bold" color="#00853F">5 000 FCFA</Typography>
                  <Typography variant="subtitle2" color="textSecondary">VALABLE 12 MOIS</Typography>
                </Box>

                <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                  <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    
                    {/* OPTION WAVE */}
                    <Paper 
                      variant="outlined" 
                      onClick={() => setPaymentMethod('wave')}
                      sx={{ 
                        mb: 2, p: 2, cursor: 'pointer',
                        borderColor: paymentMethod === 'wave' ? '#00853F' : '#e0e0e0',
                        backgroundColor: paymentMethod === 'wave' ? '#f0f7f2' : '#fff',
                        borderWidth: paymentMethod === 'wave' ? 2 : 1
                      }}
                    >
                      <FormControlLabel 
                        value="wave" 
                        control={<Radio sx={{ color: '#00853F', '&.Mui-checked': { color: '#00853F' } }} />} 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                            <SmartphoneIcon sx={{ mr: 1, color: '#1dcaff' }} />
                            <Typography sx={{ fontWeight: 'bold', color: '#333' }}>Payer avec Wave</Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>

                    {/* OPTION STRIPE */}
                    <Paper 
                      variant="outlined" 
                      onClick={() => setPaymentMethod('stripe')}
                      sx={{ 
                        p: 2, cursor: 'pointer',
                        borderColor: paymentMethod === 'stripe' ? '#6772e5' : '#e0e0e0',
                        backgroundColor: paymentMethod === 'stripe' ? '#f4f5ff' : '#fff',
                        borderWidth: paymentMethod === 'stripe' ? 2 : 1
                      }}
                    >
                      <FormControlLabel 
                        value="stripe" 
                        control={<Radio sx={{ color: '#6772e5', '&.Mui-checked': { color: '#6772e5' } }} />} 
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                            <CreditCardIcon sx={{ mr: 1, color: '#6772e5' }} />
                            <Typography sx={{ fontWeight: 'bold', color: '#333' }}>Carte Bancaire</Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                    </Paper>

                  </RadioGroup>
                </FormControl>

                <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                  En cliquant sur "ACTIVER MON COMPTE", vous acceptez nos&nbsp;
                  <Link onClick={() => navigate('/terms')} variant="caption" sx={{ cursor: 'pointer', color: theme.palette.text.primary }}>
                    Conditions d'Utilisation
                  </Link>
                  &nbsp;et notre&nbsp;
                  <Link onClick={() => navigate('/privacy')} variant="caption" sx={{ cursor: 'pointer', color: theme.palette.text.primary }}>
                    Politique de Confidentialité
                  </Link>.
                </Typography>
                <hr />

                <Button fullWidth variant="contained" size="large" onClick={handlePayment}
                  sx={{ 
                    backgroundColor: '#00853F', color: 'white', py: 2, borderRadius: 2, 
                    fontWeight: 'bold', '&:hover': { backgroundColor: '#006631' } 
                  }}
                >
                  ACTIVER MON COMPTE
                </Button>

              </CardContent>
            </Card>
            
          </Grid>
        </Grid>
      </Container>

      {/* FOOTER : PLEINE LARGEUR (HORS DU CONTAINER) */}
      <Box sx={{ 
        width: '100%', 
        py: 4, 
        backgroundColor: '#f9f9f9', 
        borderTop: '1px solid #e0e0e0',
        mt: 'auto' // Pousse le footer vers le bas si le contenu est court
      }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" justifyContent="space-between" spacing={2} sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="#000000" fontWeight="bold">
                © 2024 SenBus - Solution de Tracking GPS Professionnelle.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', gap: 3, flexDirection: isMobile ? 'column' : 'row' }}>
                <Button 
                  startIcon={<WhatsAppIcon />} 
                  sx={{ color: '#25D366', textTransform: 'none', fontWeight: 'bold' }}
                  onClick={() => window.open('https://wa.me/221778435052')}
                >
                  Assistance WhatsApp
                </Button>
                <Typography variant="body2" sx={{ display: isMobile ? 'none' : 'block', alignSelf: 'center' }}>|</Typography>
                <Typography variant="body2" sx={{ color: '#000000', alignSelf: 'center', fontWeight: 'bold' }}>
                  Email: cabraldiop18@gmail.com
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default OffresPage;