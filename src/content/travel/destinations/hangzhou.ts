import type { Destination } from '../types'
import { seedDate, sourcesFor } from '../sources'
import { buildDestinationPractical } from '../practical'

const sources = sourcesFor('hangzhou')

export const hangzhou: Destination = {
  id: 'hangzhou',
  name: { en: 'Hangzhou', fr: 'Hangzhou' },
  region: { en: 'East China, Zhejiang', fr: 'Chine de l’Est, Zhejiang' },
  summary: {
    en: 'Hangzhou is built around the classical beauty of West Lake, with tea terraces, Buddhist temples, and canals just beyond its modern skyline. It is an easy high-speed day trip from Shanghai.',
    fr: 'Hangzhou s’organise autour de la beauté classique du lac de l’Ouest, avec terrasses de thé, temples bouddhistes et canaux juste derrière son skyline moderne. Une excursion facile en train à grande vitesse depuis Shanghai.',
  },
  bestSeasons: ['spring', 'autumn'],
  welcome: {
    en: 'Welcome to Hangzhou: walk the West Lake causeways at dawn, climb to a temple by mid-morning, and end with Longjing tea in the hills.',
    fr: 'Bienvenue à Hangzhou : parcourez les chaussées du lac de l’Ouest à l’aube, montez vers un temple en milieu de matinée et terminez avec un thé Longjing dans les collines.',
  },
  attractions: [
    {
      id: 'hangzhou-west-lake',
      title: { en: 'West Lake', fr: 'Lac de l’Ouest' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['hangzhou-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'nature',
      area: { en: 'Xihu District, central Hangzhou', fr: 'District de Xihu, centre de Hangzhou' },
      durationHours: 3,
      description: {
        en: 'The UNESCO-listed lake at the heart of the city, ringed by causeways, pagodas, and gardens. Classic views include the Broken Bridge, Leifeng Pagoda, and the three pools mirroring the moon.',
        fr: 'Le lac classé à l’UNESCO au cœur de la ville, entouré de chaussées, pagodes et jardins. Vues classiques : le Pont brisé, la pagode Leifeng et les trois bassins reflétant la lune.',
      },
      tips: {
        en: 'The lakefront is free and open all day; rent a boat or walk the Su and Bai causeways. Weekends and holidays are very busy.',
        fr: 'Les rives sont gratuites et ouvertes toute la journée ; louez une barque ou parcourez les chaussées Su et Bai. Les week-ends et jours fériés sont très fréquentés.',
      },
    },
    {
      id: 'hangzhou-lingyin-temple',
      title: { en: 'Lingyin Temple and Feilai Feng', fr: 'Temple de Lingyin et Feilai Feng' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['hangzhou-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'history',
      area: { en: 'Xihu District, west of West Lake', fr: 'District de Xihu, à l’ouest du lac' },
      durationHours: 2.5,
      description: {
        en: 'One of China’s oldest and wealthiest Buddhist temples, approached through a grotto of carved rock buddhas at Feilai Feng. Incense, chanting halls, and wooded hillsides make it atmospheric even when busy.',
        fr: 'L’un des temples bouddhistes les plus anciens et les plus riches de Chine, accessible par une grotte de bouddhas sculptés à Feilai Feng. Encens, salles de chant et collines boisées le rendent atmosphérique même quand il est fréquenté.',
      },
      tips: {
        en: 'There are two separate tickets (the scenic grotto and the temple); hours can change, so check the official site and arrive early.',
        fr: 'Deux billets distincts (la grotte paysagère et le temple) ; les horaires peuvent changer, vérifiez le site officiel et venez tôt.',
      },
    },
    {
      id: 'hangzhou-longjing-tea',
      title: { en: 'Longjing tea village', fr: 'Village de thé Longjing' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['hangzhou-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'food',
      area: { en: 'Xihu District, Longjing hills', fr: 'District de Xihu, collines de Longjing' },
      durationHours: 3,
      description: {
        en: 'Terraced tea fields and small farms producing Dragon Well tea, where growers pan-fry the leaves and serve tastings in hillside teahouses.',
        fr: 'Terrasses de théiers et petites fermes produisant le thé Puits du Dragon, où les producteurs torréfient les feuilles et servent des dégustations dans des maisons de thé en flanc de colline.',
      },
      tips: {
        en: 'Spring is the first-flush picking season and the busiest; buy from farms that show the leaf and offer a taste, and agree prices before buying.',
        fr: 'Le printemps est la saison de la première cueillette, la plus animée ; achetez chez des fermes qui montrent la feuille et font goûter, et convenez du prix avant d’acheter.',
      },
    },
    {
      id: 'hangzhou-hefang-street',
      title: { en: 'Hefang Street', fr: 'Rue Hefang' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['hangzhou-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'shopping',
      area: { en: 'Shangcheng District, near Wushan Square', fr: 'District de Shangcheng, près de la place Wushan' },
      durationHours: 2,
      description: {
        en: 'A restored pedestrian street of silk, fans, tea, and traditional medicine shops, with snack stalls and a lively evening market at the foot of Wushan Hill.',
        fr: 'Une rue piétonne restaurée de soieries, éventails, thés et boutiques de médecine traditionnelle, avec étals et marché du soir animé au pied de la colline Wushan.',
      },
      tips: {
        en: 'Good for souvenirs and gifts; compare prices and watch for the tourist markup on branded silk.',
        fr: 'Idéale pour souvenirs et cadeaux ; comparez les prix et méfiez-vous de la majoration touristique sur la soie de marque.',
      },
    },
    {
      id: 'hangzhou-tea-museum',
      title: { en: 'China National Tea Museum', fr: 'Musée national du Thé de Chine' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['hangzhou-gov', 'mct-china'],
      lastChecked: seedDate,
      category: 'art',
      area: { en: 'Xihu District, Longjing Road', fr: 'District de Xihu, route de Longjing' },
      durationHours: 1.5,
      description: {
        en: 'A quiet museum of tea history, implements, and ceremony set among the tea fields, with tastings and a working tea garden on site.',
        fr: 'Un musée paisible de l’histoire du thé, des ustensiles et de la cérémonie, au milieu des théiers, avec dégustations et une plantation en activité sur place.',
      },
      tips: {
        en: 'Free admission with registration in some periods, and closed on Mondays; confirm opening days on the official museum listing.',
        fr: 'Entrée gratuite avec inscription selon les périodes, fermé le lundi ; confirmez les jours d’ouverture sur la fiche officielle du musée.',
      },
    },
  ],
  stayAreas: [
    {
      id: 'hangzhou-stay-west-lake',
      title: { en: 'West Lake shore', fr: 'Rives du lac de l’Ouest' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['hangzhou-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'West Lake / Hubin', fr: 'Lac de l’Ouest / Hubin' },
      vibe: {
        en: 'Lakeside hotels and guesthouses within walking distance of the causeways, with sunrise views and easy access to Lingyin and the tea hills.',
        fr: 'Hôtels et maisons d’hôtes en bord de lac à distance de marche des chaussées, avec levers de soleil et accès facile à Lingyin et aux collines de thé.',
      },
      bestFor: ['nature', 'food'],
      priceTier: 'comfort',
      transportNotes: {
        en: 'Metro line 1 reaches Longxiangqiao near the east shore; walking and shared bikes are the best way around the lake.',
        fr: 'La ligne 1 atteint Longxiangqiao près de la rive est ; la marche et les vélos partagés sont la meilleure façon de faire le tour du lac.',
      },
    },
    {
      id: 'hangzhou-stay-hefang',
      title: { en: 'Hefang Street and the old town', fr: 'Rue Hefang et vieille ville' },
      origin: 'curated',
      freshness: 'stable',
      sourceIds: ['hangzhou-gov', 'mct-china'],
      lastChecked: seedDate,
      name: { en: 'Hefang / Wushan', fr: 'Hefang / Wushan' },
      vibe: {
        en: 'Central, budget-friendly base near the shopping street and canal district, a short hop from the lake.',
        fr: 'Base centrale et économique près de la rue commerçante et du quartier des canaux, à deux pas du lac.',
      },
      bestFor: ['food', 'shopping'],
      priceTier: 'budget',
      transportNotes: {
        en: 'Metro line 1 at Ding’an Road is close; the lake is a 15-minute walk or short bus ride.',
        fr: 'La ligne 1 à Ding’an Road est proche ; le lac est à 15 minutes à pied ou en court trajet de bus.',
      },
    },
  ],
  transport: {
    arrival: [
      {
        id: 'hangzhou-arrival-air',
        title: { en: 'Arrive by air', fr: 'Arriver par avion' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['hangzhou-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'air',
        notes: {
          en: 'Xiaoshan International Airport (HGH) connects by metro and airport buses; timetables and fares change, so confirm on official sites.',
          fr: 'L’aéroport international de Xiaoshan (HGH) est relié par métro et navettes ; horaires et tarifs changent, vérifiez sur les sites officiels.',
        },
      },
      {
        id: 'hangzhou-arrival-rail',
        title: { en: 'Arrive by high-speed rail', fr: 'Arriver en train à grande vitesse' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['rail-12306', 'hangzhou-gov'],
        lastChecked: seedDate,
        mode: 'rail',
        notes: {
          en: 'Hangzhou East and Hangzhou West connect to Shanghai in about an hour and to the wider network; book on 12306 with your passport.',
          fr: 'Hangzhou-Est et Hangzhou-Ouest relient Shanghai en environ une heure et au reste du réseau ; réservez sur 12306 avec votre passeport.',
        },
      },
    ],
    gettingAround: [
      {
        id: 'hangzhou-metro',
        title: { en: 'Metro', fr: 'Métro' },
        origin: 'curated',
        freshness: 'perishable',
        sourceIds: ['hangzhou-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'metro',
        notes: {
          en: 'A modern metro links the station, airport, and lakefront. Fares and last-train times vary; check official information.',
          fr: 'Un métro moderne relie la gare, l’aéroport et les rives du lac. Tarifs et derniers départs varient ; consultez les informations officielles.',
        },
      },
      {
        id: 'hangzhou-taxi',
        title: { en: 'Taxi and ride-hailing', fr: 'Taxi et VTC' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['hangzhou-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'rideshare',
        notes: {
          en: 'Useful for the tea hills and Lingyin, where the metro does not reach; app cars are easy and metered taxis are available.',
          fr: 'Utiles pour les collines de thé et Lingyin, hors du métro ; les VTC sont simples d’usage et les taxis au compteur disponibles.',
        },
      },
      {
        id: 'hangzhou-bus',
        title: { en: 'City buses', fr: 'Bus urbains' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['hangzhou-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bus',
        notes: {
          en: 'A dense network circles the lake and old town; cheap, though Chinese route reading helps.',
          fr: 'Un réseau dense fait le tour du lac et de la vieille ville ; bon marché, même si lire les lignes en chinois aide.',
        },
      },
      {
        id: 'hangzhou-bike',
        title: { en: 'Shared bikes and walks', fr: 'Vélos partagés et promenades' },
        origin: 'curated',
        freshness: 'stable',
        sourceIds: ['hangzhou-gov', 'mct-china'],
        lastChecked: seedDate,
        mode: 'bike',
        notes: {
          en: 'Cycling the West Lake causeways and old town lanes is one of the best ways to see Hangzhou; unlock via the operator app.',
          fr: 'Parcourir à vélo les chaussées du lac de l’Ouest et les ruelles de la vieille ville est l’une des meilleures façons de voir Hangzhou ; déverrouillez via l’application.',
        },
      },
    ],
  },
  practical: buildDestinationPractical('hangzhou', ['nia-china', 'gov-cn', 'mps-china']),
  sources,
  lastVerified: seedDate,
}
