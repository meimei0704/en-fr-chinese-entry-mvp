import type { LessonContent } from '../types.js'

export const pharmacyHelpLesson: LessonContent = {
  id: 'pharmacy-help',
  title: {
    en: 'Ask for help at a pharmacy',
    fr: 'Demander de l’aide à la pharmacie',
  },
  scenario: {
    en: 'Describe a headache or stomach ache, answer fever questions, ask about allergies, understand medicine frequency and dosage, and pay.',
    fr: 'Décrire un mal de tête ou de ventre, répondre aux questions de fièvre, demander à propos des allergies, comprendre la fréquence et le dosage, et payer.',
  },
  dialogue: {
    title: {
      en: 'Describe symptoms and buy medicine',
      fr: 'Décrire des symptômes et acheter un médicament',
    },
    lines: [
      {
        id: 'pharmacy-help-line-01',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '你好，我头疼。',
        pinyin: 'Nǐ hǎo, wǒ tóu téng.',
        translation: {
          en: 'Hello, my head hurts.',
          fr: 'Bonjour, j’ai mal à la tête.',
        },
        explanation: {
          en: '我……疼 is a simple way to name a mild pain.',
          fr: '我……疼 est une façon simple de nommer une douleur légère.',
        },
        audio: '/audio/pharmacy-help/line-01.mp3',
      },
      {
        id: 'pharmacy-help-line-02',
        speaker: {
          en: 'Pharmacist',
          fr: 'Pharmacien',
        },
        hanzi: '你发烧吗？',
        pinyin: 'Nǐ fāshāo ma?',
        translation: {
          en: 'Do you have a fever?',
          fr: 'Avez-vous de la fièvre ?',
        },
        explanation: {
          en: 'The clerk asks a yes/no symptom question with 吗.',
          fr: 'Le pharmacien pose une question oui/non sur un symptôme avec 吗.',
        },
        audio: '/audio/pharmacy-help/line-02.mp3',
      },
      {
        id: 'pharmacy-help-line-03',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '不发烧，但是肚子也有点疼。',
        pinyin: 'Bù fāshāo, dànshì dùzi yě yǒudiǎn téng.',
        translation: {
          en: 'No fever, but my stomach also hurts a little.',
          fr: 'Pas de fièvre, mais j’ai aussi un peu mal au ventre.',
        },
        explanation: {
          en: 'Add 但是 to link two symptoms in one turn.',
          fr: 'Ajoute 但是 pour relier deux symptômes en une seule réplique.',
        },
        audio: '/audio/pharmacy-help/line-03.mp3',
      },
      {
        id: 'pharmacy-help-line-04',
        speaker: {
          en: 'Pharmacist',
          fr: 'Pharmacien',
        },
        hanzi: '你对什么过敏吗？',
        pinyin: 'Nǐ duì shénme guòmǐn ma?',
        translation: {
          en: 'Are you allergic to anything?',
          fr: 'Êtes-vous allergique à quelque chose ?',
        },
        explanation: {
          en: 'A safety question the pharmacist will ask before giving medicine.',
          fr: 'Une question de sécurité que le pharmacien pose avant de donner un médicament.',
        },
        audio: '/audio/pharmacy-help/line-04.mp3',
      },
      {
        id: 'pharmacy-help-line-05',
        speaker: {
          en: 'Traveler',
          fr: 'Voyageur',
        },
        hanzi: '没有过敏。',
        pinyin: 'Méiyǒu guòmǐn.',
        translation: {
          en: 'No allergies.',
          fr: 'Pas d’allergie.',
        },
        explanation: {
          en: 'A short clear answer to the allergy safety question.',
          fr: 'Une réponse courte et claire à la question de sécurité sur les allergies.',
        },
        audio: '/audio/pharmacy-help/line-05.mp3',
      },
      {
        id: 'pharmacy-help-line-06',
        speaker: { en: 'Pharmacist', fr: 'Pharmacien' },
        hanzi: '这个止疼药，一次一片，一天两次。',
        pinyin: 'Zhège zhǐténg yào, yí cì yí piàn, yì tiān liǎng cì.',
        translation: {
          en: 'This painkiller, one tablet per dose, twice a day.',
          fr: 'Cet antidouleur, un comprimé par prise, deux fois par jour.',
        },
        explanation: {
          en: '一次一片 adds the dosage detail on top of the frequency.',
          fr: '一次一片 ajoute le détail du dosage en plus de la fréquence.',
        },
        audio: '/audio/pharmacy-help/line-06.mp3',
      },
      {
        id: 'pharmacy-help-line-07',
        speaker: { en: 'Traveler', fr: 'Voyageur' },
        hanzi: '饭前吃还是饭后吃？',
        pinyin: 'Fàn qián chī háishi fàn hòu chī?',
        translation: {
          en: 'Take before or after meals?',
          fr: 'Prendre avant ou après les repas ?',
        },
        explanation: {
          en: '饭前/饭后 is a common instruction to check for any medicine.',
          fr: '饭前/饭后 est une consigne courante à vérifier pour tout médicament.',
        },
        audio: '/audio/pharmacy-help/line-07.mp3',
      },
      {
        id: 'pharmacy-help-line-08',
        speaker: { en: 'Pharmacist', fr: 'Pharmacien' },
        hanzi: '饭后吃。一共十八块钱。',
        pinyin: 'Fàn hòu chī. Yígòng shíbā kuài qián.',
        translation: {
          en: 'After meals. Eighteen yuan altogether.',
          fr: 'Après les repas. Dix-huit yuans au total.',
        },
        explanation: {
          en: 'The pharmacist gives the instruction and the price together.',
          fr: 'Le pharmacien donne la consigne et le prix ensemble.',
        },
        audio: '/audio/pharmacy-help/line-08.mp3',
      },
    ],
  },
  sentencePatterns: [
    {
      id: 'pharmacy-help-pattern-1',
      pattern: '我……疼。',
      meaning: {
        en: 'My ... hurts.',
        fr: 'J’ai mal à ...',
      },
      example: '我头疼。',
      audio: '/audio/pharmacy-help/pattern-01.mp3',
      explanation: {
        en: 'Put the body part before 疼 for a simple symptom.',
        fr: 'Place la partie du corps avant 疼 pour un symptôme simple.',
      },
    },
    {
      id: 'pharmacy-help-pattern-2',
      pattern: '你……吗？',
      meaning: {
        en: 'Do you ...?',
        fr: 'Est-ce que vous ... ?',
      },
      example: '你发烧吗？',
      audio: '/audio/pharmacy-help/pattern-02.mp3',
      explanation: {
        en: 'Listen for 吗 when a clerk asks a yes/no health question.',
        fr: 'Écoute 吗 quand un employé pose une question de santé oui/non.',
      },
    },
    {
      id: 'pharmacy-help-pattern-3',
      pattern: '一次……片。',
      meaning: {
        en: '... tablet(s) per dose.',
        fr: '... comprimé(s) par prise.',
      },
      example: '一次一片。',
      audio: '/audio/pharmacy-help/pattern-03.mp3',
      explanation: {
        en: 'This tells you how many pills to take at one time.',
        fr: 'Cela indique combien de pilules prendre en une fois.',
      },
    },
    {
      id: 'pharmacy-help-pattern-4',
      pattern: '我对……过敏。',
      meaning: { en: 'I am allergic to ...', fr: 'Je suis allergique à ...' },
      example: '我对青霉素过敏。',
      audio: '/audio/pharmacy-help/pattern-04.mp3',
      explanation: {
        en: 'Use this to name a specific allergy if asked.',
        fr: 'Utilise cette structure pour nommer une allergie spécifique si on te le demande.',
      },
    },
    {
      id: 'pharmacy-help-pattern-5',
      pattern: '饭前还是饭后？',
      meaning: { en: 'Before or after meals?', fr: 'Avant ou après les repas ?' },
      example: '饭前还是饭后？',
      audio: '/audio/pharmacy-help/pattern-05.mp3',
      explanation: {
        en: 'Ask this to confirm when to take the medicine.',
        fr: 'Demande cela pour confirmer quand prendre le médicament.',
      },
    },
  ],
  vocabulary: [
    {
      id: 'pharmacy-help-vocab-1',
      hanzi: '药店',
      pinyin: 'yàodiàn',
      audio: '/audio/pharmacy-help/vocab-01.mp3',
      meaning: {
        en: 'pharmacy',
        fr: 'pharmacie',
      },
      explanation: {
        en: 'The place to ask for simple medicine help.',
        fr: 'Le lieu pour demander une aide simple avec un médicament.',
      },
    },
    {
      id: 'pharmacy-help-vocab-2',
      hanzi: '药',
      pinyin: 'yào',
      audio: '/audio/pharmacy-help/vocab-02.mp3',
      meaning: {
        en: 'medicine',
        fr: 'médicament',
      },
      explanation: {
        en: 'A core word in pharmacy instructions.',
        fr: 'Un mot essentiel dans les consignes de pharmacie.',
      },
    },
    {
      id: 'pharmacy-help-vocab-3',
      hanzi: '头疼',
      pinyin: 'tóu téng',
      audio: '/audio/pharmacy-help/vocab-03.mp3',
      meaning: {
        en: 'headache',
        fr: 'mal à la tête',
      },
      explanation: {
        en: 'The mild symptom used in the dialogue.',
        fr: 'Le symptôme léger utilisé dans le dialogue.',
      },
    },
    {
      id: 'pharmacy-help-vocab-4',
      hanzi: '发烧',
      pinyin: 'fāshāo',
      audio: '/audio/pharmacy-help/vocab-04.mp3',
      meaning: {
        en: 'to have a fever',
        fr: 'avoir de la fièvre',
      },
      explanation: {
        en: 'A common follow-up symptom question.',
        fr: 'Une question de symptôme fréquente.',
      },
    },
    {
      id: 'pharmacy-help-vocab-5',
      hanzi: '过敏',
      pinyin: 'guòmǐn',
      audio: '/audio/pharmacy-help/vocab-05.mp3',
      meaning: {
        en: 'allergy / allergic',
        fr: 'allergie / allergique',
      },
      explanation: {
        en: 'A safety word to recognize even in a mild-health lesson.',
        fr: 'Un mot de sécurité à reconnaître même dans une leçon de santé légère.',
      },
    },
    { id: 'pharmacy-help-vocab-6', hanzi: '肚子疼', pinyin: 'dùzi téng', audio: '/audio/pharmacy-help/vocab-06.mp3', meaning: { en: 'stomach ache', fr: 'mal au ventre' }, explanation: { en: 'Another common symptom to report at the pharmacy.', fr: 'Un autre symptôme courant à signaler à la pharmacie.' } },
    { id: 'pharmacy-help-vocab-7', hanzi: '止疼药', pinyin: 'zhǐténg yào', audio: '/audio/pharmacy-help/vocab-07.mp3', meaning: { en: 'painkiller', fr: 'antidouleur' }, explanation: { en: 'The kind of medicine you might ask for with a headache.', fr: 'Le type de médicament que tu pourrais demander pour un mal de tête.' } },
    { id: 'pharmacy-help-vocab-8', hanzi: '一次一片', pinyin: 'yí cì yí piàn', audio: '/audio/pharmacy-help/vocab-08.mp3', meaning: { en: 'one tablet per dose', fr: 'un comprimé par prise' }, explanation: { en: 'The dosage instruction you will hear with medicine.', fr: 'La consigne de dosage que tu entendras avec le médicament.' } },
    { id: 'pharmacy-help-vocab-9', hanzi: '饭前', pinyin: 'fàn qián', audio: '/audio/pharmacy-help/vocab-09.mp3', meaning: { en: 'before meals', fr: 'avant les repas' }, explanation: { en: 'One of the two common medicine timing words.', fr: 'Un des deux mots courants pour le moment de prise du médicament.' } },
    { id: 'pharmacy-help-vocab-10', hanzi: '饭后', pinyin: 'fàn hòu', audio: '/audio/pharmacy-help/vocab-10.mp3', meaning: { en: 'after meals', fr: 'après les repas' }, explanation: { en: 'The other common medicine timing word paired with 饭前.', fr: 'L’autre mot courant pour le moment de prise, associé à 饭前.' } },
  ],
  practice: {
    listening: [
      {
        id: 'pharmacy-help-listening-1',
        prompt: {
          en: 'Listen for headache and no fever.',
          fr: 'Écoute “mal à la tête” et “pas de fièvre”.',
        },
        target: '我头疼，不发烧。',
        audio: '/audio/pharmacy-help/practice-listening-01.mp3',
        explanation: {
          en: 'This combines the symptom and the negative fever answer.',
          fr: 'Cela combine le symptôme et la réponse négative sur la fièvre.',
        },
      },
      { id: 'pharmacy-help-listening-2', prompt: { en: 'Which phrase asks about allergies?', fr: 'Quelle phrase demande à propos des allergies ?' }, target: '你对什么过敏吗？', audio: '/audio/pharmacy-help/practice-listening-02.mp3', explanation: { en: 'This is a safety question you will hear at the pharmacy.', fr: 'C’est une question de sécurité que tu entendras à la pharmacie.' } },
    ],
    speaking: [
      {
        id: 'pharmacy-help-speaking-1',
        prompt: {
          en: 'Say that your head hurts.',
          fr: 'Dis que tu as mal à la tête.',
        },
        target: '我头疼。',
        audio: '/audio/pharmacy-help/practice-speaking-01.mp3',
        explanation: {
          en: 'Start with the shortest clear symptom sentence.',
          fr: 'Commence par la phrase de symptôme la plus courte et claire.',
        },
      },
      { id: 'pharmacy-help-speaking-2', prompt: { en: 'Ask whether to take the medicine before or after meals.', fr: 'Demande si le médicament se prend avant ou après les repas.' }, target: '饭前还是饭后？', audio: '/audio/pharmacy-help/practice-speaking-02.mp3', explanation: { en: 'This confirms the correct timing for the medicine.', fr: 'Cela confirme le bon moment pour prendre le médicament.' } },
    ],
    reading: [
      {
        id: 'pharmacy-help-reading-1',
        prompt: {
          en: 'Read the medicine frequency phrase.',
          fr: 'Lis la phrase de fréquence du médicament.',
        },
        target: '一天两次。',
        audio: '/audio/pharmacy-help/practice-reading-01.mp3',
        explanation: {
          en: 'Recognize how many times per day the medicine is used.',
          fr: 'Reconnais combien de fois par jour le médicament est utilisé.',
        },
      },
      { id: 'pharmacy-help-reading-2', prompt: { en: 'Match the dosage instruction.', fr: 'Associe la consigne de dosage.' }, target: '一次一片', audio: '/audio/pharmacy-help/practice-reading-02.mp3', explanation: { en: '一次一片 is the pill count per dose.', fr: '一次一片 est le nombre de comprimés par prise.' } },
    ],
  },
  reviewCards: [
    {
      id: 'pharmacy-help-review-1',
      front: '药店',
      back: {
        en: 'pharmacy',
        fr: 'pharmacie',
      },
      explanation: {
        en: 'The place for the help request.',
        fr: 'Le lieu de la demande d’aide.',
      },
    },
    {
      id: 'pharmacy-help-review-2',
      front: '头疼',
      back: {
        en: 'headache',
        fr: 'mal à la tête',
      },
      explanation: {
        en: 'Say 我头疼 to report it.',
        fr: 'Dis 我头疼 pour le signaler.',
      },
    },
    {
      id: 'pharmacy-help-review-3',
      front: '一天两次',
      back: {
        en: 'twice a day',
        fr: 'deux fois par jour',
      },
      explanation: {
        en: 'A common medicine frequency.',
        fr: 'Une fréquence courante pour un médicament.',
      },
    },
    { id: 'pharmacy-help-review-4', front: '肚子疼', back: { en: 'stomach ache', fr: 'mal au ventre' }, explanation: { en: 'Another symptom you can report with 我……疼.', fr: 'Un autre symptôme que tu peux signaler avec 我……疼.' } },
    { id: 'pharmacy-help-review-5', front: '过敏', back: { en: 'allergy / allergic', fr: 'allergie / allergique' }, explanation: { en: 'A safety word the pharmacist will check.', fr: 'Un mot de sécurité que le pharmacien vérifiera.' } },
    { id: 'pharmacy-help-review-6', front: '饭后', back: { en: 'after meals', fr: 'après les repas' }, explanation: { en: 'A common medicine timing instruction.', fr: 'Une consigne courante pour le moment de prise.' } },
  ],
}
