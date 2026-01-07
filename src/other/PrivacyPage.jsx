import {
 Container, Typography, Button, Box, Paper, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Retour
          </Button>
          <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 500 }}>
              Politique de Confidentialité
            </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ lineHeight: 1.7 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              1. Collecte des Données GPS
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Nous collectons les coordonnées de latitude, longitude, vitesse et altitude envoyées par vos dispositifs de suivi. Ces données sont stockées de manière sécurisée pour votre usage personnel.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              2. Utilisation des Informations Personnelles
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Votre nom, e-mail et mot de passe sont uniquement utilisés pour la gestion de votre compte et la communication relative à vos alertes ou à votre abonnement. Les mots de passe sont chiffrés selon les standards industriels.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              3. Rétention des Données
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              L'historique des positions est conservé par défaut pendant 12 mois. Passé ce délai, les données sont purgées de nos serveurs. L'utilisateur peut demander une suppression anticipée de ses données depuis ses paramètres.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              4. Partage des Données
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              WayTrack ne vend aucune donnée de localisation. Vos informations ne sont accessibles qu'à vous-même et, dans des cas strictement limités, aux administrateurs système pour le support technique.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPage;
