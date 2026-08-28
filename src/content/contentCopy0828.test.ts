import { describe, expect, it } from 'vitest'

import { course } from './course'

function lesson(id: string) {
  const value = course.lessons.find((candidate) => candidate.id === id)
  expect(value, `missing lesson ${id}`).toBeDefined()
  return value!
}

function line(lessonId: string, hanzi: string) {
  const value = lesson(lessonId).dialogue.lines.find((candidate) => candidate.hanzi === hanzi)
  expect(value, `missing dialogue line ${lessonId}/${hanzi}`).toBeDefined()
  return value!
}

function pattern(lessonId: string, formula: string) {
  const value = lesson(lessonId).sentencePatterns.find(
    (candidate) => candidate.pattern === formula,
  )
  expect(value, `missing pattern ${lessonId}/${formula}`).toBeDefined()
  return value!
}

function vocabulary(lessonId: string, hanzi: string) {
  const value = lesson(lessonId).vocabulary.find((candidate) => candidate.hanzi === hanzi)
  expect(value, `missing vocabulary item ${lessonId}/${hanzi}`).toBeDefined()
  return value!
}

const phoneCardIntro =
  "In China, all SIM cards require real-name registration with your passport. Only official service centers work; small shops can’t help. There are four major telecom operators: China Mobile, China Unicom, China Telecom and China Broadnet. Each operator offers various mobile SIM card options. To monitor your communication expenses, download the operator's app or follow their official WeChat account to check call charges and data usage. Pay attention to billing rules inside and outside your plan, as data charges beyond your plan can be high. Cancel your SIM card at the official store before you leave China. Unpaid debt may prevent you from buying a Chinese SIM card later."

describe('2026-08-28 lesson copy', () => {
  it('uses the requested lesson introductions', () => {
    expect(lesson('self-intro').scenario).toEqual({
      en: 'Navigate the immigration and customs smoothly and ask for help when need.',
      fr: 'Récupérez vos bagages, passez la douane et demandez de l’aide pour vous repérer sereinement à l’aéroport.',
    })
    expect(lesson('ask-directions').scenario.en).toBe(
      'Get to your destination, ensuring comfort and safety.',
    )
    expect(lesson('restaurant-order').scenario.en).toBe(
      'Ask for a menu, order food and drinks, and specify your preference.',
    )
    expect(lesson('small-talk').scenario.en).toBe(
      'Common conversation starters to break the ice, send positive vibes by giving people compliments.',
    )
  })

  it('translates hotel state phrases as whole units without changing other 了 explanations', () => {
    const hotelKey = line('order-food', '我的房卡丢了。')
    const hotelAirConditioner = line('order-food', '空调坏了。')

    expect(hotelKey.explanation.en).toContain('房卡 = room key card｜丢了 = lost')
    expect(hotelKey.explanation.en).not.toContain('丢 =')
    expect(hotelKey.explanation.en).not.toContain('｜了 =')
    expect(hotelAirConditioner.explanation.en).toContain('空调 = air conditioner｜坏了 = broken')
    expect(hotelAirConditioner.explanation.en).not.toContain('坏 =')
    expect(hotelAirConditioner.explanation.en).not.toContain('｜了 =')
    expect(line('restaurant-order', '可以点餐了吗？').explanation.en).toContain(
      '了 = now / change of state',
    )
  })

  it('adds the hotel ellipsis patterns', () => {
    expect(lesson('order-food').sentencePatterns.map(({ pattern: formula }) => formula)).toEqual(
      expect.arrayContaining(['我要……。', '我已经……。', '我可以……吗？']),
    )
  })

  it('provides three hotel examples for each new ellipsis pattern', () => {
    expect(pattern('order-food', '我要……。').examples?.map((example) => [
      example.fill,
      example.fillPinyin,
      example.hanzi,
      example.pinyin,
      example.en,
      example.fr,
    ])).toEqual([
      ['办理入住', 'bàn lǐ rù zhù', '我要办理入住。', 'wǒ yào bàn lǐ rù zhù.', 'I want to check in.', 'Je veux m’enregistrer.'],
      ['一张房卡', 'yì zhāng fáng kǎ', '我要一张房卡。', 'wǒ yào yì zhāng fáng kǎ.', 'I want a room key card.', 'Je veux une carte d’accès à ma chambre.'],
      ['退房', 'tuì fáng', '我要退房。', 'wǒ yào tuì fáng.', 'I want to check out.', 'Je veux quitter la chambre.'],
    ])
    expect(pattern('order-food', '我已经……。').examples?.map((example) => [
      example.fill,
      example.fillPinyin,
      example.hanzi,
      example.pinyin,
      example.en,
      example.fr,
    ])).toEqual([
      ['预订房间了', 'yù dìng fáng jiān le', '我已经预订房间了。', 'wǒ yǐ jīng yù dìng fáng jiān le.', 'I have already booked a room.', 'J’ai déjà réservé une chambre.'],
      ['付钱了', 'fù qián le', '我已经付钱了。', 'wǒ yǐ jīng fù qián le.', 'I have already paid.', 'J’ai déjà payé.'],
      ['入住了', 'rù zhù le', '我已经入住了。', 'wǒ yǐ jīng rù zhù le.', 'I have already checked in.', 'Je me suis déjà enregistré(e).'],
    ])
    expect(pattern('order-food', '我可以……吗？').examples?.map((example) => [
      example.fill,
      example.fillPinyin,
      example.hanzi,
      example.pinyin,
      example.en,
      example.fr,
    ])).toEqual([
      ['晚一点退房', 'wǎn yì diǎn tuì fáng', '我可以晚一点退房吗？', 'wǒ kě yǐ wǎn yì diǎn tuì fáng ma?', 'Can I check out later?', 'Puis-je partir plus tard ?'],
      ['先看一下房间', 'xiān kàn yí xià fáng jiān', '我可以先看一下房间吗？', 'wǒ kě yǐ xiān kàn yí xià fáng jiān ma?', 'Can I see the room first?', 'Puis-je voir la chambre d’abord ?'],
      ['换一个房间', 'huàn yí gè fáng jiān', '我可以换一个房间吗？', 'wǒ kě yǐ huàn yí gè fáng jiān ma?', 'Can I change rooms?', 'Puis-je changer de chambre ?'],
    ])
  })

  it('adds the phone-card introduction and foreigner phrase', () => {
    const phone = lesson('phone-and-payment')
    expect((phone.dialogue as typeof phone.dialogue & { intro?: unknown }).intro).toEqual(
      expect.objectContaining({ en: phoneCardIntro }),
    )
    expect(line('phone-and-payment', '外国人可以办理吗？').translation.en).toBe(
      'Do you offer services for foreigners?',
    )
    expect(phone.dialogue.lines.slice(0, 2).map((dialogueLine) => dialogueLine.hanzi)).toEqual([
      '我要买一个 SIM 卡。',
      '外国人可以办理吗？',
    ])
  })

  it('keeps concise phone vocabulary meanings and puts descriptions in explanations', () => {
    expect(vocabulary('phone-and-payment', '话费').meaning.en).toBe(
      'call charges / phone fees',
    )
    expect(vocabulary('phone-and-payment', '话费').explanation.en).toBe(
      'The fees incurred for communication services.',
    )
    expect(vocabulary('phone-and-payment', '流量').meaning.en).toBe(
      'data / mobile data',
    )
    expect(vocabulary('phone-and-payment', '流量').explanation.en).toBe(
      'The amount of mobile internet usage. In China, it\'s commonly referred to as "data".',
    )
    expect(vocabulary('phone-and-payment', '套餐').meaning.en).toBe(
      'plan / package',
    )
    expect(vocabulary('phone-and-payment', '套餐').explanation.en).toBe(
      'Service plans offered by telecom operators, including combinations of call minutes, SMS and data. Most plans auto-renew unless you change or cancel them. You can choose a plan based on your needs.',
    )
  })

  it('uses the approved scene-based vocabulary explanations without untranslated Chinese sentences', () => {
    const approvedExplanations = [
      {
        lessonId: 'self-intro',
        hanzi: '会说',
        explanation: {
          en: 'Use this before a language when asking about someone’s language ability—for example, when seeking help at a hotel, shop, or station.',
          fr: 'Utilisez ce mot devant une langue pour vous renseigner sur les compétences linguistiques de quelqu’un, par exemple lorsque vous cherchez de l’aide dans un hôtel, un magasin ou une gare.',
        },
      },
      {
        lessonId: 'self-intro',
        hanzi: '待',
        explanation: {
          en: 'Use this with a place or length of time when telling a host, hotel staff, or an immigration officer how long you are staying.',
          fr: 'Utilisez ce mot avec un lieu ou une durée pour indiquer à votre hôte, au personnel de l’hôtel ou à un agent d’immigration combien de temps vous comptez rester.',
        },
      },
      {
        lessonId: 'phone-and-payment',
        hanzi: '手机号码',
        explanation: {
          en: 'You may be asked for this when buying a SIM card, registering for an app, or arranging a delivery.',
          fr: 'On peut vous le demander lors de l’achat d’une carte SIM, de l’inscription à une application ou de l’organisation d’une livraison.',
        },
      },
      {
        lessonId: 'phone-and-payment',
        hanzi: '支付',
        explanation: {
          en: 'In China, you will see this word when paying in an app or at checkout. WeChat Pay and Alipay are the most common mobile payment methods.',
          fr: 'En Chine, vous verrez ce mot au moment de payer dans une application ou à la caisse. WeChat Pay et Alipay sont les moyens de paiement mobile les plus courants.',
        },
      },
      {
        lessonId: 'phone-and-payment',
        hanzi: '可以',
        explanation: {
          en: 'Put this before an action to ask whether it is possible or allowed, such as when asking about payment methods, Wi-Fi, or available services.',
          fr: 'Placez ce mot avant une action pour demander si elle est possible ou autorisée, par exemple pour vous renseigner sur les moyens de paiement, le Wi-Fi ou les services disponibles.',
        },
      },
      {
        lessonId: 'phone-and-payment',
        hanzi: '充值',
        explanation: {
          en: 'With a Chinese prepaid SIM, you can top up through the carrier’s app, Alipay, WeChat, or at a service counter.',
          fr: 'Avec une carte SIM prépayée chinoise, vous pouvez la recharger depuis l’application de l’opérateur, Alipay, WeChat ou dans un point de service.',
        },
      },
      {
        lessonId: 'phone-and-payment',
        hanzi: '余额',
        explanation: {
          en: 'Check this before making calls, using mobile data, or paying from an account, so you know how much credit remains.',
          fr: 'Vérifiez-le avant de téléphoner, d’utiliser des données mobiles ou de payer depuis un compte, afin de connaître le crédit restant.',
        },
      },
      {
        lessonId: 'train-station-ticket',
        hanzi: '车票',
        explanation: {
          en: 'In China, a train ticket is usually linked to your passport; keep your passport ready when booking and entering the station.',
          fr: 'En Chine, un billet de train est généralement associé à votre passeport ; gardez celui-ci à portée de main pour réserver et entrer dans la gare.',
        },
      },
      {
        lessonId: 'metro-ticket',
        hanzi: '自动售票机',
        explanation: {
          en: 'At many metro stations, use a ticket vending machine to choose your destination and buy a single-journey ticket; look for the English-language option on screen.',
          fr: 'Dans de nombreuses stations de métro, utilisez un distributeur pour choisir votre destination et acheter un ticket à l’unité ; cherchez l’option en anglais à l’écran.',
        },
      },
      {
        lessonId: 'metro-ticket',
        hanzi: '上车',
        explanation: {
          en: 'Use this when boarding a bus, metro, or train; let passengers get off before you get on.',
          fr: 'Utilisez ce mot lorsque vous montez dans un bus, un métro ou un train ; laissez d’abord les passagers descendre.',
        },
      },
      {
        lessonId: 'metro-ticket',
        hanzi: '下车',
        explanation: {
          en: 'Use this when telling a driver or companion which stop you plan to get off at, and listen for it in transport announcements.',
          fr: 'Utilisez ce mot pour indiquer à un chauffeur ou à un compagnon de voyage à quel arrêt vous comptez descendre, et repérez-le dans les annonces de transport.',
        },
      },
      {
        lessonId: 'ask-for-help-problem',
        hanzi: '帮忙',
        explanation: {
          en: 'Use this word to ask for a favor or offer help. It is useful when you need assistance with luggage, directions, or a phone problem.',
          fr: 'Utilisez ce mot pour demander un service ou proposer votre aide. Il est utile lorsque vous avez besoin d’aide avec des bagages, un itinéraire ou un problème de téléphone.',
        },
      },
      {
        lessonId: 'ask-for-help-problem',
        hanzi: '慢一点',
        explanation: {
          en: 'Use 慢一点 in requests such as 请说慢一点 (Please speak more slowly) or 请开慢一点 (Please drive more slowly).',
          fr: 'Utilisez 慢一点 dans des demandes comme 请说慢一点 (Parlez plus lentement, s’il vous plaît) ou 请开慢一点 (Conduisez plus lentement, s’il vous plaît).',
        },
      },
      {
        lessonId: 'ask-for-help-problem',
        hanzi: '充电',
        explanation: {
          en: 'Shared power banks are very popular in China’s public places. Scan the QR code to rent one, then return it after charging your phone.',
          fr: 'Les batteries externes partagées sont très courantes dans les lieux publics en Chine. Scannez le code QR pour en louer une, puis rendez-la après avoir rechargé votre téléphone.',
        },
      },
      {
        lessonId: 'ask-for-help-problem',
        hanzi: '没关系',
        explanation: {
          en: 'Use this mainly to reply when someone apologizes. It can also mean that something is not important.',
          fr: 'Utilisez cette expression surtout pour répondre à quelqu’un qui s’excuse. Elle peut aussi signifier que quelque chose n’est pas important.',
        },
      },
      {
        lessonId: 'pharmacy-help',
        hanzi: '药',
        explanation: {
          en: 'At a pharmacy, tell the pharmacist your symptoms, ask which medicine is suitable, and confirm how much to take and how often.',
          fr: 'À la pharmacie, décrivez vos symptômes, demandez quel médicament convient et confirmez la dose ainsi que la fréquence de prise.',
        },
      },
      {
        lessonId: 'small-talk',
        hanzi: '聊天',
        explanation: {
          en: 'Use this for relaxed conversation about topics such as travel, food, or where someone is from—not for a formal discussion.',
          fr: 'Utilisez ce mot pour une conversation détendue sur le voyage, la cuisine ou l’origine de quelqu’un, et non pour une discussion formelle.',
        },
      },
    ] as const

    for (const entry of approvedExplanations) {
      expect(vocabulary(entry.lessonId, entry.hanzi).explanation).toEqual(entry.explanation)
    }

    for (const entry of approvedExplanations.filter(({ hanzi }) => hanzi !== '慢一点')) {
      expect(entry.explanation.en).not.toMatch(/\p{Script=Han}/u)
      expect(entry.explanation.fr).not.toMatch(/\p{Script=Han}/u)
    }
  })

  it('replaces the shopping currency unit with practical price vocabulary', () => {
    const shopping = lesson('convenience-store-run')
    const vocabularyItems = shopping.vocabulary.map((item) => item.hanzi)

    expect(vocabularyItems).not.toContain('毛')
    expect(vocabularyItems).toEqual(
      expect.arrayContaining(['便宜', '贵', '打折']),
    )
    expect(vocabulary('convenience-store-run', '便宜')).toMatchObject({
      meaning: { en: 'cheap', fr: 'bon marché' },
      explanation: {
        en: 'Use 便宜 when comparing prices or asking a seller to lower the price, as in 可以便宜一点吗？',
        fr: 'Utilisez 便宜 pour comparer les prix ou demander au vendeur de baisser le prix, comme dans 可以便宜一点吗？',
      },
    })
    expect(vocabulary('convenience-store-run', '贵')).toMatchObject({
      meaning: { en: 'expensive', fr: 'cher' },
      explanation: {
        en: 'Use 贵 to say that an item costs more than expected, as in 太贵了。',
        fr: 'Utilisez 贵 pour dire qu’un article coûte plus cher que prévu, comme dans 太贵了。',
      },
    })
    expect(vocabulary('convenience-store-run', '打折')).toMatchObject({
      meaning: { en: 'discount', fr: 'remise' },
      explanation: {
        en: 'Look for 打折 signs to see whether an item is on sale; ask 现在打折吗？ before paying.',
        fr: 'Repérez les panneaux 打折 pour savoir si un article est en promotion ; demandez 现在打折吗？ avant de payer.',
      },
    })
  })

  it('updates help explanations and adds its topic-specific state-change pattern', () => {
    expect(line('ask-for-help-problem', '麻烦你了。').explanation.en).toContain(
      '了 = grammatical particle, adding politeness and gratitude',
    )
    expect(line('ask-for-help-problem', '我迷路了。').explanation.en).toContain(
      '了 = grammatical particle showing that a new situation has come about',
    )
    const statePattern = pattern('ask-for-help-problem', '我……了')
    expect(statePattern.examples?.map((example) => example.hanzi)).toEqual(
      expect.arrayContaining(['我迷路了。', '我手机没电了。', '我护照丢了。']),
    )
  })

  it('updates small-talk copy, phrase, pattern, and vocabulary', () => {
    const smallTalk = lesson('small-talk')
    expect(line('small-talk', '你穿的衣服很好看。').translation).toEqual({
      en: 'The clothes you’re wearing look very nice.',
      fr: 'Les vêtements que tu portes sont très beaux.',
    })
    expect(line('small-talk', '和你聊天很开心。').translation).toEqual({
      en: 'I’m having a great time chatting with you.',
      fr: 'Je suis très heureux / heureuse de discuter avec toi.',
    })
    expect(smallTalk.sentencePatterns.map(({ pattern: formula }) => formula)).toContain(
      '祝你……',
    )
    expect(pattern('small-talk', '祝你……').examples?.map((example) => [
      example.fill,
      example.fillPinyin,
      example.hanzi,
      example.pinyin,
      example.en,
      example.fr,
    ])).toEqual([
      ['生日快乐', 'shēng rì kuài lè', '祝你生日快乐！', 'zhù nǐ shēng rì kuài lè!', 'Happy birthday!', 'Joyeux anniversaire !'],
      ['周末愉快', 'zhōu mò yú kuài', '祝你周末愉快！', 'zhù nǐ zhōu mò yú kuài!', 'Have a nice weekend!', 'Bon week-end !'],
      ['玩得开心', 'wán de kāi xīn', '祝你玩得开心！', 'zhù nǐ wán de kāi xīn!', 'Have fun!', 'Amuse-toi bien !'],
    ])
    expect(smallTalk.vocabulary.map((item) => item.hanzi)).not.toEqual(
      expect.arrayContaining(['计划', '待', '上海']),
    )
  })

  it('uses the requested train delay examples and translations', () => {
    const delayPattern = pattern('train-station-ticket', '……晚点了吗？')
    expect(delayPattern.examples?.map((example) => [example.hanzi, example.en, example.fr])).toEqual([
      ['我的车晚点了吗？', 'Is my train delayed?', 'Mon train est-il en retard ?'],
      ['火车晚点了吗？', 'Is the train delayed?', 'Le train est-il en retard ?'],
      ['飞机晚点了吗？', 'Is the plane delayed?', 'L’avion est-il en retard ?'],
    ])
  })
})
