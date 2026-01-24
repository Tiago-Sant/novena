import { carloAcutisNovena } from './novena-carlo-acutis';
import { natalNovena } from './novena-natal';
import { santaTeresinhaNovena } from './novena-santa-teresinha';
import { carmoNovena } from './novena-nossa-senhora-do-carmo';

export const novenas = {
	'carlo-acutis': carloAcutisNovena,
	'santa-teresinha': santaTeresinhaNovena,
	'novena-de-natal': natalNovena,
	'nossa-senhora-do-carmo': carmoNovena,
};

export { carloAcutisNovena, santaTeresinhaNovena, carmoNovena };
