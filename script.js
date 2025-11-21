// --- 1. 樱花飘落效果控制 ---
let sakuraInterval = null;
let sakuraSpeed = 60; // 默认中等速度 0-100%
let sakuraCount = 150; // 默认数量 150朵
let sakuraActive = false;
let currentSakuraCount = 0; // 当前页面上的樱花数量

function getIntervalTime() {
    // 根据百分比速度设置间隔时间：0%(最慢)=1000ms, 100%(最快)=100ms
    return 1000 - (sakuraSpeed * 9);
}

function getAnimationDuration() {
    // 根据百分比速度设置动画持续时间：0%(最慢)=30s, 100%(最快)=3s
    return 30 - (sakuraSpeed * 0.27);
}

function createSakura() {
    // 如果当前樱花数量已达到最大限制，则不再创建新的樱花
    if (currentSakuraCount >= sakuraCount) {
        return;
    }
    
    const container = document.getElementById('sakura-container');
    const sakura = document.createElement('span');
    sakura.classList.add('sakura');
    sakura.innerHTML = '🌸'; // 可以改成 '❀' 或图片
    
    // 随机大小
    const size = Math.random() * 15 + 10 + 'px';
    sakura.style.fontSize = size;
    
    // 随机位置
    sakura.style.left = Math.random() * 100 + 'vw';
    
    // 根据速度设置动画时间
    const duration = Math.random() * (getAnimationDuration() / 2) + getAnimationDuration() / 2 + 's';
    sakura.style.animationDuration = duration;
    
    // 随机延迟
    sakura.style.animationDelay = Math.random() * 5 + 's';

    container.appendChild(sakura);
    currentSakuraCount++;

    // 动画结束后移除元素，防止内存溢出
    setTimeout(() => {
        sakura.remove();
        currentSakuraCount--;
    }, parseFloat(duration) * 1000 + 5000);
}

function startSakura() {
    if (sakuraInterval) clearInterval(sakuraInterval);
    currentSakuraCount = 0;
    sakuraInterval = setInterval(createSakura, getIntervalTime());
    sakuraActive = true;
    updateSakuraStatus();
}

function stopSakura() {
    if (sakuraInterval) {
        clearInterval(sakuraInterval);
        sakuraInterval = null;
    }
    // 清除所有现有的樱花
    const sakuras = document.querySelectorAll('.sakura');
    sakuras.forEach(sakura => sakura.remove());
    sakuraActive = false;
    currentSakuraCount = 0;
    updateSakuraStatus();
}

function toggleSakura() {
    if (sakuraActive) {
        stopSakura();
    } else {
        startSakura();
    }
}

function updateSakuraSpeed(speed) {
    sakuraSpeed = speed;
    
    // 更新速度滑块显示
    const speedSlider = document.getElementById('sakuraSpeedSlider');
    if (speedSlider) {
        speedSlider.value = speed;
    }
    
    // 更新速度文本显示为百分比
    const speedValue = document.getElementById('sakuraSpeedValue');
    if (speedValue) {
        speedValue.textContent = speed + '%';
    }
    
    // 如果樱花正在飘落，重新启动以应用新速度
    if (sakuraActive) {
        startSakura();
    }
    
    // 保存到本地存储
    localStorage.setItem('sakuraSpeed', speed.toString());
}

function updateSakuraCount(count) {
    sakuraCount = count;
    
    // 更新数量滑块显示
    const countSlider = document.getElementById('sakuraCountSlider');
    if (countSlider) {
        countSlider.value = count;
    }
    
    // 更新数量文本显示
    const countValue = document.getElementById('sakuraCountValue');
    if (countValue) {
        countValue.textContent = count + ' 朵';
    }
    
    // 如果樱花正在飘落，重新启动以应用新数量
    if (sakuraActive) {
        startSakura();
    }
    
    // 保存到本地存储
    localStorage.setItem('sakuraCount', count.toString());
}

function updateSakuraStatus() {
    const sakuraStatusText = document.getElementById('sakuraStatusText');
    const sakuraToggleBtn = document.getElementById('sakuraToggleBtn');
    
    if (sakuraStatusText && sakuraToggleBtn) {
        if (sakuraActive) {
            sakuraStatusText.textContent = '已开启';
            sakuraToggleBtn.textContent = '🌸 关闭樱花飘落';
            sakuraToggleBtn.classList.add('active');
        } else {
            sakuraStatusText.textContent = '已关闭';
            sakuraToggleBtn.textContent = '🌸 开启樱花飘落';
            sakuraToggleBtn.classList.remove('active');
        }
    }
    
    // 保存状态到本地存储
    localStorage.setItem('sakuraActive', sakuraActive.toString());
}

// 初始化
// 从本地存储加载设置
const savedSakuraActive = localStorage.getItem('sakuraActive');
const savedSakuraSpeed = localStorage.getItem('sakuraSpeed');
const savedSakuraCount = localStorage.getItem('sakuraCount');

if (savedSakuraActive !== null) {
    sakuraActive = savedSakuraActive === 'true';
}

if (savedSakuraSpeed) {
    sakuraSpeed = parseInt(savedSakuraSpeed);
    // 如果是旧版本的速度值(1-5)，转换为新的百分比系统
    if (sakuraSpeed >= 1 && sakuraSpeed <= 5) {
        sakuraSpeed = (sakuraSpeed - 1) * 25; // 转换为0, 25, 50, 75, 100
    }
}

if (savedSakuraCount) {
    sakuraCount = parseInt(savedSakuraCount);
}

// 初始化樱花效果
if (sakuraActive) {
    startSakura();
} else {
    // 默认禁用状态下设置定时器，但不启动
    sakuraInterval = null;
}

// 初始化速度和数量设置
updateSakuraSpeed(sakuraSpeed);
updateSakuraCount(sakuraCount);
updateSakuraStatus();

// 添加事件监听器，连接HTML控件和JavaScript函数
document.addEventListener('DOMContentLoaded', () => {
    // 切换按钮事件
    const toggleBtn = document.getElementById('sakuraToggleBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSakura);
    }
    
    // 速度滑块控制事件
    const speedSlider = document.getElementById('sakuraSpeedSlider');
    if (speedSlider) {
        speedSlider.addEventListener('input', () => {
            updateSakuraSpeed(parseInt(speedSlider.value));
        });
    }
    
    // 数量滑块控制事件
    const countSlider = document.getElementById('sakuraCountSlider');
    if (countSlider) {
        countSlider.addEventListener('input', () => {
            updateSakuraCount(parseInt(countSlider.value));
        });
    }
});


// --- 2. 主题切换 ---
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.body;
let themeOverride = false; // 标记是否用户手动覆盖了系统主题

// 检查本地存储是否有保存的主题
const savedTheme = localStorage.getItem('theme');
const savedThemeOverride = localStorage.getItem('themeOverride');

// 如果有保存的主题覆盖状态，使用它
if (savedThemeOverride !== null) {
    themeOverride = savedThemeOverride === 'true';
}

// 初始化主题
if (savedTheme) {
    // 如果有保存的主题，使用它
    body.setAttribute('data-theme', savedTheme);
    updateBtnText(savedTheme);
} else {
    // 如果没有保存的主题，尝试根据系统主题设置
    detectSystemTheme();
}

// 添加系统主题变化监听器
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addEventListener('change', (e) => {
    // 只有在没有用户手动覆盖主题的情况下，才根据系统变化切换
    if (!themeOverride) {
        const systemTheme = e.matches ? 'dark' : 'light';
        applyTheme(systemTheme);
    }
});

// 检测系统主题设置
function detectSystemTheme() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = isDarkMode ? 'dark' : 'light';
    applyTheme(systemTheme);
}

// 应用主题设置
function applyTheme(theme) {
    if (theme === 'dark') {
        body.setAttribute('data-theme', 'dark');
    } else {
        body.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
    updateBtnText(theme);
}

// --- 3. 背景模糊控制 ---
const blurToggleBtn = document.getElementById('blurToggleBtn');
const cardBlurSlider = document.getElementById('cardBlurSlider');
const cardBlurAmount = document.getElementById('cardBlurAmount');
const bgImgBlurSlider = document.getElementById('bgImgBlurSlider');
const bgImgBlurAmount = document.getElementById('bgImgBlurAmount');
const blurResetBtn = document.getElementById('blurResetBtn');
const blurStatusText = document.getElementById('blurStatusText');
const blurControls = document.querySelector('.blur-controls');

const DEFAULT_CARD_BLUR = 2;
const DEFAULT_BG_IMG_BLUR = 10;
let isBlurEnabled = true;

// 创建背景图层用于背景图片模糊
let bgBlurLayer = document.createElement('div');
bgBlurLayer.id = 'bgBlurLayer';
bgBlurLayer.style.position = 'fixed';
bgBlurLayer.style.top = '0';
bgBlurLayer.style.left = '0';
bgBlurLayer.style.width = '100%';
bgBlurLayer.style.height = '100%';
bgBlurLayer.style.pointerEvents = 'none';
bgBlurLayer.style.zIndex = '-2'; // 放在body后面
// 设置与body相同的背景图片和样式
bgBlurLayer.style.backgroundImage = getComputedStyle(body).getPropertyValue('--bg-image');
bgBlurLayer.style.backgroundSize = 'cover';
bgBlurLayer.style.backgroundPosition = 'center';
bgBlurLayer.style.backgroundAttachment = 'fixed';
body.appendChild(bgBlurLayer);

// 当主题切换时更新背景图层的图片
themeToggleBtn.addEventListener('click', function updateBgLayerOnThemeChange() {
    setTimeout(() => {
        bgBlurLayer.style.backgroundImage = getComputedStyle(body).getPropertyValue('--bg-image');
    }, 100);
});

// 检查本地存储的设置
const savedIsEnabled = localStorage.getItem('blurEnabled');
const savedCardBlur = localStorage.getItem('cardBlur');
const savedBgImgBlur = localStorage.getItem('bgImgBlur');

// 初始化设置
if (savedIsEnabled !== null) {
    isBlurEnabled = savedIsEnabled === 'true';
    updateBlurEnabled(isBlurEnabled);
} else {
    updateBlurEnabled(true);
}

if (savedCardBlur) {
    const cardBlurValue = parseInt(savedCardBlur);
    updateCardBlur(cardBlurValue);
    cardBlurSlider.value = cardBlurValue;
    cardBlurAmount.textContent = `${cardBlurValue}%`;
} else {
    updateCardBlur(DEFAULT_CARD_BLUR);
}

if (savedBgImgBlur) {
    const bgImgBlurValue = parseInt(savedBgImgBlur);
    updateBgImgBlur(bgImgBlurValue);
    bgImgBlurSlider.value = bgImgBlurValue;
    bgImgBlurAmount.textContent = `${bgImgBlurValue}%`;
} else {
    updateBgImgBlur(DEFAULT_BG_IMG_BLUR);
}

// 开关按钮事件监听
blurToggleBtn.addEventListener('click', toggleBlurEnabled);

function toggleBlurEnabled() {
    isBlurEnabled = !isBlurEnabled;
    updateBlurEnabled(isBlurEnabled);
    
    // 保存状态到本地存储
    localStorage.setItem('blurEnabled', isBlurEnabled.toString());
}

function updateBlurEnabled(enabled) {
    if (enabled) {
        blurToggleBtn.classList.add('active');
        blurToggleBtn.textContent = '🌫️ 开启背景模糊';
        blurControls.style.opacity = '1';
        blurControls.style.pointerEvents = 'auto';
        blurStatusText.textContent = '已开启';
        
        // 应用保存的模糊值
        updateCardBlur(parseInt(cardBlurSlider.value));
        updateBgImgBlur(parseInt(bgImgBlurSlider.value));
    } else {
        blurToggleBtn.classList.remove('active');
        blurToggleBtn.textContent = '🌫️ 关闭背景模糊';
        blurControls.style.opacity = '0.6';
        blurControls.style.pointerEvents = 'none';
        blurStatusText.textContent = '已关闭';
        
        // 禁用模糊
        updateCardBlur(0);
        updateBgImgBlur(0);
    }
}

// 卡片模糊滑块事件监听
cardBlurSlider.addEventListener('input', () => {
    const blurValue = parseInt(cardBlurSlider.value);
    cardBlurAmount.textContent = `${blurValue}%`;
    
    if (isBlurEnabled) {
        updateCardBlur(blurValue);
    }
    
    // 保存到本地存储
    localStorage.setItem('cardBlur', blurValue.toString());
});

// 背景图片模糊滑块事件监听
bgImgBlurSlider.addEventListener('input', () => {
    const blurValue = parseInt(bgImgBlurSlider.value);
    bgImgBlurAmount.textContent = `${blurValue}%`;
    
    if (isBlurEnabled) {
        updateBgImgBlur(blurValue);
    }
    
    // 保存到本地存储
    localStorage.setItem('bgImgBlur', blurValue.toString());
});

// 重置背景模糊按钮事件监听
blurResetBtn.addEventListener('click', () => {
    // 重置滑块
    cardBlurSlider.value = DEFAULT_CARD_BLUR;
    bgImgBlurSlider.value = DEFAULT_BG_IMG_BLUR;
    cardBlurAmount.textContent = `${DEFAULT_CARD_BLUR}%`;
    bgImgBlurAmount.textContent = `${DEFAULT_BG_IMG_BLUR}%`;
    
    // 保存到本地存储
    localStorage.setItem('cardBlur', DEFAULT_CARD_BLUR.toString());
    localStorage.setItem('bgImgBlur', DEFAULT_BG_IMG_BLUR.toString());
    
    if (isBlurEnabled) {
        updateCardBlur(DEFAULT_CARD_BLUR);
        updateBgImgBlur(DEFAULT_BG_IMG_BLUR);
    }
});

// 更新卡片模糊度的函数 - 百分比显示
function updateCardBlur(blurValue) {
    // 将百分比转换为合适的像素值 (0-20%映射到0-20px)
    const pixelValue = blurValue;
    
    // 为设置面板本身添加模糊效果（面板模糊度增强）
    const settingsPanel = document.getElementById('settingsPanel');
    settingsPanel.style.backdropFilter = `blur(${pixelValue * 1.5}px)`;
    settingsPanel.style.WebkitBackdropFilter = `blur(${pixelValue * 1.5}px)`;
    
    // 为所有玻璃效果元素应用相同的模糊度
    const glassElements = document.querySelectorAll('.glass-effect');
    glassElements.forEach(element => {
        element.style.backdropFilter = `blur(${pixelValue}px)`;
        element.style.WebkitBackdropFilter = `blur(${pixelValue}px)`;
    });
    
    // 为设置触发器按钮应用相同的模糊度
    const settingsTrigger = document.querySelector('.settings-trigger');
    settingsTrigger.style.backdropFilter = `blur(${pixelValue}px)`;
    settingsTrigger.style.WebkitBackdropFilter = `blur(${pixelValue}px)`;
}

// 更新背景图片模糊度的函数 - 百分比显示
function updateBgImgBlur(blurValue) {
    // 将百分比转换为合适的像素值 (0-20%映射到0-20px)
    const pixelValue = blurValue;
    
    bgBlurLayer.style.filter = `blur(${pixelValue}px)`;
    bgBlurLayer.style.WebkitFilter = `blur(${pixelValue}px)`;
}

// --- 4. 侧边栏设置 ---

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    let newTheme;
    
    if (currentTheme === 'dark') {
        body.removeAttribute('data-theme');
        newTheme = 'light';
    } else {
        body.setAttribute('data-theme', 'dark');
        newTheme = 'dark';
    }
    
    // 设置主题并保存到本地存储
    localStorage.setItem('theme', newTheme);
    // 标记用户已手动覆盖系统主题
    themeOverride = true;
    localStorage.setItem('themeOverride', 'true');
    updateBtnText(newTheme);
});

function updateBtnText(theme) {
    if (theme === 'dark') {
        themeToggleBtn.innerText = '☀️ 切换浅色';
    } else {
        themeToggleBtn.innerText = '🌙 切换深色';
    }
}


// --- 3. 侧边栏设置 ---
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    const isActive = panel.classList.toggle('active');
    const miniPlayer = document.getElementById('miniPlayer');
    const miniCalendar = document.getElementById('miniCalendar');
    
    // 当设置面板展开时，同时最小化播放器和日历
    if (isActive) {
        // 保存当前状态，用于后续恢复
        if (miniPlayer) {
            panel.dataset.playerMinimized = miniPlayer.classList.contains('mini-minimized');
            miniPlayer.classList.add('mini-minimized');
        }
        if (miniCalendar) {
            panel.dataset.calendarMinimized = miniCalendar.classList.contains('calendar-minimized');
            miniCalendar.classList.add('calendar-minimized');
        }
    } else {
        // 当设置面板关闭时，恢复播放器和日历的之前状态
        if (miniPlayer) {
            // 只有在之前不是最小化状态时才移除最小化类
            if (panel.dataset.playerMinimized !== 'true') {
                miniPlayer.classList.remove('mini-minimized');
            }
        }
        if (miniCalendar) {
            // 只有在之前不是最小化状态时才移除最小化类
            if (panel.dataset.calendarMinimized !== 'true') {
                miniCalendar.classList.remove('calendar-minimized');
            }
        }
        // 清理保存的状态
        delete panel.dataset.playerMinimized;
        delete panel.dataset.calendarMinimized;
    }
}


// --- 4. 高级音乐播放器功能 ---
const bgAudio = document.getElementById('bgAudio');
const musicStatus = document.getElementById('musicStatus');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const volumeSlider = document.getElementById('volumeSlider');
const volumePercent = document.getElementById('volumePercent');
const volumeIcon = document.querySelector('.volume-icon');

// 初始化音量
let isPlaying = false;
let isDragging = false;

// 创建迷你播放器
function createMiniPlayer() {
    const miniPlayer = document.createElement('div');
    miniPlayer.id = 'miniPlayer';
    miniPlayer.className = 'mini-player';
    miniPlayer.innerHTML = `
        <div class="mini-progress-container">
            <div class="mini-progress-bar">
                <div class="mini-progress-fill"></div>
            </div>
        </div>
        <div class="mini-controls">
            <button id="miniPlayPause" class="mini-play-pause-btn">▶</button>
            <div class="mini-info">
                <div class="mini-status"></div>
                <div class="mini-time"></div>
            </div>
            <div class="mini-actions">
                <button id="miniMinimize" class="mini-minimize-btn">–</button>
                <button id="miniClose" class="mini-close-btn">×</button>
            </div>
        </div>
        <!-- 迷你日历组件 -->
        <div id="miniCalendar" class="mini-calendar">
            <div class="calendar-header">
                <div class="calendar-title">日历</div>
                <div class="calendar-actions">
                    <button id="calendarMinimize" class="calendar-minimize-btn">–</button>
                    <button id="calendarClose" class="calendar-close-btn">×</button>
                </div>
            </div>
            <div class="calendar-content">
                <div class="calendar-info">
                    <span id="currentTimeDisplay" class="time">--:--</span>
                    <span id="currentWeekday" class="weekday">--</span>
                    <span id="currentYear" class="year">----</span>
                </div>
            </div>
            <!-- 日历最小化图标 -->
            <div class="calendar-minimized-icon">日历</div>
        </div>
    `;
    document.body.appendChild(miniPlayer);
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .mini-player {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 220px;
            height: 60px;
            background: rgba(255, 240, 245, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(255, 105, 180, 0.2);
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 182, 193, 0.3);
        }
        
        body[data-theme="dark"] .mini-player {
            background: rgba(40, 30, 35, 0.95);
            box-shadow: 0 4px 15px rgba(255, 105, 180, 0.1);
            border: 1px solid rgba(255, 182, 193, 0.1);
        }
        
        /* 迷你日历样式 */
        .mini-calendar {
            display: none;
            position: absolute;
            bottom: 100%;
            right: 0;
            margin-bottom: 10px;
            width: 220px;
            background: rgba(255, 240, 245, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 8px;
            border: 1px solid rgba(255, 182, 193, 0.3);
            box-shadow: 0 4px 15px rgba(255, 105, 180, 0.2);
            z-index: 1001;
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        /* 日历最小化状态样式 */
        .mini-calendar.calendar-minimized {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffc7d6, #ffbdd1);
            box-shadow: 0 4px 12px rgba(255, 187, 212, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        body[data-theme="dark"] .mini-calendar.calendar-minimized {
            background: linear-gradient(135deg, #ffbdd1, #ff9ccd);
            box-shadow: 0 4px 12px rgba(255, 187, 212, 0.15);
        }
        
        /* 日历最小化图标样式 */
        .calendar-minimized-icon {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 10px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        body[data-theme="dark"] .calendar-minimized-icon {
            color: white;
        }
        
        /* 日历最小化时显示图标 */
        .mini-calendar.calendar-minimized .calendar-minimized-icon {
            opacity: 1;
            z-index: 2;
        }
        
        /* 日历最小化时隐藏其他内容 */
        .mini-calendar.calendar-minimized .calendar-header,
        .mini-calendar.calendar-minimized .calendar-content {
            display: none;
        }
        
        body[data-theme="dark"] .mini-calendar {
            background: rgba(40, 30, 35, 0.95);
            border: 1px solid rgba(255, 182, 193, 0.1);
            box-shadow: 0 4px 15px rgba(255, 105, 180, 0.1);
        }
        
        .mini-calendar.visible {
            display: block;
            animation: slide-up 0.3s ease-out;
        }
        
        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            border-bottom: 1px solid rgba(255, 182, 193, 0.2);
        }
        
        body[data-theme="dark"] .calendar-header {
            border-bottom-color: rgba(255, 182, 193, 0.1);
        }
        
        .calendar-title {
            font-size: 0.9rem;
            font-weight: bold;
            color: var(--text-main);
        }
        
        .calendar-actions {
            display: flex;
            gap: 6px;
        }
        
        .calendar-minimize-btn,
        .calendar-close-btn {
            background: rgba(255, 105, 180, 0.1);
            border: 1px solid rgba(255, 182, 193, 0.3);
            font-size: 14px;
            cursor: pointer;
            padding: 5px 8px;
            border-radius: 5px;
            transition: all 0.2s ease;
            color: #ff69b4;
            flex-shrink: 0;
        }
        
        .calendar-minimize-btn:hover,
        .calendar-close-btn:hover {
            background: rgba(255, 105, 180, 0.2);
            transform: scale(1.05);
        }
        
        body[data-theme="dark"] .calendar-minimize-btn,
        body[data-theme="dark"] .calendar-close-btn {
            background: rgba(255, 105, 180, 0.05);
            border: 1px solid rgba(255, 105, 180, 0.1);
            color: #ff85c0;
        }
        
        body[data-theme="dark"] .calendar-minimize-btn:hover,
        body[data-theme="dark"] .calendar-close-btn:hover {
            background: rgba(255, 105, 180, 0.15);
        }
        
        .calendar-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 12px;
        }
        
        .calendar-info {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }
        
        .calendar-info .time {
            font-size: 1.5rem;
            font-weight: bold;
            color: #ff69b4;
        }
        
        body[data-theme="dark"] .calendar-info .time {
            color: #ff85c0;
        }
        
        .calendar-info .weekday {
            font-size: 0.85rem;
            color: var(--text-main);
            display: block;
        }
        
        .calendar-info .year {
            font-size: 0.85rem;
            color: var(--text-sub);
            display: block;
        }
        
        @keyframes slide-up {
            from {
                transform: translateY(10px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .mini-player:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 105, 180, 0.3);
        }
        
        body[data-theme="dark"] .mini-player:hover {
            box-shadow: 0 6px 20px rgba(255, 105, 180, 0.15);
        }
        
        .mini-progress-container {
            width: 100%;
            height: 4px;
            overflow: hidden;
            border-radius: 2px 2px 0 0;
        }
        
        .mini-progress-bar {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.1);
            cursor: pointer;
        }
        
        body[data-theme="dark"] .mini-progress-bar {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .mini-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #ff69b4, #ff85c0);
            width: 0%;
            transition: width 0.1s ease;
        }
        
        .mini-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            flex: 1;
        }
        
        .mini-play-pause-btn {
            background: linear-gradient(135deg, #ffd9e3, #ffc7d6);
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 6px;
            transition: all 0.2s ease;
            flex-shrink: 0;
            color: white;
            box-shadow: 0 2px 6px rgba(255, 187, 212, 0.2);
        }
        
        .mini-play-pause-btn:hover {
            background: linear-gradient(135deg, #ffbdd1, #ffacc8);
            transform: scale(1.05);
            box-shadow: 0 3px 8px rgba(255, 187, 212, 0.3);
        }
        
        body[data-theme="dark"] .mini-play-pause-btn {
            background: linear-gradient(135deg, #ffbdd1, #ff9ccd);
            box-shadow: 0 2px 6px rgba(255, 187, 212, 0.15);
        }
        
        body[data-theme="dark"] .mini-play-pause-btn:hover {
            background: linear-gradient(135deg, #ff9ccd, #ff85c0);
        }
        
        .mini-info {
            flex: 1;
            margin: 0 12px;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        
        .mini-status {
            font-size: 12px;
            font-weight: 500;
            color: #ff69b4;
        }
        
        body[data-theme="dark"] .mini-status {
            color: #ff85c0;
        }
        
        .mini-time {
            font-size: 11px;
            color: #ff85c0;
        }
        
        body[data-theme="dark"] .mini-time {
            color: #ff9ccd;
        }
        
        .mini-actions {
            display: flex;
            gap: 6px;
        }
        
        .mini-minimize-btn, .mini-close-btn {
            background: rgba(255, 105, 180, 0.1);
            border: 1px solid rgba(255, 182, 193, 0.3);
            font-size: 14px;
            cursor: pointer;
            padding: 5px 8px;
            border-radius: 5px;
            transition: all 0.2s ease;
            color: #ff69b4;
            flex-shrink: 0;
        }
        
        .mini-minimize-btn:hover, .mini-close-btn:hover {
            background: rgba(255, 105, 180, 0.2);
            transform: scale(1.05);
        }
        
        body[data-theme="dark"] .mini-minimize-btn, 
        body[data-theme="dark"] .mini-close-btn {
            background: rgba(255, 105, 180, 0.05);
            border: 1px solid rgba(255, 105, 180, 0.1);
            color: #ff85c0;
        }
        
        body[data-theme="dark"] .mini-minimize-btn:hover, 
        body[data-theme="dark"] .mini-close-btn:hover {
            background: rgba(255, 105, 180, 0.15);
        }
        
        .mini-minimized {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #ffc7d6, #ffbdd1);
            box-shadow: 0 4px 12px rgba(255, 187, 212, 0.3);
        }
        
        body[data-theme="dark"] .mini-minimized {
            background: linear-gradient(135deg, #ffbdd1, #ff9ccd);
            box-shadow: 0 4px 12px rgba(255, 187, 212, 0.15);
        }
        
        .mini-minimized .mini-controls,
        .mini-minimized .mini-progress-container {
            display: none;
        }
        
        .mini-minimized-icon {
            color: white;
            font-size: 16px;
            display: none;
        }
        
        .mini-minimized .mini-minimized-icon {
            display: block;
        }
    `;
    document.head.appendChild(style);
    
    // 获取迷你播放器元素
    const miniPlayPauseBtn = document.getElementById('miniPlayPause');
    const miniCloseBtn = document.getElementById('miniClose');
    const miniMinimizeBtn = document.getElementById('miniMinimize');
    const miniProgressBar = document.querySelector('.mini-progress-bar');
    const miniProgressFill = document.querySelector('.mini-progress-fill');
    
    // 添加最小化图标
    const miniMinimizedIcon = document.createElement('div');
    miniMinimizedIcon.className = 'mini-minimized-icon';
    miniMinimizedIcon.textContent = '▶';
    miniPlayer.appendChild(miniMinimizedIcon);
    
    // 获取日历相关元素
    const miniCalendar = document.getElementById('miniCalendar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const currentWeekday = document.getElementById('currentWeekday');
    const currentYear = document.getElementById('currentYear');
    
    // 更新时间和日期显示
    function updateCalendarTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timeString = hours + ':' + minutes;
        currentTimeDisplay.textContent = timeString;
        
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const weekdayString = weekdays[now.getDay()] + ' ' + (now.getMonth() + 1) + '月' + now.getDate() + '日';
        currentWeekday.textContent = weekdayString;
        
        currentYear.textContent = now.getFullYear() + '年';
    }
    
    // 初始化日历
    function initCalendar() {
        console.log('Initializing calendar...');
        
        // 立即更新时间
        updateCalendarTime();
        
        // 每分钟更新一次时间
        setInterval(updateCalendarTime, 60000);
        
        // 每秒更新一次时间，确保时间显示更准确
        setInterval(updateCalendarTime, 1000);
        
        // 确保日历元素存在
        if (!miniCalendar) {
            console.error('Calendar element not found!');
            return;
        }
        
        // 设置日历默认显示
        miniCalendar.classList.add('visible');
        
        // 延迟获取并绑定日历控制按钮事件，确保DOM完全加载
        setTimeout(() => {
            // 获取日历控制按钮
            const calendarMinimizeBtn = document.getElementById('calendarMinimize');
            const calendarCloseBtn = document.getElementById('calendarClose');
            
            if (calendarMinimizeBtn && calendarCloseBtn) {
                console.log('Calendar buttons found, binding events...');
                
                // 日历最小化按钮事件
                calendarMinimizeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('Calendar minimize button clicked');
                    // 切换日历最小化状态
                    miniCalendar.classList.toggle('calendar-minimized');
                });
                
                // 日历关闭按钮事件
                calendarCloseBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('Calendar close button clicked');
                    // 关闭日历，先移除最小化状态再隐藏
                    miniCalendar.classList.remove('calendar-minimized');
                    miniCalendar.classList.remove('visible');
                });
                
                // 获取日历最小化图标并添加点击事件
                const calendarMinimizedIcon = document.querySelector('.calendar-minimized-icon');
                if (calendarMinimizedIcon) {
                    calendarMinimizedIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        console.log('Calendar minimized icon clicked');
                        // 点击最小化图标恢复日历
                        miniCalendar.classList.remove('calendar-minimized');
                    });
                }
            } else {
                console.warn('Calendar control buttons not found');
            }
        }, 150); // 150ms延迟确保DOM完全加载
    }
    
    // 确保DOM加载完成后再初始化
    setTimeout(initCalendar, 100); // 延迟100ms确保DOM元素已完全渲染
    
    // 迷你播放器事件监听
    miniPlayPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡到容器
        togglePlayPause();
    });
    
    miniCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡到容器
        pauseMusic();
        miniPlayer.style.display = 'none';
    });
    
    miniMinimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡到容器
        miniPlayer.classList.toggle('mini-minimized');
    });
    
    miniProgressBar.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡到容器
        const rect = miniProgressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percent = clickX / width;
        setProgress(percent);
    });
    
    // 点击最小化的播放器恢复原状
    miniMinimizedIcon.addEventListener('click', () => {
        miniPlayer.classList.remove('mini-minimized');
    });
    
    // 移除额外的日历切换按钮，使用播放器内置的日历功能
    
    // 点击迷你播放器切换日历显示
    miniPlayer.addEventListener('click', function(e) {
        // 如果点击的是控制按钮或进度条，不切换日历显示
        if (e.target.closest('.mini-controls') || 
            e.target.closest('.mini-progress-container')) {
            return;
        }
        
        // 只在迷你播放器展开状态下切换日历
        if (!miniPlayer.classList.contains('mini-minimized')) {
            miniCalendar.classList.toggle('visible');
        }
    });
    
    // 移除不必要的控制按钮事件监听，因为我们已经移除了这些按钮
    
    // 点击页面其他地方关闭日历
    document.addEventListener('click', function(e) {
        // 获取搜索栏相关元素
        const searchContainer = document.querySelector('.search-container');
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.querySelector('.search-input');
        const searchButton = document.querySelector('.search-button');
        
        // 如果点击的是搜索栏相关元素，不关闭日历
        if (searchContainer && searchContainer.contains(e.target) ||
            searchForm && searchForm.contains(e.target) ||
            searchInput && searchInput.contains(e.target) ||
            searchButton && searchButton.contains(e.target) ||
            // 保留原有的条件
            miniPlayer.contains(e.target) || 
            miniCalendar.contains(e.target)) {
            return; // 不执行关闭日历的操作
        }
        
        // 其他情况关闭日历
        miniCalendar.classList.remove('visible');
    });
    
    // 保存到全局变量
    window.miniPlayer = miniPlayer;
    window.miniPlayPauseBtn = miniPlayPauseBtn;
    window.miniProgressFill = miniProgressFill;
    
    // 更新迷你播放器UI
    function updateMiniPlayerUI() {
        const miniTimeDisplay = document.querySelector('.mini-time');
        const miniStatusDisplay = document.querySelector('.mini-status');
        const miniPlayPauseBtn = document.getElementById('miniPlayPause');
        const miniMinimizedIcon = document.querySelector('.mini-minimized-icon');
        
        // 更新图标状态
        if (miniPlayPauseBtn) {
            miniPlayPauseBtn.textContent = isPlaying ? '⏸' : '▶';
        }
        if (miniMinimizedIcon) {
            miniMinimizedIcon.textContent = isPlaying ? '⏸' : '▶';
        }
        
        // 移除状态文本显示
        if (miniStatusDisplay) {
            miniStatusDisplay.textContent = ''; // 清空状态文本
        }
        
        // 更新进度
        if (bgAudio && !isNaN(bgAudio.duration)) {
            const progressPercent = (bgAudio.currentTime / bgAudio.duration) * 100;
            // 确保progressPercent在0-100范围内
            const clampedProgressPercent = Math.max(0, Math.min(100, progressPercent));
            
            // 更新进度条
            const miniProgressFill = document.querySelector('.mini-progress-fill');
            if (miniProgressFill) {
                miniProgressFill.style.width = `${clampedProgressPercent}%`;
            }
            
            // 更新时间显示 - 确保同时显示当前时间和总时间
            if (miniTimeDisplay) {
                const currentTime = formatTime(bgAudio.currentTime);
                const duration = formatTime(bgAudio.duration);
                miniTimeDisplay.textContent = `${currentTime} / ${duration}`;
            }
        }
    }
    
    // 时间格式化函数 - 移到updateMiniPlayerUI外部以避免重复定义
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // 确保在音频播放过程中持续更新进度
    if (bgAudio) {
        // 时间更新事件
        bgAudio.addEventListener('timeupdate', updateMiniPlayerUI);
        
        // 确保播放状态变化时更新UI
        bgAudio.addEventListener('play', function() {
            isPlaying = true;
            updateMiniPlayerUI();
        });
        
        bgAudio.addEventListener('pause', function() {
            isPlaying = false;
            updateMiniPlayerUI();
        });
        
        bgAudio.addEventListener('ended', function() {
            isPlaying = false;
            updateMiniPlayerUI();
        });
        
        // 确保播放/暂停按钮点击后正确更新UI
        if (miniPlayPauseBtn) {
            // 移除可能存在的旧事件监听器，避免重复绑定
            const newPlayPauseBtn = miniPlayPauseBtn.cloneNode(true);
            miniPlayPauseBtn.parentNode.replaceChild(newPlayPauseBtn, miniPlayPauseBtn);
            window.miniPlayPauseBtn = newPlayPauseBtn;
            
            newPlayPauseBtn.addEventListener('click', function() {
                if (bgAudio) {
                    // 切换播放状态
                    if (isPlaying) {
                        bgAudio.pause();
                        isPlaying = false;
                    } else {
                        bgAudio.play();
                        isPlaying = true;
                    }
                    // 立即更新UI
                    updateMiniPlayerUI();
                }
            });
        }
        
        // 初始化isPlaying状态
        isPlaying = !bgAudio.paused;
        // 初始化UI显示
        updateMiniPlayerUI();
    }
    
    // 强制立即更新UI以确保更改生效
    updateMiniPlayerUI();
    
    // 返回更新函数，供外部调用
    return updateMiniPlayerUI;
}

// 初始化迷你播放器
let updateMiniPlayerUI;
function initMiniPlayer() {
    if (!document.getElementById('miniPlayer')) {
        updateMiniPlayerUI = createMiniPlayer();
    }
}
document.addEventListener('DOMContentLoaded', initMiniPlayer);

bgAudio.volume = 0.2;
volumeSlider.value = 0.2;
volumePercent.textContent = '20%';

// 播放/暂停切换功能
playPauseBtn.addEventListener('click', togglePlayPause);

function togglePlayPause() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    bgAudio.play().then(() => {
        isPlaying = true;
        updatePlayPauseUI();
        musicStatus.innerText = "播放中 🎵";
        musicStatus.style.color = "green";
    }).catch(error => {
        alert("请先与页面交互（点击任意处）再播放，或检查音频文件路径。");
        console.error(error);
    });
}

function pauseMusic() {
    bgAudio.pause();
    isPlaying = false;
    updatePlayPauseUI();
    musicStatus.innerText = "已暂停 ⏸";
    musicStatus.style.color = "var(--text-sub)";
}

function updatePlayPauseUI() {
    if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        playPauseBtn.innerHTML = '<span id="pauseIcon">⏸</span> 暂停';
        // 确保迷你播放器可见
        const miniPlayer = document.getElementById('miniPlayer');
        if (miniPlayer) {
            miniPlayer.style.display = 'flex';
        }
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        playPauseBtn.innerHTML = '<span id="playIcon">▶</span> 播放';
    }
    
    // 更新迷你播放器UI
    if (window.updateMiniPlayerUI) {
        updateMiniPlayerUI();
    }
}

// 进度条更新
function updateProgress() {
    if (isDragging) return;
    
    const currentTime = bgAudio.currentTime;
    const duration = bgAudio.duration || 0;
    const progressPercent = (currentTime / duration) * 100;
    
    progressFill.style.width = `${progressPercent}%`;
    progressHandle.style.left = `${progressPercent}%`;
    
    // 更新时间显示
    currentTimeDisplay.textContent = formatTime(currentTime);
    totalTimeDisplay.textContent = formatTime(duration);
    
    // 更新迷你播放器进度
    if (window.updateMiniPlayerUI) {
        updateMiniPlayerUI();
    }
}

// 格式化时间为 mm:ss
function formatTime(seconds) {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 进度条点击跳转
progressBar.addEventListener('click', handleProgressClick);

function handleProgressClick(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    
    setProgress(percent);
}

function setProgress(percent) {
    const duration = bgAudio.duration || 0;
    bgAudio.currentTime = duration * percent;
    
    progressFill.style.width = `${percent * 100}%`;
    progressHandle.style.left = `${percent * 100}%`;
}

// 进度条拖动功能
function setupEventListeners() {
    // 处理不同浏览器的兼容性
    const touchEventsSupported = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // 绑定鼠标事件
    progressHandle.addEventListener('mousedown', startDrag);
    progressBar.addEventListener('mousedown', startDrag);
    
    // 如果支持触摸事件，也绑定触摸事件
    if (touchEventsSupported) {
        progressHandle.addEventListener('touchstart', startDrag, { passive: false });
        progressBar.addEventListener('touchstart', startDrag, { passive: false });
    }
}

// 初始化事件监听
setupEventListeners();

function startDrag(e) {
    isDragging = true;
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
    
    // 防止文本选择和默认行为
    try {
        e.preventDefault();
    } catch (err) {
        // 忽略某些浏览器的兼容性错误
    }
    
    // 立即更新进度
    updateProgressFromEvent(e);
}

function handleDrag(e) {
    if (!isDragging) return;
    
    try {
        e.preventDefault();
    } catch (err) {
        // 忽略某些浏览器的兼容性错误
    }
    
    updateProgressFromEvent(e);
}

function updateProgressFromEvent(e) {
    const rect = progressBar.getBoundingClientRect();
    let clientX;
    
    // 处理不同类型的事件
    if (e.type.includes('mouse')) {
        clientX = e.clientX;
    } else if (e.type.includes('touch')) {
        clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
    }
    
    const clickX = clientX - rect.left;
    const width = rect.width;
    const percent = Math.max(0, Math.min(1, clickX / width));
    
    progressFill.style.width = `${percent * 100}%`;
    progressHandle.style.left = `${percent * 100}%`;
}

function stopDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('touchmove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
    
    // 应用最终进度
    const rect = progressBar.getBoundingClientRect();
    const percent = parseFloat(progressFill.style.width) / 100;
    setProgress(percent);
}

// 音量控制
volumeSlider.addEventListener('input', handleVolumeChange);

function handleVolumeChange() {
    const volume = parseFloat(volumeSlider.value);
    bgAudio.volume = volume;
    
    // 更新音量百分比显示
    const percent = Math.round(volume * 100);
    volumePercent.textContent = `${percent}%`;
    
    // 更新音量图标
    updateVolumeIcon(volume);
}

function updateVolumeIcon(volume) {
    if (volume === 0) {
        volumeIcon.textContent = '🔇';
    } else if (volume < 0.5) {
        volumeIcon.textContent = '🔈';
    } else {
        volumeIcon.textContent = '🔊';
    }
}

// 双击音量图标静音/取消静音
volumeIcon.addEventListener('click', toggleMute);

function toggleMute() {
    if (bgAudio.volume > 0) {
        // 静音
        bgAudio.volume = 0;
        volumeSlider.value = 0;
        volumePercent.textContent = '0%';
        volumeIcon.textContent = '🔇';
    } else {
        // 恢复音量
        const previousVolume = volumeSlider.getAttribute('data-previous-volume') || 0.3;
        bgAudio.volume = previousVolume;
        volumeSlider.value = previousVolume;
        const percent = Math.round(previousVolume * 100);
        volumePercent.textContent = `${percent}%`;
        updateVolumeIcon(previousVolume);
    }
}

// 音频事件监听
bgAudio.addEventListener('timeupdate', updateProgress);
bgAudio.addEventListener('loadedmetadata', () => {
    // 音频元数据加载完成后更新总时间
    totalTimeDisplay.textContent = formatTime(bgAudio.duration);
});

bgAudio.addEventListener('error', () => {
    musicStatus.innerText = "播放错误 ❌";
    musicStatus.style.color = "red";
    console.error('音频加载错误:', bgAudio.error);
});

// 页面加载完成时自动尝试预加载音频并播放
document.addEventListener('DOMContentLoaded', () => {
    // 尝试预加载音频
    try {
        bgAudio.load();
        // 尝试自动播放音乐
        tryAutoPlay();
    } catch (e) {
        console.warn('音频预加载失败:', e);
    }
    
    // 监听音量变化时保存前一个值
    volumeSlider.addEventListener('change', () => {
        volumeSlider.setAttribute('data-previous-volume', volumeSlider.value);
    });
    
    // 初始保存音量值
    volumeSlider.setAttribute('data-previous-volume', '0.3');
    
    // 为用户交互添加提示
    playPauseBtn.addEventListener('mouseover', () => {
        if (musicStatus.textContent.includes('错误')) {
            musicStatus.title = '点击页面任意位置后重试，或检查音频文件路径';
        }
    });
    
    // 添加用户交互事件，确保在用户交互后可以播放音乐
    document.addEventListener('click', firstUserInteraction);
    document.addEventListener('touchstart', firstUserInteraction, { once: true });
    document.addEventListener('keydown', firstUserInteraction, { once: true });
});

// 尝试自动播放音乐
function tryAutoPlay() {
    try {
        // 直接尝试播放
        bgAudio.play().then(() => {
            console.log('音乐自动播放成功');
            // 移除用户交互监听器，因为已经成功播放
            document.removeEventListener('click', firstUserInteraction);
        }).catch(error => {
            console.warn('自动播放失败，等待用户交互:', error);
            musicStatus.innerText = "点击任意位置播放音乐 🎵"; 
            musicStatus.style.color = "#666";
        });
    } catch (e) {
        console.error('播放尝试错误:', e);
    }
}

// 首次用户交互时播放音乐
function firstUserInteraction() {
    try {
        if (bgAudio.paused) {
            bgAudio.play().then(() => {
                console.log('用户交互后音乐播放成功');
                // 移除所有交互监听器
                document.removeEventListener('click', firstUserInteraction);
                document.removeEventListener('touchstart', firstUserInteraction);
                document.removeEventListener('keydown', firstUserInteraction);
            }).catch(error => {
                console.error('用户交互后播放失败:', error);
                musicStatus.innerText = "播放失败，请检查音频文件 ❌";
                musicStatus.style.color = "red";
            });
        }
    } catch (e) {
        console.error('交互播放错误:', e);
    }
}

// 添加全局错误处理
bgAudio.addEventListener('stalled', () => {
    console.warn('音频加载卡顿');
    musicStatus.innerText = "加载中... ⏳";
    musicStatus.style.color = "orange";
});

bgAudio.addEventListener('waiting', () => {
    console.warn('音频等待数据');
    musicStatus.innerText = "缓冲中... 💾";
    musicStatus.style.color = "orange";
});

bgAudio.addEventListener('playing', () => {
    musicStatus.innerText = "播放中 🎵";
    musicStatus.style.color = "green";
});


// --- 5. 添加网站功能 --- //
const addSiteBtn = document.getElementById('addSiteBtn');
const addSiteModal = document.getElementById('addSiteModal');
const addSiteForm = document.getElementById('addSiteForm');
const siteNameInput = document.getElementById('siteName');
const siteUrlInput = document.getElementById('siteUrl');
const selectedIconInput = document.getElementById('selectedIcon');
const iconOptions = document.querySelectorAll('.icon-option');
const navGrid = document.querySelector('.nav-grid');
const addSiteBtnElement = document.getElementById('addSiteBtn');

// 打开添加网站弹窗
function openAddSiteModal() {
    addSiteModal.classList.add('active');
    // 重置表单
    addSiteForm.reset();
    selectedIconInput.value = 'fas fa-globe';
    // 设置默认选中第一个图标
    iconOptions.forEach(option => option.classList.remove('selected'));
    iconOptions[0].classList.add('selected');
}

// 关闭添加网站弹窗
function closeAddSiteModal() {
    addSiteModal.classList.remove('active');
}

// 为添加网站按钮添加点击事件
addSiteBtn.addEventListener('click', openAddSiteModal);

// 为图标选项添加点击事件
iconOptions.forEach(option => {
    option.addEventListener('click', () => {
        // 移除所有选中状态
        iconOptions.forEach(opt => opt.classList.remove('selected'));
        // 添加当前选中状态
        option.classList.add('selected');
        // 更新隐藏输入值
        selectedIconInput.value = option.dataset.icon;
    });
});

// 实现添加网站功能
function addNewSite() {
    const siteName = siteNameInput.value.trim();
    let siteUrl = siteUrlInput.value.trim();
    const siteIcon = selectedIconInput.value;
    const siteCategory = document.getElementById('siteCategory').value;
    
    // 验证输入
    if (!siteName || !siteUrl) {
        alert('请填写网站名称和URL');
        return;
    }
    
    // 确保URL格式正确
    if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
        siteUrl = 'https://' + siteUrl;
    }
    
    // 生成唯一ID
    const siteId = 'site_' + Date.now();
    
    // 创建新网站对象
    const newSite = {
        id: siteId,
        name: siteName,
        url: siteUrl,
        icon: siteIcon,
        category: siteCategory
    };
    
    // 获取已保存的网站列表
    let savedSites = JSON.parse(localStorage.getItem('savedSites') || '[]');
    
    // 添加新网站
    savedSites.push(newSite);
    
    // 保存到本地存储
    localStorage.setItem('savedSites', JSON.stringify(savedSites));
    
    // 在DOM中添加新网站
    addSiteToDOM(newSite);
    
    // 关闭弹窗
    closeAddSiteModal();
    
    // 显示成功消息
    alert('网站添加成功！');
}

// 将网站添加到DOM
function addSiteToDOM(site) {
    // 创建新的导航项元素
    const newNavItem = document.createElement('a');
    newNavItem.href = site.url;
    newNavItem.target = '_blank';
    newNavItem.classList.add('nav-item', 'glass-effect');
    newNavItem.dataset.siteId = site.id;
    
    // 分割图标类名
    const iconClasses = site.icon.split(' ');
    
    // 设置内容
    newNavItem.innerHTML = `
        <div class="icon-box">
            <i class="${iconClasses.join(' ')} cloud-icon"></i>
        </div>
        <h3>${site.name}</h3>
    `;
    
    // 插入到添加按钮之前
    navGrid.insertBefore(newNavItem, addSiteBtnElement);
    
    // 应用当前的模糊效果
    updateCardBlur(parseInt(cardBlurSlider.value || DEFAULT_CARD_BLUR));
}

// 从本地存储加载保存的网站
function loadSavedSites() {
    const savedSites = JSON.parse(localStorage.getItem('savedSites') || '[]');
    
    savedSites.forEach(site => {
        addSiteToDOM(site);
    });
}

// 页面加载时加载保存的网站
window.addEventListener('DOMContentLoaded', loadSavedSites);

// --- 长按删除网站卡片功能 --- //

// 不可删除的网站列表（固定网站）
const nonDeletableSites = ['哔哩哔哩', '网易云', 'ACG喵导航', '轻小说文库'];
let longPressTimer;
let currentCardElement = null;

// 初始化长按功能
function initLongPressDelete() {
    // 为所有导航卡片添加长按事件监听
    const navItems = document.querySelectorAll('.nav-item.glass-effect');
    
    navItems.forEach(item => {
        // 检查是否为固定网站
        const siteName = item.querySelector('h3')?.textContent;
        const isFixedSite = nonDeletableSites.includes(siteName);
        
        // 为非固定网站添加长按事件
        if (!isFixedSite && item.id !== 'addSiteBtn') {
            // 替换为右键触发
            item.addEventListener('contextmenu', handleContextMenu);
            item.addEventListener('mousedown', handleMouseDown);
            
            item.addEventListener('mouseup', cancelLongPress);
            item.addEventListener('mouseleave', cancelLongPress);
            item.addEventListener('touchend', cancelLongPress);
            item.addEventListener('touchmove', cancelLongPress);
        }
    });
}

// 处理右键菜单事件
function handleContextMenu(e) {
    // 阻止默认右键菜单
    e.preventDefault();
    // 只有在右键点击时才开始长按
    if (e.button === 2) {
        startLongPress.call(this, e);
    }
}

// 处理鼠标按下事件
function handleMouseDown(e) {
    // 只有在右键点击时才开始长按
    if (e.button === 2) {
        startLongPress.call(this, e);
    }
}

// 开始长按计时
function startLongPress(e) {
    // 检查是否为右键点击（button 2为右键）
    if (e && e.button !== undefined && e.button !== 2) {
        return;
    }
    
    // 存储当前卡片元素
    currentCardElement = this;
    
    // 开始计时
    longPressTimer = setTimeout(() => {
        confirmDelete(currentCardElement);
    }, 4000); // 4秒长按
}

// 取消长按计时
function cancelLongPress() {
    clearTimeout(longPressTimer);
    currentCardElement = null;
}

// 确认删除
function confirmDelete(cardElement) {
    // 显示视觉反馈 - 添加高亮效果
    cardElement.classList.add('delete-animation');
    
    // 显示确认对话框
    if (confirm('确定要删除这个网站吗？')) {
        deleteSite(cardElement);
    } else {
        // 移除高亮效果
        setTimeout(() => {
            cardElement.classList.remove('delete-animation');
        }, 300);
    }
}

// 删除网站
function deleteSite(cardElement) {
    const siteId = cardElement.dataset.siteId;
    
    // 如果有ID，说明是用户添加的网站
    if (siteId) {
        // 从本地存储中删除
        let savedSites = JSON.parse(localStorage.getItem('savedSites') || '[]');
        savedSites = savedSites.filter(site => site.id !== siteId);
        localStorage.setItem('savedSites', JSON.stringify(savedSites));
    }
    
    // 从DOM中移除
    cardElement.classList.add('fade-out');
    setTimeout(() => {
        cardElement.remove();
    }, 300);
}

// 为新添加的网站也添加长按事件
function addLongPressEventToNewCard(cardElement) {
    // 替换为右键触发
    cardElement.addEventListener('contextmenu', handleContextMenu);
    cardElement.addEventListener('mousedown', handleMouseDown);
    
    cardElement.addEventListener('mouseup', cancelLongPress);
    cardElement.addEventListener('mouseleave', cancelLongPress);
    cardElement.addEventListener('touchend', cancelLongPress);
    cardElement.addEventListener('touchmove', cancelLongPress);
}

// 修改addSiteToDOM函数，为新添加的网站添加长按事件
const originalAddSiteToDOM = addSiteToDOM;
function enhancedAddSiteToDOM(site) {
    const siteElement = originalAddSiteToDOM(site);
    // 确保新添加的网站可以删除
    addLongPressEventToNewCard(siteElement);
    return siteElement;
}

// 重写addSiteToDOM函数
function addSiteToDOM(site) {
    // 创建新的导航项元素
    const newNavItem = document.createElement('a');
    newNavItem.href = site.url;
    newNavItem.target = '_blank';
    newNavItem.classList.add('nav-item', 'glass-effect');
    newNavItem.dataset.siteId = site.id;
    
    // 分割图标类名
    const iconClasses = site.icon.split(' ');
    
    // 设置内容
    newNavItem.innerHTML = `
        <div class="icon-box">
            <i class="${iconClasses.join(' ')} cloud-icon"></i>
        </div>
        <h3>${site.name}</h3>
    `;
    
    // 插入到添加按钮之前
    navGrid.insertBefore(newNavItem, addSiteBtnElement);
    
    // 应用当前的模糊效果
    updateCardBlur(parseInt(cardBlurSlider.value || DEFAULT_CARD_BLUR));
    
    // 添加长按事件
    addLongPressEventToNewCard(newNavItem);
    
    return newNavItem;
}

// 页面加载完成后初始化长按功能
window.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保所有卡片都已加载
    setTimeout(initLongPressDelete, 500);
});

// --- 关于我弹窗控制 --- 
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.add('active');
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.remove('active');
        // 恢复背景滚动
        document.body.style.overflow = '';
    }
}

// 为关于我卡片文本添加点击事件
function initProfileModal() {
    const introText = document.getElementById('introText');
    if (introText) {
        introText.addEventListener('click', openProfileModal);
        // 添加鼠标悬停效果
        introText.style.cursor = 'pointer';
        introText.style.transition = 'color 0.3s ease';
        introText.addEventListener('mouseenter', function() {
            this.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        });
        introText.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    }
    
    // 添加点击模态框外部关闭模态框
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeProfileModal();
            }
        });
    }
    
    // 添加ESC键关闭模态框
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeProfileModal();
        }
    });
}

// --- 网站卡片拖拽排序功能 --- //
function initDragAndDrop() {
    const navGrid = document.querySelector('.nav-grid');
    const addSiteBtn = document.getElementById('addSiteBtn');
    let draggedItem = null;
    let placeholder = null;
    
    // 为所有导航卡片添加拖拽功能
    function setupDraggableCards() {
        const navItems = document.querySelectorAll('.nav-item.glass-effect');
        
        navItems.forEach(item => {
            // 排除添加网站按钮
            if (item.id !== 'addSiteBtn') {
                item.setAttribute('draggable', 'true');
                
                // 拖拽开始事件
                item.addEventListener('dragstart', function(e) {
                    draggedItem = this;
                    // 设置拖拽时的视觉效果
                    setTimeout(() => {
                        this.classList.add('dragging');
                    }, 0);
                    
                    // 设置拖拽数据
                    e.dataTransfer.setData('text/plain', this.dataset.siteId || this.querySelector('h3').textContent);
                });
                
                // 拖拽结束事件
                item.addEventListener('dragend', function() {
                    this.classList.remove('dragging');
                    draggedItem = null;
                    
                    // 移除占位符
                    if (placeholder) {
                        placeholder.remove();
                        placeholder = null;
                    }
                    
                    // 保存排序
                    saveNavItemOrder();
                });
                
                // 拖拽悬停事件
                item.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    
                    // 排除添加网站按钮
                    if (this.id === 'addSiteBtn') return;
                    
                    // 如果正在拖拽的元素不是当前元素
                    if (draggedItem !== this) {
                        // 创建占位符
                        if (!placeholder) {
                            placeholder = document.createElement('div');
                            placeholder.classList.add('nav-item', 'glass-effect', 'placeholder');
                            placeholder.style.height = `${this.offsetHeight}px`;
                            placeholder.style.opacity = '0.5';
                        }
                        
                        // 计算插入位置
                        const rect = this.getBoundingClientRect();
                        const offset = rect.y + (rect.height / 2);
                        
                        if (e.clientY < offset) {
                            // 放在当前元素前面
                            navGrid.insertBefore(placeholder, this);
                        } else {
                            // 放在当前元素后面
                            navGrid.insertBefore(placeholder, this.nextSibling);
                        }
                    }
                });
                
                // 拖拽进入事件
                item.addEventListener('dragenter', function(e) {
                    e.preventDefault();
                    // 排除添加网站按钮
                    if (this.id === 'addSiteBtn') return;
                    this.classList.add('drag-over');
                });
                
                // 拖拽离开事件
                item.addEventListener('dragleave', function() {
                    this.classList.remove('drag-over');
                });
                
                // 拖拽放置事件
                item.addEventListener('drop', function(e) {
                    e.preventDefault();
                    this.classList.remove('drag-over');
                    
                    // 排除添加网站按钮
                    if (this.id === 'addSiteBtn') return;
                    
                    // 如果正在拖拽的元素不是当前元素
                    if (draggedItem !== this) {
                        // 计算插入位置
                        const rect = this.getBoundingClientRect();
                        const offset = rect.y + (rect.height / 2);
                        
                        if (e.clientY < offset) {
                            // 放在当前元素前面
                            navGrid.insertBefore(draggedItem, this);
                        } else {
                            // 放在当前元素后面
                            navGrid.insertBefore(draggedItem, this.nextSibling);
                        }
                    }
                });
            }
        });
        
        // 为容器添加拖拽事件，以便在空白区域放置
        navGrid.addEventListener('dragover', function(e) {
            e.preventDefault();
            
            // 计算鼠标位置对应的插入点
            const items = Array.from(this.children).filter(item => 
                item !== addSiteBtn && item !== placeholder
            );
            
            let targetIndex = items.length;
            for (let i = 0; i < items.length; i++) {
                const rect = items[i].getBoundingClientRect();
                if (e.clientY < rect.y + rect.height / 2) {
                    targetIndex = i;
                    break;
                }
            }
            
            // 创建占位符
            if (!placeholder) {
                placeholder = document.createElement('div');
                placeholder.classList.add('nav-item', 'glass-effect', 'placeholder');
                placeholder.style.height = '100px';
                placeholder.style.opacity = '0.5';
            }
            
            // 插入占位符
            if (targetIndex === items.length) {
                // 放在所有元素后面，但在添加按钮前面
                this.insertBefore(placeholder, addSiteBtn);
            } else {
                this.insertBefore(placeholder, items[targetIndex]);
            }
        });
        
        navGrid.addEventListener('drop', function(e) {
            e.preventDefault();
            
            // 如果有拖拽的元素和占位符
            if (draggedItem && placeholder) {
                // 将拖拽的元素插入到占位符位置
                this.insertBefore(draggedItem, placeholder);
            }
        });
    }
    
    // 保存导航项的排序到localStorage
    function saveNavItemOrder() {
        const navItems = document.querySelectorAll('.nav-item.glass-effect');
        const order = [];
        
        navItems.forEach(item => {
            // 排除添加网站按钮
            if (item.id !== 'addSiteBtn') {
                // 使用siteId或网站名称作为标识
                const identifier = item.dataset.siteId || item.querySelector('h3').textContent;
                order.push(identifier);
            }
        });
        
        localStorage.setItem('navItemOrder', JSON.stringify(order));
    }
    
    // 从localStorage加载导航项的排序
    function loadNavItemOrder() {
        const order = JSON.parse(localStorage.getItem('navItemOrder') || '[]');
        
        if (order.length > 0) {
            const navItems = document.querySelectorAll('.nav-item.glass-effect');
            const itemMap = new Map();
            
            // 创建网站标识到元素的映射
            navItems.forEach(item => {
                if (item.id !== 'addSiteBtn') {
                    const identifier = item.dataset.siteId || item.querySelector('h3').textContent;
                    itemMap.set(identifier, item);
                }
            });
            
            // 按照保存的顺序重新排列元素
            order.forEach(identifier => {
                const item = itemMap.get(identifier);
                if (item) {
                    // 将元素移到添加按钮前面
                    navGrid.insertBefore(item, addSiteBtn);
                }
            });
        }
    }
    
    // 为新添加的网站也添加拖拽功能
    function makeNewSiteDraggable(siteElement) {
        siteElement.setAttribute('draggable', 'true');
        
        // 拖拽开始事件
        siteElement.addEventListener('dragstart', function(e) {
            draggedItem = this;
            setTimeout(() => {
                this.classList.add('dragging');
            }, 0);
            e.dataTransfer.setData('text/plain', this.dataset.siteId);
        });
        
        // 拖拽结束事件
        siteElement.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedItem = null;
            if (placeholder) {
                placeholder.remove();
                placeholder = null;
            }
            saveNavItemOrder();
        });
        
        // 拖拽悬停事件
        siteElement.addEventListener('dragover', function(e) {
            e.preventDefault();
            if (draggedItem !== this) {
                if (!placeholder) {
                    placeholder = document.createElement('div');
                    placeholder.classList.add('nav-item', 'glass-effect', 'placeholder');
                    placeholder.style.height = `${this.offsetHeight}px`;
                    placeholder.style.opacity = '0.5';
                }
                
                const rect = this.getBoundingClientRect();
                const offset = rect.y + (rect.height / 2);
                
                if (e.clientY < offset) {
                    navGrid.insertBefore(placeholder, this);
                } else {
                    navGrid.insertBefore(placeholder, this.nextSibling);
                }
            }
        });
        
        // 拖拽进入事件
        siteElement.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        // 拖拽离开事件
        siteElement.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        // 拖拽放置事件
        siteElement.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedItem !== this) {
                const rect = this.getBoundingClientRect();
                const offset = rect.y + (rect.height / 2);
                
                if (e.clientY < offset) {
                    navGrid.insertBefore(draggedItem, this);
                } else {
                    navGrid.insertBefore(draggedItem, this.nextSibling);
                }
            }
        });
    }
    
    // 在addSiteToDOM函数中添加对新网站的拖拽支持
    const originalAddSiteToDOM = addSiteToDOM;
    window.enhancedAddSiteToDOM = function(site) {
        const siteElement = originalAddSiteToDOM(site);
        makeNewSiteDraggable(siteElement);
        return siteElement;
    };
    
    // 初始化函数
    setupDraggableCards();
    loadNavItemOrder();
    
    // 暴露给全局，以便在新网站添加后调用
    window.makeNewSiteDraggable = makeNewSiteDraggable;
}

// 页面加载完成后初始化
window.addEventListener('load', function() {
    initProfileModal();
    initBackToTop(); // 初始化返回顶部功能
    initUsageGuide(); // 初始化使用说明弹窗
    
    // 初始化拖拽排序功能
    setTimeout(initDragAndDrop, 1000); // 延迟初始化，确保所有网站都已加载
});

// 返回顶部功能实现
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // 监听滚动事件，根据页面滚动位置显示/隐藏按钮
    window.addEventListener('scroll', function() {
        // 当页面向下滚动超过200px时显示按钮，否则完全隐藏
        if (window.pageYOffset > 200) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // 点击返回顶部按钮，平滑滚动到页面顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滚动
        });
    });
    
    // 初始化按钮状态，页面加载时检查当前滚动位置
    if (window.pageYOffset > 200) {
        backToTopBtn.classList.add('visible');
    }
}

// 初始化使用说明弹窗
function initUsageGuide() {
    const usageGuideModal = document.getElementById('usageGuideModal');
    if (!usageGuideModal) return;
    
    // 检查用户选择不再提示的时间戳
    const hideUntilTime = localStorage.getItem('hideUsageGuideUntil');
    const now = new Date().getTime();
    
    // 如果没有设置时间戳或时间戳已过期，则显示弹窗
    if (!hideUntilTime || parseInt(hideUntilTime) <= now) {
        usageGuideModal.classList.add('active');
    }
}

// 关闭使用说明弹窗
function closeUsageGuide(neverShow) {
    const usageGuideModal = document.getElementById('usageGuideModal');
    if (usageGuideModal) {
        usageGuideModal.classList.remove('active');
        
        // 如果用户选择10小时内不再提示，保存时间戳到localStorage
            if (neverShow) {
                const now = new Date().getTime();
                const tenHoursLater = now + (10 * 60 * 60 * 1000); // 10小时后
                localStorage.setItem('hideUsageGuideUntil', tenHoursLater.toString());
            }
    }
}