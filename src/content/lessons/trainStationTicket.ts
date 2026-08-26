import type { LessonContent } from '../types.js'

export const trainStationTicketLesson: LessonContent = {
  id: 'train-station-ticket',
  title: {
    en: '坐火车 / Take the train',
    fr: '坐火车 / Prendre le train',
  },
  scenario: {
    en: 'Most train tickets are booked online, but these phrases help you navigate the station.',
    fr: 'La plupart des billets de train se réservent en ligne, mais ces phrases t\'aident à te repérer en gare.',
  },
  dialogue: {
    title: {
      en: 'Buy a train ticket and find your platform',
      fr: 'Acheter un billet de train et trouver son quai',
    },
    lines: [
      {
        id: 'train-station-ticket-line-01',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '火车站在哪里？',
        pinyin: 'Huǒ chē zhàn zài nǎ lǐ?',
        translation: { en: 'Where is the train station?', fr: 'Où est la gare ?' },
        explanation: { en: '火车站 = train station｜在 = be at｜哪里 = where. Use this question to ask for the train station’s location.', fr: '火车站 = gare｜在 = se trouver｜哪里 = où. Utilisez cette question pour demander où se trouve la gare.' },
        audio: '/audio/train-station-ticket/line-01.mp3',
      },
      {
        id: 'train-station-ticket-line-02',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '售票处在哪里？',
        pinyin: 'Shòu piào chù zài nǎ lǐ?',
        translation: { en: 'Where is the ticket office?', fr: 'Où est le guichet de billets ?' },
        explanation: { en: '售票处 = ticket office｜在 = be at｜哪里 = where. Ask this at a station when you need the ticket counter.', fr: '售票处 = guichet｜在 = se trouver｜哪里 = où. Posez cette question en gare pour trouver le guichet.' },
        audio: '/audio/train-station-ticket/line-02.mp3',
      },
      {
        id: 'train-station-ticket-line-03',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我要一张去[北京]的票。',
        pinyin: 'Wǒ yào yì zhāng qù [Běi jīng] de piào.',
        translation: { en: 'I’d like one ticket to [Beijing].', fr: 'Je voudrais un billet pour [Pékin].' },
        explanation: { en: '我 = I｜要 = want / would like｜一 = one｜张 = measure word for tickets｜去北京的票 = a ticket to Beijing. Replace 北京 with your destination when buying a ticket.', fr: '我 = je｜要 = vouloir｜一 = un｜张 = classificateur pour les billets｜去北京的票 = un billet pour Pékin. Remplacez 北京 par votre destination lors de l’achat.' },
        audio: '/audio/train-station-ticket/line-03.mp3',
      },
      {
        id: 'train-station-ticket-line-04',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '这是我的护照。',
        pinyin: 'Zhè shì wǒ de hù zhào.',
        translation: { en: 'This is my passport.', fr: 'Voici mon passeport.' },
        explanation: { en: '这 = this｜是 = is｜我的 = my｜护照 = passport. Say this while presenting your passport to the ticket clerk.', fr: '这 = ceci｜是 = est｜我的 = mon｜护照 = passeport. Dites cette phrase en présentant votre passeport au guichet.' },
        audio: '/audio/train-station-ticket/line-04.mp3',
      },
      {
        id: 'train-station-ticket-line-05',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '火车几点开？',
        pinyin: 'Huǒ chē jǐ diǎn kāi?',
        translation: { en: 'What time does the train leave?', fr: 'À quelle heure part le train ?' },
        explanation: { en: '火车 = train｜几点 = what time｜开 = leave / depart. Ask this to confirm the train’s departure time.', fr: '火车 = train｜几点 = à quelle heure｜开 = partir. Posez cette question pour confirmer l’heure de départ.' },
        audio: '/audio/train-station-ticket/line-05.mp3',
      },
      {
        id: 'train-station-ticket-line-06',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '餐车在哪里？',
        pinyin: 'Cān chē zài nǎ lǐ?',
        translation: { en: 'Where is the dining car?', fr: 'Où est la voiture-restaurant ?' },
        explanation: { en: '餐车 = dining car｜在 = be at｜哪里 = where. Ask this aboard the train to locate the dining car.', fr: '餐车 = voiture-restaurant｜在 = se trouver｜哪里 = où. Posez cette question à bord pour trouver la voiture-restaurant.' },
        audio: '/audio/train-station-ticket/line-06.mp3',
      },
      {
        id: 'train-station-ticket-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '火车晚点了吗？',
        pinyin: 'Huǒ chē wǎn diǎn le ma?',
        translation: { en: 'Is the train delayed?', fr: 'Le train est-il en retard ?' },
        explanation: { en: '火车 = train｜晚点 = be delayed｜了 = changed state｜吗 = yes-or-no question particle. Use this to ask whether the train has been delayed.', fr: '火车 = train｜晚点 = être en retard｜了 = changement de situation｜吗 = particule de question fermée. Utilisez cette phrase pour demander si le train est retardé.' },
        audio: '/audio/train-station-ticket/line-07.mp3',
      },
      {
        id: 'train-station-ticket-line-08',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '请问怎么换乘？',
        pinyin: 'Qǐng wèn zěn me huàn chéng?',
        translation: { en: 'Excuse me, how do I transfer?', fr: 'Excusez-moi, comment faire une correspondance ?' },
        explanation: { en: '请问 = excuse me / may I ask｜怎么 = how｜换乘 = transfer. Ask this when you need instructions for changing trains.', fr: '请问 = excusez-moi｜怎么 = comment｜换乘 = faire une correspondance. Posez cette question quand vous devez changer de train.' },
        audio: '/audio/train-station-ticket/line-08.mp3',
      },
      {
        id: 'train-station-ticket-line-09',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我误车了。',
        pinyin: 'Wǒ wù chē le.',
        translation: { en: 'I missed the train.', fr: 'J\'ai raté mon train.' },
        explanation: { en: '我 = I｜误车 = miss a train｜了 = completed event. Use this concise phrase to tell staff that you missed the train.', fr: '我 = je｜误车 = rater un train｜了 = action accomplie. Utilisez cette phrase concise pour signaler au personnel que vous avez raté le train.' },
        audio: '/audio/train-station-ticket/line-09.mp3',
      },
      {
        id: 'train-station-ticket-line-10',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '我没赶上火车。',
        pinyin: 'Wǒ méi gǎn shàng huǒ chē.',
        translation: { en: 'I missed the train.', fr: 'J\'ai raté le train.' },
        explanation: { en: '我 = I｜没 = did not｜赶上 = catch / make｜火车 = train. Use this natural phrase when you arrived too late to catch the train.', fr: '我 = je｜没 = ne… pas｜赶上 = réussir à prendre｜火车 = train. Utilisez cette phrase naturelle lorsque vous êtes arrivé trop tard.' },
        audio: '/audio/train-station-ticket/line-10.mp3',
      },
      {
        id: 'train-station-ticket-line-11',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '能改签下一辆车吗？',
        pinyin: 'Néng gǎi qiān xià yí liàng chē ma?',
        translation: { en: 'Can I change my ticket to the next train?', fr: 'Puis-je modifier mon billet pour le prochain train ?' },
        explanation: { en: '能 = can｜改签 = change a booking｜下一辆车 = the next train｜吗 = yes-or-no question particle. Ask staff whether your ticket can be changed to the next train.', fr: '能 = pouvoir｜改签 = modifier un billet｜下一辆车 = le prochain train｜吗 = particule de question fermée. Demandez au personnel si votre billet peut être reporté sur le prochain train.' },
        audio: '/audio/train-station-ticket/line-11.mp3',
      },
      {
        id: 'train-station-ticket-line-12',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '如何退票退款呢？',
        pinyin: 'Rú hé tuì piào tuì kuǎn ne?',
        translation: { en: 'How can I cancel my ticket and get a refund?', fr: 'Comment annuler mon billet et me faire rembourser ?' },
        explanation: { en: '如何 = how｜退票 = cancel / return a ticket｜退款 = get a refund｜呢 = question particle. Ask this when you need the cancellation and refund procedure.', fr: '如何 = comment｜退票 = annuler / rendre un billet｜退款 = obtenir un remboursement｜呢 = particule interrogative. Posez cette question pour connaître la procédure d’annulation et de remboursement.' },
        audio: '/audio/train-station-ticket/line-12.mp3',
      },
    ],
  },
    sentencePatterns: [
    {
      id: 'train-station-ticket-pattern-1',
      pattern: '……在哪里？',
      pinyin: '... zài nǎ lǐ?',
      meaning: {
        en: 'Where is ...?',
        fr: 'Où est ... ?',
      },
      audio: '/audio/train-station-ticket/pattern-01.mp3',
      examples: [
        {
          fill: '火车站',
          fillPinyin: 'huǒ chē zhàn',
          hanzi: '火车站在哪里？',
          pinyin: 'Huǒ chē zhàn zài nǎ lǐ?',
          en: 'Where is the train station?',
          fr: 'Où est la gare ?',
          audio: '/audio/train-station-ticket/pattern-01-example-01.mp3',
        },
        {
          fill: '售票处',
          fillPinyin: 'shòu piào chù',
          hanzi: '售票处在哪里？',
          pinyin: 'Shòu piào chù zài nǎ lǐ?',
          en: 'Where is the ticket office?',
          fr: 'Où est le guichet ?',
          audio: '/audio/train-station-ticket/pattern-01-example-02.mp3',
        },
        {
          fill: '餐车',
          fillPinyin: 'cān chē',
          hanzi: '餐车在哪里？',
          pinyin: 'Cān chē zài nǎ lǐ?',
          en: 'Where is the dining car?',
          fr: 'Où est la voiture-restaurant ?',
          audio: '/audio/train-station-ticket/pattern-01-example-03.mp3',
        },
      ],
    },
    {
      id: 'train-station-ticket-pattern-2',
      pattern: '我要一张去……的票。',
      pinyin: 'Wǒ yào yì zhāng qù ... de piào.',
      meaning: {
        en: 'I’d like one ticket to ...',
        fr: 'Je voudrais un billet pour ...',
      },
      audio: '/audio/train-station-ticket/pattern-02.mp3',
      examples: [
        {
          fill: '北京',
          fillPinyin: 'Běi jīng',
          hanzi: '我要一张去北京的票。',
          pinyin: 'Wǒ yào yì zhāng qù Běi jīng de piào.',
          en: 'I’d like one ticket to Beijing.',
          fr: 'Je voudrais un billet pour Pékin.',
          audio: '/audio/train-station-ticket/pattern-02-example-01.mp3',
        },
        {
          fill: '上海',
          fillPinyin: 'Shàng hǎi',
          hanzi: '我要一张去上海的票。',
          pinyin: 'Wǒ yào yì zhāng qù Shàng hǎi de piào.',
          en: 'I’d like one ticket to Shanghai.',
          fr: 'Je voudrais un billet pour Shanghai.',
          audio: '/audio/train-station-ticket/pattern-02-example-02.mp3',
        },
        {
          fill: '广州',
          fillPinyin: 'Guǎng zhōu',
          hanzi: '我要一张去广州的票。',
          pinyin: 'Wǒ yào yì zhāng qù Guǎng zhōu de piào.',
          en: 'I’d like one ticket to Guangzhou.',
          fr: 'Je voudrais un billet pour Canton.',
          audio: '/audio/train-station-ticket/pattern-02-example-03.mp3',
        },
      ],
    },
    {
      id: 'train-station-ticket-pattern-3',
      pattern: '……几点开？',
      pinyin: '... jǐ diǎn kāi?',
      meaning: {
        en: 'What time does ... leave?',
        fr: 'À quelle heure part ... ?',
      },
      audio: '/audio/train-station-ticket/pattern-03.mp3',
      examples: [
        {
          fill: '火车',
          fillPinyin: 'huǒ chē',
          hanzi: '火车几点开？',
          pinyin: 'Huǒ chē jǐ diǎn kāi?',
          en: 'What time does the train leave?',
          fr: 'À quelle heure part le train ?',
          audio: '/audio/train-station-ticket/pattern-03-example-01.mp3',
        },
        {
          fill: '高铁',
          fillPinyin: 'gāo tiě',
          hanzi: '高铁几点开？',
          pinyin: 'Gāo tiě jǐ diǎn kāi?',
          en: 'What time does the high-speed train leave?',
          fr: 'À quelle heure part le train à grande vitesse ?',
          audio: '/audio/train-station-ticket/pattern-03-example-02.mp3',
        },
        {
          fill: '动车',
          fillPinyin: 'dòng chē',
          hanzi: '动车几点开？',
          pinyin: 'Dòng chē jǐ diǎn kāi?',
          en: 'What time does the bullet train leave?',
          fr: 'À quelle heure part le train rapide ?',
          audio: '/audio/train-station-ticket/pattern-03-example-03.mp3',
        },
      ],
    },
    {
      id: 'train-station-ticket-pattern-4',
      pattern: '……晚点了吗？',
      pinyin: '... wǎn diǎn le ma?',
      meaning: {
        en: 'Is ... delayed?',
        fr: '... est-il en retard ?',
      },
      audio: '/audio/train-station-ticket/pattern-04.mp3',
      examples: [
        {
          fill: '火车',
          fillPinyin: 'huǒ chē',
          hanzi: '火车晚点了吗？',
          pinyin: 'Huǒ chē wǎn diǎn le ma?',
          en: 'Is the train delayed?',
          fr: 'Le train est-il en retard ?',
          audio: '/audio/train-station-ticket/pattern-04-example-01.mp3',
        },
        {
          fill: '高铁',
          fillPinyin: 'gāo tiě',
          hanzi: '高铁晚点了吗？',
          pinyin: 'Gāo tiě wǎn diǎn le ma?',
          en: 'Is the high-speed train delayed?',
          fr: 'Le train à grande vitesse est-il en retard ?',
          audio: '/audio/train-station-ticket/pattern-04-example-02.mp3',
        },
      ],
    },
    {
      id: 'train-station-ticket-pattern-5',
      pattern: '怎么换乘？',
      pinyin: 'Zěn me huàn chéng?',
      meaning: {
        en: 'How do I transfer?',
        fr: 'Comment faire une correspondance ?',
      },
      audio: '/audio/train-station-ticket/pattern-05.mp3',
    },
    {
      id: 'train-station-ticket-pattern-6',
      pattern: '售票处在哪里？',
      pinyin: 'Shòu piào chù zài nǎ lǐ?',
      meaning: {
        en: 'Where is the ticket office?',
        fr: 'Où est le guichet de billets ?',
      },
    
      audio: '/audio/train-station-ticket/line-02.mp3',},
    {
      id: 'train-station-ticket-pattern-7',
      pattern: '这是我的护照。',
      pinyin: 'Zhè shì wǒ de hù zhào.',
      meaning: {
        en: 'This is my passport.',
        fr: 'Voici mon passeport.',
      },
    
      audio: '/audio/train-station-ticket/line-04.mp3',},
    {
      id: 'train-station-ticket-pattern-8',
      pattern: '餐车在哪里？',
      pinyin: 'Cān chē zài nǎ lǐ?',
      meaning: {
        en: 'Where is the dining car?',
        fr: 'Où est la voiture-restaurant ?',
      },
    
      audio: '/audio/train-station-ticket/line-06.mp3',},
    {
      id: 'train-station-ticket-pattern-9',
      pattern: '我误车了。',
      pinyin: 'Wǒ wù chē le.',
      meaning: {
        en: 'I missed the train.',
        fr: 'J\'ai raté mon train.',
      },
    
      audio: '/audio/train-station-ticket/line-09.mp3',},
    {
      id: 'train-station-ticket-pattern-10',
      pattern: '我没赶上火车。',
      pinyin: 'Wǒ méi gǎn shàng huǒ chē.',
      meaning: {
        en: 'I missed the train.',
        fr: 'J\'ai raté le train.',
      },
    
      audio: '/audio/train-station-ticket/line-10.mp3',},
    {
      id: 'train-station-ticket-pattern-11',
      pattern: '能改签下一辆车吗？',
      pinyin: 'Néng gǎi qiān xià yí liàng chē ma?',
      meaning: {
        en: 'Can I change my ticket to the next train?',
        fr: 'Puis-je modifier mon billet pour le prochain train ?',
      },
    
      audio: '/audio/train-station-ticket/line-11.mp3',},
    {
      id: 'train-station-ticket-pattern-12',
      pattern: '如何退票退款呢？',
      pinyin: 'Rú hé tuì piào tuì kuǎn ne?',
      meaning: {
        en: 'How can I cancel my ticket and get a refund?',
        fr: 'Comment annuler mon billet et me faire rembourser ?',
      },
    
      audio: '/audio/train-station-ticket/line-12.mp3',},
  ],
  vocabulary: [
    {
      id: 'train-station-ticket-vocab-1',
      hanzi: '火车站',
      pinyin: 'huǒ chē zhàn',
      audio: '/audio/train-station-ticket/vocab-01.mp3',
      meaning: {
        en: 'train station',
        fr: 'gare',
      },
      explanation: {
        en: 'The station where you buy tickets and board trains.',
        fr: 'La gare où vous achetez des billets et prenez le train.',
      },
    },
    {
      id: 'train-station-ticket-vocab-2',
      hanzi: '车票',
      pinyin: 'chē piào',
      audio: '/audio/train-station-ticket/vocab-02.mp3',
      meaning: {
        en: 'train ticket / vehicle ticket',
        fr: 'billet de train / ticket de transport',
      },
      explanation: {
        en: 'A general word for a train ticket or another transport ticket.',
        fr: 'Un terme général pour un billet de train ou un autre titre de transport.',
      },
    },
    {
      id: 'train-station-ticket-vocab-3',
      hanzi: '上海',
      pinyin: 'Shàng hǎi',
      audio: '/audio/train-station-ticket/vocab-03.mp3',
      meaning: {
        en: 'Shanghai',
        fr: 'Shanghai',
      },
      explanation: {
        en: 'A common destination used when practising a ticket request.',
        fr: 'Une destination courante pour s’entraîner à demander un billet.',
      },
    },
    {
      id: 'train-station-ticket-vocab-4',
      hanzi: '今天',
      pinyin: 'jīn tiān',
      audio: '/audio/train-station-ticket/vocab-04.mp3',
      meaning: {
        en: 'today',
        fr: 'aujourd\'hui',
      },
      explanation: {
        en: 'Use 今天 when a departure or trip is happening today.',
        fr: 'Utilisez 今天 lorsqu’un départ ou un trajet a lieu aujourd’hui.',
      },
    },
    {
      id: 'train-station-ticket-vocab-5',
      hanzi: '出发',
      pinyin: 'chū fā',
      audio: '/audio/train-station-ticket/vocab-05.mp3',
      meaning: {
        en: 'depart',
        fr: 'partir / départ',
      },
      explanation: {
        en: 'The action word for the train leaving.',
        fr: 'Le mot d\'action pour le départ du train.',
      },
    },
    { id: 'train-station-ticket-vocab-6', hanzi: '硬座', pinyin: 'yìng zuò', audio: '/audio/train-station-ticket/vocab-06.mp3', meaning: { en: 'hard seat (standard class)', fr: 'siège dur (classe standard)' }, explanation: { en: 'The most common and affordable train seat type.', fr: 'Le type de place le plus courant et abordable en train.' } },
    { id: 'train-station-ticket-vocab-7', hanzi: '软座', pinyin: 'ruǎn zuò', audio: '/audio/train-station-ticket/vocab-07.mp3', meaning: { en: 'soft seat (comfort class)', fr: 'siège souple (classe confort)' }, explanation: { en: 'A more comfortable seat option that costs a bit more.', fr: 'Une option de place plus confortable qui coûte un peu plus cher.' } },
    { id: 'train-station-ticket-vocab-8', hanzi: '站台', pinyin: 'zhàn tái', audio: '/audio/train-station-ticket/vocab-08.mp3', meaning: { en: 'platform', fr: 'quai' }, explanation: { en: 'The place where you board the train.', fr: 'L\'endroit où tu montes dans le train.' } },
    { id: 'train-station-ticket-vocab-9', hanzi: '晚点', pinyin: 'wǎn diǎn', audio: '/audio/train-station-ticket/vocab-09.mp3', meaning: { en: 'delay / late', fr: 'retard / en retard' }, explanation: { en: 'A word you will see on station displays if a train is late.', fr: 'Un mot que tu verras sur les écrans de gare si un train est en retard.' } },
    { id: 'train-station-ticket-vocab-10', hanzi: '护照', pinyin: 'hù zhào', audio: '/audio/train-station-ticket/vocab-10.mp3', meaning: { en: 'passport', fr: 'passeport' }, explanation: { en: 'You need it for buying long-distance train tickets.', fr: 'Tu en as besoin pour acheter des billets de train longue distance.' } },
    { id: 'train-station-ticket-vocab-11', hanzi: '进站口', pinyin: 'jìn zhàn kǒu', audio: '/audio/train-station-ticket/vocab-11.mp3', meaning: { en: 'station entrance', fr: 'entrée de la gare' }, explanation: { en: 'The entrance you use to go into the station.', fr: 'L\'entrée que tu utilises pour entrer dans la gare.' } },
    { id: 'train-station-ticket-vocab-12', hanzi: '人工通道', pinyin: 'rén gōng tōng dào', audio: '/audio/train-station-ticket/vocab-12.mp3', meaning: { en: 'staffed lane / manual inspection lane', fr: 'passage avec contrôle manuel' }, explanation: { en: 'Use this if automated gates do not read your passport.', fr: 'Utilise ce passage si les portiques automatiques ne lisent pas ton passeport.' } },
    { id: 'train-station-ticket-vocab-13', hanzi: '检票口', pinyin: 'jiǎn piào kǒu', audio: '/audio/train-station-ticket/vocab-13.mp3', meaning: { en: 'ticket check gate', fr: 'portique de contrôle des billets' }, explanation: { en: 'The gate where your ticket is checked before the platform.', fr: 'Le portique où l\'on vérifie ton billet avant le quai.' } },
    { id: 'train-station-ticket-vocab-14', hanzi: '车厢号', pinyin: 'chē xiāng hào', audio: '/audio/train-station-ticket/vocab-14.mp3', meaning: { en: 'carriage number', fr: 'numéro de voiture' }, explanation: { en: 'Find this number on your ticket to locate your carriage.', fr: 'Trouve ce numéro sur ton billet pour localiser ta voiture.' } },
    { id: 'train-station-ticket-vocab-15', hanzi: '座位号', pinyin: 'zuò wèi hào', audio: '/audio/train-station-ticket/vocab-15.mp3', meaning: { en: 'seat number', fr: 'numéro de siège' }, explanation: { en: 'Use this number to find your exact seat on the train.', fr: 'Utilise ce numéro pour trouver ta place exacte dans le train.' } },
  ],
  practice: {
    listening: [
      {
        id: 'train-station-ticket-listening-1',
        prompt: {
          en: 'Listen for the ticket to Shanghai.',
          fr: 'Écoute le billet pour Shanghai.',
        },
        target: '我想买一张去上海的票。',
        audio: '/audio/train-station-ticket/practice-listening-01.mp3',
        explanation: {
          en: '我想买 = I would like to buy｜一张 = one｜去上海 = to Shanghai｜的票 = ticket. The destination goes after 去 in this ticket request.',
          fr: '我想买 = je voudrais acheter｜一张 = un｜去上海 = pour Shanghai｜的票 = billet. Dans cette demande, la destination se place après 去.',
        },
      },
      { id: 'train-station-ticket-listening-2', prompt: { en: 'Which phrase says the train won\'t be delayed?', fr: 'Quelle phrase dit que le train n\'aura pas de retard ?' }, target: '不会晚点。', audio: '/audio/train-station-ticket/practice-listening-02.mp3', explanation: { en: '不会 = will not｜晚点 = be delayed. This reply reassures you that the train is expected to run on time.', fr: '不会 = ne… pas / ne… pas devoir｜晚点 = être en retard. Cette réponse indique que le train devrait être à l’heure.' } },
    ],
    speaking: [
      {
        id: 'train-station-ticket-speaking-1',
        prompt: {
          en: 'Say that you want to buy a ticket to Shanghai.',
          fr: 'Dis que tu veux acheter un billet pour Shanghai.',
        },
        target: '我想买一张去上海的票。',
        audio: '/audio/train-station-ticket/practice-speaking-01.mp3',
        explanation: {
          en: '我想买 = I would like to buy｜一张 = one｜去上海的票 = ticket to Shanghai. Use this at the ticket counter to request your destination.',
          fr: '我想买 = je voudrais acheter｜一张 = un｜去上海的票 = billet pour Shanghai. Utilisez cette phrase au guichet pour demander votre destination.',
        },
      },
      { id: 'train-station-ticket-speaking-2', prompt: { en: 'Ask which platform the train is at.', fr: 'Demande sur quel quai se trouve le train.' }, target: '在哪个站台？', audio: '/audio/train-station-ticket/practice-speaking-02.mp3', explanation: { en: '在 = at｜哪个 = which｜站台 = platform. Ask this after buying your ticket to find the correct platform.', fr: '在 = à｜哪个 = quel｜站台 = quai. Posez cette question après l’achat du billet pour trouver le bon quai.' } },
    ],
    reading: [
      {
        id: 'train-station-ticket-reading-1',
        prompt: {
          en: 'Read the departure time.',
          fr: 'Lis l\'heure de départ.',
        },
        target: '三点出发。',
        audio: '/audio/train-station-ticket/practice-reading-01.mp3',
        explanation: {
          en: '三点 = three o’clock｜出发 = depart. This short sentence states a departure time.',
          fr: '三点 = trois heures｜出发 = partir. Cette phrase courte indique une heure de départ.',
        },
      },
      { id: 'train-station-ticket-reading-2', prompt: { en: 'Match the word for platform.', fr: 'Associe le mot pour quai.' }, target: '站台', audio: '/audio/train-station-ticket/practice-reading-02.mp3', explanation: { en: '站台 is the platform where you board. Look for it on signs.', fr: '站台 est le quai où tu embarques. Cherche-le sur les panneaux.' } },
    ],
  },
  reviewCards: [
    {
      id: 'train-station-ticket-review-1',
      front: '火车站',
      back: {
        en: 'train station',
        fr: 'gare',
      },
      explanation: {
        en: 'The setting for buying the ticket.',
        fr: 'Le lieu où acheter le billet.',
      },
    },
    {
      id: 'train-station-ticket-review-2',
      front: '车票',
      back: {
        en: 'ticket',
        fr: 'billet',
      },
      explanation: {
        en: 'A general word for a train or transport ticket.',
        fr: 'Un terme général pour un billet de train ou de transport.',
      },
    },
    {
      id: 'train-station-ticket-review-3',
      front: '三点出发',
      back: {
        en: 'Depart at three o’clock.',
        fr: 'Le départ est à trois heures.',
      },
      explanation: {
        en: '三点 = three o’clock｜出发 = depart. Use this compact phrase to state a departure time.',
        fr: '三点 = trois heures｜出发 = partir. Utilisez cette phrase courte pour indiquer une heure de départ.',
      },
    },
    { id: 'train-station-ticket-review-4', front: '硬座', back: { en: 'hard seat', fr: 'place dure' }, explanation: { en: 'The standard train seat class in China.', fr: 'La classe de place standard en train en Chine.' } },
    { id: 'train-station-ticket-review-5', front: '站台', back: { en: 'platform', fr: 'quai' }, explanation: { en: 'Find this word on signs to locate your boarding area.', fr: 'Trouve ce mot sur les panneaux pour localiser ta zone d\'embarquement.' } },
    { id: 'train-station-ticket-review-6', front: '晚点', back: { en: 'delay', fr: 'retard' }, explanation: { en: 'Watch for this word on departure boards.', fr: 'Surveille ce mot sur les panneaux de départ.' } },
  ],
}
