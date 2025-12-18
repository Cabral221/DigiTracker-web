import { useSelector } from 'react-redux';

export const useAdministrator = () => useSelector((state) => {
  const admin = state.session.user.administrator;
  return admin;
});

export const useManager = () => useSelector((state) => {
  const admin = state.session.user.administrator;
  const manager = (state.session.user.userLimit || 0) !== 0;
  return admin || manager;
});

export const useDeviceReadonly = () => useSelector((state) => {
  const admin = state.session.user.administrator;
  const serverReadonly = state.session.server.readonly;
  const userReadonly = state.session.user.readonly;
  const serverDeviceReadonly = state.session.server.deviceReadonly;
  const userDeviceReadonly = state.session.user.deviceReadonly;
  return !admin && (serverReadonly || userReadonly || serverDeviceReadonly || userDeviceReadonly);
});

export const useRestriction = (key) => useSelector((state) => {
  const admin = state.session.user.administrator;
  const serverValue = state.session.server[key];
  const userValue = state.session.user[key];
  return !admin && (serverValue || userValue);
});


/**
 * Hook personnalisé pour vérifier si l'utilisateur est un abonné payant.
 * Cette vérification est basée sur l'attribut 'isSubscriber' stocké
 * sur l'objet utilisateur du serveur Traccar.
 */
export const useIsSubscriber = () => {
  const user = useSelector((state) => state.session.user);

  // 1. Si l'utilisateur n'est pas chargé, on refuse l'accès par défaut
  if (!user) {
    return false;
  }

  // 2. Les administrateurs ont toujours accès
  if (user.administrator) {
    return true;
  }

  // 3. Récupération des attributs (ceux que StripeResource enregistre)
  const isSubscriber = user.attributes.isSubscriber;
  const endDateStr = user.attributes.subscriptionEndDate;

  // 4. Vérification du statut (on compare avec la chaîne "true")
  if (isSubscriber !== 'true' || !endDateStr) {
    return false;
  }

  // 5. Comparaison de la date d'expiration
  // On récupère la date du jour au format ISO (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // En JavaScript, comparer deux chaînes "YYYY-MM-DD" fonctionne parfaitement 
  // pour savoir laquelle est chronologiquement après l'autre.
  return endDateStr >= today;
};