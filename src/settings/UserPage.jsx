import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, FormControl,
  InputLabel, Select, MenuItem, FormControlLabel, Checkbox, FormGroup,
  TextField, Button, InputAdornment, IconButton, OutlinedInput,
  Dialog, DialogContent, DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import EditItemView from './components/EditItemView';
import EditAttributesAccordion from './components/EditAttributesAccordion';
import { useTranslation } from '../common/components/LocalizationProvider';
import useUserAttributes from '../common/attributes/useUserAttributes';
import { sessionActions } from '../store';
import SelectField from '../common/components/SelectField';
import SettingsMenu from './components/SettingsMenu';
import useCommonUserAttributes from '../common/attributes/useCommonUserAttributes';
import { useAdministrator, useRestriction } from '../common/util/permissions';
import { useCatch } from '../reactHelper';
import { map } from '../map/core/MapView';
import useSettingsStyles from './common/useSettingsStyles';
import fetchOrThrow from '../common/util/fetchOrThrow';

const UserPage = () => {
  const { classes } = useSettingsStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const fixedEmail = useRestriction('fixedEmail');

  const currentUser = useSelector((state) => state.session.user);
  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const openIdForced = useSelector((state) => state.session.server.openIdForce);
  const totpEnable = useSelector((state) => state.session.server.attributes.totpEnable);
  const totpForce = useSelector((state) => state.session.server.attributes.totpForce);

  const commonUserAttributes = useCommonUserAttributes(t);
  const userAttributes = useUserAttributes(t);

  const { id } = useParams();
  const [item, setItem] = useState(id === currentUser.id.toString() ? currentUser : null);

  const [deleteEmail, setDeleteEmail] = useState();
  const [deleteFailed, setDeleteFailed] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [revokeToken, setRevokeToken] = useState('');

  const handleDelete = useCatch(async () => {
    if (deleteEmail === currentUser.email) {
      setDeleteFailed(false);
      await fetchOrThrow(`/api/users/${currentUser.id}`, { method: 'DELETE' });
      navigate('/login');
      dispatch(sessionActions.updateUser(null));
    } else {
      setDeleteFailed(true);
    }
  });

  const handleGenerateTotp = useCatch(async () => {
    const response = await fetchOrThrow('/api/users/totp', { method: 'POST' });
    setItem({ ...item, totpKey: await response.text() });
  });

  const closeRevokeDialog = () => {
    setRevokeDialogOpen(false);
    setRevokeToken('');
  };

  const handleRevokeToken = useCatch(async () => {
    await fetchOrThrow('/api/session/token/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token: revokeToken }).toString(),
    });
    closeRevokeDialog();
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const attribute = searchParams.get('attribute');

  useEffect(() => {
    if (item && attribute && !item.attributes.hasOwnProperty('attribute')) {
      const updatedAttributes = { ...item.attributes };
      updatedAttributes[attribute] = '';
      setItem({ ...item, attributes: updatedAttributes });
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('attribute');
      setSearchParams(newParams, { replace: true });
    }
  }, [item, searchParams, setSearchParams, attribute]);

  const onItemSaved = (result) => {
    if (result.id === currentUser.id) {
      dispatch(sessionActions.updateUser(result));
    }
  };

  const validate = () => item && item.name && item.email && (item.id || item.password) && (admin || !totpForce || item.totpKey);

  return (
    <EditItemView
      endpoint="users"
      item={item}
      setItem={setItem}
      defaultItem={admin ? { deviceLimit: -1 } : {}}
      validate={validate}
      onItemSaved={onItemSaved}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'settingsUser']}
    >
      {item && (
        <>
          {/* 1. INFORMATIONS OBLIGATOIRES (Nom, Email, Password) */}
          <Accordion defaultExpanded={!attribute}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('sharedRequired')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                value={item.name || ''}
                onChange={(e) => setItem({ ...item, name: e.target.value })}
                label={t('sharedName')}
              />
              <TextField
                value={item.email || ''}
                onChange={(e) => setItem({ ...item, email: e.target.value })}
                label={t('userEmail')}
                disabled={fixedEmail && item.id === currentUser.id}
              />
              {!openIdForced && (
                <TextField
                  type="password"
                  onChange={(e) => setItem({ ...item, password: e.target.value })}
                  label={t('userPassword')}
                  autoComplete="new-password"
                />
              )}
              {totpEnable && (
                <FormControl>
                  <InputLabel>{t('loginTotpKey')}</InputLabel>
                  <OutlinedInput
                    readOnly
                    label={t('loginTotpKey')}
                    value={item.totpKey || ''}
                    endAdornment={(
                      <InputAdornment position="end">
                        <IconButton size="small" edge="end" onClick={handleGenerateTotp}><CachedIcon fontSize="small" /></IconButton>
                        <IconButton size="small" edge="end" onClick={() => setItem({ ...item, totpKey: null })}><CloseIcon fontSize="small" /></IconButton>
                      </InputAdornment>
                    )}
                  />
                </FormControl>
              )}
            </AccordionDetails>
          </Accordion>

          {/* 2. PRÉFÉRENCES (Unités, Fuseau horaire) - Utile pour l'abonné */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">{t('sharedPreferences')}</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                value={item.phone || ''}
                onChange={(e) => setItem({ ...item, phone: e.target.value })}
                label={t('sharedPhone')}
              />
              <FormControl>
                <InputLabel>{t('settingsSpeedUnit')}</InputLabel>
                <Select
                  label={t('settingsSpeedUnit')}
                  value={(item.attributes && item.attributes.speedUnit) || 'kmh'}
                  onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, speedUnit: e.target.value } })}
                >
                  <MenuItem value="kn">{t('sharedKn')}</MenuItem>
                  <MenuItem value="kmh">{t('sharedKmh')}</MenuItem>
                  <MenuItem value="mph">{t('sharedMph')}</MenuItem>
                </Select>
              </FormControl>
              <SelectField
                value={item.attributes && item.attributes.timezone}
                onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, timezone: e.target.value } })}
                endpoint="/api/server/timezones"
                keyGetter={(it) => it}
                titleGetter={(it) => it}
                label={t('sharedTimezone')}
              />
            </AccordionDetails>
          </Accordion>

          {/* 3. BLOC ADMINISTRATEUR (Localisation, Permissions, Attributs) */}
          {admin && (
            <>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">{t('sharedLocation')}</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.details}>
                  <TextField type="number" value={item.latitude || 0} onChange={(e) => setItem({ ...item, latitude: Number(e.target.value) })} label={t('positionLatitude')} />
                  <TextField type="number" value={item.longitude || 0} onChange={(e) => setItem({ ...item, longitude: Number(e.target.value) })} label={t('positionLongitude')} />
                  <Button variant="outlined" color="primary" onClick={() => {
                    const { lng, lat } = map.getCenter();
                    setItem({ ...item, latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)), zoom: Number(map.getZoom().toFixed(1)) });
                  }}>
                    {t('mapCurrentLocation')}
                  </Button>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">{t('sharedPermissions')}</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.details}>
                  <TextField type="number" value={item.deviceLimit || 0} onChange={(e) => setItem({ ...item, deviceLimit: Number(e.target.value) })} label={t('userDeviceLimit')} />
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={item.administrator} onChange={(e) => setItem({ ...item, administrator: e.target.checked })} />} label={t('userAdmin')} />
                    <FormControlLabel control={<Checkbox checked={item.disabled} onChange={(e) => setItem({ ...item, disabled: e.target.checked })} />} label={t('sharedDisabled')} />
                  </FormGroup>
                </AccordionDetails>
              </Accordion>

              <EditAttributesAccordion
                attribute={attribute}
                attributes={item.attributes}
                setAttributes={(attributes) => setItem({ ...item, attributes })}
                definitions={{ ...commonUserAttributes, ...userAttributes }}
                focusAttribute={attribute}
                editingId={item.id}
              />
            </>
          )}

          {/* 4. SUPPRESSION DE COMPTE (Visible pour les abonnés si activé) */}
          {registrationEnabled && item.id === currentUser.id && !admin && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" color="error">{t('userDeleteAccount')}</Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <TextField value={deleteEmail} onChange={(e) => setDeleteEmail(e.target.value)} label={t('userEmail')} error={deleteFailed} />
                <Button variant="outlined" color="error" onClick={handleDelete} startIcon={<DeleteForeverIcon />}>{t('userDeleteAccount')}</Button>
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}

      {/* DIALOGUES DE RÉVOCATION */}
      <Dialog open={revokeDialogOpen} onClose={closeRevokeDialog} fullWidth maxWidth="xs">
        <DialogContent className={classes.details}>
          <TextField value={revokeToken} onChange={(e) => setRevokeToken(e.target.value)} label={t('userToken')} autoFocus fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRevokeDialog}>{t('sharedCancel')}</Button>
          <Button onClick={handleRevokeToken} disabled={!revokeToken} variant="contained">{t('userRevokeToken')}</Button>
        </DialogActions>
      </Dialog>
    </EditItemView>
  );
};

export default UserPage;