import type { Destination } from '../types'
import { seedDate, sourcesFor } from '../sources'
import { buildDestinationPractical } from '../practical'

const sources = sourcesFor('beijing')

export const beijing: Destination = {
  id: 'beijing',
  name: { en: 'Beijing', fr: 'Pékin' },
  region: { en: 'North China', fr: 'Chine du Nord' },
  summary: {
    en: 'China’s capital for over eight centuries, Beijing layers imperial palaces, hutong lanes, and a fast-modern skyline. It is the best single city for monuments of the Ming and Qing dynasties alongside major museums and food streets.',
    fr: 'Capitale de la Chine depuis plus de huit siècles, Pékin superpose palais impériaux, ruelles hutong et un skyline résolument moderne. C’est la meilleure ville pour les monuments des dynasties Ming et Qing, les grands musées et les rues gourmandes.',
  },
  bestSeasons: ['spring', 'autumn'],
  welcome: {
    en: 'Welcome to Beijing: give yourself at least three days to see the Forbidden City, a stretch of the Great Wall, and a hutong neighbourhood at an unhurried pace.',
    fr: 'Bienvenue à Pékin : prévoyez au moins trois jours pour voir la Cité interdite, une portion de la Grande Muraille et un quartier de hutongs sans vous presser.',
  },
  attractions: [
    {
      id: 'beijing-forbidden-city',
      title: { en: 'Forbidden City (Palace Museum)', fr: 'Cité interdite (musée du Palais)' },
      origin: 'curated',
      freshness: 'perishable',
      sourceIds: ['beijing-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'history',
      area: { en: 'Dongcheng, beside Tiananmen Square', fr: 'Dongcheng, près de la place Tiananmen' },
      durationHours: 3,
      description: {
        en: 'The imperial palace of the Ming and Qing dynasties, with 900-plus surviving halls and courtyards along a north–south axis. Entering from the south and exiting the north leads naturally toward Jingshan Park.',
        fr: 'Le palais impérial des Ming et des Qing, avec plus de 900 salles et cours conservées le long d’un axe nord–sud. Entrer par le sud et sortir par le nord mène naturellement au parc Jingshan.',
      },
      tips: {
        en: 'Entry is by timed, passport-linked reservation and the site is closed on many Mondays; book on the official Palace Museum channel well ahead and carry the passport you booked with.',
        fr: 'L’entrée se fait sur réservation horodatée liée au passeport et le site ferme souvent le lundi ; réservez longtemps à l’avance sur le canal officiel du musée du Palais et présentez le passeport utilisé pour la réservation.',
      },
    },
    {
      id: 'beijing-great-wall-mutianyu',
      title: { en: 'Great Wall at Mutianyu', fr: 'Grande Muraille à Mutianyu' },
      origin: 'curated',
      freshness: 'perishable',
      sourceIds: ['beijing-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'history',
      area: { en: 'Huairou District, about 70 km from the centre', fr: 'District de Huairou, à environ 70 km du centre' },
      durationHours: 5,
      description: {
        en: 'A restored, forested section of the Ming Great Wall with sweeping ridge views and a cable car or chairlift to the ramparts. It is a popular but less crowded alternative to Badaling.',
        fr: 'Une section restaurée et boisée de la Grande Muraille Ming, avec de larges panoramas sur les crêtes et un téléphérique ou un télésiège jusqu’aux remparts. Une alternative prisée mais moins fréquentée que Badaling.',
      },
      tips: {
        en: 'Cable-car, shuttle, and last-entry times shift by season, so confirm opening hours and ticket options on the official site the day before. There is little shade on the wall: bring water and sun protection.',
        fr: 'Les horaires du téléphérique, de la navette et de la dernière entrée varient selon la saison : vérifiez les horaires et les billets sur le site officiel la veille. Il y a peu d’ombre sur la muraille : emportez de l’eau et une protection solaire.',
      },
    },
    {
      id: 'beijing-798-art-zone',
      title: { en: '798 Art Zone', fr: 'Zone artistique 798' },
      origin: 'curated',
      freshness: 'perishable',
      sourceIds: ['beijing-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'art',
      area: { en: 'Chaoyang District, Dashanzi', fr: 'District de Chaoyang, Dashanzi' },
      durationHours: 2.5,
      description: {
        en: 'A former electronics factory complex turned contemporary art district, with galleries, studios, sculpture, and design shops in Bauhaus-style halls.',
        fr: 'Un ancien complexe d’usines électroniques devenu quartier d’art contemporain, avec galeries, ateliers, sculptures et boutiques de design dans des halls de style Bauhaus.',
      },
      tips: {
        en: 'Most galleries are free and closed on Mondays; check individual listing pages, as exhibitions rotate frequently.',
        fr: 'La plupart des galeries sont gratuites et fermées le lundi ; consultez les pages de chaque lieu, les expositions changeant souvent.',
      },
    },
    {
      id: 'beijing-wangfujing-snacks',
      title: { en: 'Wangfujing food street', fr: 'Rue gourmande de Wangfujing' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['beijing-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'food',
      area: { en: 'Dongcheng, Wangfujing', fr: 'Dongcheng, Wangfujing' },
      durationHours: 2,
      description: {
        en: 'A pedestrian shopping street with a snack lane of skewers, dumplings, and sweets. Beyond the tourist snacks, nearby side streets serve solid Beijing staples such as zhajiangmian noodles and roast duck.',
        fr: 'Une rue piétonne commerçante avec une allée de snacks : brochettes, raviolis et douceurs. Au-delà des en-cas touristiques, les ruelles voisines servent de solides classiques pékinois comme les nouilles zhajiangmian et le canard laqué.',
      },
      tips: {
        en: 'Prices on the main snack lane are tourist-oriented; walk one block off the pedestrian street for better value and calmer seating.',
        fr: 'Les prix de l’allée principale visent les touristes ; éloignez-vous d’une rue pour un meilleur rapport qualité-prix et plus de calme.',
      },
    },
    {
      id: 'beijing-summer-palace',
      title: { en: 'Summer Palace', fr: 'Palais d’Été' },
      origin: 'curated',
      freshness: 'perishable',
      sourceIds: ['beijing-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'nature',
      area: { en: 'Haidian District, northwest Beijing', fr: 'District de Haidian, nord-ouest de Pékin' },
      durationHours: 3,
      description: {
        en: 'A vast imperial garden around Kunming Lake, with the Long Corridor, hilltop temples, and boat rides across the water. The lakeside paths are a calm counterpoint to the central monuments.',
        fr: 'Un vaste jardin impérial autour du lac Kunming, avec le Long Couloir, des temples perchés et des promenades en barque. Les sentiers au bord du lac offrent un contrepoint paisible aux monuments du centre.',
      },
      tips: {
        en: 'Admission and boat operating hours vary by season; check the official site, and enter by the north or east gate to spread out the crowds.',
        fr: 'L’entrée et les horaires des barques varient selon la saison ; vérifiez le site officiel et entrez par la porte nord ou est pour mieux répartir la foule.',
      },
    },
  ],
  stayAreas: [
    {
      id: 'beijing-stay-dongcheng',
      title: { en: 'Dongcheng and the hutongs', fr: 'Dongcheng et les hutongs' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['beijing-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'Dongcheng / Yonghegong hutongs', fr: 'Dongcheng / hutongs de Yonghegong' },
      vibe: {
        en: 'Historic low-rise lanes, courtyard guesthouses, and easy walking access to the Forbidden City and Drum and Bell Towers.',
        fr: 'Ruelles basses historiques, maisons d’hôtes avec cour et accès à pied à la Cité interdite et aux tours du Tambour et de la Cloche.',
      },
      bestFor: ['history', 'food'],
      priceTier: 'mid',
      transportNotes: {
        en: 'Metro lines 2 and 5 run nearby; many sights are walkable, but allow time for lane exploring.',
        fr: 'Les lignes 2 et 5 du métro passent à proximité ; de nombreux sites sont accessibles à pied, mais prévoyez du temps pour flâner dans les ruelles.',
      },
    },
    {
      id: 'beijing-stay-sanlitun',
      title: { en: 'Sanlitun and the embassy district', fr: 'Sanlitun et le quartier des ambassades' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['beijing-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'Sanlitun', fr: 'Sanlitun' },
      vibe: {
        en: 'Modern bars, restaurants, and international hotels with a lively evening scene, a short drive from the historic centre.',
        fr: 'Bars modernes, restaurants et hôtels internationaux avec une scène du soir animée, à courte distance du centre historique.',
      },
      bestFor: ['nightlife', 'shopping'],
      priceTier: 'comfort',
      transportNotes: {
        en: 'Metro line 10 and taxis or ride-hailing are convenient; the historic core is roughly 20–30 minutes away in traffic.',
        fr: 'La ligne 10 et les taxis ou VTC sont pratiques ; le cœur historique est à environ 20–30 minutes en circulation.',
      },
    },
  ],
  transport: {
    arrival: [
      {
        id: 'beijing-arrival-air',
        title: { en: 'Arrive by air', fr: 'Arriver par avion' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['beijing-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'air',
        notes: {
          en: 'Beijing Capital (PEK) and Daxing (PKX) airports both connect to the city by express rail and metro; airport express operating hours and fares can change, so confirm on the official metro/airport site.',
          fr: 'Les aéroports de Pékin-Capitale (PEK) et Daxing (PKX) relient la ville par train express et métro ; les horaires et tarifs pouvant changer, vérifiez sur le site officiel du métro ou de l’aéroport.',
        },
      },
      {
        id: 'beijing-arrival-rail',
        title: { en: 'Arrive by high-speed rail', fr: 'Arriver en train à grande vitesse' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['rail-12306', 'beijing-gov'],
        lastChecked: seedDate,
        mode: 'rail',
        notes: {
          en: 'High-speed trains from Shanghai, Xi’an, and many other cities arrive at Beijing South or Beijing West. Book seats on 12306 with your passport and allow time for passport checks at the gate.',
          fr: 'Les trains à grande vitesse en provenance de Shanghai, Xi’an et bien d’autres villes arrivent à Pékin-Sud ou Pékin-Ouest. Réservez sur 12306 avec votre passeport et prévoyez du temps pour les contrôles à l’entrée.',
        },
      },
    ],
    gettingAround: [
      {
        id: 'beijing-metro',
        title: { en: 'Metro', fr: 'Métro' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['beijing-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'metro',
        notes: {
          en: 'A large, cheap, well-signed network that beats traffic for most central trips. Buy a Yikatong card or a single-ride ticket; fares and last-train times vary, so check the official metro site.',
          fr: 'Un réseau vaste, bon marché et bien signalé, plus rapide que la circulation pour la plupart des trajets du centre. Achetez une carte Yikatong ou un ticket à l’unité ; tarifs et derniers départs variant, consultez le site officiel du métro.',
        },
      },
      {
        id: 'beijing-taxi',
        title: { en: 'Taxi and ride-hailing', fr: 'Taxi et VTC' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['beijing-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'rideshare',
        notes: {
          en: 'Ride-hailing in the English-language apps is the easiest option; metered taxis are also plentiful. Have your destination written in Chinese and avoid unlicensed touts at stations and airports.',
          fr: 'Les applications de VTC en anglais sont l’option la plus simple ; les taxis au compteur sont aussi nombreux. Ayez votre destination écrite en chinois et évitez les rabatteurs non agréés dans les gares et aéroports.',
        },
      },
      {
        id: 'beijing-bus',
        title: { en: 'City buses', fr: 'Bus urbains' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['beijing-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bus',
        notes: {
          en: 'Extensive but harder to use without Chinese; routes and stop names are displayed, and most fares are low and paid by transport card or app.',
          fr: 'Très étendu mais plus difficile sans le chinois ; itinéraires et arrêts sont affichés, et la plupart des tarifs sont bas et payés par carte de transport ou application.',
        },
      },
      {
        id: 'beijing-bike',
        title: { en: 'Shared bikes', fr: 'Vélos en libre-service' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['beijing-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bike',
        notes: {
          en: 'Dockless shared bikes are cheap and ideal for hutong lanes and lakeside paths; unlock them through the operator app and park only in marked areas.',
          fr: 'Les vélos partagés sans borne sont bon marché et parfaits pour les hutongs et les bords de lac ; déverrouillez-les via l’application de l’opérateur et garez-vous uniquement dans les zones balisées.',
        },
      },
    ],
  },
  practical: buildDestinationPractical('beijing', ['nia-china', 'gov-cn', 'mps-china']),
  sources,
  lastVerified: seedDate,
}
