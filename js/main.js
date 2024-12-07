// main.js

// 模拟数据存储
const userData = {
    isLoggedIn: false,
    currentUser: null
};

// 模拟用户数据库
const users = [];

// 示例动态数据
const sampleActivities = [
    {
        id: 1,
        playerName: "玩家小明",
        action: "获得了成就【不眠不休】",
        game: "赛博朋克2077",
        timestamp: "5分钟前",
        icon: "🏆"
    },
    {
        id: 2,
        playerName: "游戏达人",
        action: "购买了新游戏",
        game: "艾尔登法环",
        timestamp: "10分钟前",
        icon: "🎮"
    }
];

const samplePlayers = [
    {
        id: 1,
        name: "玩家小明",
        level: 42,
        status: "online",
        achievements: 156
    },
    {
        id: 2,
        name: "游戏达人",
        level: 38,
        status: "gaming",
        achievements: 123
    }
];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    displayActivities();
    displayPlayers();
    initializeEventListeners();
    checkLoginStatus();
    startActivitySimulation();
}

// 显示动态
function displayActivities() {
    const container = document.getElementById('activityContainer');
    if (!container) return;

    container.innerHTML = sampleActivities.map(activity => `
        <div class="activity-card">
            <div class="activity-header">
                <div class="activity-user">
                    <span class="activity-icon">${activity.icon}</span>
                    <span class="player-name">${activity.playerName}</span>
                </div>
                <span class="timestamp">${activity.timestamp}</span>
            </div>
            <div class="activity-content">${activity.action}</div>
            <span class="game-tag">${activity.game}</span>
        </div>
    `).join('');
}

// 显示玩家列表
function displayPlayers() {
    const container = document.getElementById('playerContainer');
    if (!container) return;

    container.innerHTML = samplePlayers.map(player => `
        <div class="player-card">
            <div class="player-avatar"></div>
            <div class="player-info">
                <div class="player-header">
                    <span class="player-name">${player.name}</span>
                    <span class="player-status ${player.status}">${getStatusText(player.status)}</span>
                </div>
                <div class="player-details">
                    <span class="player-level">Level ${player.level}</span>
                    <span class="player-achievements">成就: ${player.achievements}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// 初始化事件监听器
function initializeEventListeners() {
    // 登录按钮
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => openModal('loginModal'));
    }

    // 注册按钮
    const registerBtn = document.querySelector('.register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => openModal('registerModal'));
    }

    // 登录表单
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // 注册表单
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // 搜索功能
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// 处理登录
async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // 先检查是否是管理员账号
        if (adminData.admins[username]) {
            try {
                // 尝试管理员登录
                await adminLogin(username, password);
                // 登录成功，跳转到管理员页面
                window.location.href = 'admin.html';
                return;
            } catch (error) {
                showError(error.message);
                return;
            }
        }

        // 不是管理员，按普通用户登录
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            userData.isLoggedIn = true;
            userData.currentUser = user;
            updateUIAfterLogin();
            closeModal('loginModal');
            showSuccess('登录成功！');
        } else {
            showError('用户名或密码错误');
        }
    } catch (error) {
        showError('登录失败：' + error.message);
    }
}

// 处理注册
async function handleRegister(event) {
    event.preventDefault();
    
    const inviteCode = document.getElementById('inviteCode').value;
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    try {
        // 验证密码匹配
        if (password !== confirmPassword) {
            throw new Error('两次输入的密码不匹配');
        }

        // 验证邀请码
        await verifyInviteCode(inviteCode);

        // 检查用户名是否已存在
        if (users.some(user => user.username === username)) {
            throw new Error('用户名已被使用');
        }

        // 创建新用户
        const newUser = {
            id: 'user' + Date.now(),
            username: username,
            password: password,
            registrationDate: new Date(),
            inviteCode: inviteCode,
            level: 1,
            achievements: [],
            games: []
        };

        // 保存用户数据
        users.push(newUser);

        // 标记邀请码已使用
        await useInviteCode(inviteCode, newUser.id);

        // 自动登录
        userData.isLoggedIn = true;
        userData.currentUser = newUser;

        // 更新UI
        updateUIAfterLogin();
        closeModal('registerModal');
        showSuccess('注册成功！');
    } catch (error) {
        showError(error.message);
    }
}

// 登录后更新UI
function updateUIAfterLogin() {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons && userData.currentUser) {
        authButtons.innerHTML = `
            <div class="user-info">
                <span>欢迎, ${userData.currentUser.username}</span>
                <button onclick="handleLogout()" class="logout-btn">登出</button>
            </div>
        `;
    }
}

// 处理登出
function handleLogout() {
    userData.isLoggedIn = false;
    userData.currentUser = null;
    location.reload();
}

// 处理搜索
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    // 过滤动态
    const filteredActivities = sampleActivities.filter(activity => 
        activity.playerName.toLowerCase().includes(searchTerm) ||
        activity.game.toLowerCase().includes(searchTerm) ||
        activity.action.toLowerCase().includes(searchTerm)
    );
    
    // 过滤玩家
    const filteredPlayers = samplePlayers.filter(player => 
        player.name.toLowerCase().includes(searchTerm)
    );

    // 更新显示
    if (searchTerm) {
        displayActivities(filteredActivities);
        displayPlayers(filteredPlayers);
    } else {
        displayActivities();
        displayPlayers();
    }
}

// 检查登录状态
function checkLoginStatus() {
    if (userData.isLoggedIn) {
        updateUIAfterLogin();
    }
}

// 模态框控制
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        online: '在线',
        offline: '离线',
        gaming: '游戏中'
    };
    return statusMap[status] || status;
}

// 显示错误信息
function showError(message) {
    alert(message); // 实际应用中应使用更友好的提示方式
}

// 显示成功信息
function showSuccess(message) {
    alert(message); // 实际应用中应使用更友好的提示方式
}

// 模拟实时动态更新
function startActivitySimulation() {
    setInterval(() => {
        if (samplePlayers.length > 0) {
            const randomPlayer = samplePlayers[Math.floor(Math.random() * samplePlayers.length)];
            const newActivity = {
                id: Date.now(),
                playerName: randomPlayer.name,
                action: getRandomAction(),
                game: getRandomGame(),
                timestamp: "刚刚",
                icon: getRandomIcon()
            };

            sampleActivities.unshift(newActivity);
            if (sampleActivities.length > 10) {
                sampleActivities.pop();
            }
            
            displayActivities();
        }
    }, 30000); // 每30秒更新一次
}

// 辅助函数
function getRandomAction() {
    const actions = [
        "获得了新成就",
        "完成了一次挑战",
        "购买了新游戏",
        "发现了隐藏彩蛋",
        "达到了新等级"
    ];
    return actions[Math.floor(Math.random() * actions.length)];
}

function getRandomGame() {
    const games = [
        "赛博朋克2077",
        "艾尔登法环",
        "死亡搁浅",
        "空洞骑士",
        "博德之门3"
    ];
    return games[Math.floor(Math.random() * games.length)];
}

function getRandomIcon() {
    const icons = ["🏆", "🎮", "🔍", "⭐", "🌟"];
    return icons[Math.floor(Math.random() * icons.length)];
}