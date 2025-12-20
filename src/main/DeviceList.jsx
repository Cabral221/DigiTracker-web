import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// AJOUT DE Box ET Button DANS LES IMPORTS CI-DESSOUS
import { 
  List, ListItem, ListItemText, ListItemIcon, Divider, 
  Typography, ListItemButton, Badge, Box, Button 
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { makeStyles } from 'tss-react/mui';
import { devicesActions } from '../store';
import { useTranslation } from '../common/components/LocalizationProvider';

const useStyles = makeStyles()((theme) => ({
  list: { height: '100%', width: '100%', overflow: 'auto' },
  header: { padding: theme.spacing(2), backgroundColor: theme.palette.background.default },
  lineBadge: { '& .MuiBadge-badge': { right: -10, top: 13, border: `2px solid ${theme.palette.background.paper}`, padding: '0 4px' } }
}));

const DeviceList = ({ devices = [], groups: externalGroups }) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();
  
  // 2. Priorité aux groupes filtrés de MainPage, sinon fallback sur le store
  const internalGroups = useSelector((state) => state.groups.items || {});
  const groups = externalGroups || internalGroups;
  // 3. On transforme en tableau et on filtre immédiatement le groupe racine par son nom
  const groupsArray = Object.values(groups).filter(
    (group) => group.name !== "Flotte SenBus"
  );
  
  const handleLineClick = (groupId) => {
    // Vérification de sécurité avant le dispatch
    if (devices && devices.length > 0) {
      // Filtrer les bus appartenant à cette ligne
      // On active le filtre dans le store global
      dispatch(devicesActions.setFilter({ groups: [groupId] }));
      
      // On sélectionne le premier bus de ce groupe pour centrer la carte
      const lineDevices = devices.filter(d => d.groupId === groupId);
      if (lineDevices.length > 0) {
        dispatch(devicesActions.selectId(lineDevices[0].id));
      }
    }
  };
  
  const handleClearFilter = () => {
    // On réinitialise le filtre pour tout voir
    dispatch(devicesActions.setFilter({ groups: [] }));
  };

  // On utilise groupsArray (déjà filtré) pour le message d'attente
  if (groupsArray.length === 0) {
    return <Typography sx={{ p: 2 }}>Aucune ligne disponible...</Typography>;
  }
  
  return (
    <div className={classes.list}>
    <div className={classes.header}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          🇸🇳 Nos Lignes
        </Typography>
        <Button size="small" onClick={handleClearFilter} sx={{ textTransform: 'none' }}>
          Voir tout
        </Button>
      </Box>
      <Typography variant="body2" color="textSecondary">
        Sélectionnez une ligne pour isoler les bus
      </Typography>
    </div>
    <Divider />
    <List>
    {groupsArray.map((group) => {
      const busInLine = devices.filter(d => d.groupId === group.id);
      const activeCount = busInLine.filter(d => d.status === 'online').length;
      
      return (
        <ListItem key={group.id} disablePadding divider>
          <ListItemButton onClick={() => handleLineClick(group.id)} sx={{ py: 2 }}>
          <ListItemIcon>
            <Badge badgeContent={activeCount} color="success" className={classes.lineBadge}>
              <DirectionsBusIcon fontSize="large" color="primary" />
            </Badge>
          </ListItemIcon>
          <ListItemText primary={<Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>{group.name}</Typography>} secondary={`${busInLine.length} bus affectés • ${activeCount} en mouvement`}/>
          </ListItemButton>
        </ListItem>
      );
    })}
    </List>
    </div>
  );
};

export default DeviceList;