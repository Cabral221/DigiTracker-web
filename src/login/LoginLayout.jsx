import { Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import LogoImage from './LogoImage';
import { Typography, Divider } from '@mui/material';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  sidebar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.primary.main,
    paddingBottom: theme.spacing(5),
    width: theme.dimensions.sidebarWidth,
    [theme.breakpoints.down('lg')]: {
      width: theme.dimensions.sidebarWidthTablet,
    },
    [theme.breakpoints.down('sm')]: {
      width: '0px',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    boxShadow: '-2px 0px 16px rgba(0, 0, 0, 0.25)',
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(0, 25, 0, 0),
    },
  },
  form: {
    maxWidth: theme.spacing(52),
    padding: theme.spacing(5),
    width: '100%',
  },
  headerContainer: {
    textAlign: 'center',
    marginBottom: theme.spacing(3),
  },
  brandTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginTop: theme.spacing(1),
  },
  brandSubtitle: {
    color: '#000000',
    fontSize: '0.9rem',
    marginBottom: theme.spacing(2),
  },
}));

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();

  return (
    <main className={classes.root}>
      <div className={classes.sidebar}>
        {/* {!useMediaQuery(theme.breakpoints.down('lg')) && <LogoImage color={theme.palette.secondary.contrastText} />} */}
        {/* --- DÉBUT DE LA PERSONNALISATION --- */}
        <div className={classes.headerContainer}>
        {/* Logo dynamique ou fixe */}
        {/* <LogoImage color={'#000000'} sx={{ width: '80px', margin: '0 auto' }} /> */}

        <Typography variant="h4" className={classes.brandTitle}>
        WayTrack
        </Typography>

        <Typography className={classes.brandSubtitle}>
        Suivi en temps réel de vos bus de transports urbains
        </Typography>

        <Divider sx={{ mb: 2 }} />
        </div>
        {/* --- FIN DE LA PERSONNALISATION --- */}
      </div>
      <Paper className={classes.paper}>
        <form className={classes.form}>
          {children}
        </form>
      </Paper>
    </main>
  );
};

export default LoginLayout;
