import type { Destination } from '../types'
import { seedDate, sourcesFor } from '../sources'
import { buildDestinationPractical } from '../practical'

const sources = sourcesFor('guilin')

export const guilin: Destination = {
  id: 'guilin',
  name: { en: 'Guilin', fr: 'Guilin' },
  region: { en: 'South China, Guangxi', fr: 'Chine du Sud, Guangxi' },
  summary: {
    en: 'Guilin and nearby Yangshuo are the classic karst landscape of China: tower-like limestone peaks, winding rivers, and rice terraces. The region is best explored slowly by boat and bike.',
    fr: 'Guilin et la proche Yangshuo incarnent le paysage karstique classique de Chine : pics calcaires en forme de tours, rivières sinueuses et rizières en terrasse. La région se découvre lentement, en bateau et à vélo.',
  },
  bestSeasons: ['spring', 'autumn'],
  welcome: {
    en: 'Welcome to Guilin: cruise the Li River to Yangshuo, cycle the countryside between the peaks, and add a day for the Longji rice terraces.',
    fr: 'Bienvenue à Guilin : naviguez sur la rivière Li jusqu’à Yangshuo, parcourez à vélo la campagne entre les pics et ajoutez une journée pour les rizières de Longji.',
  },
  attractions: [
    {
      id: 'guilin-li-river-cruise',
      title: { en: 'Li River cruise', fr: 'Croisière sur la rivière Li' },
      origin: 'curated',
      freshness: 'perishable',
      sourceIds: ['guilin-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'nature',
      area: { en: 'From Guilin to Yangshuo', fr: 'De Guilin à Yangshuo' },
      durationHours: 4,
      description: {
        en: 'The signature Guilin experience: a four-hour boat trip through limestone peaks and riverside villages, past the scenery printed on the twenty-yuan note.',
        fr: 'L’expérience emblématique de Guilin : une croisière de quatre heures entre pics calcaires et villages, le long du paysage imprimé sur le billet de vingt yuans.',
      },
      tips: {
        en: 'Departure times, boat classes, and fares change by season and demand; book through an official channel ahead and confirm the pier and boarding time the day before.',
        fr: 'Heures de départ, catégories de bateaux et tarifs varient selon la saison et la demande ; réservez à l’avance via un canal officiel et confirmez l’embarcadère et l’heure la veille.',
      },
    },
    {
      id: 'guilin-reed-flute-cave',
      title: { en: 'Reed Flute Cave', fr: 'Grotte de la Flûte de Roseau' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['guilin-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'nature',
      area: { en: 'Diecai District, northwest Guilin', fr: 'District de Diecai, nord-ouest de Guilin' },
      durationHours: 1.5,
      description: {
        en: 'A large limestone cave of stalactites and stalagmites, lit in vivid colours and followed on a fixed walkway. It is a good wet-weather option.',
        fr: 'Une grande grotte calcaire de stalactites et stalagmites, éclairée de couleurs vives et parcourue par un cheminement fixe. Une bonne option par temps de pluie.',
      },
      tips: {
        en: 'Visits are by timed group entry; hours and admission can change, so check the official listing and arrive for your slot.',
        fr: 'Les visites se font par groupes à horaire ; horaires et entrée peuvent changer, vérifiez la fiche officielle et présentez-vous à votre créneau.',
      },
    },
    {
      id: 'guilin-longji-rice-terraces',
      title: { en: 'Longji Rice Terraces', fr: 'Rizières en terrasse de Longji' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['guilin-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'nature',
      area: { en: 'Longsheng County, about 2 hours from Guilin', fr: 'Comté de Longsheng, à environ 2 h de Guilin' },
      durationHours: 5,
      description: {
        en: 'Centuries-old terraces carved into steep hillsides by Zhuang and Yao villages, dramatic in spring water and autumn gold. Villages such as Ping’an and Dazhai offer walks and viewpoints.',
        fr: 'Des terrasses séculaires sculptées dans des pentes raides par les villages zhuang et yao, spectaculaires au printemps (eau) et en automne (or). Des villages comme Ping’an et Dazhai offrent sentiers et points de vue.',
      },
      tips: {
        en: 'A full day is needed; access roads are winding and a shuttle may be required from the ticket gate. Terrain is steep—wear grippy shoes and check current entry arrangements locally.',
        fr: 'Une journée complète est nécessaire ; les routes sont sinueuses et une navette peut être exigée depuis le guichet. Le terrain est raide : chaussures adhérentes et vérifiez les modalités d’accès sur place.',
      },
    },
    {
      id: 'guilin-yangshuo-west-street',
      title: { en: 'Yangshuo West Street', fr: 'Rue de l’Ouest de Yangshuo' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['guilin-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'food',
      area: { en: 'Yangshuo town centre', fr: 'Centre-ville de Yangshuo' },
      durationHours: 2,
      description: {
        en: 'A lively pedestrian lane of cafés, bars, and local kitchens serving beer fish, stuffed snails, and rice noodles. It is the social hub of Yangshuo after a day on the river.',
        fr: 'Une ruelle piétonne animée de cafés, bars et cuisines locales servant poisson à la bière, escargots farcis et nouilles de riz. Le cœur social de Yangshuo après une journée sur la rivière.',
      },
      tips: {
        en: 'Riverside and alley tables fill quickly in high season; small local restaurants one street back are often better value.',
        fr: 'Les tables en bord de rivière et dans les ruelles se remplissent vite en haute saison ; les petits restaurants une rue en arrière offrent souvent un meilleur rapport qualité-prix.',
      },
    },
    {
      id: 'guilin-zhengyang-walkway',
      title: { en: 'Zhengyang Pedestrian Street', fr: 'Rue piétonne de Zhengyang' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['guilin-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'shopping',
      area: { en: 'Xiufeng District, central Guilin', fr: 'District de Xiufeng, centre de Guilin' },
      durationHours: 1.5,
      description: {
        en: 'Guilin’s main shopping street, running from the central square toward the Two Rivers and Four Lakes area, with local snacks, crafts, and department stores.',
        fr: 'La principale rue commerçante de Guilin, reliant la place centrale au secteur des Deux Rivières et Quatre Lacs, avec snacks locaux, artisanat et grands magasins.',
      },
      tips: {
        en: 'Combine it with the evening Two Rivers and Four Lakes lights; prices are fixed in shops but compare before buying crafts.',
        fr: 'À combiner avec les illuminations du soir des Deux Rivières et Quatre Lacs ; les prix sont fixes en magasin mais comparez avant d’acheter de l’artisanat.',
      },
    },
  ],
  stayAreas: [
    {
      id: 'guilin-stay-center',
      title: { en: 'Guilin city centre', fr: 'Centre-ville de Guilin' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['guilin-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'Xiufeng / Zhengyang', fr: 'Xiufeng / Zhengyang' },
      vibe: {
        en: 'Convenient city base near the pedestrian street and lakes, best for the train station, cruises, and day trips to Longji.',
        fr: 'Base urbaine pratique près de la rue piétonne et des lacs, idéale pour la gare, les croisières et les excursions à Longji.',
      },
      bestFor: ['nature', 'food'],
      priceTier: 'mid',
      transportNotes: {
        en: 'Central for buses and taxis; the Li River cruise pier and Guilin North station are short drives away.',
        fr: 'Centrale pour les bus et taxis ; l’embarcadère de la croisière et la gare de Guilin-Nord sont à courte distance.',
      },
    },
    {
      id: 'guilin-stay-yangshuo',
      title: { en: 'Yangshuo countryside', fr: 'Campagne de Yangshuo' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['guilin-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'Yangshuo town / Yulong River', fr: 'Ville de Yangshuo / rivière Yulong' },
      vibe: {
        en: 'Riverside guesthouses and rural retreats among the peaks, ideal for cycling, rafting, and quieter evenings.',
        fr: 'Maisons d’hôtes en bord de rivière et retraites rurales parmi les pics, idéales pour le vélo, le rafting et des soirées plus calmes.',
      },
      bestFor: ['nature', 'nightlife'],
      priceTier: 'comfort',
      transportNotes: {
        en: 'About 1.5 hours from Guilin by bus or car; scooters, bikes, and taxis are the local way around.',
        fr: 'À environ 1 h 30 de Guilin en bus ou en voiture ; scooters, vélos et taxis sont les moyens locaux de circuler.',
      },
    },
  ],
  transport: {
    arrival: [
      {
        id: 'guilin-arrival-air',
        title: { en: 'Arrive by air', fr: 'Arriver par avion' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['guilin-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'air',
        notes: {
          en: 'Guilin Liangjiang International Airport (KWL) has shuttle buses and taxis to the city and Yangshuo; schedules and fares change, so confirm on official sites.',
          fr: 'L’aéroport international de Guilin Liangjiang (KWL) propose navettes et taxis vers la ville et Yangshuo ; horaires et tarifs changent, vérifiez sur les sites officiels.',
        },
      },
      {
        id: 'guilin-arrival-rail',
        title: { en: 'Arrive by high-speed rail', fr: 'Arriver en train à grande vitesse' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['rail-12306', 'guilin-gov'],
        lastChecked: seedDate,
        mode: 'rail',
        notes: {
          en: 'Guilin North and Guilin West connect to Guangzhou, Guiyang, and the national high-speed network; book on 12306 with your passport.',
          fr: 'Guilin-Nord et Guilin-Ouest relient Canton, Guiyang et le réseau national à grande vitesse ; réservez sur 12306 avec votre passeport.',
        },
      },
    ],
    gettingAround: [
      {
        id: 'guilin-bus',
        title: { en: 'Local buses and shuttles', fr: 'Bus locaux et navettes' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['guilin-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bus',
        notes: {
          en: 'City buses and tourist shuttles link the station, cruise piers, and Longji access points; fares and timetables vary, so check locally on arrival.',
          fr: 'Les bus urbains et navettes touristiques relient la gare, les embarcadères et les accès à Longji ; tarifs et horaires varient, vérifiez sur place à l’arrivée.',
        },
      },
      {
        id: 'guilin-taxi',
        title: { en: 'Taxi and ride-hailing', fr: 'Taxi et VTC' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['guilin-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'rideshare',
        notes: {
          en: 'Metered taxis and app cars are useful for the airport, cruise piers, and Yangshuo; agree the meter or use the app.',
          fr: 'Taxis au compteur et VTC sont utiles pour l’aéroport, les embarcadères et Yangshuo ; exigez le compteur ou utilisez l’application.',
        },
      },
      {
        id: 'guilin-bike',
        title: { en: 'Bikes and scooters', fr: 'Vélos et scooters' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['guilin-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bike',
        notes: {
          en: 'The flat Yulong River lanes are made for cycling; rent from guesthouses in Yangshuo and follow marked rural routes.',
          fr: 'Les chemins plats de la rivière Yulong sont faits pour le vélo ; louez dans les maisons d’hôtes de Yangshuo et suivez les itinéraires ruraux balisés.',
        },
      },
      {
        id: 'guilin-walk',
        title: { en: 'Walking', fr: 'Marche' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['guilin-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'walk',
        notes: {
          en: 'Central Guilin around the lakes and pedestrian street is walkable, as are Yangshuo town and riverside trails.',
          fr: 'Le centre de Guilin autour des lacs et de la rue piétonne se parcourt à pied, tout comme la ville de Yangshuo et les sentiers de rivière.',
        },
      },
    ],
  },
  practical: buildDestinationPractical('guilin', ['nia-china', 'gov-cn', 'mps-china']),
  sources,
  lastVerified: seedDate,
}
