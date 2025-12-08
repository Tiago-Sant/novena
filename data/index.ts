import { carloAcutisNovena } from './novena-carlo-acutis'
import { natalNovena } from './novena-natal'
import { santaTeresinhaNovena } from './novena-santa-teresinha'

export const novenas = {
  'carlo-acutis': carloAcutisNovena,
  'santa-teresinha': santaTeresinhaNovena,
  'novena-de-natal': natalNovena
}

export { carloAcutisNovena, santaTeresinhaNovena }