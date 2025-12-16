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
export const useIsSubscriber = () => useSelector((state) => {

  const user = state.session.user; 
  // Par défaut, si l'utilisateur n'est pas chargé, nous supposons 'false' ou 'true'
  // selon votre politique de sécurité (ici, 'false' est plus sûr).
  if (!user) {
    return false;
  }

  // Si l'utilisateur est administrateur, on lui donne toujours l'accès.
  // (Optionnel : si vous voulez que les administrateurs voient toujours la carte)
  const isAdmin = user.administrator; 

  // 2. LOGIQUE CRITIQUE : Accéder à l'attribut
  let isSubscriberAccess = false;

  // Vérifier si l'objet attributes existe et contient notre clé
  if (user.attributes && user.attributes.isSubscriber) {
      // La valeur doit être comparée à la chaîne "true" (Traccar stocke les attributs comme des chaînes)
      isSubscriberAccess = user.attributes.isSubscriber === 'true';
  }

  return isAdmin || isSubscriberAccess;
});