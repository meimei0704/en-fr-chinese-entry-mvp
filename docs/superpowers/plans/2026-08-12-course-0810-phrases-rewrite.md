# Course 0810 Phrases Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 Dylan 0810 完整原文**逐句完全替换** 10 门课的 Phrases（dialogue）区块，并从新 phrases 中提炼生成新的 Useful patterns（句型模板），同步音频/seed/断言后发布生产并三方验证。

**Architecture:** 数据模型不变（`dialogue.lines` 即 UI 上的 Phrases 区块，speaker 统一为 Traveler，与 daily-greetings 同款纯短语列表样式）。每课 `dialogue.lines` 全部替换为 0810 原文逐句；`sentencePatterns` 从新 phrases 中提炼模板（每课约 5~8 条，pattern=带槽位模板，example=具体原句）。音频：同句文案复用上一轮已生成且线上 sha1 逐字节一致的 `pattern-*.mp3` 复制为 `line-NN.mp3`，仅缺句用 edge-tts 生成。seed 用 `scripts/export-course-json.mjs` + `pkg/seedgen` 重生成；生产 MySQL 走 draft→publish 语义发布。

**Tech Stack:** TypeScript / Vite SSR、Go (seedgen)、MySQL contentstore、edge-tts (python)、Vitest。

**Scope (10 门课，Phrases 完全替换):**
- ask-directions（11 句）、order-food（14 句）、phone-and-payment（9 句）、restaurant-order（14 句）、train-station-ticket（12 句）、metro-ticket（9 句）、convenience-store-run（14 句）、ask-for-help-problem（16 句）、pharmacy-help（13 句）、small-talk（13 句）＝ **125 句 phrases**
- daily-greetings / self-intro **不动**（它们已是完整短语列表，不在 0810 任务范围）
- **验收基准（reviewer 已确认）**：① 每课 Phrases 区块逐句覆盖 0810 原文（硬标准，逐句比对）② 每条 pattern 的 example 能从该课 phrases 中找到原句（派生一致性），pattern 槽位模板用于 UI 展示

---

## Data source

Dylan 0810 完整原文（中文 + 官方英文翻译）逐课清单（每课 = phrases 内容，编号即行序）：

**ask-directions（打车）11 句**
1. 师傅您好，我要去这里。Hello, please go to this place.
2. 这是地址。This is the address.
3. 请打表。Please use the meter.
4. 大概多久到？How long will it take?
5. 可以开空调吗? Could you please turn on the air-conditioner?
6. 请开慢一点。Slow down please.
7. 麻烦停下车。Please stop the car.
8. 一共多少钱？How much is it?
9. 怎么支付呢？How should I pay?
10. 可以用微信/支付宝吗？Can I use WeChat Pay / Alipay?
11. 请给我发票。Receipt, please.

**order-food（酒店入住）14 句**
1. 您好，我要办理入住。Hello, I want to check in.
2. 你会说英文吗？Do you speak English?
3. 我已经预订了。I have a reservation.
4. 这是我的护照。Here is my passport.
5. Wi-Fi密码是多少？What is the Wi-Fi password?
6. 几点吃早餐？What time is breakfast?
7. 电梯在哪里？Where is the elevator?
8. 我需要更多毛巾。I need more towels.
9. 空调坏了。The air conditioner does not work.
10. 我的房卡丢了。I lost my room key.
11. 请打扫房间。Please clean my room.
12. 我可以寄存行李吗？Can I store my luggage?
13. 需要押金吗？Is a deposit needed?
14. 几点退房？What time is checkout?

**phone-and-payment（中国电话卡）9 句**
1. 我要买一个 SIM 卡。I want to buy a SIM card.
2. 能帮我安装一下吗？Please help me install it.
3. 我需要流量。I need mobile data.
4. 这个套餐有多少流量？How much data does this plan have?
5. 多少钱？How much is it?
6. 怎么充值？How do I top up?
7. 帮我设置一下网络好吗？Could you help me set up the Internet?
8. 没有网络。There is no internet.
9. 没有信号。There is no signal.

**restaurant-order（点餐）14 句**
1. 服务员！Waiter!
2. 请给我菜单。Can I have the menu please.
3. 可以点餐了吗？Can I order now?
4. 我要这个。I want this one.
5. 我要一碗面条。A bowl of noodles, please.
6. 来一碗米饭。A bowl of rice, please.
7. 请给我一杯水。Please give me a glass of water.
8. 不要辣。No spicy, please.
9. 微辣。Mildly spicy.
10. 我对花生过敏。I am allergic to peanuts.
11. 我是素食主义者。I am vegetarian.
12. 您好，结账。Check, please.
13. 我吃饱了。I am full.
14. 可以打包带走吗？Could you pack it for takeaway?

**train-station-ticket（坐火车）12 句**
1. 火车站在哪里？Where is the train station?
2. 售票处在哪里？Where is the ticket office?
3. 我要一张去[北京]的票。I want to buy one ticket to [Beijing].
4. 这是我的护照。This is my passport.
5. 火车几点开？What time does the train leave?
6. 餐车在哪里？Where is the dining car?
7. 火车晚点了吗？Is the train delayed?
8. 请问怎么换乘？How do I make a transit?
9. 我误车了。I missed my train.
10. 我没赶上火车。I missed my train. (Dylan 官方译文，原文「我误车了。/我没赶上火车。」共享此译文)
11. 能改签下一辆车吗？Can I change my ticket for a later train?
12. 如何退票退款呢？How can I get ticket cancellation and refund?

**metro-ticket（坐地铁）9 句**
1. 请问地铁站在哪里？Excuse me, where is the subway station?
2. 在哪儿买票？Where can I buy a ticket?
3. 您好，我要一张票。Hello, I want to buy a ticket.
4. 我要去天安门广场。To Tiananmen Square, please.
5. 自动售票机怎么用？Could you show me how to use the ticket vending machine?
6. 请问在哪儿换乘？Where do I make a transfer?
7. 我要去这里。I want to go to this place.
8. 是这个方向吗？Is this the right direction?
9. 请问，哪个出口去？Which exit should I take?

**convenience-store-run（购物）14 句**
1. 这个多少钱? How much is this?
2. 太贵了。It's too expensive.
3. 可以便宜一点吗? Can you make it cheaper?
4. 我只是看看。I am just looking.
5. 有别的颜色吗? Do you have other colors?
6. 我可以试试吗？Can I try it on?
7. 试衣间在哪里? Where is the fitting room?
8. 有大号/小号吗? Do you have a large/small size?
9. 我买这个。I will buy this.
10. 有袋子吗? Do you have a bag?
11. 你好，我要一瓶水。A bottle of water please.
12. 一共多少钱? How much is it?
13. 可以刷卡吗? Can I swipe a card?
14. 我用微信支付 / 支付宝。I will use WeChat Pay / Alipay.

**ask-for-help-problem（寻求帮助）16 句**
1. 请问，你可以帮我吗？Excuse me, can you help me?
2. 我护照丢了。I lost my passport.
3. 请说慢一点。Please speak slower.
4. 我听不懂。I don't understand.
5. 我手机没电了。My phone is dead.
6. 请问哪里可以给手机充电？Where can I charge my phone?
7. 您好，共享单车怎么用？How do I use the shared bike?
8. 能帮我一个忙吗？Could you do me a favor?
9. 麻烦你了。Sorry to trouble you.
10. 救命！Help!
11. 我迷路了。I am lost.
12. 请给警察打电话。Please call the police.
13. 卫生间在哪里？Where is the toilet?
14. 打扰一下,请问最近的便利店在哪里? Excuse me, where is the nearest convenience store?
15. 我的手机不见了。I lost my phone.
16. 我的钱包不见了。I lost my wallet.

**pharmacy-help（买药看医生）13 句**
1. 请问哪里有医院？Where is the hospital?
2. 我要挂号。I want to register.
3. 我头痛。I have a headache.
4. 我发烧了。I have a fever.
5. 我感冒了。I have a cold.
6. 我肚子疼。I have a stomachache.
7. 我拉肚子了。I have diarrhea.
8. 谢谢医生。谢谢护士。Thank you doctor. Thank you nurse.
9. 请问去哪里结账？Where do I pay?
10. 去哪里取药？Where do I pick up the medicine?
11. 我想买药。I want to buy medicine.
12. 饭前吃还是饭后吃？Should I take it before or after meals?
13. 多少钱？How much is it?

**small-talk（闲聊和赞美）13 句**
1. 今天天气很好。The weather is nice today.
2. 今天天气好冷啊。The weather is cold today.
3. 你好吗？How are you?
4. 你从哪里来的？Where are you from?
5. 你穿衣真好看. I like your outfit.
6. 你太幽默了. You are so funny.
7. 你太棒了！You're amazing!
8. 你真了不起！You're incredible.
9. 你的皮肤很好！Your skin looks great.
10. 你太热情了。You are so warm-hearted.
11. 你太乐于助人了.You are kind-hearted and helpful.
12. 你们这里的东西很好吃。Your food is just amazing.
13. 祝你玩得开心！再见！Enjoy your stay! Goodbye

---

## File Structure

- Modify: `src/content/lessons/{askDirections,orderFood,phoneAndPayment,restaurantOrder,trainStationTicket,metroTicket,convenienceStoreRun,askForHelpProblem,pharmacyHelp,smallTalk}.ts` — dialogue.lines 全量替换 + sentencePatterns 精简为模板
- Modify: `src/content/course.test.ts:124-135` — counts（dialogue 行数、patterns 数、行 id 断言）
- Modify: `src/admin/voiceTargets.test.ts`、`src/admin/AdminVoiceGenerationPage.test.tsx`（如存在行音频断言）— 音频目标数
- Modify: `scripts/compare-content-api.mjs`（如硬编码行数，复核时用）
- Regenerate: `pkg/seedgen/data/course.json`、`db/seeds/0001_initial_content_admin.sql`、`pkg/seedgen/data/*`（seedgen 测试相关快照如存在）
- Audio: `public/audio/<lesson>/{line-NN.mp3}`（复用/生成）、清理不再引用的旧行音频
- Create: 一次性音频映射脚本（放 `/tmp`，不入库）

---

## Branch / Worktree

- 当前工作树 HEAD detached at `66afe63`（= origin/main）。新建分支 `feat/course-phrases-0810` 并切过去再开工。

```bash
cd ~/.loop/agents/agt_hncr9qn6srtnyv/worktrees/en-fr-chinese-entry-mvp-0810
git checkout -b feat/course-phrases-0810
```

---

## Task 1: 一次性生成 audio 复用映射脚本（/tmp，不入库）

**Files:**
- Create: `/tmp/phrases-audio-map.mjs`（临时，不入库）

- [ ] **Step 1: 确认每课 line-NN.mp3 与 pattern-NN.mp3 的文案对应**

```bash
cd ~/.loop/agents/agt_hncr9qn6srtnyv/worktrees/en-fr-chinese-entry-mvp-0810
python3 -c "import edge_tts; print('ok')"
```

- [ ] **Step 2: 生成映射脚本**（核心逻辑：对每课每条 phrase 中文，若在已有 `pattern-*.mp3` 的 example/pattern 文案中找到完全一致者 → 复制该 mp3 为 `line-NN.mp3`；找不到 → 标记 `NEED_TTS`）

```js
// /tmp/phrases-audio-map.mjs —— 由 coder 落地，按 Task 3 的 dialogue.lines 实际数据驱动
// 输出三张清单：复用列表（src pattern-NN -> dst line-NN）、NEED_TTS 列表、废弃行音频列表
```

- [ ] **Step 3: 运行并保存结果**（供 Task 3/4 使用）

```bash
node /tmp/phrases-audio-map.mjs > /tmp/phrases-audio-map.txt
cat /tmp/phrases-audio-map.txt
```

Expected: 大部分（≈110+）直接复用，少量（如「需要押金吗」「你太棒了」等新句）标记 NEED_TTS。

---

## Task 2: 建立每课 phrases 内容（dialogue.lines 全量替换）

**Files:**
- Modify: `src/content/lessons/askDirections.ts`（以及其余 9 课同类文件）
- Test: `src/content/course.test.ts`

替换规则（每课一致）：
- `dialogue.title`：保留原课程的 dialogue title（双语）——如 order-food 保留「Check in at the front desk / Faire le check-in à la réception」
- `dialogue.lines`：**全部替换**为 0810 原文逐句（含上面 Data source 的全部句子）
- 每行字段：`id` = `<lesson-id>-line-<NN>`（NN 从 01 起，与 Data source 编号一致）；`speaker` = `{ en: 'Traveler', fr: 'Voyageur' }`；`hanzi` = 中文原句（标点按 Dylan 原文）；`pinyin` = 手工正确标注；`translation` = `{ en: <官方英文>, fr: <法语> }`；`explanation` = `{ en, fr }` 简短使用说明（风格对齐现有课程）；`audio` = `/audio/<lesson>/line-NN.mp3`

- [ ] **Step 1: 编写失败测试**（在 `src/content/course.test.ts` 更新 counts 为每课 dialogue 行数=Data source 句数，patterns 数暂填目标模板数）

```ts
const expandedCounts: Record<string, { dialogue: number; patterns: number; vocab: number; practice: number; cards: number }> = {
  // ... 保留 daily-greetings / self-intro
  'ask-directions': { dialogue: 11, patterns: 6, vocab: 10, practice: 2, cards: 6 },
  'order-food': { dialogue: 14, patterns: 7, vocab: 10, practice: 2, cards: 6 },
  'phone-and-payment': { dialogue: 9, patterns: 5, vocab: 10, practice: 2, cards: 6 },
  'restaurant-order': { dialogue: 14, patterns: 7, vocab: 10, practice: 2, cards: 6 },
  'train-station-ticket': { dialogue: 12, patterns: 5, vocab: 15, practice: 2, cards: 6 },
  'metro-ticket': { dialogue: 9, patterns: 5, vocab: 14, practice: 2, cards: 6 },
  'convenience-store-run': { dialogue: 14, patterns: 6, vocab: 10, practice: 2, cards: 6 },
  'ask-for-help-problem': { dialogue: 16, patterns: 7, vocab: 10, practice: 2, cards: 6 },
  'pharmacy-help': { dialogue: 13, patterns: 6, vocab: 11, practice: 2, cards: 6 },
  'small-talk': { dialogue: 13, patterns: 7, vocab: 10, practice: 2, cards: 6 },
}
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm test -- src/content/course.test.ts 2>&1 | tail -20
```
Expected: dialogue 行数断言失败（当前仍是 8）。

- [ ] **Step 3: 逐课替换 dialogue.lines**（以 order-food 为模板给出完整示范；其余 9 课同构）

```ts
dialogue: {
  title: {
    en: 'Check in at the front desk',
    fr: 'Faire le check-in à la réception',
  },
  lines: [
    {
      id: 'order-food-line-01',
      speaker: { en: 'Traveler', fr: 'Voyageur' },
      hanzi: '您好，我要办理入住。',
      pinyin: 'Nín hǎo, wǒ yào bànlǐ rùzhù.',
      translation: { en: 'Hello, I want to check in.', fr: 'Bonjour, je veux faire le check-in.' },
      explanation: {
        en: 'Use this as your first front desk sentence to start the check-in.',
        fr: 'Utilise cette phrase comme première phrase à la réception pour commencer le check-in.',
      },
      audio: '/audio/order-food/line-01.mp3',
    },
    // ... 逐句按 Data source 编号 02..14，hanzi 严格用 Dylan 原文，translation.en 严格用官方英文
  ],
},
```

注意：pinyin 必须人工精确标注（含声调、间隔、标点处理），不得占位。

- [ ] **Step 4: 运行测试验证 dialogue 行数通过**（patterns 断言此时仍失败，属预期）

```bash
npm test -- src/content/course.test.ts 2>&1 | tail -20
```

- [ ] **Step 5: Commit**

```bash
git add src/content/lessons src/content/course.test.ts
git commit -m "feat(content): replace phrases with full 0810 copy per lesson"
```

---

## Task 3: 从 phrases 提炼生成 Useful patterns（sentencePatterns）

**Files:**
- Modify: `src/content/lessons/<lesson>.ts`（10 课）
- Test: `src/content/course.test.ts`

规则：
- 每课从新 phrases 中提炼 **5~8 条句型模板**：`pattern` = 带槽位模板（如「我要去……。」「……在哪里？」「可以……吗？」）；`example` = 该课 phrases 中的**具体原句**（必须能从 dialogue.lines.hanzi 精确匹配）；`meaning` / `explanation` 双语；`audio` = 对应原句的 `pattern-NN.mp3`（上一轮已生成）或 line 音频复制；`id` = `<lesson>-pattern-<N>`
- 定死模板：固定表达（如「救命！」「服务员！」）不入 pattern；通用疑问句/请求句提炼模板
- 每课 pattern 数与 Task 2 的 counts.patterns 一致

- [ ] **Step 1: 失败测试已在 Task 2 就位**（counts.patterns 断言失败中）

- [ ] **Step 2: 提炼并写入 patterns**（order-food 示范，7 条）

```ts
sentencePatterns: [
  { id: 'order-food-pattern-1', pattern: '我要办理入住。', meaning: { en: 'I want to check in.', fr: 'Je veux faire le check-in.' }, example: '您好，我要办理入住。', audio: '/audio/order-food/pattern-01.mp3', explanation: { en: 'First sentence at the front desk.', fr: 'Première phrase à la réception.' } },
  { id: 'order-food-pattern-2', pattern: '你会说英文吗？', meaning: { en: 'Do you speak English?', fr: 'Parlez-vous anglais ?' }, example: '你会说英文吗？', audio: '/audio/order-food/pattern-06.mp3', explanation: { en: 'Ask for help in another language.', fr: 'Demande de l\'aide dans une autre langue.' } },
  { id: 'order-food-pattern-3', pattern: '这是我的……。', meaning: { en: 'Here is my ...', fr: 'Voici mon / ma ...' }, example: '这是我的护照。', audio: '/audio/order-food/pattern-03.mp3', explanation: { en: 'Hand over a document.', fr: 'Présente un document.' } },
  { id: 'order-food-pattern-4', pattern: '……是多少？', meaning: { en: 'What is ...?', fr: 'Quel est ... ?' }, example: 'Wi-Fi密码是多少？', audio: '/audio/order-food/pattern-04.mp3', explanation: { en: 'Ask for a password or number.', fr: 'Demande un mot de passe ou un numéro.' } },
  { id: 'order-food-pattern-5', pattern: '几点……？', meaning: { en: 'What time ...?', fr: 'À quelle heure ... ?' }, example: '几点吃早餐？', audio: '/audio/order-food/pattern-07.mp3', explanation: { en: 'Ask about time.', fr: 'Demande une heure.' } },
  { id: 'order-food-pattern-6', pattern: '……在哪里？', meaning: { en: 'Where is ...?', fr: 'Où est ... ?' }, example: '电梯在哪里？', audio: '/audio/order-food/pattern-08.mp3', explanation: { en: 'Find a place or object.', fr: 'Trouver un lieu ou un objet.' } },
  { id: 'order-food-pattern-7', pattern: '请……。', meaning: { en: 'Please ...', fr: 'S\'il vous plaît ...' }, example: '请打扫房间。', audio: '/audio/order-food/pattern-12.mp3', explanation: { en: 'Polite request.', fr: 'Demande polie.' } },
],
```

其余 9 课参照此模式提炼，**每条 example 必须来自本课 phrases**。

- [ ] **Step 3: 运行测试验证全部 counts 通过**

```bash
npm test -- src/content/course.test.ts 2>&1 | tail -20
```
Expected: 全部 counts（dialogue/patterns/vocab/practice/cards）通过。

- [ ] **Step 4: Commit**

```bash
git add src/content/lessons src/content/course.test.ts
git commit -m "feat(content): derive useful patterns from new phrases"
```

---

## Task 4: 音频（复用 + 生成 + 清理）

**Files:**
- Audio: `public/audio/<lesson>/line-*.mp3`
- Delete: 不再被引用的旧行音频

- [ ] **Step 1: 依据 Task 1 的映射脚本输出执行复制**

```bash
# 以 order-food 为例（实际按 /tmp/phrases-audio-map.txt）
cp public/audio/order-food/pattern-06.mp3 public/audio/order-food/line-02.mp3
# ... 所有可复用项
```

- [ ] **Step 2: 生成 NEED_TTS 音频**（edge-tts，与现有格式一致：zh-CN-XiaoxiaoNeural -8%，MPEG 48kbps/24kHz/mono）

```bash
# 用 python edge-tts 为每条 NEED_TTS 的中文原句生成对应 line-NN.mp3
python3 -c "import edge_tts,asyncio; from pathlib import Path
async def g(t,p):
    c=edge_tts.Communicate(t,'zh-CN-XiaoxiaoNeural',rate='-8%')
    await c.save(p)
asyncio.run(g('需要押金吗？','/tmp/need-tts.mp3'))"
# 检查格式
file /tmp/need-tts.mp3
```

- [ ] **Step 3: 校验所有 dialogue.lines.audio 引用的文件存在**

```bash
node --experimental-strip-types --experimental-specifier-resolution=node -e "
import('./src/content/course.ts').then(({course})=>{const fs=require('fs');let miss=[];
for(const l of course.lessons)for(const ln of l.dialogue.lines)if(!fs.existsSync('public'+ln.audio))miss.push(ln.audio);
console.log('MISSING',miss.length,miss);})"
```

Expected: `MISSING 0`

- [ ] **Step 4: 清理不再引用的旧行音频**（删除 `line-09..` 等被替换的旧对话音频，先确认无引用）

```bash
# 列出 public/audio/<lesson>/*.mp3 中 dialogue.lines 未引用的，人工核对后删除
```

- [ ] **Step 5: 更新音频数量断言并运行相关测试**

```bash
npm test -- src/content/course.test.ts src/admin/voiceTargets.test.ts 2>&1 | tail -20
```

- [ ] **Step 6: Commit**

```bash
git add public/audio
git commit -m "feat(audio): sync line audio for phrases rewrite"
```

---

## Task 5: 重生成 seed 与 course.json

**Files:**
- Regenerate: `pkg/seedgen/data/course.json`
- Regenerate: `db/seeds/0001_initial_content_admin.sql`
- Check: `pkg/seedgen/seedgen_test.go` 快照是否需要同步

- [ ] **Step 1: 重生成 course.json**

```bash
npm run build 2>&1 | tail -3
node scripts/export-course-json.mjs
```

- [ ] **Step 2: 重生成 seed SQL**

```bash
cd pkg/seedgen && go run .  # 或项目既有 seedgen 命令（见 pkg/seedgen/README 或 Makefile，若无则照 seedgen.go 的 main 方式）
```

- [ ] **Step 3: 运行 Go 测试 + TS 全量测试**

```bash
cd pkg/seedgen && go test ./... 2>&1 | tail -10
cd ~/.loop/agents/agt_hncr9qn6srtnyv/worktrees/en-fr-chinese-entry-mvp-0810 && npm test 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add pkg/seedgen/data db/seeds/0001_initial_content_admin.sql
git commit -m "chore(seed): regenerate course json and seed sql after phrases rewrite"
```

---

## Task 6: 全量验证

- [ ] **Step 1: vitest 全量**

```bash
npm test 2>&1 | tail -20
```
Expected: 全绿（如 AdminVoiceGenerationPage 麦克风 flake 单跑确认）。

- [ ] **Step 2: tsc + lint**

```bash
npm run build 2>&1 | tail -5
npm run lint 2>&1 | tail -5
```

- [ ] **Step 3: 独立逐句比对脚本**（owner/reviewer 用）——以 Data source 为基准，对每课 `dialogue.lines.hanzi` 做归一化匹配

```python
# /tmp/verify_phrases.py：读 src/content/lessons/*.ts 或 course.json，逐课断言 0810 原句全部命中 dialogue.lines.hanzi
```

Expected: TOTAL MISSING = 0，逐课 MISSING 全 0。

- [ ] **Step 4: patterns 派生一致性**：断言每条 pattern.example ∈ 该课 dialogue.lines.hanzi（归一化后）

Expected: 100%。

---

## Task 7: 生产发布（draft→publish）

> 复用此前已验证的流程：临时 Vercel Function 内嵌最新 course.json + token 鉴权 + maxDuration 300，走 adminrepo draft→publish 语义（append-only、幂等）。

- [ ] **Step 1: 合入 main 并推送**（Vercel 生产自动部署新 bundle + 静态音频）

```bash
git checkout main && git pull --ff-only origin main
git merge feat/course-phrases-0810
git push origin main
```

- [ ] **Step 2: coder 执行生产 MySQL 发布**（与 0810 上次发布同流程，含 token 鉴权、幂等复跑 changed=0）

- [ ] **Step 3: 清理临时函数/token/临时分支**

- [ ] **Step 4: owner + reviewer 线上 cache-buster 复验**：每课 `/api/content/lessons?lessonId=...`（或 `/api/content/course`）phrases 逐句覆盖 + patterns example 派生一致 + 新 line-NN.mp3 全部 200

---

## Task 8: 交付与验收

- [ ] coder 交付报告（含逐课 phrases/patterns 数量、音频复用/新增清单、测试结果）
- [ ] reviewer 独立复验通过（新基准：phrases 逐句覆盖 + patterns 派生一致）
- [ ] owner 终验线上（cache-buster 实测）
- [ ] 交 @Dylan 验收；feature 分支是否删除按 Dylan 指示

---

## Self-Review

**Spec coverage:** ① 0810 原文逐句完全替换 Phrases(dialogue) ✅ Task 2；② patterns 基于 phrases 生成 ✅ Task 3；③ 音频复用/生成/清理 ✅ Task 4；④ seed/断言 ✅ Task 5；⑤ 生产发布 + 三方验证 ✅ Task 7/8。daily-greetings/self-intro 明确不在范围 ✅。1A（纯短语列表，speaker=Traveler）✅；2A（提炼模板 5~8 条，example 从 phrases 派生）✅ 并写进 Task 3 验收断言。

**Placeholder scan:** 无 TBD/TODO；每课数据以 Data source 清单为真源，pattern 提炼规则具体到字段级。

**Type consistency:** `dialogue.lines[].id` = `<lesson>-line-NN`，`sentencePatterns[].id` = `<lesson>-pattern-N`，audio 路径 `/audio/<lesson>/line-NN.mp3` 与 `pattern-NN.mp3` 全局一致；counts 字段名与 `course.test.ts` 现有 `expandedCounts` 一致。
