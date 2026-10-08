import type { LocalizedText } from '../types'
import type { FactFreshness, PracticalInfo, TravelFact } from './types'
import { seedDate } from './sources'

function fact(
  id: string,
  title: LocalizedText,
  sourceIds: string[],
  freshness: FactFreshness = 'stable',
): TravelFact {
  return {
    id,
    title,
    origin: 'curated',
    freshness,
    sourceIds,
    lastChecked: seedDate,
  }
}

/**
 * Country-level practical guidance. `visaEntry` is perishable (entry rules
 * change) and, like `safety`, carries the mandatory disclaimer flag. Values are
 * deliberately conservative and reference-only: they point at official sources
 * rather than asserting a specific price, hour, or rule.
 */
export const countryPractical: PracticalInfo = {
  payments: fact(
    'country-payments',
    {
      en: 'Mobile payments (Alipay, WeChat Pay) are accepted almost everywhere, from metro gates to street stalls; major international cards can now usually be linked. Visa and Mastercard are accepted mainly at larger hotels, malls, and airports, so keep a small cash backup for small vendors.',
      fr: 'Les paiements mobiles (Alipay, WeChat Pay) sont acceptés presque partout, du métro aux étals de rue ; les grandes cartes internationales peuvent désormais généralement être liées. Visa et Mastercard sont surtout acceptées dans les grands hôtels, centres commerciaux et aéroports : gardez un peu d’espèces en secours pour les petits commerçants.',
    },
    ['pboc', 'mct-china'],
  ),
  connectivity: fact(
    'country-connectivity',
    {
      en: 'Buy a local SIM or eSIM at the airport or an official carrier store (China Mobile, China Unicom, China Telecom); registration needs your passport. Many Western apps and sites are restricted on local networks, so arrange any access you rely on before you travel. Wi-Fi is common in hotels, cafés, and stations.',
      fr: 'Achetez une carte SIM locale ou un eSIM à l’aéroport ou dans une boutique officielle (China Mobile, China Unicom, China Telecom) ; l’enregistrement exige votre passeport. De nombreuses applications et sites occidentaux sont restreints sur les réseaux locaux : préparez vos accès avant le départ. Le Wi-Fi est courant dans les hôtels, cafés et gares.',
    },
    ['miit-china', 'mct-china'],
  ),
  etiquette: fact(
    'country-etiquette',
    {
      en: 'Greetings are polite but often reserved. Offer and receive business cards, gifts, or a cup of tea with both hands. Queueing is looser than in Europe and personal space is smaller; stay patient rather than confrontational. Tipping is not expected, and modest dress is appreciated at temples and religious sites.',
      fr: 'Les salutations sont polies mais souvent réservées. Offrez et recevez cartes de visite, cadeaux ou une tasse de thé avec les deux mains. Les files sont plus souples qu’en Europe et l’espace personnel plus réduit : restez patient plutôt que conflictuel. Le pourboire n’est pas attendu et une tenue sobre est appréciée dans les temples et lieux religieux.',
    },
    ['mct-china', 'gov-cn'],
  ),
  safety: {
    ...fact(
      'country-safety',
      {
        en: 'China is generally safe for travelers, including at night in major cities, but keep normal precautions: watch valuables in crowds, use licensed taxis or ride-hailing apps, and keep your passport secure. Save your embassy or consulate contact. In an emergency, dial 110 for police, 120 for an ambulance, and 119 for the fire service.',
        fr: 'La Chine est généralement sûre pour les voyageurs, y compris la nuit dans les grandes villes, mais gardez les précautions d’usage : surveillez vos objets dans les foules, utilisez des taxis agréés ou des applications de VTC et conservez votre passeport en lieu sûr. Enregistrez le contact de votre ambassade ou consulat. En urgence, composez le 110 (police), 120 (ambulance) et 119 (pompiers).',
      },
      ['gov-cn', 'mps-china'],
    ),
    disclaimer: true,
  },
  visaEntry: {
    ...fact(
      'country-visa-entry',
      {
        en: 'Entry rules vary by nationality and change often: check your visa or visa-free eligibility, passport validity, and any required onward ticket or proof of accommodation before booking. Rules and fees are set by Chinese authorities and should be confirmed on the official National Immigration Administration or embassy site, not by this reference-only summary.',
        fr: 'Les règles d’entrée varient selon la nationalité et changent souvent : vérifiez votre éligibilité au visa ou à l’exemption de visa, la validité du passeport et tout billet de continuation ou justificatif d’hébergement exigé avant de réserver. Les règles et frais sont fixés par les autorités chinoises et doivent être confirmés sur le site officiel de l’Administration nationale de l’immigration ou de l’ambassade, et non par ce résumé indicatif.',
      },
      ['nia-china', 'gov-cn'],
      'perishable',
    ),
    disclaimer: true,
  },
  emergencyNumbers: fact(
    'country-emergency',
    {
      en: 'Key emergency numbers: 110 police, 120 ambulance, 119 fire, 122 traffic police. The 12308 hotline is the Chinese foreign ministry’s helpline for consular protection of Chinese citizens; foreign travelers should instead contact their own embassy or consulate.',
      fr: 'Numéros d’urgence principaux : 110 police, 120 ambulance, 119 pompiers, 122 police de la route. La ligne 12308 est le service d’assistance consulaire du ministère chinois des Affaires étrangères pour les citoyens chinois ; les voyageurs étrangers doivent contacter leur propre ambassade ou consulat.',
    },
    ['mps-china', 'gov-cn'],
  ),
}

/**
 * Destination-scoped practical block. Uses generic but valid guidance and a
 * unique id prefix so each destination satisfies the required `PracticalInfo`
 * shape without duplicating fact ids across the seed set.
 */
export function buildDestinationPractical(prefix: string, sourceIds: string[]): PracticalInfo {
  return {
    payments: fact(
      `${prefix}-practical-payments`,
      {
        en: 'Mobile payments are the default in shops, cafés, and taxis; set up Alipay or WeChat Pay and keep a little cash for the rare cash-only stall. Larger hotels and malls usually accept international cards.',
        fr: 'Les paiements mobiles sont la norme dans les commerces, cafés et taxis ; configurez Alipay ou WeChat Pay et gardez un peu d’espèces pour les rares étals sans terminal. Les grands hôtels et centres commerciaux acceptent généralement les cartes internationales.',
      },
      sourceIds,
    ),
    connectivity: fact(
      `${prefix}-practical-connectivity`,
      {
        en: 'A local SIM or eSIM bought with your passport gives the best data coverage; station and café Wi-Fi exists but is less reliable. Plan for any restricted apps before arrival.',
        fr: 'Une carte SIM locale ou un eSIM acheté avec votre passeport offre la meilleure couverture data ; le Wi-Fi des gares et cafés existe mais reste moins fiable. Préparez vos applications restreintes avant l’arrivée.',
      },
      sourceIds,
    ),
    etiquette: fact(
      `${prefix}-practical-etiquette`,
      {
        en: 'Greet with a nod or a slight bow, offer and receive items with both hands, and dress modestly at temples. Tipping is not expected; a service charge is rare.',
        fr: 'Saluez d’un signe de tête ou d’une légère inclinaison, offrez et recevez les objets avec les deux mains et couvrez-vous aux temples. Le pourboire n’est pas attendu ; le service est rarement facturé.',
      },
      sourceIds,
    ),
    safety: {
      ...fact(
        `${prefix}-practical-safety`,
        {
          en: 'The city is generally safe day and night, but watch belongings in crowded sights and use licensed taxis or ride-hailing. In an emergency dial 110 (police), 120 (ambulance), or 119 (fire).',
          fr: 'La ville est généralement sûre de jour comme de nuit, mais surveillez vos affaires dans les sites bondés et utilisez des taxis agréés ou une application de VTC. En urgence, composez le 110 (police), 120 (ambulance) ou 119 (pompiers).',
        },
        sourceIds,
      ),
      disclaimer: true,
    },
    visaEntry: {
      ...fact(
        `${prefix}-practical-visa-entry`,
        {
          en: 'Visa and entry requirements depend on your nationality and can change; confirm current rules with the official immigration authority or your embassy before travel.',
          fr: 'Les exigences de visa et d’entrée dépendent de votre nationalité et peuvent changer ; confirmez les règles en vigueur auprès de l’autorité officielle d’immigration ou de votre ambassade avant le départ.',
        },
        sourceIds,
        'perishable',
      ),
      disclaimer: true,
    },
    emergencyNumbers: fact(
      `${prefix}-practical-emergency`,
      {
        en: 'Dial 110 for police, 120 for an ambulance, 119 for fire, and 122 for traffic police.',
        fr: 'Composez le 110 (police), 120 (ambulance), 119 (pompiers) et 122 (police de la route).',
      },
      sourceIds,
    ),
  }
}
