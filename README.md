# 经典游戏合集

一个包含 **15 款经典小游戏** 的纯前端网页游戏集合，支持桌面端和移动端游玩。

## 项目结构

```
my-games/
├── index.html              # 入口页/游戏大厅
├── sudoku.html             # 数独
├── snake.html              # 贪吃蛇
├── tetris.html             # 俄罗斯方块
├── minesweeper.html        # 扫雷
├── game2048.html           # 2048
├── gomoku.html             # 五子棋
├── breakout.html           # 打砖块
├── memory.html             # 记忆翻牌
├── sokoban.html            # 推箱子
├── whackamole.html         # 打地鼠
├── flappybird.html         # 飞翔的小鸟
├── pinball.html            # 见缝插针
├── klotski.html            # 华容道
├── puzzle.html             # 滑块拼图
├── assets/
│   ├── css/
│   │   ├── common.css      # 公共样式（导航、布局、模态框、响应式）
│   │   ├── sudoku.css      # 数独样式
│   │   ├── snake.css       # 贪吃蛇样式
│   │   ├── tetris.css      # 俄罗斯方块样式
│   │   ├── minesweeper.css # 扫雷样式
│   │   ├── game2048.css    # 2048样式
│   │   ├── gomoku.css      # 五子棋样式
│   │   ├── breakout.css    # 打砖块样式
│   │   ├── memory.css      # 记忆翻牌样式
│   │   ├── sokoban.css     # 推箱子样式
│   │   ├── whackamole.css  # 打地鼠样式
│   │   ├── flappybird.css  # 飞翔的小鸟样式
│   │   ├── pinball.css     # 见缝插针样式
│   │   ├── klotski.css     # 华容道样式
│   │   └── puzzle.css      # 滑块拼图样式
│   ├── js/
│   │   ├── common.js       # 公共脚本（导航、计时器、模态框、规则）
│   │   ├── sudoku.js       # 数独逻辑
│   │   ├── snake.js        # 贪吃蛇逻辑
│   │   ├── tetris.js       # 俄罗斯方块逻辑
│   │   ├── minesweeper.js  # 扫雷逻辑
│   │   ├── game2048.js     # 2048逻辑
│   │   ├── gomoku.js       # 五子棋逻辑
│   │   ├── breakout.js     # 打砖块逻辑
│   │   ├── memory.js       # 记忆翻牌逻辑
│   │   ├── sokoban.js      # 推箱子逻辑
│   │   ├── whackamole.js   # 打地鼠逻辑
│   │   ├── flappybird.js   # 飞翔的小鸟逻辑
│   │   ├── pinball.js      # 见缝插针逻辑
│   │   ├── klotski.js      # 华容道逻辑
│   │   └── puzzle.js       # 滑块拼图逻辑
│   └── images/             # 图片资源（预留）
└── README.md
```

## 游戏列表

| 游戏 | 文件 | 描述 |
|------|------|------|
| 🔢 数独 | `sudoku.html` | 经典9×9数独，支持4种难度（简单/中等/困难/专家） |
| 🐍 贪吃蛇 | `snake.html` | 控制小蛇吃食物，支持4种速度，手机端虚拟方向键 |
| 🧱 俄罗斯方块 | `tetris.html` | 经典方块消除，支持等级系统与计分 |
| 💣 扫雷 | `minesweeper.html` | 经典扫雷，支持3种难度与标记模式 |
| 🎲 2048 | `game2048.html` | 数字合并游戏，支持3×3/4×4/5×5三种棋盘 |
| ⚫ 五子棋 | `gomoku.html` | 双人对战或人机对战（简单AI），15×15棋盘 |
| 🏓 打砖块 | `breakout.html` | 弹球击碎砖块，支持4种难度与暂停 |
| 🃏 记忆翻牌 | `memory.html` | 翻牌配对，支持3×4/4×4/4×6三种难度 |
| 📦 推箱子 | `sokoban.html` | 经典推箱子，共15关，支持撤销与关卡选择 |
| 🐹 打地鼠 | `whackamole.html` | 快速击打冒出的地鼠，躲避炸弹，支持4种难度 |
| 🐦 飞翔的小鸟 | `flappybird.html` | 点击控制小鸟飞越管道障碍，3种难度，最高分本地保存 |
| 🎯 见缝插针 | `pinball.html` | 在旋转圆盘上精准插针，支持3种难度与关卡递增 |
| 🏯 华容道 | `klotski.html` | 经典横刀立马布局，支持5种主题与步数统计 |
| 🧩 滑块拼图 | `puzzle.html` | 滑动还原拼图，3种数学生成主题，4种难度，支持拖拽操作 |

## 运行方式

1. 直接在浏览器中打开 `index.html` 文件
2. 或使用任意静态文件服务器（如 VS Code Live Server）

```bash
# 使用 Python 简单 HTTP 服务器
python -m http.server 8080

# 或使用 Node.js 的 http-server
npx http-server -p 8080
```

然后在浏览器中访问 `http://localhost:8080`

## 技术特点

- **纯前端实现**：无需后端，所有游戏逻辑均在浏览器中运行
- **响应式设计**：适配桌面端和移动端，移动端有侧边栏导航
- **模块化结构**：每个游戏独立的 HTML/CSS/JS 文件，便于维护和扩展
- **本地存储**：部分游戏使用 localStorage 保存最高分/通关记录
- **键盘+触摸双支持**：同时支持键盘操作和触摸屏操作
- **Canvas 数学绘图**：滑块拼图使用 Canvas 2D API 和纯数学函数实时生成精美主题图像
- **通用布局系统**：公共侧边栏、游戏选择器、计时器、模态框、规则说明统一管理

## 浏览器兼容性

- Chrome / Edge / Firefox / Safari 最新版本
- iOS Safari / Android Chrome
