import { grey, green, red, blue } from '@mui/material/colors'; // Ajout de couleurs pour le thème
import { createTheme } from '@mui/material';
import { loadImage, prepareIcon } from './mapUtil';

import directionSvg from '../../resources/images/direction.svg';
import backgroundSvg from '../../resources/images/background.svg';
import animalSvg from '../../resources/images/icon/animal.svg';
import bicycleSvg from '../../resources/images/icon/bicycle.svg';
import boatSvg from '../../resources/images/icon/boat.svg';
import busSvg from '../../resources/images/icon/bus.svg';
import carSvg from '../../resources/images/icon/car.svg';
import camperSvg from '../../resources/images/icon/camper.svg';
import craneSvg from '../../resources/images/icon/crane.svg';
import defaultSvg from '../../resources/images/icon/default.svg';
import startSvg from '../../resources/images/icon/start.svg';
import finishSvg from '../../resources/images/icon/finish.svg';
import helicopterSvg from '../../resources/images/icon/helicopter.svg';
import motorcycleSvg from '../../resources/images/icon/motorcycle.svg';
import personSvg from '../../resources/images/icon/person.svg';
import planeSvg from '../../resources/images/icon/plane.svg';
import scooterSvg from '../../resources/images/icon/scooter.svg';
import shipSvg from '../../resources/images/icon/ship.svg';
import tractorSvg from '../../resources/images/icon/tractor.svg';
import trailerSvg from '../../resources/images/icon/trailer.svg';
import trainSvg from '../../resources/images/icon/train.svg';
import tramSvg from '../../resources/images/icon/tram.svg';
import truckSvg from '../../resources/images/icon/truck.svg';
import vanSvg from '../../resources/images/icon/van.svg';

// Note: On n'importe plus les bus-online/offline car on va colorer le busSvg standard

export const mapIcons = {
  animal: animalSvg,
  bicycle: bicycleSvg,
  boat: boatSvg,
  bus: busSvg,
  car: carSvg,
  camper: camperSvg,
  crane: craneSvg,
  default: defaultSvg,
  finish: finishSvg,
  helicopter: helicopterSvg,
  motorcycle: motorcycleSvg,
  person: personSvg,
  plane: planeSvg,
  scooter: scooterSvg,
  ship: shipSvg,
  start: startSvg,
  tractor: tractorSvg,
  trailer: trailerSvg,
  train: trainSvg,
  tram: tramSvg,
  truck: truckSvg,
  van: vanSvg,
};

export const mapIconKey = (category) => {
  switch (category) {
    case 'offroad':
    case 'pickup':
      return 'car';
    case 'trolleybus':
      return 'bus';
    default:
      return mapIcons.hasOwnProperty(category) ? category : 'default';
  }
};

export const mapImages = {};

// On définit ici les couleurs que Traccar va appliquer sur les SVG
const theme = createTheme({
  palette: {
    success: { main: '#2ecc71' }, // Vert (Mouvement)
    error: { main: '#e74c3c' },   // Rouge (Offline)
    info: { main: '#3498db' },    // Bleu (Online/Statique)
    neutral: { main: grey[500] }, // Gris (Inconnu)
  },
});

export default async () => {
  const background = await loadImage(backgroundSvg);
  mapImages.background = await prepareIcon(background);
  mapImages.direction = await prepareIcon(await loadImage(directionSvg));

  // Liste des statuts que le moteur de carte utilise pour construire les clés d'images
  const statuses = ['info', 'success', 'error', 'neutral', 'online', 'offline', 'unknown', 'selected'];

  await Promise.all(Object.keys(mapIcons).map(async (category) => {
    const results = [];

    statuses.forEach((status) => {
      // Mapping pour faire correspondre le statut à une couleur du thème
      const paletteMapping = {
        success: 'success', 
        info: 'info', online: 'info', selected: 'info',
        error: 'error', offline: 'error',
        neutral: 'neutral', unknown: 'neutral'
      };

      const themeColor = paletteMapping[status] || 'neutral';
      const colorValue = theme.palette[themeColor].main;

      results.push(loadImage(mapIcons[category]).then((icon) => {
        // prepareIcon va superposer le background + l'icône + la couleur
        mapImages[`${category}-${status}`] = prepareIcon(background, icon, colorValue);
      }));
    });
    await Promise.all(results);
  }));
};