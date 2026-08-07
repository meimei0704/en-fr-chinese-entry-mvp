# Batch 1 Course Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand askDirections, orderFood, phoneAndPayment lessons from 5→8 dialogue, 3→5 patterns, 5→10 vocab, 1→2 pronunciation, 4→6 hanzi, 1→2 practice, 3→6 cards.

**Architecture:** Pure content data modifications to 3 lesson files + 1 test file. No component, CSS, routing, or type changes.

**Tech Stack:** TypeScript content data, Vitest verification.

---

## Baseline

From `origin/main`, create `feature/t51-batch1-course-expansion` branch. Only modify:
- `src/content/lessons/askDirections.ts`
- `src/content/lessons/orderFood.ts`
- `src/content/lessons/phoneAndPayment.ts`
- `src/content/course.test.ts`

---

### Task 1: Expand askDirections.ts (5→8 dialogue)

**Files:** Modify `src/content/lessons/askDirections.ts`

- [ ] **Step 1: Renumber existing lines 04-05 → 06-07**

Change line ids and audio paths:
- `ask-directions-line-04` → `ask-directions-line-06`, audio → `/audio/ask-directions/line-06.mp3`
- `ask-directions-line-05` → `ask-directions-line-07`, audio → `/audio/ask-directions/line-07.mp3`

- [ ] **Step 2: Insert new lines 04-05 (meter request + response) after existing line 03**

```ts
{
  id: 'ask-directions-line-04',
  speaker: {
    en: 'Traveler',
    fr: 'Voyageur',
  },
  hanzi: '请打表。',
  pinyin: 'Qǐng dǎbiǎo.',
  translation: {
    en: 'Please use the meter.',
    fr: 'Veuillez utiliser le compteur.',
  },
  explanation: {
    en: 'Say 请打表 when you get in to make sure the driver starts the meter.',
    fr: 'Dis 请打表 en montant pour t\'assurer que le chauffeur démarre le compteur.',
  },
  audio: '/audio/ask-directions/line-04.mp3',
},
{
  id: 'ask-directions-line-05',
  speaker: {
    en: 'Driver',
    fr: 'Chauffeur',
  },
  hanzi: '好的，打表。',
  pinyin: 'Hǎo de, dǎbiǎo.',
  translation: {
    en: 'Okay, the meter is on.',
    fr: 'D\'accord, le compteur est allumé.',
  },
  explanation: {
    en: 'The driver confirms the meter is running.',
    fr: 'Le chauffeur confirme que le compteur fonctionne.',
  },
  audio: '/audio/ask-directions/line-05.mp3',
},
```

- [ ] **Step 3: Insert new line 08 (payment) after renumbered line 07**

```ts
{
  id: 'ask-directions-line-08',
  speaker: {
    en: 'Traveler',
    fr: 'Voyageur',
  },
  hanzi: '多少钱？可以扫码吗？',
  pinyin: 'Duōshǎo qián? Kěyǐ sǎomǎ ma?',
  translation: {
    en: 'How much? Can I scan to pay?',
    fr: 'Combien ? Je peux scanner pour payer ?',
  },
  explanation: {
    en: 'Ask 多少钱 for the fare, then 可以扫码吗 to check if QR payment is accepted.',
    fr: 'Demande 多少钱 pour le prix, puis 可以扫码吗 pour vérifier si le paiement par QR est accepté.',
  },
  audio: '/audio/ask-directions/line-08.mp3',
},
```

---

### Task 2: Expand askDirections — patterns, vocab, pronunciation, hanzi, practice, cards

**Files:** Modify `src/content/lessons/askDirections.ts`

- [ ] **Step 1: Append 2 new sentence patterns**

```ts
{
  id: 'ask-directions-pattern-4',
  pattern: '请……',
  meaning: {
    en: 'Please ... (polite request)',
    fr: 'S\'il vous plaît ... (demande polie)',
  },
  example: '请打表。',
  audio: '/audio/ask-directions/pattern-04.mp3',
  explanation: {
    en: 'Use 请 before a short action to make a polite request in a taxi or at a counter.',
    fr: 'Utilise 请 avant une action courte pour faire une demande polie en taxi ou à un comptoir.',
  },
},
{
  id: 'ask-directions-pattern-5',
  pattern: '可以……吗？',
  meaning: {
    en: 'Can I ...? / Is it possible to ...?',
    fr: 'Puis-je ... ? / Est-il possible de ... ?',
  },
  example: '可以扫码吗？',
  audio: '/audio/ask-directions/pattern-05.mp3',
  explanation: {
    en: 'Use 可以…吗 to check if a payment method, action, or request is okay.',
    fr: 'Utilise 可以…吗 pour vérifier si un moyen de paiement, une action ou une demande est accepté.',
  },
},
```

- [ ] **Step 2: Append 5 new vocabulary items**

```ts
{
  id: 'ask-directions-vocab-6',
  hanzi: '打表',
  pinyin: 'dǎbiǎo',
  audio: '/audio/ask-directions/vocab-06.mp3',
  meaning: { en: 'turn on the meter', fr: 'allumer le compteur' },
  explanation: {
    en: 'Say this to make sure the taxi uses the meter instead of a fixed price.',
    fr: 'Dis ceci pour t\'assurer que le taxi utilise le compteur plutôt qu\'un prix fixe.',
  },
},
{
  id: 'ask-directions-vocab-7',
  hanzi: '二维码',
  pinyin: 'èrwéimǎ',
  audio: '/audio/ask-directions/vocab-07.mp3',
  meaning: { en: 'QR code', fr: 'code QR' },
  explanation: {
    en: 'You will see 二维码 everywhere for payment, menus, and WiFi in China.',
    fr: 'Tu verras 二维码 partout en Chine pour le paiement, les menus et le WiFi.',
  },
},
{
  id: 'ask-directions-vocab-8',
  hanzi: '扫码',
  pinyin: 'sǎomǎ',
  audio: '/audio/ask-directions/vocab-08.mp3',
  meaning: { en: 'scan to pay', fr: 'scanner pour payer' },
  explanation: {
    en: 'The most common payment action: open your app and scan a QR code.',
    fr: 'L\'action de paiement la plus courante : ouvre ton appli et scanne un code QR.',
  },
},
{
  id: 'ask-directions-vocab-9',
  hanzi: '发票',
  pinyin: 'fāpiào',
  audio: '/audio/ask-directions/vocab-09.mp3',
  meaning: { en: 'receipt / invoice', fr: 'reçu / facture' },
  explanation: {
    en: 'Ask for a 发票 if you need an official receipt for reimbursement.',
    fr: 'Demande un 发票 si tu as besoin d\'un reçu officiel pour te faire rembourser.',
  },
},
{
  id: 'ask-directions-vocab-10',
  hanzi: '高速',
  pinyin: 'gāosù',
  audio: '/audio/ask-directions/vocab-10.mp3',
  meaning: { en: 'highway / expressway', fr: 'autoroute' },
  explanation: {
    en: 'The driver may ask 走高速吗？ to check if you prefer the expressway.',
    fr: 'Le chauffeur peut demander 走高速吗？ pour vérifier si tu préfères l\'autoroute.',
  },
},
```

- [ ] **Step 3: Append 1 new pronunciation tip (shīfu vs shìfǒu)**

```ts
{
  id: 'ask-directions-pronunciation-2',
  focus: { en: 'sh vs s contrast', fr: 'Contraste sh vs s' },
  audioText: '师傅，是否走高速？',
  audio: '/audio/ask-directions/pronunciation-02.mp3',
  tip: {
    en: 'Curl your tongue for 师 (shī) but keep it flat for 四 (sì). Practice 师傅 vs 是否.',
    fr: 'Enroule ta langue pour 师 (shī) mais garde-la plate pour 四 (sì). Entraîne-toi avec 师傅 vs 是否.',
  },
  explanation: {
    en: 'The sh/s contrast is critical for taxi communication in China.',
    fr: 'Le contraste sh/s est essentiel pour communiquer en taxi en Chine.',
  },
},
```

- [ ] **Step 4: Append 2 new hanzi (表, 码)**

```ts
{
  id: 'ask-directions-hanzi-5',
  hanzi: '表',
  pinyin: 'biǎo',
  meaning: { en: 'meter / watch / form', fr: 'compteur / montre / formulaire' },
  explanation: {
    en: 'Recognize 表 in 打表, meaning the taxi meter.',
    fr: 'Reconnais 表 dans 打表, le compteur du taxi.',
  },
},
{
  id: 'ask-directions-hanzi-6',
  hanzi: '码',
  pinyin: 'mǎ',
  meaning: { en: 'code; as in QR code', fr: 'code ; comme dans code QR' },
  explanation: {
    en: 'Recognize 码 in 扫码 and 二维码.',
    fr: 'Reconnais 码 dans 扫码 et 二维码.',
  },
},
```

- [ ] **Step 5: Append 1 listening, 1 speaking, 1 reading practice**

```ts
// listening[1]
{
  id: 'ask-directions-listening-2',
  prompt: {
    en: 'Which phrase asks to use the meter?',
    fr: 'Quelle phrase demande d\'utiliser le compteur ?',
  },
  target: '请打表。',
  audio: '/audio/ask-directions/practice-listening-02.mp3',
  explanation: {
    en: '请打表 is the key safety phrase before the taxi starts moving.',
    fr: '请打表 est la phrase de sécurité clé avant que le taxi ne démarre.',
  },
},
// speaking[1]
{
  id: 'ask-directions-speaking-2',
  prompt: {
    en: 'Ask the driver to use the meter.',
    fr: 'Demande au chauffeur d\'utiliser le compteur.',
  },
  target: '请打表。',
  audio: '/audio/ask-directions/practice-speaking-02.mp3',
  explanation: {
    en: 'A short 请 before an action keeps the request polite and simple.',
    fr: 'Un 请 court avant une action garde la demande polie et simple.',
  },
},
// reading[1]
{
  id: 'ask-directions-reading-2',
  prompt: {
    en: 'Match the payment phrase.',
    fr: 'Associe la phrase de paiement.',
  },
  target: '可以扫码吗？',
  audio: '/audio/ask-directions/practice-reading-02.mp3',
  explanation: {
    en: 'Recognize 扫码 as the scan-to-pay action.',
    fr: 'Reconnais 扫码 comme l\'action de scanner pour payer.',
  },
},
```

- [ ] **Step 6: Append 3 new review cards**

```ts
{
  id: 'ask-directions-review-4', front: '打表',
  back: { en: 'use the meter', fr: 'utiliser le compteur' },
  explanation: { en: 'A key taxi safety word.', fr: 'Un mot clé de sécurité en taxi.' },
},
{
  id: 'ask-directions-review-5', front: '扫码',
  back: { en: 'scan to pay', fr: 'scanner pour payer' },
  explanation: { en: 'The main way to pay in China.', fr: 'Le principal moyen de payer en Chine.' },
},
{
  id: 'ask-directions-review-6', front: '发票',
  back: { en: 'receipt / invoice', fr: 'reçu / facture' },
  explanation: { en: 'Ask for this if you need proof of payment.', fr: 'Demande ceci si tu as besoin d\'une preuve de paiement.' },
},
```

---

### Task 3: Expand orderFood.ts (5→8 dialogue)

**Files:** Modify `src/content/lessons/orderFood.ts`

- [ ] **Step 1: Append 3 new dialogue lines (06-08) after existing line 05**

```ts
{
  id: 'order-food-line-06',
  speaker: { en: 'Guest', fr: 'Client' },
  hanzi: 'WiFi密码是多少？',
  pinyin: 'WiFi mìmǎ shì duōshǎo?',
  translation: {
    en: 'What is the WiFi password?',
    fr: 'Quel est le mot de passe WiFi ?',
  },
  explanation: {
    en: 'WiFi密码是多少 is the most practical hotel check-in follow-up question.',
    fr: 'WiFi密码是多少 est la question de suivi la plus pratique après le check-in.',
  },
  audio: '/audio/order-food/line-06.mp3',
},
{
  id: 'order-food-line-07',
  speaker: { en: 'Front desk', fr: 'Réception' },
  hanzi: '在这里，早餐是早上七点到九点。',
  pinyin: 'Zài zhèlǐ, zǎocān shì zǎoshang qī diǎn dào jiǔ diǎn.',
  translation: {
    en: 'Here it is. Breakfast is from 7 to 9 in the morning.',
    fr: 'Le voici. Le petit-déjeuner est de 7h à 9h du matin.',
  },
  explanation: {
    en: 'The front desk gives WiFi and breakfast info in one practical reply.',
    fr: 'La réception donne le WiFi et les infos petit-déjeuner en une réponse pratique.',
  },
  audio: '/audio/order-food/line-07.mp3',
},
{
  id: 'order-food-line-08',
  speaker: { en: 'Guest', fr: 'Client' },
  hanzi: '需要押金吗？几点退房？',
  pinyin: 'Xūyào yājīn ma? Jǐ diǎn tuìfáng?',
  translation: {
    en: 'Is a deposit needed? What time is checkout?',
    fr: 'Une caution est-elle nécessaire ? À quelle heure est le check-out ?',
  },
  explanation: {
    en: 'Ask about deposit and checkout time together to finish the check-in quickly.',
    fr: 'Demande la caution et l\'heure de check-out ensemble pour terminer le check-in rapidement.',
  },
  audio: '/audio/order-food/line-08.mp3',
},
```

---

### Task 4: Expand orderFood — patterns, vocab, pronunciation, hanzi, practice, cards

**Files:** Modify `src/content/lessons/orderFood.ts`

- [ ] **Step 1: Append 2 new patterns**

```ts
{
  id: 'order-food-pattern-4',
  pattern: '……是多少？',
  meaning: { en: 'What is ...? (for numbers)', fr: 'Quel est ... ? (pour les chiffres)' },
  example: 'WiFi密码是多少？',
  audio: '/audio/order-food/pattern-04.mp3',
  explanation: {
    en: 'Use …是多少 to ask for a password, price, or room number.',
    fr: 'Utilise …是多少 pour demander un mot de passe, un prix ou un numéro de chambre.',
  },
},
{
  id: 'order-food-pattern-5',
  pattern: '需要……吗？',
  meaning: { en: 'Is ... needed? / Do I need ...?', fr: 'Est-ce que ... est nécessaire ?' },
  example: '需要押金吗？',
  audio: '/audio/order-food/pattern-05.mp3',
  explanation: {
    en: 'Use 需要…吗 to ask whether a deposit, passport, or other item is required.',
    fr: 'Utilise 需要…吗 pour demander si une caution, un passeport ou autre est nécessaire.',
  },
},
```

- [ ] **Step 2: Append 5 new vocabulary**

```ts
{
  id: 'order-food-vocab-6', hanzi: 'WiFi密码', pinyin: 'WiFi mìmǎ', audio: '/audio/order-food/vocab-06.mp3',
  meaning: { en: 'WiFi password', fr: 'mot de passe WiFi' },
  explanation: { en: 'The first thing to ask after check-in.', fr: 'La première chose à demander après le check-in.' },
},
{
  id: 'order-food-vocab-7', hanzi: '早餐', pinyin: 'zǎocān', audio: '/audio/order-food/vocab-07.mp3',
  meaning: { en: 'breakfast', fr: 'petit-déjeuner' },
  explanation: { en: 'Ask about breakfast time and location at check-in.', fr: 'Demande l\'heure et le lieu du petit-déjeuner au check-in.' },
},
{
  id: 'order-food-vocab-8', hanzi: '押金', pinyin: 'yājīn', audio: '/audio/order-food/vocab-08.mp3',
  meaning: { en: 'deposit', fr: 'caution' },
  explanation: { en: 'Many hotels in China ask for a deposit during check-in.', fr: 'Beaucoup d\'hôtels en Chine demandent une caution au check-in.' },
},
{
  id: 'order-food-vocab-9', hanzi: '退房', pinyin: 'tuìfáng', audio: '/audio/order-food/vocab-09.mp3',
  meaning: { en: 'check out', fr: 'check-out / libérer la chambre' },
  explanation: { en: 'Know your 退房 time to avoid extra charges.', fr: 'Connais ton heure de 退房 pour éviter des frais supplémentaires.' },
},
{
  id: 'order-food-vocab-10', hanzi: '电梯', pinyin: 'diàntī', audio: '/audio/order-food/vocab-10.mp3',
  meaning: { en: 'elevator', fr: 'ascenseur' },
  explanation: { en: 'Ask 电梯在哪里？ to find the elevator to your room.', fr: 'Demande 电梯在哪里？ pour trouver l\'ascenseur vers ta chambre.' },
},
```

- [ ] **Step 3: Append 1 new pronunciation tip (fáng vs fàng)**

```ts
{
  id: 'order-food-pronunciation-2',
  focus: { en: 'Second vs fourth tone: 房 vs 放', fr: '2e vs 4e ton : 房 vs 放' },
  audioText: '房卡，退房，放在这里',
  audio: '/audio/order-food/pronunciation-02.mp3',
  tip: {
    en: '房 (fáng) rises gently; 放 (fàng) drops sharply. Mixing them may confuse the front desk.',
    fr: '房 (fáng) monte doucement ; 放 (fàng) descend brusquement. Les confondre peut troubler la réception.',
  },
  explanation: {
    en: '房 and 放 appear often at hotels — getting the tone right avoids misunderstandings.',
    fr: '房 et 放 apparaissent souvent à l\'hôtel — maîtriser le ton évite les malentendus.',
  },
},
```

- [ ] **Step 4: Append 2 new hanzi (早, 金)**

```ts
{
  id: 'order-food-hanzi-5', hanzi: '早', pinyin: 'zǎo',
  meaning: { en: 'morning / early', fr: 'matin / tôt' },
  explanation: { en: 'Recognize 早 in 早餐 on hotel signs.', fr: 'Reconnais 早 dans 早餐 sur les panneaux de l\'hôtel.' },
},
{
  id: 'order-food-hanzi-6', hanzi: '金', pinyin: 'jīn',
  meaning: { en: 'money / gold', fr: 'argent / or' },
  explanation: { en: 'Recognize 金 in 押金, the deposit word.', fr: 'Reconnais 金 dans 押金, le mot pour caution.' },
},
```

- [ ] **Step 5: Append 1 listening, 1 speaking, 1 reading + 3 new review cards**

```ts
// listening[1] — appended after existing
{
  id: 'order-food-listening-2',
  prompt: { en: 'Which phrase asks for the WiFi password?', fr: 'Quelle phrase demande le mot de passe WiFi ?' },
  target: 'WiFi密码是多少？', audio: '/audio/order-food/practice-listening-02.mp3',
  explanation: { en: 'WiFi密码是多少 is the first follow-up after receiving your room card.', fr: 'WiFi密码是多少 est la première question après avoir reçu ta carte de chambre.' },
},
// speaking[1]
{
  id: 'order-food-speaking-2',
  prompt: { en: 'Ask the front desk what time checkout is.', fr: 'Demande à la réception à quelle heure est le check-out.' },
  target: '几点退房？', audio: '/audio/order-food/practice-speaking-02.mp3',
  explanation: { en: '几点退房 is a short, practical checkout question.', fr: '几点退房 est une question courte et pratique pour le check-out.' },
},
// reading[1]
{
  id: 'order-food-reading-2',
  prompt: { en: 'Match the hotel word for deposit.', fr: 'Associe le mot d\'hôtel pour caution.' },
  target: '押金', audio: '/audio/order-food/practice-reading-02.mp3',
  explanation: { en: '押金 is the deposit you may need to pay at check-in.', fr: '押金 est la caution que tu pourrais devoir payer au check-in.' },
},
// 3 new review cards
{ id: 'order-food-review-4', front: 'WiFi密码', back: { en: 'WiFi password', fr: 'mot de passe WiFi' }, explanation: { en: 'Ask this right after check-in.', fr: 'Demande ceci juste après le check-in.' } },
{ id: 'order-food-review-5', front: '退房', back: { en: 'check out', fr: 'check-out' }, explanation: { en: 'Know your checkout time.', fr: 'Connais ton heure de check-out.' } },
{ id: 'order-food-review-6', front: '押金', back: { en: 'deposit', fr: 'caution' }, explanation: { en: 'You may need to pay this at the front desk.', fr: 'Tu pourrais devoir payer ceci à la réception.' } },
```

---

### Task 5: Expand phoneAndPayment.ts (5→8 dialogue)

**Files:** Modify `src/content/lessons/phoneAndPayment.ts`

- [ ] **Step 1: Renumber existing line 05 → 08**

Change id to `phone-and-payment-line-08`, audio to `/audio/phone-and-payment/line-08.mp3`.

- [ ] **Step 2: Insert new lines 05-07 after line 04**

```ts
{
  id: 'phone-and-payment-line-05',
  speaker: { en: 'Traveler', fr: 'Voyageur' },
  hanzi: '有什么流量套餐？',
  pinyin: 'Yǒu shénme liúliàng tàocān?',
  translation: {
    en: 'What data plans do you have?',
    fr: 'Quels forfaits data avez-vous ?',
  },
  explanation: {
    en: 'Ask 有什么流量套餐 to compare data plan options at a phone shop.',
    fr: 'Demande 有什么流量套餐 pour comparer les forfaits data dans une boutique.',
  },
  audio: '/audio/phone-and-payment/line-05.mp3',
},
{
  id: 'phone-and-payment-line-06',
  speaker: { en: 'Clerk', fr: 'Employé' },
  hanzi: '有10G和30G的，你要哪个？',
  pinyin: 'Yǒu shí G hé sānshí G de, nǐ yào nǎge?',
  translation: {
    en: 'We have 10G and 30G. Which one do you want?',
    fr: 'Nous avons 10 Go et 30 Go. Lequel voulez-vous ?',
  },
  explanation: {
    en: 'The clerk names two plan sizes and asks you to choose.',
    fr: 'L\'employé nomme deux tailles de forfait et te demande de choisir.',
  },
  audio: '/audio/phone-and-payment/line-06.mp3',
},
{
  id: 'phone-and-payment-line-07',
  speaker: { en: 'Traveler', fr: 'Voyageur' },
  hanzi: '怎么充值？',
  pinyin: 'Zěnme chōngzhí?',
  translation: {
    en: 'How do I top up?',
    fr: 'Comment recharger ?',
  },
  explanation: {
    en: 'Ask 怎么充值 to learn how to add credit to your phone.',
    fr: 'Demande 怎么充值 pour savoir comment ajouter du crédit à ton téléphone.',
  },
  audio: '/audio/phone-and-payment/line-07.mp3',
},
```

---

### Task 6: Expand phoneAndPayment — patterns, vocab, pronunciation, hanzi, practice, cards

**Files:** Modify `src/content/lessons/phoneAndPayment.ts`

- [ ] **Step 1: Append 2 new patterns**

```ts
{
  id: 'phone-and-payment-pattern-4',
  pattern: '有什么……？',
  meaning: { en: 'What ... do you have?', fr: 'Qu\'est-ce que vous avez comme ... ?' },
  example: '有什么流量套餐？', audio: '/audio/phone-and-payment/pattern-04.mp3',
  explanation: { en: 'Use 有什么 to ask about available options at a shop or counter.', fr: 'Utilise 有什么 pour demander les options disponibles dans un magasin ou à un comptoir.' },
},
{
  id: 'phone-and-payment-pattern-5',
  pattern: '怎么……？',
  meaning: { en: 'How to ...?', fr: 'Comment ... ?' },
  example: '怎么充值？', audio: '/audio/phone-and-payment/pattern-05.mp3',
  explanation: { en: 'Use 怎么 before a verb to ask how to do something.', fr: 'Utilise 怎么 avant un verbe pour demander comment faire quelque chose.' },
},
```

- [ ] **Step 2: Append 5 new vocabulary**

```ts
{ id: 'phone-and-payment-vocab-6', hanzi: '流量', pinyin: 'liúliàng', audio: '/audio/phone-and-payment/vocab-06.mp3', meaning: { en: 'data / mobile data', fr: 'données mobiles' }, explanation: { en: 'The key word when choosing a phone plan.', fr: 'Le mot clé pour choisir un forfait téléphonique.' } },
{ id: 'phone-and-payment-vocab-7', hanzi: '套餐', pinyin: 'tàocān', audio: '/audio/phone-and-payment/vocab-07.mp3', meaning: { en: 'plan / package', fr: 'forfait' }, explanation: { en: '套餐 means a bundled plan for phone, data, or even meals.', fr: '套餐 désigne un forfait groupé pour le téléphone, les données ou même les repas.' } },
{ id: 'phone-and-payment-vocab-8', hanzi: '充值', pinyin: 'chōngzhí', audio: '/audio/phone-and-payment/vocab-08.mp3', meaning: { en: 'top up / recharge', fr: 'recharger' }, explanation: { en: 'Use 充值 when you need to add credit to your phone or transit card.', fr: 'Utilise 充值 quand tu dois ajouter du crédit à ton téléphone ou ta carte de transport.' } },
{ id: 'phone-and-payment-vocab-9', hanzi: '微信', pinyin: 'Wēixìn', audio: '/audio/phone-and-payment/vocab-09.mp3', meaning: { en: 'WeChat', fr: 'WeChat' }, explanation: { en: 'The most common messaging and payment app in China.', fr: 'L\'application de messagerie et de paiement la plus courante en Chine.' } },
{ id: 'phone-and-payment-vocab-10', hanzi: '余额', pinyin: 'yú\'é', audio: '/audio/phone-and-payment/vocab-10.mp3', meaning: { en: 'balance', fr: 'solde' }, explanation: { en: 'Check your 余额 to know how much credit you have left.', fr: 'Vérifie ton 余额 pour savoir combien de crédit il te reste.' } },
```

- [ ] **Step 3: Append 1 pronunciation, 2 hanzi, practices, cards**

```ts
// pronunciation[1]
{ id: 'phone-and-payment-pronunciation-2', focus: { en: 'ch vs zh contrast: 充 vs 重', fr: 'Contraste ch vs zh : 充 vs 重' }, audioText: '充值不是重置', audio: '/audio/phone-and-payment/pronunciation-02.mp3', tip: { en: '充值 (chōngzhí top-up) vs 重置 (chóngzhì reset) — different initial sounds, different meanings.', fr: '充值 (chōngzhí recharger) vs 重置 (chóngzhì réinitialiser) — sons initiaux différents, sens différents.' }, explanation: { en: 'The ch/zh contrast avoids mixing up topping up with resetting.', fr: 'Le contraste ch/zh évite de confondre recharger et réinitialiser.' } },
// hanzi[4], hanzi[5]
{ id: 'phone-and-payment-hanzi-5', hanzi: '充', pinyin: 'chōng', meaning: { en: 'fill / charge', fr: 'remplir / charger' }, explanation: { en: 'Recognize 充 in 充值, the top-up word.', fr: 'Reconnais 充 dans 充值, le mot pour recharger.' } },
{ id: 'phone-and-payment-hanzi-6', hanzi: '信', pinyin: 'xìn', meaning: { en: 'message / trust', fr: 'message / confiance' }, explanation: { en: 'Recognize 信 in 微信, WeChat.', fr: 'Reconnais 信 dans 微信, WeChat.' } },
// listening[1], speaking[1], reading[1]
{ id: 'phone-and-payment-listening-2', prompt: { en: 'Which phrase asks about data plans?', fr: 'Quelle phrase demande les forfaits data ?' }, target: '有什么流量套餐？', audio: '/audio/phone-and-payment/practice-listening-02.mp3', explanation: { en: '有什么流量套餐 helps you compare phone plan options.', fr: '有什么流量套餐 t\'aide à comparer les forfaits téléphoniques.' } },
{ id: 'phone-and-payment-speaking-2', prompt: { en: 'Ask how to top up your phone.', fr: 'Demande comment recharger ton téléphone.' }, target: '怎么充值？', audio: '/audio/phone-and-payment/practice-speaking-02.mp3', explanation: { en: '怎么充值 is the fastest way to ask about adding credit.', fr: '怎么充值 est la façon la plus rapide de demander comment ajouter du crédit.' } },
{ id: 'phone-and-payment-reading-2', prompt: { en: 'Match the payment app name.', fr: 'Associe le nom de l\'appli de paiement.' }, target: '微信', audio: '/audio/phone-and-payment/practice-reading-02.mp3', explanation: { en: '微信 is the most important app name to recognize in China.', fr: '微信 est le nom d\'application le plus important à reconnaître en Chine.' } },
// 3 new review cards
{ id: 'phone-and-payment-review-4', front: '流量', back: { en: 'mobile data', fr: 'données mobiles' }, explanation: { en: 'The word for mobile data.', fr: 'Le mot pour les données mobiles.' } },
{ id: 'phone-and-payment-review-5', front: '充值', back: { en: 'top up / recharge', fr: 'recharger' }, explanation: { en: 'How to add credit to your phone.', fr: 'Comment ajouter du crédit à ton téléphone.' } },
{ id: 'phone-and-payment-review-6', front: '微信', back: { en: 'WeChat', fr: 'WeChat' }, explanation: { en: 'The essential messaging and payment app.', fr: 'L\'application essentielle de messagerie et de paiement.' } },
```

---

### Task 7: Update course.test.ts

**Files:** Modify `src/content/course.test.ts`

- [ ] **Step 1: Update the uniform assertion loop (lines 132-142) to add batch 1 exceptions**

Replace the `if (lesson.id === 'self-intro')` block:

```ts
const expandedCounts: Record<string, Record<string, number>> = {
  'self-intro': { dialogue: 10, patterns: 5, vocab: 11, pronunciation: 2, hanzi: 6, practice: 2, cards: 6 },
  'ask-directions': { dialogue: 8, patterns: 5, vocab: 10, pronunciation: 2, hanzi: 6, practice: 2, cards: 6 },
  'order-food': { dialogue: 8, patterns: 5, vocab: 10, pronunciation: 2, hanzi: 6, practice: 2, cards: 6 },
  'phone-and-payment': { dialogue: 8, patterns: 5, vocab: 10, pronunciation: 2, hanzi: 6, practice: 2, cards: 6 },
}

for (const lesson of course.lessons) {
  const counts = expandedCounts[lesson.id]
  if (counts) {
    expect(lesson.dialogue.lines).toHaveLength(counts.dialogue)
    expect(lesson.sentencePatterns).toHaveLength(counts.patterns)
    expect(lesson.vocabulary).toHaveLength(counts.vocab)
    expect(lesson.pronunciation).toHaveLength(counts.pronunciation)
    expect(lesson.hanziRecognition).toHaveLength(counts.hanzi)
    expect(lesson.practice.listening).toHaveLength(counts.practice)
    expect(lesson.practice.speaking).toHaveLength(counts.practice)
    expect(lesson.practice.reading).toHaveLength(counts.practice)
    expect(lesson.reviewCards).toHaveLength(counts.cards)
    expect(lesson.shortInput.audio).toMatch(/^\/audio\//)
  } else {
    expect(lesson.dialogue.lines).toHaveLength(5)
    expect(lesson.sentencePatterns).toHaveLength(3)
    expect(lesson.vocabulary).toHaveLength(5)
    expect(lesson.pronunciation).toHaveLength(1)
    expect(lesson.hanziRecognition).toHaveLength(4)
    expect(lesson.practice.listening).toHaveLength(1)
    expect(lesson.practice.speaking).toHaveLength(1)
    expect(lesson.practice.reading).toHaveLength(1)
    expect(lesson.reviewCards).toHaveLength(3)
    expect(lesson.shortInput.audio).toMatch(/^\/audio\//)
  }
}
```

- [ ] **Step 2: Update the MP3 audio count (line 320)**

`audioPaths).toHaveLength(199)` → `audioPaths).toHaveLength(239)`

(如果实际计数不同，运行测试根据失败消息调整)

- [ ] **Step 3: Add new self-intro paths to the skip set in the MP3 test**

Add the batch 1 new audio paths to the `newSelfIntroPaths` set (rename to `newAudioPaths`):

```ts
const newAudioPaths = new Set([
  // selfIntro new paths (existing)
  '/audio/self-intro/line-02.mp3', '/audio/self-intro/line-04.mp3', '/audio/self-intro/line-05.mp3',
  '/audio/self-intro/pattern-04.mp3', '/audio/self-intro/pattern-05.mp3',
  '/audio/self-intro/vocab-06.mp3', '/audio/self-intro/vocab-07.mp3', '/audio/self-intro/vocab-08.mp3',
  '/audio/self-intro/vocab-09.mp3', '/audio/self-intro/vocab-10.mp3', '/audio/self-intro/vocab-11.mp3',
  '/audio/self-intro/pronunciation-02.mp3',
  '/audio/self-intro/practice-listening-02.mp3', '/audio/self-intro/practice-speaking-02.mp3', '/audio/self-intro/practice-reading-02.mp3',
  '/audio/self-intro/short-input-02.mp3',
  // askDirections new paths (skip files that don't exist yet)
  '/audio/ask-directions/line-06.mp3', '/audio/ask-directions/line-07.mp3', '/audio/ask-directions/line-08.mp3',
  '/audio/ask-directions/pattern-04.mp3', '/audio/ask-directions/pattern-05.mp3',
  '/audio/ask-directions/vocab-06.mp3', '/audio/ask-directions/vocab-07.mp3', '/audio/ask-directions/vocab-08.mp3',
  '/audio/ask-directions/vocab-09.mp3', '/audio/ask-directions/vocab-10.mp3',
  '/audio/ask-directions/pronunciation-02.mp3',
  '/audio/ask-directions/practice-listening-02.mp3', '/audio/ask-directions/practice-speaking-02.mp3', '/audio/ask-directions/practice-reading-02.mp3',
  // orderFood new paths
  '/audio/order-food/line-06.mp3', '/audio/order-food/line-07.mp3', '/audio/order-food/line-08.mp3',
  '/audio/order-food/pattern-04.mp3', '/audio/order-food/pattern-05.mp3',
  '/audio/order-food/vocab-06.mp3', '/audio/order-food/vocab-07.mp3', '/audio/order-food/vocab-08.mp3',
  '/audio/order-food/vocab-09.mp3', '/audio/order-food/vocab-10.mp3',
  '/audio/order-food/pronunciation-02.mp3',
  '/audio/order-food/practice-listening-02.mp3', '/audio/order-food/practice-speaking-02.mp3', '/audio/order-food/practice-reading-02.mp3',
  // phoneAndPayment new paths
  '/audio/phone-and-payment/line-06.mp3', '/audio/phone-and-payment/line-07.mp3',
  '/audio/phone-and-payment/line-08.mp3',
  '/audio/phone-and-payment/pattern-04.mp3', '/audio/phone-and-payment/pattern-05.mp3',
  '/audio/phone-and-payment/vocab-06.mp3', '/audio/phone-and-payment/vocab-07.mp3', '/audio/phone-and-payment/vocab-08.mp3',
  '/audio/phone-and-payment/vocab-09.mp3', '/audio/phone-and-payment/vocab-10.mp3',
  '/audio/phone-and-payment/pronunciation-02.mp3',
  '/audio/phone-and-payment/practice-listening-02.mp3', '/audio/phone-and-payment/practice-speaking-02.mp3', '/audio/phone-and-payment/practice-reading-02.mp3',
])
```

Replace `newSelfIntroPaths` variable name with `newAudioPaths` and update the skip condition from `if (newSelfIntroPaths.has(audioPath))` to `if (newAudioPaths.has(audioPath))`.

Also update:
- Replaced line 234: `lesson.dialogue.lines.map((line) => line.id)).toEqual(Array.from({ length: 7 },...))` for selfIntro check is already updated from prior work. No change needed here for batch 1.
- The `expectedArrivalChinese` array and the immigration test are already updated. No further change needed.

---

### Task 9: Generate audio files for selfIntro (backfill ~17 MP3)

**Files:** Create files in `public/audio/self-intro/`

Use macOS `say -v Tingting` (zh_CN female) + `lame` for MP3 encoding. Output: MPEG ADTS, layer III, v2, 48kbps, 24kHz, Mono — matches existing files.

- [ ] **Step 1: Generate dialogue audio for new/renumbered selfIntro lines**

```bash
AUDIO_DIR="public/audio/self-intro"
mkdir -p "$AUDIO_DIR"

# Line 02 (new - Officer)
say -v Tingting "您好。请出示您的护照。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/line-02.mp3"

# Line 04 (new - Officer)
say -v Tingting "您来中国做什么？您打算停留多久？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/line-04.mp3"

# Line 05 (new - Traveler)
say -v Tingting "我是来旅游的，大概两个星期。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/line-05.mp3"

# Lines 06-10 (renumbered from old 03-07) — regenerate with same content at new paths
say -v Tingting "请问行李提取处在哪里？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/line-06.mp3"
say -v Tingting "我的行李还没到。请问问询台在哪里？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/line-07.mp3"
say -v Tingting "请问出口在哪里？请问出租车在哪里？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/line-08.mp3"
say -v Tingting "我想去这个地址。请到这里。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/line-09.mp3"
say -v Tingting "大概需要多久？大概多少钱？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/line-10.mp3"
```

- [ ] **Step 2: Generate pattern, vocab, pronunciation, practice, short-input audio**

```bash
# Patterns 04-05
say -v Tingting "我是来旅游的。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/pattern-04.mp3"
say -v Tingting "我打算停留两个星期。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/pattern-05.mp3"

# Vocab 06-11
say -v Tingting "海关" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/vocab-06.mp3"
say -v Tingting "入境" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/vocab-07.mp3"
say -v Tingting "旅游" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/vocab-08.mp3"
say -v Tingting "停留" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/vocab-09.mp3"
say -v Tingting "星期" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/vocab-10.mp3"
say -v Tingting "指纹" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/vocab-11.mp3"

# Pronunciation 02
say -v Tingting "我是来旅游的。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/pronunciation-02.mp3"

# Practice listening/speaking/reading 02
say -v Tingting "我是来旅游的。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/practice-listening-02.mp3"
say -v Tingting "我是来旅游的，大概两个星期。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/practice-speaking-02.mp3"
say -v Tingting "海关" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/practice-reading-02.mp3"

# Short input 02
say -v Tingting "我是来旅游的。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AUDIO_DIR/short-input-02.mp3"
```

Expected: 17 new MP3 files in `public/audio/self-intro/`.

- [ ] **Step 3: Remove selfIntro paths from MP3 test skip set**

In `course.test.ts`, remove all `/audio/self-intro/` entries from `newAudioPaths` (now `newBatch1AudioPaths`). The files now exist and should pass `existsSync`.

---

### Task 10: Generate batch 1 audio files (~13 per lesson)

**Files:** Create files in `public/audio/ask-directions/`, `public/audio/order-food/`, `public/audio/phone-and-payment/`

- [ ] **Step 1: askDirections audio (~13 new MP3)**

```bash
AD="public/audio/ask-directions"
mkdir -p "$AD"

# Renumbered lines 06-07 (old content at new paths)
say -v Tingting "大概多久到？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/line-06.mp3"
say -v Tingting "四十分钟左右。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/line-07.mp3"

# New lines 04, 05, 08
say -v Tingting "请打表。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/line-04.mp3"
say -v Tingting "好的，打表。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/line-05.mp3"
say -v Tingting "多少钱？可以扫码吗？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/line-08.mp3"

# Patterns, vocab, pronunciation, practice
say -v Tingting "请打表。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/pattern-04.mp3"
say -v Tingting "可以扫码吗？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/pattern-05.mp3"
say -v Tingting "打表" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/vocab-06.mp3"
say -v Tingting "二维码" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/vocab-07.mp3"
say -v Tingting "扫码" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/vocab-08.mp3"
say -v Tingting "发票" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/vocab-09.mp3"
say -v Tingting "高速" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/vocab-10.mp3"
say -v Tingting "师傅，是否走高速？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/pronunciation-02.mp3"
say -v Tingting "请打表。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/practice-listening-02.mp3"
say -v Tingting "请打表。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/practice-speaking-02.mp3"
say -v Tingting "可以扫码吗？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$AD/practice-reading-02.mp3"
```

- [ ] **Step 2: orderFood audio (~13 new MP3)**

```bash
OD="public/audio/order-food"
mkdir -p "$OD"

say -v Tingting "WiFi密码是多少？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/line-06.mp3"
say -v Tingting "在这里，早餐是早上七点到九点。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/line-07.mp3"
say -v Tingting "需要押金吗？几点退房？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/line-08.mp3"
say -v Tingting "WiFi密码是多少？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/pattern-04.mp3"
say -v Tingting "需要押金吗？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/pattern-05.mp3"
say -v Tingting "WiFi密码" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/vocab-06.mp3"
say -v Tingting "早餐" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/vocab-07.mp3"
say -v Tingting "押金" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/vocab-08.mp3"
say -v Tingting "退房" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/vocab-09.mp3"
say -v Tingting "电梯" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/vocab-10.mp3"
say -v Tingting "房卡，退房，放在这里" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/pronunciation-02.mp3"
say -v Tingting "WiFi密码是多少？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/practice-listening-02.mp3"
say -v Tingting "几点退房？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/practice-speaking-02.mp3"
say -v Tingting "押金" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$OD/practice-reading-02.mp3"
```

- [ ] **Step 3: phoneAndPayment audio (~12 new MP3)**

```bash
PP="public/audio/phone-and-payment"
mkdir -p "$PP"

say -v Tingting "有什么流量套餐？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/line-05.mp3"
say -v Tingting "有10G和30G的，你要哪个？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/line-06.mp3"
say -v Tingting "怎么充值？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/line-07.mp3"
say -v Tingting "好的，谢谢。" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/line-08.mp3"
say -v Tingting "有什么流量套餐？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/pattern-04.mp3"
say -v Tingting "怎么充值？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/pattern-05.mp3"
say -v Tingting "流量" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/vocab-06.mp3"
say -v Tingting "套餐" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/vocab-07.mp3"
say -v Tingting "充值" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/vocab-08.mp3"
say -v Tingting "微信" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/vocab-09.mp3"
say -v Tingting "余额" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/vocab-10.mp3"
say -v Tingting "充值不是重置" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/pronunciation-02.mp3"
say -v Tingting "有什么流量套餐？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/practice-listening-02.mp3"
say -v Tingting "怎么充值？" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/practice-speaking-02.mp3"
say -v Tingting "微信" -o /tmp/tmp.aiff && lame -b 48 --resample 24 -m m /tmp/tmp.aiff "$PP/practice-reading-02.mp3"
```

---

### Task 11: Update MP3 test after audio generation

**Files:** Modify `src/content/course.test.ts`

After all audio files are generated, the MP3 test skip set is no longer needed. Simplify:

- [ ] **Step 1: Remove the skip set** — delete `newAudioPaths` / `newBatch1AudioPaths` entirely, remove the `if (newAudioPaths.has(audioPath)) continue` block.

- [ ] **Step 2: Update total count** — `239` should now be the correct passing value. Run the test to confirm.

```bash
npm run test -- --run src/content/course.test.ts
```

Expected: PASS (all audio paths now have valid MP3 files).

---

### Task 12: Full verification

**Files:** N/A (verification only)

- [ ] **Step 1: Run focused tests**

```bash
npm run test -- --run src/content/course.test.ts
```

Expected: PASS (course content assertions updated for batch 1).

- [ ] **Step 2: Run full test suite**

```bash
npm run test -- --run
npm run lint
npm run build
```

Expected: All pass.

- [ ] **Step 3: Browser smoke**

Visit dev server, verify each of 3 lessons renders correctly with expanded content.

---

## Scope Confirmation Checklist

- [ ] 3 lesson files (`askDirections.ts`, `orderFood.ts`, `phoneAndPayment.ts`) expanded to target density
- [ ] `course.test.ts` uniform assertion loop updated with lookup table
- [ ] MP3 test count updated (199→241) and new paths added to skip set
- [ ] All lesson IDs unchanged
- [ ] No changes to types.ts, course.ts, journey.ts, router, components, CSS
- [ ] All new content has en/fr bilingual coverage
- [ ] Audio files generated for all new/renumbered paths (selfIntro ~17 + Batch 1 ~39)

## Delivery

- **Branch:** `feature/t51-batch1-course-expansion` from `origin/main`
- **Verification:** Vitest full suite, lint, build, E2E
- **Caveats:** shortInput unchanged (type constraint); audio generated via `say -v Tingting` + `lame`
- **Gate:** review; reviewer publishes pass/fix required
- **Next owner:** reviewer → planner merge deploy
