import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Box } from '@mui/material';

const SubscriptionBanner = () => {
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
            backgroundColor: 'rgba(255, 152, 0, 0.9)', // Orange discret
            color: 'white',
            padding: '4px 16px',
            borderRadius: '20px',
            boxShadow: 2,
            pointerEvents: 'none' // Pour ne pas gêner les clics sur la carte
        }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                ⏳ Abonnement annuel : expire dans {diffDays} jours
            </Typography>
        </Box>
    );
};

export default SubscriptionBanner;