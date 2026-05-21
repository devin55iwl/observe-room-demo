你是一个高级 UX/UI Designer、交互设计师和产品视觉设计师。请以 Apple-level quality 的标准，重新设计并升级一个名为 Check List 的浮层面板组件。
目标不是简单美化，而是让它在不同高度下都保持 清晰、克制、高级、信息密度合理、层级明确，并且具备顺滑自然的状态切换体验。

整体设计目标

这个 Check List 面板服务于 AI interview / research workflow。
它需要根据可用空间高度自动切换内容密度和信息结构，在不同尺寸下都保持：

视觉上干净、克制、精致

信息优先级明确，不拥挤

有 Apple 风格的秩序感、呼吸感、材质感与流畅动效

不要做成传统企业后台，也不要过度炫技

保留未来感、玻璃感和 intelligence tool 的气质

设计原则
1. 内容优先级

Check List 中有三类核心内容：

Follow-up suggestions（AI 推荐追问）

Input area（输入框 + urgent toggle）

Matrix visualization（问题状态矩阵可视化）

不同高度下，三者的优先级不同，不能全部同时强展示。

2. 自适应逻辑

面板应根据高度切换为 4 个显示状态。
这些状态不是简单缩放，而是 信息架构重组。

四个显示状态
State 1 — Full Height / Expanded
场景

面板占据几乎完整高度。

目标

这是最完整的工作态，允许用户查看和操作全部内容。

内容结构

顶部：标题栏

中部上半部分：问题状态可视化 / checklist overview

中部下半部分：AI follow-up suggestions

底部：输入框 + urgent toggle

设计要求

保持当前 full-height 版本的大致信息完整性

但要优化层级、留白、视觉节奏和内容分区

Follow-up 区域要更像主任务流的一部分，而不是附属卡片堆砌

可视化模块、建议区、输入区之间要有清晰的主次关系

避免界面太满，保持高级感和轻盈感

State 2 — Half Height / Focused Card
场景

面板高度约为屏幕一半。

目标

以 AI follow-up suggestions + input area 为主导，适合正在进行访谈时快速查看和输入。

内容结构

顶部：标题栏 + 一个可视化切换按钮

主体：2–3 条 AI follow-up suggestions，作为主内容

底部：输入框 + urgent toggle

默认隐藏完整问题列表

保留一个 visualization toggle button

交互要求

点击右上角的 visualization button 后：

follow-up suggestions 收起或移除

切换为 矩阵可视化模块 + 输入框

保持布局简洁，不要两种信息同时争抢注意力

设计要求

这个状态应强调“快速行动”，而不是“全面浏览”

Follow-up 卡片应该更精炼、更可读、更易点选

输入框必须始终稳定保留，作为操作锚点

toggle 动画应平滑、克制，像 Apple 的 panel mode switch

切换前后要有连续性，不要像两个完全断裂的页面

State 3 — One-third Height / Compact Visualization
场景

面板高度约为屏幕三分之一。

目标

只保留最核心的状态感知能力，让用户快速扫一眼 checklist 进度和分布。

内容结构

顶部：标题栏

主体：仅显示 矩阵可视化

底部可选：一个简洁进度计数（例如 16/20）

不显示 follow-up suggestions

不显示输入框

设计要求

这里的矩阵应该高密度但依然优雅

更像一个 glanceable status module，而不是一个可编辑界面

重点是 scanability：一眼看懂状态分布、当前活跃项、完成进度

视觉要克制，不要满屏都是重发光和强色块

应有更强的摘要感和仪表盘感

State 4 — One-quarter Height / Minimal Strip
场景

面板高度约为屏幕四分之一。

目标

压缩成最小可视状态，只作为 checklist 的存在提示和状态预览。

内容结构

顶部可保留极简标题或图标标识

主体仅保留一行或极简矩阵可视化

保留总进度数字，例如 16/20

不显示 follow-up suggestions

不显示输入框

设计要求

这个状态应该极简、安静、像系统级摘要组件

更接近 Apple 的 glance UI / compact overlay 感

只传递“有这些状态”和“当前进度到哪”

尽量减少视觉噪音和文字量

强调结构秩序，而非功能堆叠

Breakpoint 逻辑

请基于高度而不是宽度来设计组件断点。
核心是 3 个 breakpoint，映射为 4 个状态：

Large height → State 1

Medium height → State 2

Small height → State 3

Extra small height → State 4

请明确每个 breakpoint 下：

保留哪些内容

隐藏哪些内容

哪些内容折叠为 icon / toggle / count

动效如何保证连续性

矩阵可视化要求

矩阵可视化是 checklist 的核心抽象表达。
请优化它的表现，使其更接近高级产品视觉，而不是普通色块网格。

状态颜色

Green = high / good

Yellow = moderate

Red = low / issue

Purple = active / live

Gray = pending / queue

设计要求

支持在不同高度下自动从详细矩阵过渡到更紧凑的 tile / strip / line 形式

保持统一视觉语言，不同状态不是重新设计，而是同一系统的压缩版本

active 状态可以有轻微 glow，但必须克制

保持可扫描性和结构感

Apple-level 视觉标准

请用 Apple 标准来约束整体视觉质量，但不要做成纯拟物。
重点参考以下特征：

强层级感与秩序感

精准留白

柔和且克制的玻璃材质

细腻边界和阴影

流畅、安静、不突兀的动画

视觉上简洁，但细节很深

每个状态都像是同一个系统自然收缩出来的，而不是四套不相关设计

避免：

过度发光

赛博朋克式炫技

企业后台表格感

复杂描边和过度装饰

信息全都挤在一起

输出要求

请输出以下内容：

Check List 在 4 个状态下的 UI 结构方案

每个状态的信息优先级说明

breakpoint 到状态的映射逻辑

动效和转场建议

视觉语言建议（材质、间距、字体层级、颜色使用）

如何让矩阵可视化在压缩时依然保持可读

给出一个更适合 Figma AI / UI 生成工具使用的短版 prompt

更适合 Figma / v0 / 生成工具的短版 Prompt

Design an Apple-level adaptive floating panel called “Check List” for an AI interview workflow.
It should support 4 height-based states with clear progressive reduction of content:

Full height: show checklist visualization, AI follow-up suggestions, and input area.

Half height: prioritize follow-up suggestions and input area, while keeping a visualization toggle button. When toggled, replace follow-up suggestions with a compact matrix visualization and keep the input area.

One-third height: show only the matrix visualization and a minimal progress count.

One-quarter height: reduce further into an ultra-compact checklist status preview, using a minimal strip or compressed matrix plus total progress.

Use a refined Apple-inspired visual language: clean hierarchy, precise spacing, subtle glass material, restrained glow, elegant motion, and a seamless sense of continuity across states.
The matrix should use color-coded status tiles: green, yellow, red, purple for active, gray for pending.
Avoid clutter, enterprise dashboard heaviness, or overly decorative sci-fi effects.
This should feel like a premium adaptive system UI for a modern intelligence tool.

你还可以再加一句，让 AI 更听话

把这句附在最后，效果通常会更稳：

Do not treat these as four separate screens. Treat them as one adaptive component system that compresses gracefully as available height decreases.