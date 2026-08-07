# Batch 1 课程内容扩充设计

> askDirections (打车) / orderFood (入住) / phoneAndPayment (支付)

## 目标

按到达机场课程 (selfIntro) 的扩充标准和经验，对 Batch 1 三课统一扩充内容密度。不改变 lesson ID、TypeScript 类型定义、和后续课程。

## 当前基线

三课结构完全一致，均为统一模板生成：

| 维度 | 当前 |
|------|:---:|
| 对话 | 5 行（双向） |
| 句型 | 3 个 |
| 词汇 | 5 个 |
| 发音 | 1 个 |
| 汉字 | 4 个 |
| 练习 | 1+1+1 |
| 卡片 | 3 张 |
| 短输入 | 1 题 |

## 扩充方案

### 统一密度目标

| 维度 | 当前 | 目标 |
|------|:---:|:---:|
| 对话 | 5 | **8** |
| 句型 | 3 | **5** |
| 词汇 | 5 | **10** |
| 发音 | 1 | **2** |
| 汉字 | 4 | **6** |
| 练习 | 1+1+1 | **2+2+2** |
| 卡片 | 3 | **6** |
| 短输入 | 1 | 1（类型约束）|

---

## askDirections (打车去酒店 / Taxi to your stay)

**id**: `ask-directions`, **pathOrder**: 2

### 对话扩充 (5 → 8 行)

保留现有 5 行双向对话结构，新增 3 行：

| 行号 | 角色 | 内容 | 场景 |
|:---:|------|------|------|
| 01 | Traveler | 师傅，去这个酒店。 | 保留（原 line-01） |
| 02 | Driver | 好的，你给我看一下地址。 | 保留（原 line-02） |
| 03 | Traveler | 在这里。 | 保留（原 line-03） |
| 04 | **Traveler** | **请打表。** | **新增 — 确认打表计价** |
| 05 | Driver | 好的，打表。 | **新增** |
| 06 | Traveler | 大概多久到？ | 保留（原 line-04） |
| 07 | Driver | 四十分钟左右。 | 保留（原 line-05） |
| 08 | **Traveler** | **多少钱？可以扫码吗？** | **新增 — 支付** |

原 line-04~05 重新编号为 line-06~07，原 line-03 之后插入新 line-04~05。

### 句型扩充 (3 → 5 个)

保留现有 3 个句型，新增：

4. **请……** — polite request pattern
   - 例句：请打表。(Please use the meter.)
5. **可以……吗？** — permission / feasibility check
   - 例句：可以扫码吗？(Can I scan to pay?)

### 词汇扩充 (5 → 10 个)

保留现有 5 词，新增 5 个：

| # | 汉字 | 拼音 | 含义 |
|---|------|------|------|
| 6 | 打表 | dǎbiǎo | turn on the meter |
| 7 | 二维码 | èrwéimǎ | QR code |
| 8 | 扫码 | sǎomǎ | scan to pay |
| 9 | 发票 | fāpiào | receipt / invoice |
| 10 | 高速 | gāosù | highway / expressway |

### 发音扩充 (1 → 2 个)

新增：**师傅 vs 是否 的卷舌对比**（shīfu — shìfǒu，舌尖前 vs 卷舌）

### 汉字扩充 (4 → 6 个)

新增：**表**（打表），**码**（扫码）

### 练习 / 卡片扩充

听说读各 1→2 题，复习卡片 3→6 张。新增练习和卡片聚焦新增场景（打表、支付、发票）。

---

## orderFood (酒店入住 / Hotel check-in)

**id**: `order-food`, **pathOrder**: 3

### 对话扩充 (5 → 8 行)

保留现有双向结构（Guest / Front desk），新增 3 行：

| 行号 | 角色 | 内容 | 场景 |
|:---:|------|------|------|
| 01 | Guest | 你好，我有预订。 | 保留 |
| 02 | Front desk | 请问您叫什么名字？ | 保留 |
| 03 | Guest | 我叫 Alex。 | 保留 |
| 04 | Front desk | 请出示护照。 | 保留 |
| 05 | Front desk | 好的，这是您的房卡。 | 保留 |
| 06 | **Guest** | **WiFi密码是多少？** | **新增** |
| 07 | **Front desk** | **在这里，早餐是早上七点到九点。** | **新增 — WiFi + 早餐** |
| 08 | **Guest** | **需要押金吗？几点退房？** | **新增 — 押金 + 退房** |

新 line-06~08 追加在现有 5 行之后。

### 句型扩充 (3 → 5 个)

保留现有 3 个句型，新增：

4. **……是多少？** — asking for numerical info
   - 例句：WiFi密码是多少？
5. **需要……吗？** — asking if something is required
   - 例句：需要押金吗？

### 词汇扩充 (5 → 10 个)

保留现有 5 词，新增 5 个：

| # | 汉字 | 拼音 | 含义 |
|---|------|------|------|
| 6 | WiFi密码 | WiFi mìmǎ | WiFi password |
| 7 | 早餐 | zǎocān | breakfast |
| 8 | 押金 | yājīn | deposit |
| 9 | 退房 | tuìfáng | check-out |
| 10 | 电梯 | diàntī | elevator |

### 发音扩充 (1 → 2 个)

新增：**房 vs 放 的声调对比**（fáng — fàng，第二声 vs 第四声）

### 汉字扩充 (4 → 6 个)

新增：**早**（早餐），**金**（押金）

---

## phoneAndPayment (手机支付 / Phone & payment)

**id**: `phone-and-payment`, **pathOrder**: 4

### 对话扩充 (5 → 8 行)

保留现有双向结构（Traveler / Clerk），新增 3 行：

| 行号 | 角色 | 内容 | 场景 |
|:---:|------|------|------|
| 01 | Traveler | 你好，我想办一张手机卡。 | 保留 |
| 02 | Clerk | 好的，请出示护照。 | 保留 |
| 03 | Traveler | 这个号码可以用来支付吗？ | 保留 |
| 04 | Clerk | 可以，也可以先用现金。 | 保留 |
| 05 | **Traveler** | **有什么流量套餐？** | **新增 — 流量选择** |
| 06 | **Clerk** | **有10G和30G的，你要哪个？** | **新增** |
| 07 | **Traveler** | **怎么充值？** | **新增 — 充值** |
| 08 | Traveler | 好的，谢谢。 | 保留（原 line-05） |

原 line-05 重新编号为 line-08，新 line-05~07 插入在 line-04 之后。

### 句型扩充 (3 → 5 个)

保留现有 3 个句型，新增：

4. **有什么……？** — asking for available options
   - 例句：有什么流量套餐？
5. **怎么……？** — asking how to do something
   - 例句：怎么充值？

### 词汇扩充 (5 → 10 个)

保留现有 5 词，新增 5 个：

| # | 汉字 | 拼音 | 含义 |
|---|------|------|------|
| 6 | 流量 | liúliàng | data / mobile data |
| 7 | 套餐 | tàocān | plan / package |
| 8 | 充值 | chōngzhí | top up / recharge |
| 9 | 微信 | Wēixìn | WeChat |
| 10 | 余额 | yú'é | balance |

### 发音扩充 (1 → 2 个)

新增：**充值 vs 重置 的声母对比**（chōngzhí — chóngzhì，清 vs 浊、声调）

### 汉字扩充 (4 → 6 个)

新增：**充**（充值），**信**（微信）

---

## 边界明确

### 本轮范围内
- 修改 3 个文件：`src/content/lessons/askDirections.ts`、`orderFood.ts`、`phoneAndPayment.ts`
- 保持所有 lesson ID 不变
- 保持 en/fr 双语覆盖
- 保持 `LessonContent` 类型兼容（不修改 types.ts）
- 新增内容遵守现有命名约定

### 本轮范围外
- 不修改 types.ts、course.ts、journey.ts、路由、组件、CSS
- 不修改其他 6 门课程
- 不生成实际音频文件（路径声明即可）
- 不修改 shortInput（类型约束）

## 交付与验收

- Spec owner：dylan-t2-reviewer
- Plan owner：dylan-t2-planner
- Code owner：dylan-t2-codex
- Review owner：dylan-t2-reviewer

验收标准：
1. 三课对话均增至 8 行，句型均 5 个，词汇均 10 个，发音均 2 个，汉字均 6 个，练习均 2+2+2，卡片均 6 张
2. 新增内容均有 en/fr 双语解释
3. 所有现有测试和 E2E 继续通过（需配套更新计数断言）
4. 三课均在首页和课程页正常渲染
