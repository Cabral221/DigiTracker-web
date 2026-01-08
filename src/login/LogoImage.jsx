import { useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';

// Imports des deux versions SVG fixes
import LogoMain from '../resources/images/logo-waytracker.svg';
import LogoInverted from '../resources/images/logo-waytracker-inverted.svg';

const useStyles = makeStyles()((theme) => ({
  image: {
    alignSelf: 'center',
    maxWidth: '340px',
    maxHeight: '220px',
    width: 'auto',
    height: 'auto',
    margin: theme.spacing(2),
  },
}));

const LogoImage = ({ inverted }) => {
  const theme = useTheme();
  const { classes } = useStyles();
  const expanded = !useMediaQuery(theme.breakpoints.down('lg'));

  // Récupération des attributs du serveur (Traccar)
  const logo = useSelector((state) => state.session.server.attributes?.logo);
  const logoInverted = useSelector((state) => state.session.server.attributes?.logoInverted);

  // 1. Si un logo personnalisé a été chargé sur le serveur, on l'utilise en priorité
  if (logo) {
    if (expanded && logoInverted) {
      return <img className={classes.image} src={logoInverted} alt="Logo" />;
    }
    return <img className={classes.image} src={logo} alt="Logo" />;
  }

  // 2. Sinon, on utilise tes fichiers SVG locaux selon le paramètre "inverted"
  // Si inverted={true} -> version blanche (#FFFFFF)
  // Si inverted={false} ou non défini -> version verte (#10B981)
  return (
    <img
      className={classes.image}
      src={inverted ? LogoInverted : LogoMain}
      alt="WayTracker"
    />
  );
};

export default LogoImage;
