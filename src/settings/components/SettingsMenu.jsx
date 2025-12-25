import {
  Divider, List,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import DrawIcon from '@mui/icons-material/Draw';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import TodayIcon from '@mui/icons-material/Today';
import SendIcon from '@mui/icons-material/Send';
import DnsIcon from '@mui/icons-material/Dns';
import HelpIcon from '@mui/icons-material/Help';
import PaymentIcon from '@mui/icons-material/Payment';
import CampaignIcon from '@mui/icons-material/Campaign';
import CalculateIcon from '@mui/icons-material/Calculate';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import {
  useAdministrator, useManager, useRestriction,
} from '../../common/util/permissions';
import useFeatures from '../../common/util/useFeatures';
import MenuItem from '../../common/components/MenuItem';

const SettingsMenu = () => {
  const t = useTranslation();
  const location = useLocation();

  const readonly = useRestriction('readonly');
  const admin = useAdministrator();
  const manager = useManager(); // Utilise le hook manager existant
  const user = useSelector((state) => state.session.user); // Récupérer l'utilisateur pour vérifier l'abonnement
  const userId = useSelector((state) => state.session.user.id);
  const supportLink = useSelector((state) => state.session.server.attributes.support);
  const billingLink = useSelector((state) => state.session.user.attributes.billingLink);

  const features = useFeatures();

  // On définit qui a le droit de gérer sa propre flotte (Admin ou Abonné/Manager)
  const canManageFlotte = admin || manager || user.attributes.isSubscriber === 'true';

  return (
    <>
      <List>
        {/* TOUT LE MONDE : Accès au profil */}
        <MenuItem
          title={t('settingsUser')}
          link={`/settings/user/${userId}`}
          icon={<PersonIcon />}
          selected={location.pathname === `/settings/user/${userId}`}
        />

        {/* ACCÈS GESTION : Visible par l'Admin ET le Manager (Abonné) */}
        {canManageFlotte && (
          <>
            <MenuItem
              title={t('sharedPreferences')}
              link="/settings/preferences"
              icon={<TuneIcon />}
              selected={location.pathname === '/settings/preferences'}
            />
            <MenuItem
              title={t('sharedNotifications')}
              link="/settings/notifications"
              icon={<NotificationsIcon />}
              selected={location.pathname.startsWith('/settings/notification')}
            />
            <MenuItem
              title={t('deviceTitle')}
              link="/settings/devices"
              icon={<DnsIcon />}
              selected={location.pathname.startsWith('/settings/device')}
            />
            <MenuItem
              title={t('sharedGeofences')}
              link="/geofences"
              icon={<DrawIcon />}
              selected={location.pathname.startsWith('/settings/geofence')}
            />
            {!features.disableGroups && (
              <MenuItem
                title={t('settingsGroups')}
                link="/settings/groups"
                icon={<FolderIcon />}
                selected={location.pathname.startsWith('/settings/group')}
              />
            )}
            {!features.disableDrivers && (
              <MenuItem
                title={t('sharedDrivers')}
                link="/settings/drivers"
                icon={<PersonIcon />}
                selected={location.pathname.startsWith('/settings/driver')}
              />
            )}
            {!features.disableCalendars && (
              <MenuItem
                title={t('sharedCalendars')}
                link="/settings/calendars"
                icon={<TodayIcon />}
                selected={location.pathname.startsWith('/settings/calendar')}
              />
            )}
            {!features.disableSavedCommands && (
              <MenuItem
                title={t('sharedSavedCommands')}
                link="/settings/commands"
                icon={<SendIcon />}
                selected={location.pathname.startsWith('/settings/command')}
              />
            )}
            {/* Options avancées souvent réservées au Manager/Admin */}
            {!features.disableMaintenance && (
              <MenuItem
                title={t('sharedMaintenance')}
                link="/settings/maintenances"
                icon={<BuildIcon />}
                selected={location.pathname.startsWith('/settings/maintenance')}
              />
            )}
          </>
        )}

        {/* LIENS EXTERNES */}
        {billingLink && (
          <MenuItem
            title={t('userBilling')}
            link={billingLink}
            icon={<PaymentIcon />}
          />
        )}
      </List>

      {/* SECTION ADMINISTRATION SYSTÈME (Uniquement Admin ou vrai Manager d'utilisateurs) */}
      {(admin || manager) && (
        <>
          <Divider />
          <List>
            {/* L'annonce est souvent pour l'Admin uniquement */}
            {admin && (
              <MenuItem
                title={t('serverAnnouncement')}
                link="/settings/announcement"
                icon={<CampaignIcon />}
                selected={location.pathname === '/settings/announcement'}
              />
            )}
            {/* Seul l'Admin gère les réglages du serveur global */}
            {admin && (
              <MenuItem
                title={t('settingsServer')}
                link="/settings/server"
                icon={<SettingsIcon />}
                selected={location.pathname === '/settings/server'}
              />
            )}
            {/* Seul l'Admin voit la liste globale des utilisateurs (ou un Manager de sous-comptes) */}
            <MenuItem
              title={t('settingsUsers')}
              link="/settings/users"
              icon={<PeopleIcon />}
              selected={location.pathname.startsWith('/settings/user') && location.pathname !== `/settings/user/${userId}`}
            />
          </List>
        </>
      )}
    </>
  );
};

export default SettingsMenu;