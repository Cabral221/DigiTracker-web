import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

export default (keyword, filter, filterSort, filterMap, positions, setFilteredDevices, setFilteredPositions) => {
  const groups = useSelector((state) => state.groups.items);
  const devices = useSelector((state) => state.devices.items);

  // Helper pour trouver les groupes parents
  const getDeviceGroups = (device) => {
    const groupIds = [];
    let { groupId } = device;
    while (groupId) {
      groupIds.push(groupId);
      groupId = groups[groupId]?.groupId || 0;
    }
    return groupIds;
  };

  // 1. FILTRE SIDEBAR : On garde tous les bus (filtrés uniquement par texte/statut)
  const sidebarDevices = useMemo(() => {
    const lowerCaseKeyword = keyword.toLowerCase();

    return Object.values(devices)
      .filter((device) => !filter.statuses.length || filter.statuses.includes(device.status))
      .filter((device) => {
        return [device.name, device.uniqueId, device.phone, device.model, device.contact]
          .some((s) => s && s.toLowerCase().includes(lowerCaseKeyword));
      });
  }, [devices, filter.statuses, keyword]);

  // 2. GESTION DU TRI ET DE LA CARTE
  useEffect(() => {
    // TRI : On trie la liste de la sidebar
    const sorted = [...sidebarDevices];
    switch (filterSort) {
      case 'name':
        sorted.sort((device1, device2) => device1.name.localeCompare(device2.name));
        break;
      case 'lastUpdate':
        sorted.sort((device1, device2) => {
          const time1 = device1.lastUpdate ? dayjs(device1.lastUpdate).valueOf() : 0;
          const time2 = device2.lastUpdate ? dayjs(device2.lastUpdate).valueOf() : 0;
          return time2 - time1;
        });
        break;
      default:
        break;
    }

    // Mise à jour de la Sidebar (Toujours visible)
    setFilteredDevices(sorted);

    // FILTRE CARTE : On n'affiche que si une ligne (groupe) est sélectionnée
    let mapDevices = [];
    if (filter.groups && filter.groups.length > 0) {
      mapDevices = sorted.filter((device) => 
        getDeviceGroups(device).some((id) => filter.groups.includes(id))
      );
    }

    // Mise à jour des Positions sur la carte
    // Si aucune ligne n'est sélectionnée, mapDevices est vide [] -> Carte vide.
    const newPositions = mapDevices
      .map((device) => positions[device.id])
      .filter((pos) => pos !== undefined && pos !== null);

    setFilteredPositions(newPositions);

  }, [sidebarDevices, groups, filter.groups, filterSort, filterMap, positions, setFilteredDevices, setFilteredPositions]);
};