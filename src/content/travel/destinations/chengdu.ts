import type { Destination } from '../types'
import { seedDate, sourcesFor } from '../sources'
import { buildDestinationPractical } from '../practical'

const sources = sourcesFor('chengdu')

export const chengdu: Destination = {
  id: 'chengdu',
  name: { en: 'Chengdu', fr: 'Chengdu' },
  region: { en: 'Southwest China, Sichuan', fr: 'Chine du Sud-Ouest, Sichuan' },
  summary: {
    en: 'The laid-back capital of Sichuan, Chengdu is famous for giant pandas, teahouses, and the bold, numbing flavours of Sichuan cuisine. It is also the main gateway to western China.',
    fr: 'Capitale décontractée du Sichuan, Chengdu est célèbre pour ses pandas géants, ses maisons de thé et les saveurs franches et anesthésiantes de la cuisine sichuanaise. C’est aussi la principale porte d’entrée vers l’ouest de la Chine.',
  },
  bestSeasons: ['spring', 'autumn'],
  welcome: {
    en: 'Welcome to Chengdu: plan an early morning at the panda base, an afternoon in a teahouse, and an evening of hotpot and Sichuan opera.',
    fr: 'Bienvenue à Chengdu : prévoyez une matinée tôt à la base des pandas, un après-midi en maison de thé et une soirée fondue sichuanaise et opéra du Sichuan.',
  },
  attractions: [
    {
      id: 'chengdu-panda-base',
      title: { en: 'Chengdu Research Base of Giant Panda Breeding', fr: 'Base de recherche et d’élevage des pandas géants' },
      origin: 'curated',
      freshness: 'perishable',
      sourceIds: ['chengdu-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'nature',
      area: { en: 'Chenghua District, north of the centre', fr: 'District de Chenghua, au nord du centre' },
      durationHours: 3,
      description: {
        en: 'A conservation and breeding park where you can watch giant pandas and the smaller red pandas in open enclosures. Pandas are most active early, before the heat sets in.',
        fr: 'Un parc de conservation et d’élevage où observer pandas géants et petits pandas roux dans des enclos ouverts. Les pandas sont plus actifs tôt, avant la chaleur.',
      },
      tips: {
        en: 'Tickets are released online and opening hours can change seasonally; book ahead on the official channel and arrive for opening to see the pandas feeding.',
        fr: 'Les billets sont mis en vente en ligne et les horaires changent selon la saison ; réservez à l’avance sur le canal officiel et arrivez à l’ouverture pour voir les pandas se nourrir.',
      },
    },
    {
      id: 'chengdu-wuhou-jinli',
      title: { en: 'Wuhou Shrine and Jinli', fr: 'Sanctuaire de Wuhou et Jinli' },
      origin: 'curated',
      freshness: 'perishable',
      sourceIds: ['chengdu-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'history',
      area: { en: 'Wuhou District, south of the centre', fr: 'District de Wuhou, au sud du centre' },
      durationHours: 3,
      description: {
        en: 'A memorial temple to the Three Kingdoms strategist Zhuge Liang beside Jinli, a restored lane of Qing-style shops, teahouses, and snack stalls.',
        fr: 'Un temple mémorial dédié au stratège des Trois Royaumes Zhuge Liang, jouxtant Jinli, une ruelle restaurée de boutiques de style Qing, maisons de thé et étals.',
      },
      tips: {
        en: 'Jinli is free and busiest at night; the shrine charges a modest ticket and is quieter in the morning.',
        fr: 'Jinli est gratuite et plus animée le soir ; le sanctuaire demande un billet modeste et est plus calme le matin.',
      },
    },
    {
      id: 'chengdu-kuanzhai-alley',
      title: { en: 'Kuanzhai Alley', fr: 'Allée Kuanzhai' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['chengdu-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'food',
      area: { en: 'Qingyang District, central Chengdu', fr: 'District de Qingyang, centre de Chengdu' },
      durationHours: 2,
      description: {
        en: 'Three parallel Qing-era lanes renovated into a pedestrian quarter of courtyard restaurants, tea houses, and small shops, with street food throughout.',
        fr: 'Trois ruelles parallèles de l’époque Qing rénovées en quartier piéton de restaurants à cour, maisons de thé et petites boutiques, avec de la street-food partout.',
      },
      tips: {
        en: 'Come hungry and graze: sample dan dan noodles, dumplings, and sweet rice cakes. Mornings are calmest for photographs.',
        fr: 'Venez affamé et grignotez : goûtez nouilles dan dan, raviolis et gâteaux de riz sucrés. Les matins sont les plus calmes pour les photos.',
      },
    },
    {
      id: 'chengdu-sichuan-opera',
      title: { en: 'Sichuan opera and face-changing', fr: 'Opéra du Sichuan et changement de masque' },
      origin: 'curated',
      freshness: 'perishable',
      sourceIds: ['chengdu-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'art',
      area: { en: 'Central Chengdu teahouse theatres', fr: 'Théâtres-maisons de thé du centre' },
      durationHours: 2,
      description: {
        en: 'An evening of high-pitched singing, comic mime, and the celebrated bian lian face-changing act, best experienced in a traditional teahouse theatre with a cup of local tea.',
        fr: 'Une soirée de chant aigu, de mime comique et du célèbre numéro de changement de masque bian lian, à savourer dans un théâtre-maison de thé traditionnel avec une tasse de thé local.',
      },
      tips: {
        en: 'Shows are short and tourist-friendly; reserve seats ahead for the face-changing programme and check performance times on the venue’s official page.',
        fr: 'Les spectacles sont courts et accessibles ; réservez des places à l’avance pour le programme de changement de masque et vérifiez les horaires sur la page officielle de la salle.',
      },
    },
    {
      id: 'chengdu-peoples-park-teahouse',
      title: { en: 'People’s Park teahouses', fr: 'Maisons de thé du parc du Peuple' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['chengdu-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'food',
      area: { en: 'Qingyang District, central Chengdu', fr: 'District de Qingyang, centre de Chengdu' },
      durationHours: 1.5,
      description: {
        en: 'The classic Chengdu pastime: a bamboo chair, a lidded cup of jasmine tea, and an afternoon of people-watching, ear cleaning, and mahjong around the park’s lake.',
        fr: 'Le passe-temps classique de Chengdu : une chaise en bambou, une tasse de thé au jasmin à couvercle et un après-midi à observer la vie du parc, entre nettoyage d’oreilles et mahjong autour du lac.',
      },
      tips: {
        en: 'Tea is inexpensive and refills are unlimited; go mid-afternoon when locals gather and pay in cash or by mobile app.',
        fr: 'Le thé est bon marché et les remplissages illimités ; venez en milieu d’après-midi quand les habitants se réunissent et payez en espèces ou par application.',
      },
    },
  ],
  stayAreas: [
    {
      id: 'chengdu-stay-chunxi-road',
      title: { en: 'Chunxi Road and the CBD', fr: 'Chunxi Road et le centre d’affaires' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['chengdu-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'Chunxi Road / Tianfu Square', fr: 'Chunxi Road / place Tianfu' },
      vibe: {
        en: 'Modern shopping streets, malls, and hotels around a central pedestrian crossroads, with nightlife and every cuisine nearby.',
        fr: 'Rues commerçantes modernes, centres commerciaux et hôtels autour d’un carrefour piéton central, avec vie nocturne et toutes les cuisines à proximité.',
      },
      bestFor: ['shopping', 'food'],
      priceTier: 'mid',
      transportNotes: {
        en: 'Metro lines 1, 2, and 3 meet nearby; taxis and app cars are abundant.',
        fr: 'Les lignes 1, 2 et 3 du métro se croisent à proximité ; taxis et VTC sont abondants.',
      },
    },
    {
      id: 'chengdu-stay-jinli',
      title: { en: 'Jinli and Wuhou', fr: 'Jinli et Wuhou' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['chengdu-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'Jinli / Wuhou', fr: 'Jinli / Wuhou' },
      vibe: {
        en: 'Historic lanes and courtyards south of the centre, a relaxed base for culture and snack food.',
        fr: 'Ruelles et cours historiques au sud du centre, une base détendue pour la culture et la street-food.',
      },
      bestFor: ['history', 'food'],
      priceTier: 'comfort',
      transportNotes: {
        en: 'Metro line 3 stops at Gaoshengqiao, a short walk away; the centre is 15–25 minutes by taxi.',
        fr: 'La ligne 3 s’arrête à Gaoshengqiao, à quelques minutes à pied ; le centre est à 15–25 minutes en taxi.',
      },
    },
  ],
  transport: {
    arrival: [
      {
        id: 'chengdu-arrival-air',
        title: { en: 'Arrive by air', fr: 'Arriver par avion' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['chengdu-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'air',
        notes: {
          en: 'Tianfu (TFU) is the newer international airport and Shuangliu (CTU) mainly domestic; both connect by metro and airport buses. Schedules and fares change, so confirm on official sites.',
          fr: 'Tianfu (TFU) est le nouvel aéroport international et Shuangliu (CTU) surtout domestique ; les deux sont reliés par métro et navettes. Horaires et tarifs changent, vérifiez sur les sites officiels.',
        },
      },
      {
        id: 'chengdu-arrival-rail',
        title: { en: 'Arrive by high-speed rail', fr: 'Arriver en train à grande vitesse' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['rail-12306', 'chengdu-gov'],
        lastChecked: seedDate,
        mode: 'rail',
        notes: {
          en: 'Chengdu East and Chengdu South link to Chongqing, Xi’an, and the high-speed network. Book on 12306 with your passport and allow time for ID gates.',
          fr: 'Chengdu-Est et Chengdu-Sud relient Chongqing, Xi’an et le réseau à grande vitesse. Réservez sur 12306 avec votre passeport et prévoyez du temps pour les portiques d’identité.',
        },
      },
    ],
    gettingAround: [
      {
        id: 'chengdu-metro',
        title: { en: 'Metro', fr: 'Métro' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['chengdu-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'metro',
        notes: {
          en: 'A clean, expanding metro reaches the airport, main stations, and most sights. Fares and last-train times vary; check official information.',
          fr: 'Un métro propre et en expansion dessert l’aéroport, les gares principales et la plupart des sites. Tarifs et derniers départs varient ; consultez les informations officielles.',
        },
      },
      {
        id: 'chengdu-taxi',
        title: { en: 'Taxi and ride-hailing', fr: 'Taxi et VTC' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['chengdu-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'rideshare',
        notes: {
          en: 'Cheap and plentiful; the app is easiest with a local number, and metered taxis are fine for the panda base early in the morning.',
          fr: 'Bon marché et nombreux ; l’application est plus simple avec un numéro local, et les taxis au compteur conviennent pour la base des pandas tôt le matin.',
        },
      },
      {
        id: 'chengdu-bus',
        title: { en: 'City buses', fr: 'Bus urbains' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['chengdu-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bus',
        notes: {
          en: 'Comprehensive and cheap but slower in traffic; signage is mostly Chinese, so the metro is easier for visitors.',
          fr: 'Très complet et bon marché mais plus lent dans les bouchons ; la signalétique est surtout en chinois, le métro est donc plus simple pour les visiteurs.',
        },
      },
      {
        id: 'chengdu-bike',
        title: { en: 'Shared bikes', fr: 'Vélos en libre-service' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['chengdu-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bike',
        notes: {
          en: 'Flat and green, Chengdu is made for cycling between teahouses and parks; unlock bikes via the operator app.',
          fr: 'Plate et verdoyante, Chengdu se prête au vélo entre maisons de thé et parcs ; déverrouillez les vélos via l’application de l’opérateur.',
        },
      },
    ],
  },
  practical: buildDestinationPractical('chengdu', ['nia-china', 'gov-cn', 'mps-china']),
  sources,
  lastVerified: seedDate,
}
