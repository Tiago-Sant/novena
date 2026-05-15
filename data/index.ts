import { carloAcutisNovena } from './novena-carlo-acutis';
import { natalNovena } from './novena-natal';
import { santaTeresinhaNovena } from './novena-santa-teresinha';
import { carmoNovena } from './novena-nossa-senhora-do-carmo';
import { fatimaNovena } from './novena-nossa-senhora-de-fatima';
import { espiritoSantoNovena } from './novena-espirito-santo';

export const novenas = {
	'carlo-acutis': carloAcutisNovena,
	'santa-teresinha': santaTeresinhaNovena,
	'novena-de-natal': natalNovena,
	'nossa-senhora-do-carmo': carmoNovena,
  'nossa-senhora-de-fatima': fatimaNovena,
  'espirito-santo': espiritoSantoNovena,
};

export { carloAcutisNovena, santaTeresinhaNovena, carmoNovena, fatimaNovena, espiritoSantoNovena, natalNovena };
