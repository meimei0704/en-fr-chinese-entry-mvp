import type { LocalizedText } from './types'

export interface CultureAdviceSubItem {
  id: string
  lead?: LocalizedText
  body: LocalizedText
}

export interface CultureAdviceItem {
  id: string
  lead?: LocalizedText
  body: LocalizedText
  subItems?: CultureAdviceSubItem[]
}

export interface CultureAdviceSection {
  id: string
  title: LocalizedText
  kind: 'numbered' | 'bulleted'
  intro?: LocalizedText
  items: CultureAdviceItem[]
}

export const cultureAdvice = {
  title: {
    en: 'Culture advice for travelers in China',
    fr: 'Conseils culturels pour les voyageurs en Chine',
  },
  sections: [
    {
      id: 'general-social-tips',
      title: { en: 'General Social Tips', fr: 'Conseils sociaux généraux' },
      kind: 'numbered',
      items: [
        {
          id: 'formal-visits',
          lead: {
            en: 'For formal visits:',
            fr: 'Pour les visites formelles :',
          },
          body: {
            en: 'Address people by their title plus family name (e.g., "Mr. Li" or "Ms. Wang"). Do not use given first names unless you are explicitly invited to do so.',
            fr: 'Adressez-vous aux personnes par leur titre suivi du nom de famille (ex. « M. Li » ou « Mme Wang »). N’utilisez pas les prénoms sauf invitation explicite.',
          },
        },
        {
          id: 'giving-receiving-items',
          lead: {
            en: 'Giving and receiving items:',
            fr: 'Donner et recevoir des objets :',
          },
          body: {
            en: 'Always give or receive items — gifts, business cards, or even a cup of tea — with both hands as a gesture of respect. Hand-to-hand passing with one single hand can feel impolite in formal settings.',
            fr: 'Toujours donner ou recevoir un objet — cadeaux, cartes de visite ou même une tasse de thé — avec les deux mains en signe de respect. Tendre un objet d’une seule main peut paraître impoli dans un cadre formel.',
          },
        },
        {
          id: 'gifts-to-avoid',
          lead: {
            en: 'Gifts to avoid (symbolic taboos):',
            fr: 'Cadeaux à éviter (tabous symboliques) :',
          },
          body: { en: '', fr: '' },
          subItems: [
            {
              id: 'clocks',
              lead: {
                en: 'Clocks:',
                fr: 'Les horloges :',
              },
              body: {
                en: 'The phrase for "giving a clock" sounds like attending a funeral in Chinese.',
                fr: 'L’expression « offrir une horloge » évoque l’assistance à des funérailles en chinois.',
              },
            },
            {
              id: 'white-chrysanthemums',
              lead: {
                en: 'White chrysanthemums:',
                fr: 'Les chrysanthèmes blancs :',
              },
              body: {
                en: 'Traditionally used for funerals; avoid white-black gift wrapping paper.',
                fr: 'Traditionnellement réservés aux funérailles ; évitez le papier cadeau blanc et noir.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'dining-etiquette',
      title: { en: 'Dining Etiquette', fr: 'Étiquette à table' },
      kind: 'bulleted',
      items: [
        {
          id: 'wait-for-host',
          lead: {
            en: 'Wait for the host:',
            fr: 'Attendre l’hôte :',
          },
          body: {
            en: 'Do not start eating until the host or the eldest person at the table begins eating or proposes the first toast.',
            fr: 'Ne commencez pas à manger avant que l’hôte ou l’aîné de la table ne commence ou ne propose le premier toast.',
          },
        },
        {
          id: 'chopstick-rules',
          lead: {
            en: 'Chopstick rules:',
            fr: 'Règles des baguettes :',
          },
          body: {
            en: 'Never stick chopsticks upright vertically in a bowl of rice, as this resembles incense offerings for the deceased. Do not point at other people with your chopsticks.',
            fr: 'Ne plantez jamais les baguettes verticalement dans un bol de riz, cela évoque l’encens offert aux défunts. Ne pointez pas les autres avec vos baguettes.',
          },
        },
        {
          id: 'toasting-customs',
          lead: {
            en: 'Toasting customs:',
            fr: 'Coutumes de toast :',
          },
          body: {
            en: 'When someone proposes a toast, raise your glass and drink along with them.\nTo show respect to elders or senior guests, hold your glass slightly lower than theirs when clinking glasses.',
            fr: 'Quand quelqu’un propose un toast, levez votre verre et buvez avec lui.\nPour montrer votre respect aux aînés, tenez votre verre légèrement plus bas que le leur lorsque vous trinquez.',
          },
        },
        {
          id: 'useful-phrase',
          lead: {
            en: 'Useful phrase:',
            fr: 'Expression utile :',
          },
          body: {
            en: '"干杯" (Gān bēi) = "Cheers!" Traditionally this means draining your glass, though sipping is widely acceptable in modern-day casual meals.',
            fr: '« 干杯 » (Gān bēi) = « Santé ! » Traditionnellement cela signifie vider son verre, bien que boire une gorgée soit largement accepté dans les repas décontractés modernes.',
          },
        },
      ],
    },
    {
      id: 'conversation-guidelines',
      title: { en: 'Conversation Guidelines', fr: 'Consignes de conversation' },
      kind: 'bulleted',
      items: [
        {
          id: 'safe-topics',
          body: {
            en: 'Avoid sensitive discussion topics: politics, Taiwan, Tibet, or direct criticism of the government. Safe and welcome topics: local food, travel experiences, Chinese traditional culture, hobbies and family life.',
            fr: 'Évitez les sujets sensibles : politique, Taïwan, Tibet ou critique directe du gouvernement. Sujets sûrs et bienvenus : cuisine locale, expériences de voyage, culture traditionnelle chinoise, loisirs et vie de famille.',
          },
        },
      ],
    },
    {
      id: 'visiting-someones-home',
      title: { en: "Visiting Someone's Home", fr: 'Visiter un foyer' },
      kind: 'bulleted',
      items: [
        {
          id: 'small-thoughtful-gift',
          body: {
            en: 'Bring a small thoughtful gift: Fruits, quality tea, or desserts are good choices. Avoid overly expensive gifts, which may put the host in an awkward position.',
            fr: 'Apportez un petit cadeau attentionné : fruits, bon thé ou desserts sont de bons choix. Évitez les cadeaux trop chers qui pourraient mettre l’hôte mal à l’aise.',
          },
        },
        {
          id: 'remove-shoes',
          body: {
            en: 'Remove your shoes at the entrance, unless the host tells you there is no need. House slippers are often provided for guests.',
            fr: 'Retirez vos chaussures à l’entrée, sauf si l’hôte vous dit que ce n’est pas nécessaire. Des pantoufles sont souvent fournies aux invités.',
          },
        },
        {
          id: 'accept-hospitality',
          body: {
            en: 'Accept hospitality politely: Even if you are already full, try to eat at least a small bite of food offered to you, to show appreciation for the host’s effort.',
            fr: 'Acceptez poliment l’hospitalité : même si vous êtes rassasié, goûtez au moins une petite bouchée de ce qui vous est offert, pour montrer votre appréciation des efforts de l’hôte.',
          },
        },
      ],
    },
    {
      id: 'public-conduct',
      title: {
        en: 'Public Conduct and Behaviour',
        fr: 'Conduite et comportement en public',
      },
      kind: 'bulleted',
      items: [
        {
          id: 'offer-seat',
          body: {
            en: 'On public transport, offer your seat to elderly people, pregnant women, and young children. This is widely regarded as basic good manners.',
            fr: 'Dans les transports en commun, cédez votre place aux personnes âgées, aux femmes enceintes et aux jeunes enfants. C’est largement considéré comme une marque de courtoisie élémentaire.',
          },
        },
        {
          id: 'pointing',
          body: {
            en: 'Pointing directly at another person with your finger is considered rude. Use an open palm if you need to gesture toward someone or something.',
            fr: 'Pointer quelqu’un directement du doigt est considéré comme impoli. Utilisez la main ouverte pour désigner une personne ou une chose.',
          },
        },
        {
          id: 'photos-permission',
          body: {
            en: 'Ask permission before taking photos of local people, especially in villages and ethnic-minority areas. Some temples ban photography inside halls; never photograph military or government-related sites where signs prohibit it.',
            fr: 'Demandez la permission avant de photographier les habitants, surtout dans les villages et les zones de minorités ethniques. Certains temples interdisent la photo dans les salles ; ne photographiez jamais les sites militaires ou gouvernementaux où des panneaux l’interdisent.',
          },
        },
      ],
    },
    {
      id: 'visiting-temples',
      title: {
        en: 'Visiting Temples & Cultural Sites',
        fr: 'Visiter les temples et sites culturels',
      },
      kind: 'bulleted',
      items: [
        {
          id: 'dress-modestly',
          body: {
            en: 'Dress modestly: Cover shoulders and knees. Remove hats and sunglasses inside main halls.',
            fr: 'Habillez-vous avec modestie : couvrez épaules et genoux. Retirez chapeaux et lunettes de soleil dans les salles principales.',
          },
        },
        {
          id: 'do-not-touch',
          body: {
            en: 'Do not touch statues, offerings or sacred objects. Always follow posted site rules.',
            fr: 'Ne touchez ni statues, ni offrandes, ni objets sacrés. Suivez toujours les règles affichées sur le site.',
          },
        },
      ],
    },
    {
      id: 'number-superstitions',
      title: {
        en: 'Number Superstitions & Symbolism',
        fr: 'Superstitions et symbolisme des nombres',
      },
      kind: 'bulleted',
      intro: {
        en: 'Certain numbers carry cultural associations due to Chinese homophones:',
        fr: 'Certains nombres portent des associations culturelles dues aux homophones chinois :',
      },
      items: [
        {
          id: 'number-8',
          lead: { en: '8:', fr: '8 :' },
          body: {
            en: 'Represents wealth, prosperity and good luck — highly favoured.',
            fr: 'Représente la richesse, la prospérité et la bonne chance — très apprécié.',
          },
        },
        {
          id: 'number-6',
          lead: { en: '6:', fr: '6 :' },
          body: {
            en: 'Stands for harmony, smooth progress and good fortune.',
            fr: 'Évoque l’harmonie, le progrès sans heurt et la bonne fortune.',
          },
        },
        {
          id: 'number-4',
          lead: { en: '4:', fr: '4 :' },
          body: {
            en: 'Its pronunciation sounds similar to the word for "death". Many people try to avoid the number 4 in phone numbers, building floors and room numbers.',
            fr: 'Sa prononciation ressemble au mot « mort ». Beaucoup évitent le chiffre 4 dans les numéros de téléphone, les étages et les numéros de chambre.',
          },
        },
      ],
    },
  ],
} satisfies {
  title: LocalizedText
  sections: CultureAdviceSection[]
}
