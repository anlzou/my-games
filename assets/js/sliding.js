// ==================== 滑块拼图游戏 (Sliding Puzzle) ====================
// 游戏规则：将打乱的拼图块通过滑动恢复到原始顺序
// 每次只能移动与空白格相邻的方块
// 支持多种主题（程序化生成图案）和多级难度（3×3 / 4×4 / 5×5 / 6×6）

// ========== 配置 ==========
const SLIDING_CONFIG = {
    sizes: { easy: 3, medium: 4, hard: 5, expert: 6 },
    shuffleFactor: { easy: 20, medium: 30, hard: 40, expert: 50 }
};

// ========== 主题定义 - 使用程序化算法生成有趣图案 ==========
// 每个主题用不同的数学函数生成视觉图案，然后分割到各格子上
const SLIDING_THEMES = {
    mandala: {
        name: '曼陀罗',
        icon: '🌀',
        colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#01a3a4', '#f368e0', '#ff9f43', '#00d2d3'],
        description: '🌀 对称 · 圆环 · 绚丽'
    },
    wave: {
        name: '波浪',
        icon: '🌊',
        colors: ['#00d2d3', '#54a0ff', '#2e86de', '#01a3a4', '#48dbfb', '#0abde3', '#341f97', '#5f27cd', '#1dd1a1', '#10ac84'],
        description: '🌊 波纹 · 流动 · 渐变'
    },
    cellular: {
        name: '细胞',
        icon: '🧬',
        colors: ['#1dd1a1', '#10ac84', '#2ed573', '#7bed9f', '#70a1ff', '#5352ed', '#eccc68', '#ffa502', '#ff6348', '#ff4757'],
        description: '🧬 分形 · 有机 · 生长'
    },
    spiral: {
        name: '螺旋',
        icon: '🌀',
        colors: ['#9b59b6', '#8e44ad', '#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#1abc9c', '#e67e22', '#34495e', '#2c3e50'],
        description: '🌀 旋涡 · 缠绕 · 动态'
    },
    stripe: {
        name: '条纹',
        icon: '📊',
        colors: ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#1abc9c', '#e74c3c', '#34495e', '#f39c12'],
        description: '📊 条纹 · 几何 · 整齐'
    }
};

// ========== 游戏状态 ==========
let slidingBoard = [];
let slidingGrid = 4;
let slidingDifficulty = 'medium';
let slidingTheme = 'mandala';
let slidingMoves = 0;
let slidingSeconds = 0;
let slidingTimer = null;
let slidingStarted = false;
let slidingWon = false;
let isPreviewOpen = false;
let showNumbers = false;   // 默认隐藏数字

// 触摸/拖动相关
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let touchTargetTile = null;

// 预生成的图案（每个格子对应的背景数据）
let tilePatterns = [];

// ======================================================================
//  初始化游戏
// ======================================================================
function initSliding() {
    resetSlidingState();
    generatePatterns();
    renderSliding();
    // 确保数字按钮状态与默认一致
    updateNumButtonStyle();
}

function resetSlidingState() {
    const size = slidingGrid * slidingGrid;
    slidingBoard = [];
    for (let i = 0; i < size; i++) {
        slidingBoard[i] = i;
    }
    slidingMoves = 0;
    slidingSeconds = 0;
    slidingStarted = false;
    slidingWon = false;
    if (slidingTimer) { clearInterval(slidingTimer); slidingTimer = null; }
    updateSlidingStats();
    document.getElementById('sliding-board').classList.remove('win');
}

function resetSlidingGame() {
    if (slidingTimer) { clearInterval(slidingTimer); slidingTimer = null; }
    resetSlidingState();
    generatePatterns();
    renderSliding();
}

// ======================================================================
//  设置主题
// ======================================================================
function setSlidingTheme(theme) {
    if (!SLIDING_THEMES[theme]) return;
    if (slidingTimer) { clearInterval(slidingTimer); slidingTimer = null; }
    slidingTheme = theme;
    document.querySelectorAll('.sliding-theme-selector .theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    resetSlidingState();
    generatePatterns();
    renderSliding();
}

// ======================================================================
//  设置难度
// ======================================================================
function setSlidingDifficulty(diff) {
    const size = SLIDING_CONFIG.sizes[diff];
    if (!size) return;
    if (slidingTimer) { clearInterval(slidingTimer); slidingTimer = null; }
    slidingDifficulty = diff;
    slidingGrid = size;
    document.querySelectorAll('.difficulty-selector .diff-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.diff === diff);
    });
    resetSlidingState();
    generatePatterns();
    renderSliding();
}

// ======================================================================
//  显示/隐藏数字切换
// ======================================================================
function toggleSlidingNumbers() {
    showNumbers = !showNumbers;
    updateNumButtonStyle();
    renderSliding();
}

function updateNumButtonStyle() {
    const btn = document.getElementById('sliding-num-toggle');
    if (!btn) return;
    if (showNumbers) {
        btn.style.background = '#ffd700';
        btn.style.color = '#1a1a2e';
        btn.textContent = '🔢 数字';
    } else {
        btn.style.background = '#6c757d';
        btn.style.color = '#fff';
        btn.textContent = '🔢 数字';
    }
}

// ======================================================================
//  打乱拼图（确保有解）
// ======================================================================
function startSlidingGame() {
    if (slidingTimer) { clearInterval(slidingTimer); slidingTimer = null; }
    
    const size = slidingGrid * slidingGrid;
    slidingBoard = [];
    for (let i = 0; i < size; i++) {
        slidingBoard[i] = i;
    }
    slidingMoves = 0;
    slidingSeconds = 0;
    slidingStarted = false;
    slidingWon = false;
    document.getElementById('sliding-board').classList.remove('win');

    const shuffleSteps = SLIDING_CONFIG.shuffleFactor[slidingDifficulty] || 30;
    let blankIndex = size - 1;
    
    for (let step = 0; step < shuffleSteps; step++) {
        const neighbors = getNeighborIndices(blankIndex);
        if (neighbors.length === 0) continue;
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        slidingBoard[blankIndex] = slidingBoard[randomNeighbor];
        slidingBoard[randomNeighbor] = size - 1;
        blankIndex = randomNeighbor;
    }

    if (isSlidingSolved()) {
        for (let step = 0; step < 10; step++) {
            const neighbors = getNeighborIndices(blankIndex);
            if (neighbors.length === 0) continue;
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            slidingBoard[blankIndex] = slidingBoard[randomNeighbor];
            slidingBoard[randomNeighbor] = size - 1;
            blankIndex = randomNeighbor;
        }
    }

    updateSlidingStats();
    renderSliding();
}

// ======================================================================
//  获取相邻索引
// ======================================================================
function getNeighborIndices(index) {
    const row = Math.floor(index / slidingGrid);
    const col = index % slidingGrid;
    const neighbors = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of dirs) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < slidingGrid && nc >= 0 && nc < slidingGrid) {
            neighbors.push(nr * slidingGrid + nc);
        }
    }
    return neighbors;
}

function getBlankIndex() {
    const size = slidingGrid * slidingGrid;
    for (let i = 0; i < size; i++) {
        if (slidingBoard[i] === size - 1) return i;
    }
    return size - 1;
}

function isSlidingSolved() {
    const size = slidingGrid * slidingGrid;
    for (let i = 0; i < size; i++) {
        if (slidingBoard[i] !== i) return false;
    }
    return true;
}

// ======================================================================
//  尝试移动
// ======================================================================
function tryMoveTile(tileIndex) {
    if (slidingWon) return false;
    
    const blankIndex = getBlankIndex();
    const tileRow = Math.floor(tileIndex / slidingGrid);
    const tileCol = tileIndex % slidingGrid;
    const blankRow = Math.floor(blankIndex / slidingGrid);
    const blankCol = blankIndex % slidingGrid;
    
    const dr = Math.abs(tileRow - blankRow);
    const dc = Math.abs(tileCol - blankCol);
    
    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
        const size = slidingGrid * slidingGrid;
        slidingBoard[blankIndex] = slidingBoard[tileIndex];
        slidingBoard[tileIndex] = size - 1;
        
        if (!slidingStarted) startSlidingTimer();
        slidingMoves++;
        updateSlidingStats();
        renderSliding();
        
        if (isSlidingSolved()) {
            slidingWon = true;
            if (slidingTimer) { clearInterval(slidingTimer); slidingTimer = null; }
            document.getElementById('sliding-board').classList.add('win');
            setTimeout(() => showSlidingWinModal(), 500);
        }
        return true;
    }
    return false;
}

// ======================================================================
//  计时器
// ======================================================================
function startSlidingTimer() {
    if (slidingTimer) return;
    slidingStarted = true;
    slidingTimer = setInterval(() => {
        slidingSeconds++;
        updateSlidingStats();
    }, 1000);
}

function updateSlidingStats() {
    document.getElementById('sliding-moves').textContent = slidingMoves;
    const m = String(Math.floor(slidingSeconds / 60)).padStart(2, '0');
    const s = String(slidingSeconds % 60).padStart(2, '0');
    document.getElementById('sliding-time').textContent = `${m}:${s}`;
}

// ======================================================================
//  程序化图案生成引擎
//  使用数学函数生成视觉上连续、有趣的图案，并分割到不同格子
// ======================================================================

// 生成一个256x256虚拟画布上的图案，每个格子取对应区域作为背景
function generatePatterns() {
    const grid = slidingGrid;
    const patternSize = 256; // 虚拟画布大小
    const colors = SLIDING_THEMES[slidingTheme].colors;
    const seed = Date.now() % 10000; // 随机种子，每次不同
    
    tilePatterns = [];
    
    // 为每个格子生成独特的图案片段
    for (let tileNum = 0; tileNum < grid * grid; tileNum++) {
        const row = Math.floor(tileNum / grid);
        const col = tileNum % grid;
        
        // 计算此格子在虚拟画布中的位置比例 (0~1)
        const x0 = col / grid;
        const y0 = row / grid;
        const x1 = (col + 1) / grid;
        const y1 = (row + 1) / grid;
        
        // 生成多个渐变和装饰层，模拟图片的一部分
        const bg = generateTilePattern(tileNum, row, col, grid, colors, seed, x0, y0, x1, y1, patternSize);
        tilePatterns[tileNum] = bg;
    }
}

// 生成单个格子的背景图案
function generateTilePattern(tileNum, row, col, grid, colors, seed, x0, y0, x1, y1) {
    const theme = slidingTheme;
    const cx = (x0 + x1) / 2; // 格子中心x
    const cy = (y0 + y1) / 2; // 格子中心y
    
    // 根据主题使用不同的数学函数生成图案
    let bgStyle;
    
    switch (theme) {
        case 'mandala':
            bgStyle = genMandalaTile(row, col, grid, colors, seed, cx, cy, x0, y0, x1, y1);
            break;
        case 'wave':
            bgStyle = genWaveTile(row, col, grid, colors, seed, cx, cy, x0, y0, x1, y1);
            break;
        case 'cellular':
            bgStyle = genCellularTile(row, col, grid, colors, seed, cx, cy, x0, y0, x1, y1);
            break;
        case 'spiral':
            bgStyle = genSpiralTile(row, col, grid, colors, seed, cx, cy, x0, y0, x1, y1);
            break;
        case 'stripe':
            bgStyle = genStripeTile(row, col, grid, colors, seed, cx, cy, x0, y0, x1, y1);
            break;
        default:
            bgStyle = genMandalaTile(row, col, grid, colors, seed, cx, cy, x0, y0, x1, y1);
    }
    
    return bgStyle;
}

// ---- 曼陀罗/万花筒图案 ----
function genMandalaTile(row, col, grid, colors, seed, cx, cy, x0, y0, x1, y1) {
    const grads = [];
    const angle = Math.atan2(cy - 0.5, cx - 0.5) + seed * 0.001;
    
    // 基础色来自位置
    const c1 = colors[(row * 3 + col * 7 + seed) % colors.length];
    const c2 = colors[(row * 7 + col * 5 + seed + 3) % colors.length];
    const c3 = colors[(row * 5 + col * 11 + seed + 6) % colors.length];
    
    // 创建复杂的多重径向渐变
    const centerX = 50 + Math.sin(seed + row * 2.3 + col * 1.7) * 30;
    const centerY = 50 + Math.cos(seed + row * 1.7 + col * 2.3) * 30;
    
    // 环形图案 - 使用多个径向渐变叠加
    grads.push(`radial-gradient(circle at ${40 + Math.sin(angle) * 20}% ${40 + Math.cos(angle) * 20}%, ${c1}88 0%, transparent 60%)`);
    grads.push(`radial-gradient(circle at ${60 + Math.sin(angle + 1) * 20}% ${60 + Math.cos(angle + 1) * 20}%, ${c2}88 0%, transparent 60%)`);
    grads.push(`radial-gradient(circle at ${centerX}% ${centerY}%, ${c3}66 0%, transparent 70%)`);
    
    // 额外的装饰圆环
    for (let i = 0; i < 3; i++) {
        const px = 20 + (i * 25 + Math.sin(seed * 0.5 + row + col) * 10) % 60;
        const py = 30 + (i * 20 + Math.cos(seed * 0.5 + col + row) * 10) % 50;
        const cc = colors[(i * 5 + row * 3 + col * 7 + seed) % colors.length];
        grads.push(`radial-gradient(circle at ${px}% ${py}%, ${cc}55 0%, transparent 50%)`);
    }
    
    // 基础渐变
    const angleDeg = ((row * 45 + col * 60 + seed) % 360);
    grads.push(`linear-gradient(${angleDeg}deg, ${c1}44, ${c2}44, ${c3}44)`);
    
    return {
        background: grads.join(', '),
        boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.1), inset -1px -1px 3px rgba(0,0,0,0.2)'
    };
}

// ---- 波浪图案 ----
function genWaveTile(row, col, grid, colors, seed, cx, cy, x0, y0, x1, y1) {
    const c1 = colors[(row * 5 + col * 3 + seed) % colors.length];
    const c2 = colors[(row * 3 + col * 7 + seed + 2) % colors.length];
    const c3 = colors[(row * 7 + col * 5 + seed + 4) % colors.length];
    
    // 用波浪函数生成相位偏移
    const phaseX = Math.sin((x0 + x1) * 4 + seed * 0.01) * 0.3;
    const phaseY = Math.cos((y0 + y1) * 4 + seed * 0.01) * 0.3;
    
    const angle = (row * 30 + col * 40 + seed * 0.5) % 360;
    const angle2 = (row * 60 + col * 20 + seed * 0.3 + 45) % 360;
    
    const grads = [];
    
    // 主波浪条纹
    grads.push(`linear-gradient(${angle}deg, ${c1}, ${c2}55 30%, ${c3}44 50%, ${c2}55 70%, ${c1})`);
    // 交叉波浪
    grads.push(`repeating-linear-gradient(${angle2}deg, ${c1}33 0px, ${c2}33 10px, transparent 10px, transparent 20px)`);
    // 径向光晕
    const px = 50 + phaseX * 30;
    const py = 50 + phaseY * 30;
    grads.push(`radial-gradient(circle at ${px}% ${py}%, ${c3}77 0%, transparent 60%)`);
    
    return {
        background: grads.join(', '),
        boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.1), inset -1px -1px 3px rgba(0,0,0,0.15)'
    };
}

// ---- 细胞/有机图案 ----
function genCellularTile(row, col, grid, colors, seed, cx, cy, x0, y0, x1, y1) {
    const c1 = colors[(row * 7 + col * 11 + seed) % colors.length];
    const c2 = colors[(row * 11 + col * 7 + seed + 3) % colors.length];
    const c3 = colors[(row * 13 + col * 5 + seed + 5) % colors.length];
    
    const grads = [];
    
    // 每个格子内部有多个"细胞"气泡
    const numCells = 2 + (row * col) % 3;
    for (let i = 0; i < numCells; i++) {
        const px = 15 + (i * 37 + row * 23 + col * 17 + seed) % 70;
        const py = 15 + (i * 43 + col * 29 + row * 13 + seed) % 70;
        const size = 20 + (i * 13 + row * 7 + col * 11) % 40;
        const cc = colors[(i * 7 + row * 5 + col * 3 + seed) % colors.length];
        grads.push(`radial-gradient(circle at ${px}% ${py}%, ${cc}66 0%, ${cc}22 ${size}%, transparent ${size + 10}%)`);
    }
    
    // 细胞壁/分界线
    grads.push(`linear-gradient(${(row * 45 + col * 35) % 360}deg, ${c1}44, ${c2}44, ${c3}44)`);
    
    // 额外的有机形状
    const px2 = 30 + Math.sin(row * 2.1 + col * 1.3 + seed * 0.01) * 25;
    const py2 = 30 + Math.cos(col * 2.1 + row * 1.3 + seed * 0.01) * 25;
    grads.push(`radial-gradient(ellipse at ${px2}% ${py2}%, ${c3}55 0%, transparent 50%)`);
    
    return {
        background: grads.join(', '),
        boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.08), inset -1px -1px 3px rgba(0,0,0,0.2)'
    };
}

// ---- 螺旋图案 ----
function genSpiralTile(row, col, grid, colors, seed, cx, cy, x0, y0, x1, y1) {
    const c1 = colors[(row * 3 + col * 7 + seed) % colors.length];
    const c2 = colors[(row * 7 + col * 3 + seed + 2) % colors.length];
    const c3 = colors[(row * 5 + col * 11 + seed + 4) % colors.length];
    
    const grads = [];
    
    // 螺旋中心偏移（每个格子不同）
    const spiralCenterX = 50 + Math.sin(row * 1.7 + col * 2.3 + seed * 0.01) * 15;
    const spiralCenterY = 50 + Math.cos(col * 1.7 + row * 2.3 + seed * 0.01) * 15;
    
    // 锥形/旋转变换效果
    const rotAngle = (row * 40 + col * 50 + seed) % 360;
    const rotAngle2 = (row * 60 + col * 30 + seed + 90) % 360;
    
    grads.push(`conic-gradient(from ${rotAngle}deg at ${spiralCenterX}% ${spiralCenterY}%, ${c1}, ${c2}, ${c3}, ${c1})`);
    grads.push(`radial-gradient(circle at ${spiralCenterX}% ${spiralCenterY}%, ${c3}88 0%, transparent 60%)`);
    grads.push(`linear-gradient(${rotAngle2}deg, ${c1}33, transparent 30%, ${c2}44 60%, transparent 80%, ${c3}33)`);
    
    return {
        background: grads.join(', '),
        boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.1), inset -1px -1px 3px rgba(0,0,0,0.18)'
    };
}

// ---- 条纹图案 ----
function genStripeTile(row, col, grid, colors, seed, cx, cy, x0, y0, x1, y1) {
    const c1 = colors[(row * 5 + col * 7 + seed) % colors.length];
    const c2 = colors[(row * 7 + col * 5 + seed + 2) % colors.length];
    const c3 = colors[(row * 11 + col * 3 + seed + 4) % colors.length];
    
    const grads = [];
    
    // 主要条纹方向
    const angle1 = (row * 30 + col * 20 + seed) % 360;
    const angle2 = (row * 45 + col * 35 + seed + 60) % 360;
    
    // 粗细不同的条纹
    grads.push(`repeating-linear-gradient(${angle1}deg, ${c1} 0px, ${c1} 4px, ${c2}44 4px, ${c2}44 12px, transparent 12px, transparent 16px)`);
    grads.push(`repeating-linear-gradient(${angle2}deg, ${c3}33 0px, transparent 3px, ${c1}44 3px, transparent 8px)`);
    
    // 径向渐变柔化
    grads.push(`radial-gradient(circle at ${30 + (row * 20 + col * 15) % 40}% ${30 + (col * 20 + row * 15) % 40}%, ${c3}44 0%, transparent 70%)`);
    
    return {
        background: grads.join(', '),
        boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.08), inset -1px -1px 3px rgba(0,0,0,0.15)'
    };
}

// ======================================================================
//  渲染拼图棋盘
// ======================================================================
function renderSliding() {
    const boardEl = document.getElementById('sliding-board');
    boardEl.innerHTML = '';
    
    const size = slidingGrid * slidingGrid;
    const blankIndex = getBlankIndex();
    
    boardEl.style.gridTemplateColumns = `repeat(${slidingGrid}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${slidingGrid}, 1fr)`;
    
    for (let i = 0; i < size; i++) {
        const tileValue = slidingBoard[i];
        const tile = document.createElement('div');
        tile.className = 'sliding-tile';
        tile.dataset.index = i;
        
        const isBlank = (tileValue === size - 1);
        
        if (isBlank) {
            tile.classList.add('empty');
        } else {
            const tileNum = tileValue; // 原始位置编号
            const pattern = tilePatterns[tileNum];
            
            if (pattern) {
                tile.style.background = pattern.background;
                tile.style.boxShadow = pattern.boxShadow;
            }
            
            // 编号标签（根据 showNumbers 控制显示）
            const label = document.createElement('span');
            label.className = 'tile-label';
            label.textContent = tileNum + 1;
            if (!showNumbers) {
                label.style.display = 'none';
            }
            tile.appendChild(label);
            
            // 点击事件
            tile.addEventListener('click', (function(idx) {
                return function(e) {
                    e.stopPropagation();
                    tryMoveTile(idx);
                };
            })(i));
            
            // 触摸事件
            tile.addEventListener('touchstart', (function(idx) {
                return function(e) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    touchStartTime = Date.now();
                    touchTargetTile = idx;
                };
            })(i));
            
            tile.addEventListener('touchmove', (function(idx) {
                return function(e) {
                    e.preventDefault();
                };
            })(i));
            
            tile.addEventListener('touchend', (function(idx) {
                return function(e) {
                    if (touchTargetTile === null) return;
                    const dt = Date.now() - touchStartTime;
                    if (dt > 500) {
                        touchTargetTile = null;
                        return;
                    }
                    const touchEnd = e.changedTouches[0];
                    const dx = touchEnd.clientX - touchStartX;
                    const dy = touchEnd.clientY - touchStartY;
                    const absDx = Math.abs(dx);
                    const absDy = Math.abs(dy);
                    const minSwipe = 10;
                    
                    if (absDx < minSwipe && absDy < minSwipe) {
                        touchTargetTile = null;
                        return;
                    }
                    
                    const blankIdx = getBlankIndex();
                    const bRow = Math.floor(blankIdx / slidingGrid);
                    const bCol = blankIdx % slidingGrid;
                    
                    let targetIdx = -1;
                    if (absDx > absDy) {
                        if (dx > 0) {
                            if (bCol + 1 < slidingGrid) targetIdx = blankIdx + 1;
                        } else {
                            if (bCol - 1 >= 0) targetIdx = blankIdx - 1;
                        }
                    } else {
                        if (dy > 0) {
                            if (bRow + 1 < slidingGrid) targetIdx = blankIdx + slidingGrid;
                        } else {
                            if (bRow - 1 >= 0) targetIdx = blankIdx - slidingGrid;
                        }
                    }
                    
                    if (targetIdx >= 0 && targetIdx < size && slidingBoard[targetIdx] !== size - 1) {
                        tryMoveTile(targetIdx);
                    }
                    touchTargetTile = null;
                };
            })(i));
        }
        
        boardEl.appendChild(tile);
    }
}

// ======================================================================
//  预览完整图案
// ======================================================================
function showSlidingPreview() {
    if (isPreviewOpen) {
        closeSlidingPreview();
        return;
    }
    
    const previewArea = document.getElementById('sliding-preview-area');
    const size = slidingGrid * slidingGrid;
    
    previewArea.innerHTML = '';
    previewArea.style.display = 'grid';
    previewArea.style.gridTemplateColumns = `repeat(${slidingGrid}, 1fr)`;
    previewArea.style.gridTemplateRows = `repeat(${slidingGrid}, 1fr)`;
    previewArea.style.gap = '2px';
    previewArea.style.background = '#2a1f3d';
    previewArea.style.padding = '3px';
    previewArea.style.borderRadius = '12px';
    previewArea.style.border = '3px solid rgba(0, 212, 255, 0.4)';
    previewArea.style.width = 'min(70vw, 300px)';
    previewArea.style.height = 'min(70vw, 300px)';
    previewArea.style.margin = '12px auto';
    
    for (let i = 0; i < size; i++) {
        const tileValue = i;
        const tile = document.createElement('div');
        tile.style.borderRadius = '3px';
        tile.style.position = 'relative';
        tile.style.minWidth = '0';
        tile.style.minHeight = '0';
        
        const isBlank = (tileValue === size - 1);
        if (isBlank) {
            tile.style.background = 'rgba(0,0,0,0.2)';
            tile.style.border = '1px dashed rgba(255,255,255,0.15)';
        } else {
            const pattern = tilePatterns[tileValue];
            if (pattern) {
                tile.style.background = pattern.background;
                tile.style.boxShadow = pattern.boxShadow;
            }
            tile.style.border = '1px solid rgba(255,255,255,0.2)';
        }
        previewArea.appendChild(tile);
    }
    
    document.getElementById('sliding-preview-modal').classList.add('show');
    isPreviewOpen = true;
}

function closeSlidingPreview() {
    document.getElementById('sliding-preview-modal').classList.remove('show');
    isPreviewOpen = false;
}

// ======================================================================
//  胜利弹窗
// ======================================================================
function showSlidingWinModal() {
    const themeData = SLIDING_THEMES[slidingTheme];
    const themeName = themeData ? themeData.name : '未知';
    const gridDesc = `${slidingGrid}×${slidingGrid}`;
    
    const size = slidingGrid * slidingGrid;
    const optimalMoves = size * 2;
    let rating = '⭐⭐⭐';
    let ratingText = '大师级';
    if (slidingMoves <= optimalMoves) {
        rating = '⭐⭐⭐';
        ratingText = '大师级';
    } else if (slidingMoves <= optimalMoves * 2) {
        rating = '⭐⭐';
        ratingText = '优秀';
    } else {
        rating = '⭐';
        ratingText = '继续加油';
    }
    
    const timeStr = formatSlidingTime(slidingSeconds);
    
    document.getElementById('modal-title').textContent = '🎉 拼图完成！';
    document.getElementById('modal-msg').innerHTML = `
        主题: ${themeData.icon} ${themeName} (${gridDesc})<br>
        步数: ${slidingMoves} 步 | 用时: ${timeStr}<br>
        评级: ${rating} ${ratingText}
    `;
    document.getElementById('modal-content').className = 'modal-content win';
    document.getElementById('game-modal').classList.add('show');
    
    const modalBtn = document.querySelector('#game-modal .modal-btn');
    modalBtn.onclick = function() {
        closeModal();
    };
}

function formatSlidingTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}分${s}秒` : `${s}秒`;
}

function closeModal() {
    document.getElementById('game-modal').classList.remove('show');
    resetSlidingGame();
}

// ======================================================================
//  键盘快捷键
// ======================================================================
document.addEventListener('keydown', (e) => {
    const gameArea = document.getElementById('sliding');
    if (!gameArea) return;
    
    const key = e.key;
    const blankIdx = getBlankIndex();
    const bRow = Math.floor(blankIdx / slidingGrid);
    const bCol = blankIdx % slidingGrid;
    const size = slidingGrid * slidingGrid;
    
    let targetIdx = -1;
    
    switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (bRow + 1 < slidingGrid) targetIdx = blankIdx + slidingGrid;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (bRow - 1 >= 0) targetIdx = blankIdx - slidingGrid;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (bCol + 1 < slidingGrid) targetIdx = blankIdx + 1;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (bCol - 1 >= 0) targetIdx = blankIdx - 1;
            break;
        case ' ':
            e.preventDefault();
            startSlidingGame();
            return;
        case 'r':
        case 'R':
            resetSlidingGame();
            return;
        case 'p':
        case 'P':
            showSlidingPreview();
            return;
        case 'n':
        case 'N':
            toggleSlidingNumbers();
            return;
    }
    
    if (targetIdx >= 0 && targetIdx < size && slidingBoard[targetIdx] !== size - 1) {
        e.preventDefault();
        tryMoveTile(targetIdx);
    }
});
