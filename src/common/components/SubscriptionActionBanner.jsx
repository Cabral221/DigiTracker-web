import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Nécessaire pour le changement de page
import StarIcon from '@mui/icons-material/Star'; // Optionnel : pour un look plus pro

const SubscriptionActionBanner = () => {
  const navigate = useNavigate(); // On initialise la fonction de navigation ici

  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<StarIcon />} // Ajoute une petite étoile
      onClick={() => navigate('/offres')}
      style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1100, // Un peu plus haut pour être sûr de survoler la carte
        borderRadius: '20px',
        boxShadow: '0px 4px 15px rgba(0,0,0,0.4)',
        fontWeight: 'bold',
        backgroundColor: '#FFD700', // Or pour le côté Premium
        color: '#000', // Texte noir pour le contraste
      }}
    >
      Devenir Manager - Gérer mon Bus
    </Button>
  );
};

export default SubscriptionActionBanner;