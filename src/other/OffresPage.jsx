import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Container, Typography, Button, Box, Card, CardContent, 
  List, ListItem, ListItemIcon, ListItemText, Radio, 
  RadioGroup, FormControlLabel, FormControl, Grid, Paper, useMediaQuery, IconButton, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RouterIcon from '@mui/icons-material/Router';
import { useNavigate } from 'react-router-dom';
import LogoImage from '../login/LogoImage';

const OffresPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [paymentMethod, setPaymentMethod] = useState('wave');
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [gpsQuantity, setGpsQuantity] = useState(0);

  // CHARTE GRAPHIQUE & PRIX
  const SOLO_COLOR = '#FF9800';
  const BASIC_COLOR = '#00853F'; 
  const PRO_COLOR = '#1A237E'; 
  const BUSINESS_COLOR = '#D32F2F';
  const GPS_UNIT_PRICE = 15000;

  // Configuration des plans avec leurs fonctionnalités respectives
  const PLANS_CONFIG = {
    solo: { 
      name: 'Pack Solo', price: 15000, vehicles: 1, color: SOLO_COLOR, 
      desc: "Sécurité maximale pour votre véhicule personnel.",
      features: ["1 Véhicule", "Coupure moteur", "Position temps réel", "Support Standard"],
      stripeLink: '#',
    },
    basic: { 
      name: 'Pack Familial', price: 45000, vehicles: 5, color: BASIC_COLOR, 
      desc: "Idéal pour protéger les véhicules de la famille.",
      features: ["Jusqu'à 5 véhicules", "Coupure moteur", "Rapports de trajets", "Support Prioritaire"],
      stripeLink: 'https://buy.stripe.com/test_00wcMYe9Y4FJ11a3WL0ZW00'
    },
    pro: { 
      name: 'Pack Flotte Pro', price: 85000, vehicles: 15, color: PRO_COLOR, 
      desc: "Optimisé pour la gestion de flotte intensive.",
      features: ["Jusqu'à 15 véhicules", "Alertes vitesse/zone", "Historique 90 jours", "Gestionnaire dédié"],
      stripeLink: '#'
    },
    business: { 
      name: 'Pack Business+', price: 250000, vehicles: 50, color: BUSINESS_COLOR, 
      desc: "Solution complète pour grandes entreprises.",
      features: ["Jusqu'à 50 véhicules", "API Intégration", "Rapports personnalisés", "Support VIP 24/7"],
      stripeLink: '#'
    }
  };

  const activeColor = PLANS_CONFIG[selectedPlan].color;
  const totalAmount = PLANS_CONFIG[selectedPlan].price + (gpsQuantity * GPS_UNIT_PRICE);
  
  useEffect(() => {
    if (!user) { navigate('/login'); }
  }, [user, navigate]);

  if (!user) return null; 

  const handlePayment = () => {
    
    // 1. Gestion de Wave (Redirection manuelle ou WhatsApp pour le moment)
    if (paymentMethod === 'wave') {
      const message = `Bonjour SenBus, je souhaite souscrire au *${PLANS_CONFIG[selectedPlan].name}* avec *${gpsQuantity}* boîtiers GPS. Total: ${totalAmount} FCFA.`;
      window.open(`https://wa.me/221778435052?text=${encodeURIComponent(message)}`);
      console.log("Détails commande:", { plan: selectedPlan, gps: gpsQuantity, total: totalAmount });
      return;
    }
    
    // 2. Gestion de Stripe
    if (paymentMethod === 'stripe') {
      // Si l'utilisateur a ajouté des boîtiers GPS, Stripe Checkout a besoin d'un lien dynamique.
      // Pour simplifier sans backend lourd, si gpsQuantity > 0, on peut rediriger vers WhatsApp 
      console.log("Détails commande:", { plan: selectedPlan, gps: gpsQuantity, total: totalAmount });
      // ou créer des produits "Boitier" sur Stripe.
      
      if (gpsQuantity > 0) {
        alert("Pour inclure des boîtiers GPS dans votre paiement par carte, notre équipe va vous générer un lien personnalisé sur WhatsApp.");
        const message = `Demande de lien de paiement par carte pour : ${PLANS_CONFIG[selectedPlan].name} + ${gpsQuantity} boîtiers GPS.`;
        window.open(`https://wa.me/221778435052?text=${encodeURIComponent(message)}`);
        return;
      }

      // Paiement direct pour le Pack seul
      const endpoint = PLANS_CONFIG[selectedPlan].stripeLink;
      const params = new URLSearchParams();
      if (user) {
        params.append('prefilled_email', user.email);
        params.append('client_reference_id', user.id); 
      }
      window.location.href = `${endpoint}?${params.toString()}`;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FFFFFF', color: '#333333' }}>
      
      {/* BOUTON RETOUR */}
      <Box sx={{ p: 2 }}>
        <Container maxWidth="lg">
          <Button 
            onClick={() => navigate(-1)} 
            startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '1rem' }} />}
            sx={{ color: '#666', textTransform: 'none', fontWeight: 'bold' }}
          >
            Retour
          </Button>
        </Container>
      </Box>

      {/* SECTION PRINCIPALE */}
      <Box sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          <Box display={isMobile ? 'block' : 'flex'} alignItems="center" justifyContent="center" flexDirection="row">
            <Box sx={{ textAlign: 'center', mb: 6 }} display={isMobile ? 'block' : 'flex'} alignItems="center" justifyContent="center">
              <LogoImage color={activeColor} />
              <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" sx={{ mt: 2, mb: 1, color: activeColor }}>
                SenBus Manager
                <Typography variant="h6" sx={{ color: '#555' }}>
                  Choisissez le forfait adapté à votre flotte.
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4} alignItems="flex-start">
            {/* GAUCHE : GRILLE DES CARTES D'OFFRES */}
            <Grid item xs={12} md={7} lg={8}>
              <Grid container spacing={2}>
                {Object.entries(PLANS_CONFIG).map(([key, config]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Paper 
                      elevation={selectedPlan === key ? 6 : 1}
                      onClick={() => setSelectedPlan(key)}
                      sx={{ 
                        p: 0, cursor: 'pointer', borderRadius: 4, border: '2px solid', 
                        borderColor: selectedPlan === key ? config.color : '#eee', 
                        backgroundColor: '#fff', transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex', flexDirection: 'column'
                      }}
                    >
                      {/* Entête de la carte */}
                      <Box sx={{ p: 2, backgroundColor: selectedPlan === key ? config.color : '#f8f9fa', color: selectedPlan === key ? '#fff' : '#333', textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">{config.name}</Typography>
                        <Typography variant="h5" fontWeight="black">{config.price.toLocaleString()} FCFA</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>{config.vehicles} véhicule(s) / An</Typography>
                      </Box>
                      
                      {/* Corps de la carte : Fonctionnalités */}
                      <Box sx={{ p: 2, flexGrow: 1 }}>
                        <List dense>
                          {config.features.map((feature, i) => (
                            <ListItem key={i} disableGutters sx={{ py: 0 }}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircleIcon sx={{ color: selectedPlan === key ? config.color : '#ccc', fontSize: '1.1rem' }} />
                              </ListItemIcon>
                              <ListItemText primary={feature} primaryTypographyProps={{ fontSize: '0.85rem', color: '#444' }} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      
                      {/* Note descriptive bas de carte */}
                      <Box sx={{ p: 2, pt: 0 }}>
                         <Typography variant="caption" sx={{ color: '#888', fontStyle: 'italic', display: 'block', lineHeight: 1.2 }}>
                            {config.desc}
                         </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* VENTE GPS */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#333' }}>Besoin de boîtiers GPS ?</Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f1eeeeff' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <RouterIcon sx={{ mr: 2, color: activeColor, fontSize: 35 }} />
                    <Box>
                      <Typography fontWeight="bold" sx={{ color: activeColor }}>Boîtier Tracker GPS 4G</Typography>
                      <Typography variant="body2" sx={{ color: activeColor }}>Paramétré et prêt à l'emploi • 15 000 FCFA/u</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#fff', borderRadius: 2, p: 0.5, border: '1px solid #eee' }}>
                    <IconButton size="small" onClick={() => setGpsQuantity(Math.max(0, gpsQuantity - 1))} sx={{ color: activeColor }}><RemoveIcon /></IconButton>
                    <Typography fontWeight="bold" sx={{ minWidth: 30, textAlign: 'center', color: activeColor }}>{gpsQuantity}</Typography>
                    <IconButton size="small" onClick={() => setGpsQuantity(gpsQuantity + 1)} sx={{ color: activeColor }}><AddIcon /></IconButton>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* DROITE : PAIEMENT (PANIER) */}
            <Grid item xs={12} md={5} lg={4}>
              <Card elevation={10} sx={{ borderRadius: 5, position: 'sticky', top: 20 }}>
                <Box sx={{ backgroundColor: activeColor, py: 2.5, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', letterSpacing: 1 }}>
                      RÉSUMÉ COMMANDE
                  </Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="body1">{PLANS_CONFIG[selectedPlan].name}</Typography>
                      <Typography variant="body1" fontWeight="bold">{PLANS_CONFIG[selectedPlan].price.toLocaleString()} FCFA</Typography>
                    </Box>
                    {gpsQuantity > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="body1">{gpsQuantity} Boîtier(s) GPS</Typography>
                        <Typography variant="body1" fontWeight="bold">{(gpsQuantity * GPS_UNIT_PRICE).toLocaleString()} FCFA</Typography>
                      </Box>
                    )}
                    <Divider sx={{ my: 2, borderBottomWidth: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6" fontWeight="bold">Total à payer</Typography>
                      <Typography variant="h6" fontWeight="black" color={activeColor}>{totalAmount.toLocaleString()} FCFA</Typography>
                    </Box>
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem' }}>Mode de paiement</Typography>
                  <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                    <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <Paper variant="outlined" sx={{ mb: 2, p: 1, cursor: 'pointer', borderColor: paymentMethod === 'wave' ? activeColor : '#eee', borderWidth: paymentMethod === 'wave' ? 2 : 1 }}>
                        <FormControlLabel value="wave" control={<Radio sx={{ color: activeColor }} />} 
                          label={<Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}><SmartphoneIcon sx={{ mr: 1, color: '#1dcaff' }} /><Typography sx={{ fontWeight: 'bold', color: '#ffffffff' }}>Wave Mobile Money</Typography></Box>} 
                        />
                      </Paper>
                      <Paper variant="outlined" sx={{ p: 1, cursor: 'pointer', borderColor: paymentMethod === 'stripe' ? '#6772e5' : '#eee', borderWidth: paymentMethod === 'stripe' ? 2 : 1 }}>
                        <FormControlLabel value="stripe" control={<Radio sx={{ color: '#6772e5' }} />} 
                          label={<Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}><CreditCardIcon sx={{ mr: 1, color: '#6772e5' }} /><Typography sx={{ fontWeight: 'bold', color: '#ffffffff' }}>Carte Bancaire (Stripe)</Typography></Box>} 
                        />
                      </Paper>
                    </RadioGroup>
                  </FormControl>

                  <Button 
                    fullWidth variant="contained" size="large" onClick={handlePayment} 
                    sx={{ backgroundColor: activeColor, color: '#fff', py: 2, borderRadius: 3, fontSize: '1.1rem', fontWeight: 'bold', '&:hover': { backgroundColor: activeColor, opacity: 0.9 }, boxShadow: `0 4px 14px 0 ${activeColor}50` }}
                  >
                    VALIDER MON OFFRE
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ py: 3, backgroundColor: '#f9f9f9', borderTop: '1px solid #eee', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={6} sx={{ textAlign: isMobile ? 'center' : 'left', mb: isMobile ? 2 : 0 }}>
              <Typography variant="body2" sx={{ color: '#333', fontWeight: 'bold' }}>© 2024 SenBus - Tracking GPS Professionnel.</Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: isMobile ? 'center' : 'right' }}>
              <Button 
                startIcon={<WhatsAppIcon />} 
                sx={{ color: '#25D366', fontWeight: 'bold', textTransform: 'none' }} 
                onClick={() => window.open('https://wa.me/221778435052')}
              >
                Assistance technique WhatsApp
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default OffresPage;