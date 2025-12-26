import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery, useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import BottomMenu from './common/components/BottomMenu';
import SocketController from './SocketController';
import CachingController from './CachingController';
import { useCatch, useEffectAsync } from './reactHelper';
import { sessionActions } from './store';
import UpdateController from './UpdateController';
import TermsDialog from './common/components/TermsDialog';
import Loader from './common/components/Loader';
import fetchOrThrow from './common/util/fetchOrThrow';

const useStyles = makeStyles()(() => ({
  page: {
    flexGrow: 1,
    overflow: 'auto',
  },
  menu: {
    zIndex: 4,
    '@media print': {
      display: 'none',
    },
  },
}));

const App = () => {
  const { classes } = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const newServer = useSelector((state) => state.session.server.newServer);
  const termsUrl = useSelector((state) => state.session.server.attributes.termsUrl);
  const user = useSelector((state) => state.session.user);
  const initialized = useSelector((state) => state.session.initialized); // On récupère l'état d'initialisation

  const acceptTerms = useCatch(async () => {
    const response = await fetchOrThrow(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, attributes: { ...user.attributes, termsAccepted: true } }),
    });
    dispatch(sessionActions.updateUser(await response.json()));
  });

  useEffectAsync(async () => {
    // 1. Pages réellement publiques (accessibles SANS compte)
    const isPublicPage = [
      '/login', '/register', '/terms', '/privacy', '/reset-password'
    ].includes(pathname);
    
    // Note : '/offres' est retiré d'ici car on veut que l'API de session 
    // soit vérifiée AVANT d'y accéder.

    if (!user) {
      try {
        const response = await fetch('/api/session');
        if (response.ok) {
          const userData = await response.json();
          dispatch(sessionActions.updateUser(userData));
          // Ici, on ne fait rien, l'Outlet affichera la page demandée (ex: /offres)
        } else if (!isPublicPage) {
          // Si pas de session ET page non-publique (comme /offres ou /) -> Login
          window.sessionStorage.setItem('postLogin', pathname + search);
          navigate(newServer ? '/register' : '/login', { replace: true });
        }
      } catch (e) {
        console.error("Session check failed", e);
      } finally {
        dispatch(sessionActions.setInitialized());
      }
    } else {
      dispatch(sessionActions.setInitialized());
    }
  }, [[pathname, navigate, dispatch]]);

  // --- LE CHANGEMENT CRITIQUE EST ICI ---
  // Si on n'est pas initialisé, on affiche le loader.
  // Une fois initialisé, si on n'a pas d'user, on ne bloque pas (pour laisser Navigation.jsx gérer les routes publiques)
  if (!initialized) {
    return (<Loader />);
  }

  // Si on est initialisé mais qu'on n'a pas d'utilisateur, 
  // on laisse passer le rendu pour que les routes comme /offres dans Navigation.jsx fonctionnent.
  if (!user) {
    return <Outlet />; 
  }

  if (termsUrl && !user.attributes.termsAccepted) {
    return (
      <TermsDialog
        open
        onCancel={() => navigate('/login')}
        onAccept={() => acceptTerms()}
      />
    );
  }

  return (
    <>
      <SocketController />
      <CachingController />
      <UpdateController />
      <div className={classes.page}>
        <Outlet />
      </div>
      {!desktop && (
        <div className={classes.menu}>
          <BottomMenu />
        </div>
      )}
    </>
  );
};

export default App;
