import { useSelector } from 'react-redux';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SubscriptionBanner = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.session.user);
    const endDateStr = user?.attributes?.subscriptionEndDate;

    if (!endDateStr) return null;

    const endDate = new Date(endDateStr);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // On affiche la bannière seulement s'il reste entre 1 et 30 jours
    if (diffDays <= 0 || diffDays > 30) return null;

    return (
        <Box sx={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 153, 0, 0.79)', // Un peu plus opaque pour la lisibilité
            color: 'white',
            padding: '6px 16px',
            borderRadius: '25px',
            boxShadow: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            pointerEvents: 'auto' // Changé en 'auto' pour permettre le clic sur le bouton
        }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                ⏳ Expire dans {diffDays} {diffDays === 1 ? 'jour' : 'jours'}
            </Typography>
            
            <Button 
                variant="contained" 
                size="small"
                onClick={() => navigate('/offres')}
                sx={{ 
                    backgroundColor: 'white', 
                    color: '#ff9800',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    borderRadius: '15px',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    textTransform: 'none',
                    py: 0
                }}
            >
                Renouveler
            </Button>
        </Box>
    );
};

export default SubscriptionBanner;