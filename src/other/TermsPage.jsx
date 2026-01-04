import {
 Container, Typography, Button, Box, Paper, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TermsPage = () => {
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
            Conditions Générales d'Utilisation
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ lineHeight: 1.7 }}>
          <Box sx={{ p: 3 }}>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              1. Nature du Service
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              WayTrack est une solution de gestion de flotte basée sur le protocole Traccar. Le service inclut le suivi en temps réel, la gestion des dispositifs, et l'accès aux rapports d'activité.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              2. Responsabilité de l'Utilisateur
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              L'utilisateur est seul responsable de la conformité légale de l'installation des balises. Il est strictement interdit d'utiliser WayTrack pour suivre des personnes à leur insu ou sans base légale valide.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              3. Disponibilité du Serveur
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Bien que nous visions une disponibilité de 99.9%, WayTrack ne peut être tenu responsable des pertes de données liées à une défaillance de couverture réseau GSM ou à une maintenance technique du serveur.
            </Typography>

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
              4. Résiliation et Paiement
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              L'accès est conditionné par le paiement des frais d'abonnement. En cas d'expiration de l'abonnement, l'accès aux données historiques et au suivi en temps réel sera suspendu automatiquement.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsPage;
