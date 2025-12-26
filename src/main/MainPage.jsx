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
import Loader from '../common/components/Loader';
// import SubscriptionPrompt from '../common/components/SubscriptionPrompt';
import SubscriptionBanner from '../common/components/SubscriptionBanner';
import { useLocation, useNavigate } from 'react-router-dom';
import SubscriptionActionBanner from '../common/components/SubscriptionActionBanner';
import SubscriptionExpiryGuard from '../common/components/SubscriptionExpiryGuard'; // Import du nouveau garde-fou

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
  // 1. Déclarations des Hooks de base (TOUJOURS EN PREMIER)
  const initialized = useSelector(state => state.session.initialized);
  const user = useSelector((state) => state.session.user);
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);
  
  // Déclaration de tous les states
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = usePersistedState('filter', { statuses: [], groups: [] });
  const [filterSort, setFilterSort] = usePersistedState('filterSort', '');
  const [filterMap, setFilterMap] = usePersistedState('filterMap', true);
  const [devicesOpen, setDevicesOpen] = useState(desktop);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [isManualSelection, setIsManualSelection] = useState(false);

  // Sélections et mémos
  const globalFilter = useSelector((state) => state.devices.filter);
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

  const selectedPosition = useMemo(() => 
    filteredPositions.find((position) => selectedDeviceId && position.deviceId === selectedDeviceId),
    [filteredPositions, selectedDeviceId]
  );

  // LOGIQUE D'EXPIRATION
  const isExpired = useMemo(() => {
    if (!user || !user.attributes.subscriptionEndDate) return false;
    const expiryDate = new Date(user.attributes.subscriptionEndDate);
    return expiryDate < new Date();
  }, [user]);

  const onEventsClick = useCallback(() => setEventsOpen(true), [setEventsOpen]);

  // =======================================================
  // 🔄 LOGIQUE DE REDIRECTION (AVANT INITIALISATION)
  // =======================================================
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('paiement') === 'succes') {
      const newUrl = `${window.location.pathname}?confirme=true`;
      window.history.replaceState({}, document.title, newUrl);
      window.location.reload(); 
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

  // Filtrage des groupes
  const memoizedFilter = useMemo(() => {
    const selectedGroups = globalFilter.groups && globalFilter.groups.length > 0 
      ? globalFilter.groups 
      : (filter.groups || []);
    const excludedGroupId = 1;
    const filteredGroups = selectedGroups.filter(id => Number(id) !== excludedGroupId);

    return { statuses: filter.statuses || [], groups: filteredGroups };
  }, [filter.statuses, filter.groups, globalFilter.groups]);

  // Utilisation du filtre (Hook)
  useFilter(keyword, memoizedFilter, filterSort, filterMap, positions, setFilteredDevices, setFilteredPositions);

  // Liaison manuelle
  useEffect(() => {
    if (selectedDeviceId) {
      setIsManualSelection(true);
    }
  }, [selectedDeviceId]);

  // =======================================================
  // 🛡️ LE GARDE-FOU (PLACÉ APRÈS TOUS LES HOOKS)
  // =======================================================
  if (!initialized || !user) {
    return <Loader />;
  }

  // =======================================================
  // ✅ RENDU FINAL
  // =======================================================
  return (
    <div className={classes.root}>
      {/* Affichage du garde-fou si expiré */}
      {isExpired && <SubscriptionExpiryGuard />}

      <SubscriptionBanner />
      {/* Bannière d'abonnement */}
      {user && user.attributes.isSubscriber !== 'true' && (
        <SubscriptionActionBanner />
      )}
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