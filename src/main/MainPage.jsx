import {
  useState, useCallback, useEffect, useMemo
} from 'react';
import { Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import DeviceList from './DeviceList';
import BottomMenu from '../common/components/BottomMenu';
import StatusCard from '../common/components/StatusCard';
import { devicesActions } from '../store'; // Import groupé
import { errorsActions } from '../store/errors'; 
import usePersistedState from '../common/util/usePersistedState';
import EventsDrawer from './EventsDrawer';
import useFilter from './useFilter';
import MainToolbar from './MainToolbar';
import MainMap from './MainMap';
import { useAttributePreference } from '../common/util/preferences';
import { useIsSubscriber } from '../common/util/permissions';
import Loader from '../common/components/Loader';
import SubscriptionPrompt from '../common/components/SubscriptionPrompt';
import SubscriptionBanner from '../common/components/SubscriptionBanner';
import { useLocation, useNavigate } from 'react-router-dom';

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
  },
  sidebar: {
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
      left: 0,
      top: 0,
      height: `calc(100% - ${theme.spacing(3)})`,
      width: theme.dimensions.drawerWidthDesktop,
      margin: theme.spacing(1.5),
      zIndex: 3,
    },
    [theme.breakpoints.down('md')]: {
      height: '100%',
      width: '100%',
    },
  },
  header: {
    pointerEvents: 'auto',
    zIndex: 6,
  },
  footer: {
    pointerEvents: 'auto',
    zIndex: 5,
  },
  middle: {
    flex: 1,
    display: 'grid',
    minHeight: 0,
  },
  contentMap: {
    pointerEvents: 'auto',
    gridArea: '1 / 1',
  },
  contentList: {
    pointerEvents: 'auto',
    gridArea: '1 / 1',
    zIndex: 4,
    display: 'flex',
    minHeight: 0,
  },
}));

const MainPage = () => {
// 1. Lire l'état d'initialisation de la session
  //    (L'état qui devient true seulement après la vérification API)  
  const initialized = useSelector(state => state.session.initialized);

  const { classes } = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const mapOnSelect = useAttributePreference('mapOnSelect', false);

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const selectedPosition = filteredPositions.find((position) => selectedDeviceId && position.deviceId === selectedDeviceId);
    // AJOUTEZ CECI : On récupère notre nouveau filtre de groupe
  const globalFilter = useSelector((state) => state.devices.filter);

  const user = useSelector((state) => state.session.user);
  const groups = useSelector((state) => {
    const allGroups = state.groups.items || {};
    const filtered = {};
    Object.keys(allGroups).forEach(id => {
      if (allGroups[id].name !== "Flotte SenBus") {
        filtered[id] = allGroups[id];
      }
    });
    return filtered;
  });

  const [filteredDevices, setFilteredDevices] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = usePersistedState('filter', { statuses: [], groups: [] });
  const [filterSort, setFilterSort] = usePersistedState('filterSort', '');
  const [filterMap, setFilterMap] = usePersistedState('filterMap', true);
  const [devicesOpen, setDevicesOpen] = useState(desktop);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [isManualSelection, setIsManualSelection] = useState(false);

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen]);

  // =======================================================
  // 🔄 LOGIQUE DE REDIRECTION (AVANT INITIALISATION)
  // =======================================================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('paiement') === 'succes') {
      const newUrl = `${window.location.pathname}?confirme=true`;
      window.history.replaceState({}, document.title, newUrl);
      window.location.reload(); // Force le rechargement pour rafraîchir les droits
    }
  }, [location]);

  // =======================================================
  // ✨ LOGIQUE DU TOAST (APRÈS INITIALISATION)
  // =======================================================
  useEffect(() => {
    if (initialized) {
      const params = new URLSearchParams(location.search);
      if (params.get('confirme') === 'true') {
        dispatch(errorsActions.push("Félicitations ! Votre abonnement SenBus est désormais actif. 🚀"));
        navigate(location.pathname, { replace: true });
      }
    }
  }, [initialized, location, navigate, dispatch]);

  useEffect(() => {
    if (!desktop && selectedDeviceId) {
      setDevicesOpen(false);
      setIsManualSelection(true);
    }
  }, [desktop, selectedDeviceId]);

    // 1. On crée un objet stable qui ne change QUE si les données changent vraiment
  const memoizedFilter = useMemo(() => {
        // 1. Déterminer quels groupes sont sélectionnés
    const selectedGroups = globalFilter.groups && globalFilter.groups.length > 0 
      ? globalFilter.groups 
      : (filter.groups || []);
          // 2. Filtrer pour exclure l'ID 1 (Le groupe racine "Flotte SenBus")
          // On convertit en Number pour être sûr de la comparaison
    const excludedGroupId = 1;
    const filteredGroups = selectedGroups.filter(id => Number(id) !== excludedGroupId);

    return { statuses: filter.statuses || [], groups: filteredGroups };
  }, [filter.statuses, filter.groups, globalFilter.groups]);

  useFilter(keyword, memoizedFilter, filterSort, filterMap, positions, setFilteredDevices, setFilteredPositions);

  // =======================================================
  // ⛔ ÉTAPE CRITIQUE 1 : GESTION DU CHARGEMENT
  // =======================================================
  if (!initialized) {
    // Afficher un spinner (Loader) tant que nous n'avons pas la réponse de session
    return (<Loader />);
  }

  // =======================================================
  // ✅ ÉTAPE CRITIQUE 2 : VÉRIFICATION DE LA PERMISSION
  // =======================================================
  const hasAccess = useIsSubscriber();

  if (!hasAccess) {
    return (<SubscriptionPrompt />);
  }

    // =======================================================
  // 🔗 ÉTAPE CRITIQUE 3 : LIAISON AUTOMATIQUE (SaaS)
  // =======================================================
  // Logique déplacée côté Backend pour éviter les erreurs de permissions 400/403

    // On intercepte le changement de sélection pour forcer l'affichage
  useEffect(() => {
    if (selectedDeviceId) {
      setIsManualSelection(true);
    }
  }, [selectedDeviceId]);
  
  return (
    <div className={classes.root}>
      <SubscriptionBanner />
      {desktop && (
        <MainMap
          filteredPositions={filteredPositions}
          selectedPosition={selectedPosition}
          onEventsClick={onEventsClick}
        />
      )}
      <div className={classes.sidebar}>
        <Paper square elevation={3} className={classes.header}>
          <MainToolbar
            filteredDevices={filteredDevices}
            groups={groups}
            devicesOpen={devicesOpen}
            setDevicesOpen={setDevicesOpen}
            keyword={keyword}
            setKeyword={setKeyword}
            filter={filter}
            setFilter={setFilter}
            filterSort={filterSort}
            setFilterSort={setFilterSort}
            filterMap={filterMap}
            setFilterMap={setFilterMap}
          />
        </Paper>
        <div className={classes.middle}>
          {!desktop && (
            <div className={classes.contentMap}>
              <MainMap
                filteredPositions={filteredPositions}
                selectedPosition={selectedPosition}
                onEventsClick={onEventsClick}
              />
            </div>
          )}
          <Paper square className={classes.contentList} style={devicesOpen ? {} : { visibility: 'hidden' }}>
            <DeviceList devices={filteredDevices} groups={groups} />
          </Paper>
        </div>
        {desktop && (
          <div className={classes.footer}>
            <BottomMenu />
          </div>
        )}
      </div>
      <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />
      {selectedDeviceId && (filteredDevices.length === 1 || isManualSelection) && (
        <div style={{ 
          position: 'fixed', 
          bottom: desktop ? '20px' : '100px',
          left: desktop ? theme.dimensions.drawerWidthDesktop : '10px',
          right: '10px',
          zIndex: 4,
          pointerEvents: 'none'
        }}>
          <div style={{ pointerEvents: 'auto' }}>
            <StatusCard
              deviceId={selectedDeviceId}
              position={selectedPosition}
              onClose={() => {
                dispatch(devicesActions.selectId(null));
                setIsManualSelection(false); 
              }}
              desktopPadding={0}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;