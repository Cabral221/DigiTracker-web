import { grey } from '@mui/material/colors';
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

import busOnline from '../../resources/images/icon/bus-online.svg';
import busOffline from '../../resources/images/icon/bus-offline.svg';
import busNeutral from '../../resources/images/icon/bus-neutral.svg';

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
  'bus-online': busOnline,
  'bus-offline': busOffline,
  'bus-neutral': busNeutral,
  'bus-default': busNeutral, // Sécurité si le statut est inconnu
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

const theme = createTheme({
  palette: {
    neutral: { main: grey[500] },
  },
});

export default async () => {
  const background = await loadImage(backgroundSvg);
  mapImages.background = await prepareIcon(background);
  mapImages.direction = await prepareIcon(await loadImage(directionSvg));

  await Promise.all(Object.keys(mapIcons).map(async (category) => {
    const results = [];
    // On définit le mapping des couleurs Traccar vers vos fichiers
    const busCustomIcons = {
      success: busOnline,
      error: busOffline,
      neutral: busNeutral,
      info: busOnline, // par défaut pour info
    };

    ['info', 'success', 'error', 'neutral'].forEach((color) => {
      // SI la catégorie est 'bus' ET qu'on a une icône personnalisée pour cette couleur
      const iconToLoad = (category === 'bus' && busCustomIcons[color]) 
        ? busCustomIcons[color] 
        : mapIcons[category];

      results.push(loadImage(iconToLoad).then((icon) => {
        // Pour vos bus personnalisés, on peut passer 'null' pour le background 
        // ou ne pas appliquer de filtre de couleur si vos SVG sont déjà colorés.
        const colorValue = category === 'bus' ? null : theme.palette[color].main;
        
        mapImages[`${category}-${color}`] = prepareIcon(background, icon, colorValue);
      }));
    });
    await Promise.all(results);
  }));
};
