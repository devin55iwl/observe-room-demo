# Cookiy Research Observer — Design System Guideline

> **用途**：将此文件完整传给 AI，即可在全新会话中精准复刻或扩展本设计系统的任何界面。  
> **覆盖范围**：美学哲学 → Token → 玻璃材质 → 动效 → 布局 → 组件 → 约束清单。

---

## 0. 产品背景

**Cookiy Research Observer** 是一个 UX 研究访谈实时观察工具，运行于 Figma Make iframe 沙箱。  
用户角色：**Research Ops（研究运营者）**，只能注入追问建议，不直接控制硬件。  
设计对标：**Apple Vision Pro 空间计算美学** —— 深空暗底、玻璃浮层、无 chrome 感。

---

## 1. 技术栈与全局约束

### 1.1 技术栈
| 层 | 选型 |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS v4（inline style 为主，Tailwind 辅助） |
| Animation | `motion/react`（从 `motion` 包引入，非 framer-motion） |
| Icons | `lucide-react` |
| 路由 | `react-router`（非 react-router-dom） |

### 1.2 Figma Make 沙箱强制约束（违反会触发模块解析失败）

```
❶ 所有 import 语句必须在任何 const 声明之前。
   ✅ import React from "react";
      const MotionDiv = motion.div;   ← 在所有 import 之后
   ❌ const MotionDiv = motion.div;
      import { X } from "lucide-react"; ← 致命错误

❷ motion 组件必须在模块顶层预解构为常量：
   const MotionDiv  = motion.div;
   const MotionSpan = motion.span;
   不能在 JSX 中直接写 <motion.div>

❸ 禁止使用 React.Fragment（<></>），改用真实 DOM 元素：
   ✅ <div>...</div>
   ❌ <>...</>

❹ border 简写属性会与 oklch/rgba 格式冲突（Tailwind v4 内部使用 oklch）。
   在任何 MotionDiv 或含动画的元素上，必须拆分为独立属性：
   ✅ borderWidth: 1, borderStyle: "solid", borderColor: "rgba(...)"
   ❌ border: "1px solid rgba(...)"  ← 在 Motion 元素上会报错

❺ Tailwind 过渡类（transition-colors / transition-all 等）与内联 border 样式混用
   会导致 oklch/rgba 格式冲突，必须移除 Tailwind 过渡类，
   改用内联 transitionProperty / transitionDuration / transitionTimingFunction。
```

---

## 2. 设计 Token

### 2.1 排版（`T`）
```ts
export const T = {
  display: 20,   // 大标题、数字展示
  title:   15,   // 面板标题
  body:    13,   // 正文、时钟
  caption: 11,   // 卡片文本、对话内容
  micro:   9,    // 标签、badge、时间戳
} as const;
```

### 2.2 圆角（`R`）
```ts
export const R = {
  pill: 9999,   // 胶囊形 badge、状态点容器
  lg:   24,     // 大面板、Surface 容器
  md:   16,     // 卡片、按钮
  sm:   10,     // tooltip、小弹层
} as const;
```

### 2.3 颜色（`C`）
```ts
export const C = {
  accent:       "#615FFF",                  // 品牌紫，AI/Moderator 主色
  accentMuted:  "rgba(97,95,255,0.10)",     // 品牌紫背景
  accentBorder: "rgba(97,95,255,0.18)",     // 品牌紫边框
  negative:     "#FF8080",                  // 危险/停止/负面情绪
  positive:     "#6DD4A0",                  // 成功/正面情绪
  warning:      "#FFD166",                  // 警告/待定状态
} as const;
```

#### 颜色使用规则
- **品牌紫（accent）**：AI Moderator 角色、激活状态、进度条渐变起点
- **绿（positive）**：已完成状态、正面情绪、进度条渐变终点
- **黄（warning）**：待处理状态、Pending badge、犹豫信号
- **红（negative）**：危险操作、停止/静音状态、负面情绪、Urgent 标签
- **白色系**：所有前景文本用 `rgba(255,255,255,α)` 控制层次感：
  - `0.90` 主标题
  - `0.72` 次级内容
  - `0.55` 对话文字（受访者）
  - `0.42–0.52` 主持人文字（斜体）
  - `0.22–0.30` 辅助信息
  - `0.12–0.18` 极弱/已划掉

### 2.4 布局常量（`G` + 全局间距）
```ts
export const G          = 12;   // 通用网格间距（所有元素之间的基础 gap）
export const NAV_W      = 54;   // 右侧导航图标列宽
export const LEFT_W     = 345;  // 左侧 Dock 宽度
export const CTRL_BAR_H = 52;   // 底部控制栏高度
export const STATUS_H   = 61;   // 顶部状态栏高度
export const STATUS_GAP = 3;    // 状态栏与下方内容的间距
export const PANEL_W    = 356;  // 标准右侧面板宽度
export const PANEL_DEFAULT_H = 420;
export const PANEL_MIN_H     = 180;
export const PANEL_MAX_H     = 800;
export const SNAP_DIST       = 10;  // 吸附阈值（px）
```

---

## 3. 玻璃材质系统

> 核心原则：**blur 做工作，tint 控制遮挡度**。不依赖不透明背景，一切依靠模糊后的背景内容增强层次感。

### 3.1 基础 glass filter
```ts
export const glass: CSSProperties = {
  backdropFilter:         "blur(64px) saturate(120%) brightness(0.92)",
  WebkitBackdropFilter:   "blur(64px) saturate(120%) brightness(0.92)",
};
```

### 3.2 主面板 Surface（`surfaceStyle`）
```ts
export const surfaceStyle: CSSProperties = {
  ...glass,
  borderRadius: R.lg,                        // 24px
  background:   "rgba(10,12,22,0.48)",       // 深蓝黑半透明底
  borderWidth:  1,
  borderStyle:  "solid",
  borderColor:  "rgba(255,255,255,0.11)",
  boxShadow: [
    "inset 0  1px  0   rgba(255,255,255,0.16)",  // 顶部高光边（玻璃边缘感）
    "inset 1px  1px  2px rgba(255,255,255,0.06)", // 新拟态深度
    "inset -1px -1px  2px rgba(0,0,0,0.20)",
    "inset 0 0 0 0.5px rgba(255,255,255,0.04)",   // 内侧微发光
    "0  8px 32px rgba(0,0,0,0.45)",               // 深度投影
    "0  2px  8px rgba(0,0,0,0.20)",
  ].join(", "),
};
```

### 3.3 内部卡片（`cardStyle` / `cardGlowStyle`）
```ts
// 普通卡片（面板内部的二级容器）
export const cardStyle: CSSProperties = {
  background:   "rgba(255,255,255,0.055)",
  borderWidth:  0.5, borderStyle: "solid",
  borderColor:  "rgba(255,255,255,0.09)",
  borderRadius: R.md,
  boxShadow: [
    "inset  0.5px  0.5px 1.5px rgba(255,255,255,0.09)",
    "inset -0.5px -0.5px 1.5px rgba(0,0,0,0.12)",
  ].join(", "),
};

// 带紫色辉光的卡片（激活/高亮状态）
export const cardGlowStyle: CSSProperties = {
  ...cardStyle,
  background: "rgba(255,255,255,0.065)",
  boxShadow: [
    "inset  0.5px  0.5px 1.5px rgba(255,255,255,0.11)",
    "inset -0.5px -0.5px 1.5px rgba(0,0,0,0.12)",
    "0 6px 18px -4px rgba(97,95,255,0.10)",         // 品牌紫辉光
  ].join(", "),
};
```

### 3.4 Tooltip 样式（`tipStyle`）
```ts
export const tipStyle: CSSProperties = {
  ...glass,
  borderRadius: R.sm,
  background:   "rgba(8,10,20,0.78)",
  border:       "0.5px solid rgba(255,255,255,0.12)",  // tooltip 不含 Motion，border 简写可用
  boxShadow: [
    "inset 0  1px  0   rgba(255,255,255,0.10)",
    "inset  0.5px  0.5px 1px rgba(255,255,255,0.06)",
    "inset -0.5px -0.5px 1px rgba(0,0,0,0.20)",
    "0 4px 16px rgba(0,0,0,0.40)",
  ].join(", "),
  color: "rgba(255,255,255,0.72)",
};
```

### 3.5 自适应 Glass（背景亮度感知）
```ts
// 根据背景亮度 t（0=黑，1=亮），动态调整 Surface 的不透明度：
function tintedBg(t: number): string {
  const base  = 0.48;
  const bonus = t > 0.25 ? Math.min(0.18, (t - 0.25) * 0.28) : 0;
  return `rgba(10,12,22,${(base + bonus).toFixed(3)})`;
  // 最暗：rgba(10,12,22,0.48) — 显示模糊背景氛围
  // 最亮：rgba(10,12,22,0.66) — 加强遮罩，防止洗出
}
```

背景亮度通过 Canvas 采样 `<img>` 得到（64×64 缩放后取 RGB 加权平均），通过 `GlassTintCtx` 全局共享给所有 Surface。

---

## 4. 动效系统

### 4.1 Spring 预设（`spring`）
```ts
export const spring = {
  type:      "spring" as const,
  damping:   28,
  stiffness: 200,
};
```

### 4.2 常用 transition 配置
```ts
// 面板出入场（弹性感）
{ type: "spring", damping: 26, stiffness: 220 }

// 快速列表项入场（带延迟叠加）
{ type: "spring", damping: 26, stiffness: 300, delay: index * 0.04 }

// 展开/折叠（高度动画）
{ type: "spring", damping: 28, stiffness: 280 }

// 旋转/方向切换
{ type: "spring", damping: 20, stiffness: 260 }

// 面板位置跟随（布局计算变化）
{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }   // 自定义 cubic-bezier

// 布局区域平移（centreRight 跟随面板开关）
transition: "right 0.32s cubic-bezier(0.32,0.72,0,1)"
transition: "left 0.32s cubic-bezier(0.32,0.72,0,1), right 0.32s cubic-bezier(0.32,0.72,0,1)"
```

### 4.3 标准 AnimatePresence 入场/出场 pattern
```tsx
// 面板（上方滑入）
initial={{ opacity: 0, y: -16, scale: 0.97 }}
animate={{ opacity: 1, y: 0,   scale: 1    }}
exit=   {{ opacity: 0, y: -16, scale: 0.97 }}

// 卡片/列表项（细微弹起）
initial={{ opacity: 0, y: 6, scale: 0.97 }}
animate={{ opacity: 1, y: 0, scale: 1    }}
exit=   {{ opacity: 0, y: -4, scale: 0.97 }}

// Toast（含 blur）
initial={{ opacity: 0, y: 10, scale: 0.96, filter: "blur(6px)" }}
animate={{ opacity: 1, y: 0,  scale: 1,   filter: "blur(0px)"  }}
exit=   {{ opacity: 0, y: 6,  scale: 0.97, filter: "blur(3px)" }}

// 展开区域（高度弹出）
initial={{ height: 0, opacity: 0 }}
animate={{ height: "auto", opacity: 1 }}
exit=   {{ height: 0, opacity: 0 }}
```

### 4.4 Keyframe 动画（CSS，通过 `<style dangerouslySetInnerHTML>` 注入）
```css
/* LIVE 红点扩散 */
@keyframes liveping {
  75%, 100% { transform: scale(2.2); opacity: 0; }
}

/* Transcript 实时转写跳点 */
@keyframes transcribe-dot {
  0%, 60%, 100% { transform: translateY(0);    opacity: 0.55; }
  30%           { transform: translateY(-4px);  opacity: 1;    }
}
```

---

## 5. 布局架构

### 5.1 全局层叠（z-index 分层）
```
z-10   — FollowUpBar（顶部追问栏）、Discard 按钮
z-20   — ControlBar 容器
z-25   — Discard 按钮（确保在中心区可见）
z-30   — RightNav（右侧导航）
z-[35] — ActionToast（右下角信号面板）
z-40   — LeftDock 左侧 Dock
z-50   — DraggablePanel（普通停靠态）
z-55   — DraggablePanel（拖拽中）
z-[60] — Tooltip 触发层
z-[70] — Volume/Brightness 弹出层
z-9999 — Tip 组件（Portal，脱离 overflow）
```

### 5.2 屏幕分区（水平）
```
|← G →|← LEFT_W (345px) →|← G →|← 中心内容区 →|← centreRight →|← G →|← NAV_W (54px) →|← G →|

左边距    = G = 12px
左 Dock 宽 = LEFT_W = 345px
中间间距   = G = 12px
中心区右边界 = centreRight（动态，见下）
右边距     = rightOffset = G + NAV_W + G = 78px
```

### 5.3 `centreRight` 动态计算（核心）
```ts
// rightOffset = G + NAV_W + G = 78px（右侧导航+间距，固定不变）
const rightOffset = G + NAV_W + G;

// centreRight = 中心区的右边界（随面板开关动态变化）
const centreRight = useMemo(() => {
  if (dockedIds.length === 0) return rightOffset;
  const w = dockedIds.length > 2 ? 320 : PANEL_W; // 面板列宽
  return rightOffset + w + G;
}, [dockedIds.length, rightOffset]);
```

**规则**：FollowUpBar、ActionToast、ControlBar、Discard 按钮的右边界全部使用 `centreRight`，并加上 `transition: right 0.32s cubic-bezier(0.32,0.72,0,1)` 平滑跟随。这确保这些元素永远不会被右侧面板列（z-50）遮挡。

### 5.4 垂直分区
```
top: G                              — FollowUpBar
top: G                              — StatusBar（左侧）
center（vertical）                  — RightNav
bottom: G                           — ControlBar
bottom: G + CTRL_BAR_H + G          — ActionToast 上边界
```

---

## 6. 组件规范

### 6.1 `Surface`（玻璃面板容器）
最基础的玻璃容器，自动感知背景亮度并调整 tint。

```tsx
// 用法
<Surface className="px-4 py-3 flex items-center gap-2">
  ...
</Surface>

// 内部实现
function Surface({ children, className }) {
  const { surface } = useAdaptiveGlass(); // 响应 GlassTintCtx
  return <div className={className} style={surface}>{children}</div>;
}
```

### 6.2 `Card`（二级卡片）
```tsx
<Card active glow style={{ padding: "10px 12px" }}>
  ...
</Card>
// active: 激活紫色边框 + 紫色背景
// glow:   带紫色外辉光的版本
```

### 6.3 `SectionLabel`（分区标题）
```tsx
<SectionLabel tip="鼠标悬浮显示的 tooltip 说明">
  SECTION TITLE
</SectionLabel>
// 样式：大写 · 极弱白色 · 右侧 1px 分隔线
// 字号：T.micro (9px)，letterSpacing: 0.14em
```

### 6.4 `PanelContentArea`（可滚动内容区）
```tsx
<PanelContentArea>
  ... 面板内容 ...
</PanelContentArea>
```
- 内部监听 `ResizeObserver` 计算 `compactLevel`（0=full, 1=half, 2=compact, 3=minimal）
- 内容超出时显示底部渐变 fade（`linear-gradient(to top, rgba(10,12,18,0.65)...)`）
- 通过 `CompactCtx` 将 compactLevel 传给子组件，让子组件自适应高度变化

### 6.5 `Tip`（Portal Tooltip）
```tsx
<Tip text="说明文字" align="left" above={true}>
  <button>触发元素</button>
</Tip>
// align: "left" | "center" | "right"
// above: true（默认上方显示，靠近视口边缘时自动翻转）
// 延迟：300ms hover 后显示
// z-index: 9999，通过 createPortal 渲染到 document.body
```

### 6.6 `DraggablePanel`（可拖拽/停靠面板）
```tsx
<DraggablePanel
  id="Insights"
  title="Insights"
  icon={<TrendingUp size={14} />}
  onClose={() => closePanel("Insights")}
  targetRect={getTargetRect("Insights")}   // {x, y, w, h}
  panelRectsRef={panelRectsRef}
  onSnapLines={setSnapLines}
  onDragStartNotify={() => handleDragStart("Insights")}
  onDragEndNotify={(fx, fy, fh) => handleDragEnd("Insights", fx, fy, fh)}
  onRedock={() => handleRedock("Insights")}
  meta="Live"                              // 右上角小标签
>
  <InsightsContent />
</DraggablePanel>
```

**停靠规则**：
- 右侧停靠列：1个面板=占满高度，2个=各 `(availH-G)/2`，3个以上=各 `(availH-(n-1)*G)/n`，最大 360px
- 3 个以上面板时宽度收窄为 320px
- 拖拽超过 dockThreshold 右边界时自动重新停靠

### 6.7 `StatusBar`（顶部状态栏）
```tsx
<StatusBar clock={clock} />
// 显示：房间号、项目名、角色 badge（Research Ops）、REC 红点、计时器
// 固定在左侧 Dock 顶部：width=LEFT_W, top=G, left=G
```

### 6.8 `FollowUpBar`（追问栏）
位置：顶部，`left: G+LEFT_W+G, right: centreRight, top: G`  
三档响应式：
- `< 480px`（compact）：隐藏进度条 + "asked" 标签
- `< 360px`（narrow）：隐藏分隔线 + 预览区
- `< 260px`（mini）：只保留图标 + badge + 收起箭头

每个追问项（`NoteSlip`）：
- 状态点：`pending`=黄色+pulse，`asked`=绿色，`failed`=红色
- 来源 badge：`AI`=品牌紫，`You`=极弱白
- `urgent` 标签：红色，7px，uppercase

### 6.9 `ActionToastStack`（行为信号 Toast）
位置：`right: centreRight, bottom: G+CTRL_BAR_H+G`  
- Toast 自动 4 秒后消失，堆叠方向向上（`flex-direction: column-reverse`）
- 空闲时显示 Handle（含 Bell 图标 + "Signals"/"Muted" 标签）
- 整体可 snap-drag 拖拽移动

```
4 类信号：
- Hesitation      黄色  Pause 图标
- Strong Reaction 红色  Zap 图标
- Confusion       白色  HelpCircle 图标
- Engagement Drop 品牌紫 TrendingDown 图标
```

### 6.10 `ControlBar`（底部控制栏）
位置：`left: G+LEFT_W+G, right: centreRight, bottom: G`，内部 `justify-center`。

控制项（从左到右）：
1. Mic（disabled，AI Moderator 控制）
2. Camera（disabled）
3. 分隔线
4. ScreenShare（disabled）
5. Volume（hover 展开垂直滑块）
6. Brightness（hover 展开垂直滑块）
7. 分隔线
8. Bell（切换通知开关）
9. 分隔线
10. Leave Room（红色 + 边框）

### 6.11 `LeftDockModule`（左侧实时字幕 Dock）

**折叠态**（默认）：
- 整体高度 auto，内容为 Live Bar
- Live Bar 可点击 → 展开

**展开态**：
- 顶部 Header（Transcript 图标 + 标题）
- 中间可滚动的历史记录（`TRANSCRIPT` 数据 slice(0, -1)）
- 固定底部 Live Bar（实时内容始终可见）
- 最底部 ToggleStrip（"Collapse" + 旋转 180° 的 ChevronUp）

**Live Bar 内容**（展开/折叠均显示真实流式文本）：
- 单人发言：显示 `modBubble.displayed` 或 `intBubble.displayed`
- 双人重叠：分两行各显示双方流式文本
- 无信号时：显示最后一句完整对话

**ToggleStrip**（唯一的展开/折叠控件）：
- 始终固定在模块最底部
- 折叠时标签="Transcript"，展开时标签="Collapse"
- ChevronUp 旋转动画：`rotate: isExpanded ? 180 : 0`

### 6.12 `RightNav`（右侧导航）
- 位置：`right: G, top: 50%（垂直居中）`，`z-30`
- 宽度：NAV_W (54px)
- 包含所有右侧面板的开关 tab 按钮

---

## 7. 实时模拟数据系统

### 7.1 `useLiveSimulation(clock: string): LiveSimulationState`
**唯一数据源**，所有消费实时字幕的组件必须从这个 hook 取数，禁止各自独立模拟。

```ts
interface LiveSimulationState {
  modBubble:    LiveBubble | null;  // AI Moderator 当前流式气泡
  intBubble:    LiveBubble | null;  // 受访者当前流式气泡
  history:      HistoryTurn[];      // 已完成的对话历史（最近12条）
  isOverlap:    boolean;            // 双方同时说话
  hasLive:      boolean;            // 是否有任何活跃气泡
  isStreaming:  boolean;            // 是否正在流式输出字符
  activeSpeaker: "mod" | "int" | null;
  lastTurn:     HistoryTurn | null; // 最近一条完整对话
}
```

流式参数：`CHARS_PER_TICK = 2`，`TICK_MS = 28`（约 70 字符/秒）

### 7.2 Speaker 身份 Token（`SPEAKER_META`）
```ts
{
  mod: { name: "Cookiy AI", color: "rgba(97,95,255,0.90)",   bg: "rgba(97,95,255,0.10)",   border: "rgba(97,95,255,0.22)",   Icon: Sparkles },
  int: { name: "#9527",     color: "rgba(109,212,160,0.90)", bg: "rgba(109,212,160,0.08)", border: "rgba(109,212,160,0.18)", Icon: User      },
}
```

---

## 8. 状态管理模式

```
纯 React state，无外部状态库。

面板开关：Set<string>（openPanels）
面板位置：Record<string, {x,y,h}>（detached，仅记录脱离停靠的面板）
全局 tint：GlassTintCtx（Context，从背景图像亮度采样）
Snap 数据：panelRectsRef（MutableRef，零 re-render）

状态更新原则：
- 面板 open/close → setOpenPanels（immutable Set 更新）
- 面板脱离停靠 → setDetached（Record 合并/删除）
- Snap 线条 → useState（SnapLine[]，仅渲染层使用）
```

---

## 9. 吸附对齐系统（SnapEngine）

```ts
const SNAP_DIST = 10; // 吸附触发阈值（px）

// 吸附目标：
// - 其他所有面板的 left/right/top/bottom 边
// - 每条边都可双向吸附（我的左边 ↔ 你的右边，等）
// 吸附时显示青色辅助线（SnapGuides 组件）
```

---

## 10. 背景系统

层叠顺序（同一 `BackgroundLayer` 组件内）：
1. 全屏底图（受访者视频 / 截图画面）
2. PiP 小窗（交换后变全屏，原全屏变 PiP）
3. 暗化遮罩（`rgba(0,0,0,0.35)`，确保玻璃面板可读性）

自适应亮度：通过 `sampleBrightness()` Canvas 采样背景图，  
将结果写入 `GlassTintCtx` → 所有 Surface 自动调整 tint opacity。

---

## 11. Adaptive 响应式原则

| 检测方式 | 用途 |
|---|---|
| `ResizeObserver` 在容器上 | PanelContentArea compactLevel（0-3 级） |
| `ResizeObserver` 在 FollowUpBar header 上 | mini/narrow/compact 三档折叠 |
| `window.innerWidth` / `window.innerHeight` | panel 停靠计算 |

**不使用 Tailwind 断点（sm/md/lg）**，所有响应式均基于容器尺寸而非视口断点。

---

## 12. 常用 Pattern 速查

### 12.1 带 hover 态的图标按钮
```tsx
<button
  style={{
    background: "rgba(255,255,255,0.00)",
    borderRadius: R.md,
    transitionProperty: "background",
    transitionDuration: "0.18s",
    transitionTimingFunction: "ease",
  }}
  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.00)"; }}
>
  <Icon size={14} style={{ color: "rgba(255,255,255,0.40)" }} />
</button>
```

### 12.2 状态 badge
```tsx
// 品牌色 badge（AI 标记）
<span style={{
  fontSize: 8, letterSpacing: 0.4,
  color: "rgba(97,95,255,0.70)",
  background: "rgba(97,95,255,0.10)",
  borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(97,95,255,0.20)",
  borderRadius: 4, padding: "1px 5px",
}}>AI</span>

// 危险 badge（urgent）
<span style={{
  fontSize: 7, letterSpacing: "0.08em",
  color: C.negative,
  background: "rgba(255,128,128,0.06)",
  borderRadius: 3,
  borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,128,128,0.10)",
  padding: "1px 4px", textTransform: "uppercase",
}}>urgent</span>
```

### 12.3 水平分隔线
```tsx
// 强分隔
<div style={{ height: 0.5, background: "rgba(255,255,255,0.08)" }} />
// 极弱分隔（面板内部）
<div style={{ height: 0.5, background: "rgba(255,255,255,0.04)" }} />
// 品牌色分隔（"Now" 时间线）
<div style={{ height: 0.5, background: "rgba(97,95,255,0.16)" }} />
```

### 12.4 LIVE 红点（带 ping 动画）
```tsx
<div style={{ position: "relative", width: 6, height: 6 }}>
  {/* 实心点 */}
  <div style={{
    width: 6, height: 6, borderRadius: "50%", position: "absolute",
    background: isStreaming ? "rgba(255,100,100,0.90)" : "rgba(255,100,100,0.40)",
  }} />
  {/* 扩散 ping */}
  {isStreaming && (
    <div style={{
      width: 6, height: 6, borderRadius: "50%", position: "absolute",
      background: "rgba(255,100,100,0.65)",
      animation: "liveping 1.8s cubic-bezier(0,0,0.2,1) infinite",
    }} />
  )}
</div>
```

### 12.5 垂直滑块（Volume/Brightness）
```tsx
// 旋转 <input type="range"> 实现垂直效果
<input
  type="range" min={0} max={100} value={value}
  onChange={...}
  style={{
    position: "absolute",
    width: 120, height: 20,
    transform: "rotate(-90deg)",
    transformOrigin: "center center",
    opacity: 0, cursor: "pointer",
  }}
/>
```

### 12.6 内联 Transition（替代 Tailwind transition-* 类）
```tsx
// ✅ 正确写法（避免 oklch 冲突）
style={{
  transitionProperty: "background, color",
  transitionDuration: "0.18s",
  transitionTimingFunction: "ease",
}}

// ❌ 错误写法（与 Motion border 样式冲突）
className="transition-colors duration-200"
```

---

## 13. 文件结构

```
/src/app/
├── App.tsx                         # 根编排器（状态 + 布局）
├── routes.ts                       # React Router 路由配置
├── styles/
│   ├── fonts.css                   # 字体导入（仅此文件）
│   └── theme.css                   # Tailwind 主题 token
└── components/
    ├── constants.ts                # 设计 Token（T/R/C/G/surfaceStyle 等）
    ├── types.ts                    # 所有共享 TypeScript 类型
    ├── data.ts                     # mock 数据（TRANSCRIPT/TABS/RIGHT_IDS）
    ├── hooks.ts                    # useClock / GlassTintCtx / useAdaptiveGlass / useSnapDrag
    ├── useLiveSimulation.ts        # 实时字幕唯一数据源
    ├── primitives.tsx              # Surface / Card / SectionLabel / PanelContentArea
    ├── SnapEngine.tsx              # 吸附对齐逻辑 + SnapGuides 渲染
    ├── Tip.tsx                     # Portal Tooltip
    ├── TranslateButton.tsx         # 翻译语言切换按钮
    ├── constants.ts                # 同上（已合并）
    │
    ├── StatusBar.tsx               # 顶部状态栏
    ├── FollowUpBar.tsx             # 追问栏
    ├── ControlBar.tsx              # 底部控制栏
    ├── ActionToast.tsx             # 行为信号 Toast + hook
    ├── DraggablePanel.tsx          # 可拖拽/停靠面板容器
    ├── LeftDockModule.tsx          # 左侧实时字幕 Dock
    ├── LeftDockPiP.tsx             # 左侧 PiP 小窗
    ├── RightNav.tsx                # 右侧导航 tab
    ├── BackgroundLayer.tsx         # 背景视频/图像层
    ├── FaceAnalysisView.tsx        # 情感分析面板内容
    ├── AnalysisPill.tsx            # 情感分析最小化 Pill
    ├── DiscardModal.tsx            # 丢弃会话确认弹窗
    ├── LiveTranscript.tsx          # 浮动实时字幕气泡
    ├── ParticipantTaskView.tsx     # 参与者任务视图（共享屏幕模式）
    ├── FaceStageView.tsx           # 人脸大图舞台视图
    │
    ├── panels/
    │   ├── PersonaContent.tsx      # 参与者档案面板
    │   ├── CheckListContent.tsx    # 访谈检查清单面板
    │   ├── InsightsContent.tsx     # 洞察聚合面板
    │   └── TranscriptContent.tsx  # 历史记录面板（右侧）
    │
    ├── ui/                         # shadcn/ui 基础组件（按需使用）
    └── figma/
        └── ImageWithFallback.tsx   # 图片组件（受保护，勿修改）
```

---

## 14. 禁止事项清单

```
✗ 不得修改 /src/app/components/figma/ImageWithFallback.tsx
✗ 不得修改 /pnpm-lock.yaml
✗ 不得在 Motion 元素上使用 border 简写（拆分为 borderWidth/Style/Color）
✗ 不得在含 border inline style 的元素上使用 Tailwind transition-* 类
✗ 不得使用 <></> React.Fragment（改用真实 DOM）
✗ 不得将 import 语句写在 const 声明之后
✗ 不得直接 <motion.div>，必须预解构为 const MotionDiv = motion.div
✗ 不得在 /src/styles/fonts.css 以外的文件导入字体
✗ 不得在代码中硬编码 oklch() 颜色值（全部使用 rgba()）
✗ 不得创建独立的 tailwind.config.js（使用 Tailwind v4 原生配置）
✗ 不得修改 /src/styles/theme.css 中的 token（除非用户明确要求改设计风格）
✗ Analysis（情感分析）功能已被禁用，不得重新启用
✗ 不得为实时字幕数据单独创建 simulation，必须使用 useLiveSimulation hook
```

---

## 15. 快速复刻新界面的步骤

1. **确认分区**：新界面属于哪个区域？（左 Dock / 中心 / 右面板 / 顶部 / 底部）
2. **定位 z-index**：参照第 5.1 节层叠表
3. **确认 `right` 边界**：中心区元素用 `centreRight`，右侧导航区元素用 `rightOffset`
4. **选择容器样式**：主面板 → `surfaceStyle`，内部卡片 → `cardStyle`/`cardGlowStyle`，tooltip → `tipStyle`
5. **选择 Token**：字号从 `T`，圆角从 `R`，颜色从 `C`，间距用 `G` 的倍数
6. **写动画**：入场用第 4.3 节 pattern，弹簧用 `spring` 预设
7. **检查约束**：对照第 14 节禁止事项逐条验证
