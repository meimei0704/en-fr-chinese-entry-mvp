import type { Destination } from '../types'
import { seedDate, sourcesFor } from '../sources'
import { buildDestinationPractical } from '../practical'

const sources = sourcesFor('xian')

export const xian: Destination = {
  id: 'xian',
  name: { en: 'Xi’an', fr: 'Xi’an' },
  region: { en: 'Northwest China, Shaanxi', fr: 'Chine du Nord-Ouest, Shaanxi' },
  summary: {
    en: 'The eastern start of the Silk Road and capital of thirteen dynasties, Xi’an is best known for the Terracotta Army and a complete Ming city wall. Its Muslim Quarter adds one of China’s great street-food scenes.',
    fr: 'Point de départ oriental de la Route de la Soie et capitale de treize dynasties, Xi’an est surtout connue pour l’armée de terre cuite et une muraille Ming intacte. Son quartier musulman abrite l’une des grandes scènes de street-food de Chine.',
  },
  bestSeasons: ['spring', 'autumn'],
  welcome: {
    en: 'Welcome to Xi’an: give the Terracotta Army a half day, then walk or cycle the city wall and eat your way through the Muslim Quarter.',
    fr: 'Bienvenue à Xi’an : consacrez une demi-journée à l’armée de terre cuite, puis parcourez à pied ou à vélo la muraille et régalez-vous dans le quartier musulman.',
  },
  attractions: [
    {
      id: 'xian-terracotta-army',
      title: { en: 'Terracotta Army', fr: 'Armée de terre cuite' },
      origin: 'curated',
      freshness: 'perishable',
      sourceIds: ['xian-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'history',
      area: { en: 'Lintong District, about 40 km east of the city', fr: 'District de Lintong, à environ 40 km à l’est' },
      durationHours: 4,
      description: {
        en: 'Thousands of life-size soldiers, horses, and chariots buried to guard the tomb of China’s first emperor, Qin Shi Huang. The three excavation pits are displayed in vast hangars, with ongoing conservation work.',
        fr: 'Des milliers de soldats, chevaux et chars grandeur nature enterrés pour garder le tombeau du premier empereur, Qin Shi Huang. Les trois fosses sont présentées dans d’immenses hangars, avec un travail de conservation en cours.',
      },
      tips: {
        en: 'Opening hours and ticket release change by season and the site is very busy; reserve on the official ticketing channel in advance and carry your passport. Pair the visit with the nearby Lintong sites.',
        fr: 'Les horaires et la mise en vente des billets varient selon la saison et le site est très fréquenté ; réservez à l’avance sur le canal officiel et présentez votre passeport. Combinez la visite avec les sites voisins de Lintong.',
      },
    },
    {
      id: 'xian-city-wall',
      title: { en: 'Xi’an City Wall', fr: 'Muraille de Xi’an' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['xian-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'history',
      area: { en: 'Beilin, encircling the old city', fr: 'Beilin, ceinturant la vieille ville' },
      durationHours: 2,
      description: {
        en: 'A complete 14th-century Ming wall running about 14 km around the old city, wide enough to cycle along the top. Gates and watchtowers frame views over both the historic grid and the modern skyline.',
        fr: 'Une muraille Ming complète du XIVe siècle, longue d’environ 14 km autour de la vieille ville, assez large pour y rouler à vélo. Portes et tours encadrent des vues sur la trame historique et le skyline moderne.',
      },
      tips: {
        en: 'Bike rental points sit at several gates, and sunset from the south gate is a highlight; rental and gate opening hours shift, so check locally.',
        fr: 'Des points de location de vélos se trouvent à plusieurs portes, et le coucher de soleil depuis la porte sud est un moment fort ; horaires de location et d’ouverture varient, renseignez-vous sur place.',
      },
    },
    {
      id: 'xian-muslim-quarter',
      title: { en: 'Muslim Quarter', fr: 'Quartier musulman' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['xian-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'food',
      area: { en: 'Lianhu, around the Great Mosque', fr: 'Lianhu, autour de la Grande Mosquée' },
      durationHours: 2,
      description: {
        en: 'A dense network of lanes around the Great Mosque where the Hui community serves lamb skewers, roujiamo (braised-meat flatbread), and hand-pulled biangbiang noodles.',
        fr: 'Un dense lacis de ruelles autour de la Grande Mosquée où la communauté hui sert brochettes d’agneau, roujiamo (galette au porc braisé) et nouilles biangbiang étirées à la main.',
      },
      tips: {
        en: 'Most stalls take mobile payment rather than cash; eat where the queues are local and go early in the evening for the freshest food.',
        fr: 'La plupart des étals acceptent le paiement mobile plutôt que les espèces ; mangez là où la file est locale et venez tôt le soir pour la nourriture la plus fraîche.',
      },
    },
    {
      id: 'xian-shaanxi-art-museum',
      title: { en: 'Shaanxi Art Museum', fr: 'Musée d’art du Shaanxi' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['xian-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'art',
      area: { en: 'Beilin, near the Bell Tower', fr: 'Beilin, près de la tour de la Cloche' },
      durationHours: 2,
      description: {
        en: 'A modern museum of Chinese painting, calligraphy, and regional folk art. It is a compact, air-conditioned break from the surrounding historic sites.',
        fr: 'Un musée moderne de peinture chinoise, de calligraphie et d’art populaire régional. Une pause compacte et climatisée entre les sites historiques voisins.',
      },
      tips: {
        en: 'Opening days and any special exhibitions change; check the official listing, and many museums close on Mondays.',
        fr: 'Les jours d’ouverture et les expositions temporaires changent ; consultez la fiche officielle, et beaucoup de musées ferment le lundi.',
      },
    },
    {
      id: 'xian-big-wild-goose-pagoda',
      title: { en: 'Big Wild Goose Pagoda', fr: 'Grande Pagode de l’Oie sauvage' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['xian-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'history',
      area: { en: 'Yanta District, Ci’en Temple', fr: 'District de Yanta, temple Ci’en' },
      durationHours: 2,
      description: {
        en: 'A seventh-century Buddhist pagoda built to house scriptures brought back by the monk Xuanzang, standing over the lively north and south squares with nightly fountain shows.',
        fr: 'Une pagode bouddhiste du VIIe siècle construite pour abriter les textes rapportés par le moine Xuanzang, dominant les animées places nord et sud et leurs spectacles de fontaines.',
      },
      tips: {
        en: 'The temple and pagoda require tickets to climb; the squares are free and busiest around the evening fountain display.',
        fr: 'Le temple et la pagode demandent un billet pour monter ; les places sont gratuites et plus animées autour du spectacle de fontaines du soir.',
      },
    },
  ],
  stayAreas: [
    {
      id: 'xian-stay-bell-tower',
      title: { en: 'Bell Tower and old city', fr: 'Tour de la Cloche et vieille ville' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['xian-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'Bell Tower / Drum Tower', fr: 'Tour de la Cloche / tour du Tambour' },
      vibe: {
        en: 'Central, walkable, and inside the wall, with the Muslim Quarter and City Wall gates on your doorstep.',
        fr: 'Central, à l’intérieur de la muraille et à deux pas du quartier musulman et des portes de la muraille.',
      },
      bestFor: ['history', 'food'],
      priceTier: 'mid',
      transportNotes: {
        en: 'Metro line 2 stops at Bell Tower; much of the old city is walkable or a short taxi ride.',
        fr: 'La ligne 2 s’arrête à la tour de la Cloche ; une bonne partie de la vieille ville se fait à pied ou en court taxi.',
      },
    },
    {
      id: 'xian-stay-qujiang',
      title: { en: 'Qujiang and the pagoda area', fr: 'Qujiang et le quartier de la pagode' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['xian-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'Qujiang New District', fr: 'Nouveau district de Qujiang' },
      vibe: {
        en: 'A modern district of hotels, parks, and cultural venues around the Big Wild Goose Pagoda, quieter at night.',
        fr: 'Un quartier moderne d’hôtels, de parcs et de lieux culturels autour de la Grande Pagode, plus calme le soir.',
      },
      bestFor: ['history', 'art'],
      priceTier: 'comfort',
      transportNotes: {
        en: 'Metro line 4 and 5 serve the area; the old city is 20–30 minutes away by taxi or metro.',
        fr: 'Les lignes 4 et 5 desservent le secteur ; la vieille ville est à 20–30 minutes en taxi ou en métro.',
      },
    },
  ],
  transport: {
    arrival: [
      {
        id: 'xian-arrival-air',
        title: { en: 'Arrive by air', fr: 'Arriver par avion' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['xian-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'air',
        notes: {
          en: 'Xianyang International Airport (XIY) connects to the city by an intercity airport line and buses; timetables and fares change, so confirm on the official airport or metro site.',
          fr: 'L’aéroport international de Xianyang (XIY) relie la ville par une ligne intercités et des navettes ; horaires et tarifs changent, vérifiez sur le site officiel de l’aéroport ou du métro.',
        },
      },
      {
        id: 'xian-arrival-rail',
        title: { en: 'Arrive by high-speed rail', fr: 'Arriver en train à grande vitesse' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['rail-12306', 'xian-gov'],
        lastChecked: seedDate,
        mode: 'rail',
        notes: {
          en: 'Xi’an North handles high-speed trains to Beijing, Chengdu, and beyond. Book on 12306 with your passport and arrive early for ID checks.',
          fr: 'Xi’an-Nord accueille les trains à grande vitesse vers Pékin, Chengdu et au-delà. Réservez sur 12306 avec votre passeport et arrivez tôt pour les contrôles d’identité.',
        },
      },
    ],
    gettingAround: [
      {
        id: 'xian-metro',
        title: { en: 'Metro', fr: 'Métro' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['xian-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'metro',
        notes: {
          en: 'A growing metro grid links the station, Bell Tower, and major sights. Fares and last-train times vary; check official information before late trips.',
          fr: 'Un réseau de métro en expansion relie la gare, la tour de la Cloche et les principaux sites. Tarifs et derniers départs varient ; consultez les informations officielles avant un trajet tardif.',
        },
      },
      {
        id: 'xian-taxi',
        title: { en: 'Taxi and ride-hailing', fr: 'Taxi et VTC' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['xian-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'rideshare',
        notes: {
          en: 'Metered taxis and app cars are inexpensive and useful for the Terracotta Army or the airport; agree the meter or use the app to avoid disputes.',
          fr: 'Taxis au compteur et voitures via application sont bon marché et utiles pour l’armée de terre cuite ou l’aéroport ; exigez le compteur ou utilisez l’application pour éviter les litiges.',
        },
      },
      {
        id: 'xian-bus',
        title: { en: 'City buses', fr: 'Bus urbains' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['xian-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bus',
        notes: {
          en: 'Buses reach sights the metro misses, including some Lintong services; routes are displayed at stops but are easier with Chinese.',
          fr: 'Les bus desservent des sites non couverts par le métro, dont certaines lignes de Lintong ; les itinéraires sont affichés aux arrêts mais plus faciles avec le chinois.',
        },
      },
      {
        id: 'xian-bike',
        title: { en: 'Shared bikes', fr: 'Vélos en libre-service' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['xian-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bike',
        notes: {
          en: 'Flat central streets and the city wall top are ideal for shared bikes; unlock via the operator app and obey one-way and parking rules.',
          fr: 'Les rues plates du centre et le sommet de la muraille sont idéals pour les vélos partagés ; déverrouillez via l’application et respectez sens uniques et stationnement.',
        },
      },
    ],
  },
  practical: buildDestinationPractical('xian', ['nia-china', 'gov-cn', 'mps-china']),
  sources,
  lastVerified: seedDate,
}
