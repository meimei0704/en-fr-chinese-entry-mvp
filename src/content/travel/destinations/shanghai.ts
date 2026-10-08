import type { Destination } from '../types'
import { seedDate, sourcesFor } from '../sources'
import { buildDestinationPractical } from '../practical'

const sources = sourcesFor('shanghai')

export const shanghai: Destination = {
  id: 'shanghai',
  name: { en: 'Shanghai', fr: 'Shanghai' },
  region: { en: 'East China, Yangtze delta', fr: 'Chine de l’Est, delta du Yangtze' },
  summary: {
    en: 'China’s largest city and financial hub, Shanghai pairs a colonial-era waterfront with Art Deco avenues, world-class museums, and relentless modern energy. It is compact and easy to navigate by metro.',
    fr: 'Plus grande ville de Chine et centre financier, Shanghai associe un front de mer colonial, des avenues Art déco, des musées de premier plan et une énergie moderne incessante. La ville est compacte et facile à parcourir en métro.',
  },
  bestSeasons: ['spring', 'autumn'],
  welcome: {
    en: 'Welcome to Shanghai: start on the Bund at dusk, then spend a day in the former French Concession and an evening among the food streets of the old city.',
    fr: 'Bienvenue à Shanghai : commencez sur le Bund au crépuscule, puis passez une journée dans l’ancienne Concession française et une soirée dans les rues gourmandes de la vieille ville.',
  },
  attractions: [
    {
      id: 'shanghai-the-bund',
      title: { en: 'The Bund', fr: 'Le Bund' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['shanghai-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'history',
      area: { en: 'Huangpu, west bank of the Huangpu River', fr: 'Huangpu, rive ouest du fleuve Huangpu' },
      durationHours: 2,
      description: {
        en: 'A riverside promenade of 1920s banks and trading houses facing the futuristic Pudong skyline. Best walked at dusk when the historic facades and the towers across the water both light up.',
        fr: 'Une promenade fluviale bordée de banques et maisons de commerce des années 1920 face au skyline futuriste de Pudong. À parcourir au crépuscule, quand façades historiques et tours d’en face s’illuminent.',
      },
      tips: {
        en: 'The promenade itself is free and open at all hours; expect large crowds on weekend evenings and public holidays.',
        fr: 'La promenade est gratuite et ouverte à toute heure ; attendez-vous à une forte affluence les soirs de week-end et jours fériés.',
      },
    },
    {
      id: 'shanghai-yu-garden',
      title: { en: 'Yu Garden and the old city', fr: 'Jardin Yu et vieille ville' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['shanghai-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'history',
      area: { en: 'Huangpu, Nanshi old town', fr: 'Huangpu, vieille ville de Nanshi' },
      durationHours: 2,
      description: {
        en: 'A classical Ming garden of rockeries, ponds, and pavilions, ringed by a market of snack stalls and souvenir shops. The surrounding lanes are as much of the experience as the garden itself.',
        fr: 'Un jardin classique de la dynastie Ming avec rocailles, étangs et pavillons, entouré d’un marché d’étals et de boutiques de souvenirs. Les ruelles alentour font partie de l’expérience autant que le jardin.',
      },
      tips: {
        en: 'The garden charges a modest admission and can queue heavily; arrive at opening time and pair it with the nearby City God Temple bazaar.',
        fr: 'Le jardin demande un droit d’entrée modeste et la file peut être longue ; arrivez à l’ouverture et combinez la visite avec le bazar du temple du Dieu de la Ville, tout proche.',
      },
    },
    {
      id: 'shanghai-museum',
      title: { en: 'Shanghai Museum', fr: 'Musée de Shanghai' },
      origin: 'curated',
      freshness: 'perishable',
      sourceIds: ['shanghai-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'art',
      area: { en: 'Huangpu, People’s Square', fr: 'Huangpu, place du Peuple' },
      durationHours: 3,
      description: {
        en: 'A flagship collection of Chinese bronze, ceramics, calligraphy, and painting on People’s Square. A second, larger branch in Pudong has opened in recent years.',
        fr: 'Une collection phare de bronzes, céramiques, calligraphies et peintures chinoises sur la place du Peuple. Une seconde antenne, plus grande, a ouvert à Pudong ces dernières années.',
      },
      tips: {
        en: 'Free timed reservations and opening hours change; check the official museum site before you go and note that many museums close on Mondays.',
        fr: 'Les réservations gratuites à horaire et les horaires changent ; consultez le site officiel du musée avant de partir et notez que beaucoup de musées ferment le lundi.',
      },
    },
    {
      id: 'shanghai-tianzifang',
      title: { en: 'Tianzifang and Xintiandi', fr: 'Tianzifang et Xintiandi' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['shanghai-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'shopping',
      area: { en: 'Huangpu, former French Concession', fr: 'Huangpu, ancienne Concession française' },
      durationHours: 2,
      description: {
        en: 'Restored shikumen lanes turned into design boutiques, galleries, and cafés. Xintiandi nearby is the polished, upmarket version of the same heritage.',
        fr: 'Des ruelles shikumen restaurées devenues boutiques de créateurs, galeries et cafés. À proximité, Xintiandi est la version soignée et haut de gamme de ce même patrimoine.',
      },
      tips: {
        en: 'Weekday mornings are quietest; prices are aimed at visitors, so compare before buying.',
        fr: 'Les matins en semaine sont les plus calmes ; les prix visent les visiteurs, comparez avant d’acheter.',
      },
    },
    {
      id: 'shanghai-french-concession',
      title: { en: 'Former French Concession food walk', fr: 'Balade gourmande dans l’ancienne Concession française' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['shanghai-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'food',
      area: { en: 'Xuhui and Huangpu, plane-tree avenues', fr: 'Xuhui et Huangpu, avenues de platanes' },
      durationHours: 3,
      description: {
        en: 'Leafy avenues lined with Art Deco apartments, local noodle shops, bakeries, and international restaurants. A good area to graze from breakfast scallion pancakes to late-night dumplings.',
        fr: 'Des avenues arborées bordées d’immeubles Art déco, de nouilles locales, de boulangeries et de restaurants internationaux. Un bon secteur pour grignoter des galettes à la ciboule du matin aux raviolis de fin de soirée.',
      },
      tips: {
        en: 'Explore on foot between Wukang Road and Fuxing Park; many small kitchens close mid-afternoon.',
        fr: 'Explorez à pied entre la rue Wukang et le parc Fuxing ; beaucoup de petites cuisines ferment en milieu d’après-midi.',
      },
    },
  ],
  stayAreas: [
    {
      id: 'shanghai-stay-the-bund',
      title: { en: 'The Bund and Huangpu', fr: 'Le Bund et Huangpu' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['shanghai-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'The Bund / East Nanjing Road', fr: 'Le Bund / rue Nanjing Est' },
      vibe: {
        en: 'Grand historic hotels and river views, steps from the waterfront and the pedestrian shopping street.',
        fr: 'Grands hôtels historiques et vues sur le fleuve, à deux pas du front de mer et de la rue piétonne commerçante.',
      },
      bestFor: ['history', 'shopping'],
      priceTier: 'comfort',
      transportNotes: {
        en: 'Metro lines 2 and 10 serve East Nanjing Road; Pudong is one stop away by metro or a short ferry ride.',
        fr: 'Les lignes 2 et 10 desservent la rue Nanjing Est ; Pudong est à un arrêt de métro ou une courte traversée en ferry.',
      },
    },
    {
      id: 'shanghai-stay-french-concession',
      title: { en: 'Former French Concession', fr: 'Ancienne Concession française' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['shanghai-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'Xuhui / former French Concession', fr: 'Xuhui / ancienne Concession française' },
      vibe: {
        en: 'Quiet leafy streets, boutique hotels, and a dense café and restaurant scene away from the tourist core.',
        fr: 'Rues calmes et arborées, hôtels de charme et dense scène de cafés et restaurants à l’écart du cœur touristique.',
      },
      bestFor: ['food', 'nightlife'],
      priceTier: 'mid',
      transportNotes: {
        en: 'Metro lines 1, 10, and 12 crisscross the area; most of it is pleasant to walk.',
        fr: 'Les lignes 1, 10 et 12 traversent le quartier ; l’essentiel se parcourt agréablement à pied.',
      },
    },
  ],
  transport: {
    arrival: [
      {
        id: 'shanghai-arrival-air',
        title: { en: 'Arrive by air', fr: 'Arriver par avion' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['shanghai-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'air',
        notes: {
          en: 'Pudong (PVG) and Hongqiao (SHA) airports both link to the city by metro and the Maglev from Pudong. Operating hours and fare levels change, so confirm on the official metro or Maglev site.',
          fr: 'Les aéroports de Pudong (PVG) et Hongqiao (SHA) relient la ville en métro, et le Maglev depuis Pudong. Horaires et tarifs évoluent : vérifiez sur le site officiel du métro ou du Maglev.',
        },
      },
      {
        id: 'shanghai-arrival-rail',
        title: { en: 'Arrive by high-speed rail', fr: 'Arriver en train à grande vitesse' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['rail-12306', 'shanghai-gov'],
        lastChecked: seedDate,
        mode: 'rail',
        notes: {
          en: 'Hongqiao is the main high-speed hub, with frequent trains to Hangzhou, Beijing, and beyond. Book on 12306 with your passport and allow time for ID checks.',
          fr: 'Hongqiao est le principal pôle à grande vitesse, avec des trains fréquents vers Hangzhou, Pékin et au-delà. Réservez sur 12306 avec votre passeport et prévoyez du temps pour les contrôles d’identité.',
        },
      },
    ],
    gettingAround: [
      {
        id: 'shanghai-metro',
        title: { en: 'Metro', fr: 'Métro' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['shanghai-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'metro',
        notes: {
          en: 'One of the world’s largest metro systems and the best way to cross the city. Use a transport card or the metro app; fares and last-train times vary, so check official information.',
          fr: 'L’un des plus grands réseaux de métro au monde et le meilleur moyen de traverser la ville. Utilisez une carte de transport ou l’application ; tarifs et derniers départs varient, consultez les informations officielles.',
        },
      },
      {
        id: 'shanghai-taxi',
        title: { en: 'Taxi and ride-hailing', fr: 'Taxi et VTC' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['shanghai-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'rideshare',
        notes: {
          en: 'Metered taxis and app-based cars are easy to find; have your destination in Chinese and use official taxi ranks at stations and airports.',
          fr: 'Taxis au compteur et voitures via application sont faciles à trouver ; ayez votre destination en chinois et utilisez les stations officielles dans les gares et aéroports.',
        },
      },
      {
        id: 'shanghai-bus',
        title: { en: 'City buses', fr: 'Bus urbains' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['shanghai-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bus',
        notes: {
          en: 'Dense coverage and low fares, useful for short hops off the metro grid; Chinese route reading helps.',
          fr: 'Couverture dense et tarifs bas, utiles pour de courts trajets hors du réseau de métro ; lire les lignes en chinois aide.',
        },
      },
      {
        id: 'shanghai-bike',
        title: { en: 'Shared bikes and walking', fr: 'Vélos en libre-service et marche' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['shanghai-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bike',
        notes: {
          en: 'Flat terrain makes shared bikes and walking ideal in the old concessions and along the river; unlock bikes via the operator app.',
          fr: 'Le terrain plat rend vélos partagés et marche idéals dans les anciennes concessions et le long du fleuve ; déverrouillez les vélos via l’application de l’opérateur.',
        },
      },
    ],
  },
  practical: buildDestinationPractical('shanghai', ['nia-china', 'gov-cn', 'mps-china']),
  sources,
  lastVerified: seedDate,
}
