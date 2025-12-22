import maplibregl from 'maplibre-gl';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePreference } from '../../common/util/preferences';
import { map } from '../core/MapView';

const MapDefaultCamera = ({ mapReady }) => {
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);

  const defaultLatitude = usePreference('latitude');
  const defaultLongitude = usePreference('longitude');
  const defaultZoom = usePreference('zoom', 0);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!mapReady || initialized) return;

    if (selectedDeviceId) {
      const position = positions[selectedDeviceId];
      if (position) {
        map.jumpTo({
          center: [position.longitude, position.latitude],
          zoom: Math.max(defaultZoom > 0 ? defaultZoom : map.getZoom(), 14), // Zoom plus proche (14) quand on sélectionne
        });
        setInitialized(true);
      }
    } else {
      const coordinates = Object.values(positions).map((item) => [item.longitude, item.latitude]);
      
      if (coordinates.length > 1) {
        // --- CALCUL DES LIMITES POUR PLUSIEURS BUS ---
        const bounds = coordinates.reduce(
          (bounds, item) => bounds.extend(item), 
          new maplibregl.LngLatBounds(coordinates[0], coordinates[1])
        );

        map.fitBounds(bounds, {
          duration: 0,
          padding: 70, // Padding fixe de 70px sur tous les côtés (confortable)
          maxZoom: 13,  // Empêche de trop zoomer si les bus sont proches
        });
        setInitialized(true);

      } else if (coordinates.length === 1) {
        // --- CAS D'UN SEUL BUS ---
        const [individual] = coordinates;
        map.jumpTo({
          center: individual,
          zoom: 13, // Zoom équilibré pour voir les rues alentours
        });
        setInitialized(true);

      } else if (defaultLatitude && defaultLongitude) {
        // --- CAS PAR DÉFAUT (COORDONNÉES TRACCAR) ---
        map.jumpTo({
          center: [defaultLongitude, defaultLatitude],
          zoom: defaultZoom,
        });
        setInitialized(true);
      }
    }
  }, [selectedDeviceId, initialized, defaultLatitude, defaultLongitude, defaultZoom, positions, mapReady]);

  return null;
};

MapDefaultCamera.handlesMapReady = true;

export default MapDefaultCamera;