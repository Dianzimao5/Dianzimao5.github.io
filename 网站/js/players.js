// 模拟玩家数据
const playersData = [
    {
        id: 1,
        name: "玩家小明",
        level: 42,
        achievements: 156,
        playTime: "1024小时",
        status: "online",
        avatar: "/api/placeholder/80/80",
        recentGames: [
            {
                name: "赛博朋克2077",
                lastPlayed: "2小时前",
                playtime: "168小时"
            },
            {
                name: "艾尔登法环",
                lastPlayed: "昨天",
                playtime: "96小时"
            }
        ],
        recentAchievements: [
            {
                title: "不眠不休",
                game: "赛博朋克2077",
                date: "今天",
                rarity: "5%"
            },
            {
                title: "收藏家",
                game: "艾尔登法环",
                date: "昨天",
                rarity: "12%"
            }
        ]
    },
    // 添加更多玩家数据...
];

// 当前页面状态
let currentView = 'grid';
let currentPage = 1;
let itemsPerPage = 12;
let currentSort = 'level';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializePlayers();
});

// 初始化玩家页面
function initializePlayers() {
    displayPlayers();
    initializeFilters();
    initializeViewToggle();
    initializeEventListeners();
}

// 显示玩家列表
function displayPlayers(filteredPlayers = playersData) {
    const container = document.getElementById('playersGrid');
    if (!container) return;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const playersToShow = filteredPlayers.slice(start, end);

    container.innerHTML = playersToShow.map(player => `
        <div class="player-card" data-id="${player.id}" onclick="showPlayerDetails(${player.id})">
            <div class="player-cover">
                <div class="player-avatar" style="background-image: url('${player.avatar}')"></div>
            </div>
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-stats">
                    <div class="stat-item">
                        <div class="stat-value">Lv.${player.level}</div>
                        <div class="stat-label">等级</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${player.achievements}</div>
                        <div class="stat-label">成就</div>
                    </div>
                </div>
                <div class="player-status status-${player.status}">
                    ${getStatusText(player.status)}
                </div>
            </div>
        </div>
    `).join('');

    updatePagination(filteredPlayers.length);
}

// 更新分页
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.querySelector('.pagination');
    const prevBtn = pagination.querySelector('.page-btn:first-child');
    const nextBtn = pagination.querySelector('.page-btn:last-child');
    const pageNumber = pagination.querySelector('.page-number');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    pageNumber.textContent = currentPage;
}

// 初始化筛选器
function initializeFilters() {
    const sortSelect = document.getElementById('playerSort');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
}

// 处理排序
function handleSort(e) {
    currentSort = e.target.value;
    const sortedPlayers = [...playersData];

    switch (currentSort) {
        case 'level':
            sortedPlayers.sort((a, b) => b.level - a.level);
            break;
        case 'achievements':
            sortedPlayers.sort((a, b) => b.achievements - a.achievements);
            break;
        case 'active':
            sortedPlayers.sort((a, b) => 
                a.status === 'online' ? -1 : b.status === 'online' ? 1 : 0
            );
            break;
    }

    displayPlayers(sortedPlayers);
}

// 初始化视图切换
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            changeView(view);
            
            // 更新按钮状态
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// 切换视图
function changeView(view) {
    currentView = view;
    const container = document.getElementById('playersContainer');
    container.className = `players-container ${view}-view`;
    displayPlayers();
}

// 显示玩家详情
function showPlayerDetails(playerId) {
    const player = playersData.find(p => p.id === playerId);
    if (!player) return;

    // 更新模态框内容
    document.getElementById('playerName').textContent = player.name;
    document.getElementById('playerLevel').textContent = `Lv.${player.level}`;
    document.getElementById('playerAchievements').textContent = player.achievements;
    document.getElementById('playerPlayTime').textContent = player.playTime;

    // 显示最近游戏
    const recentGames = document.getElementById('playerRecentGames');
    recentGames.innerHTML = player.recentGames.map(game => `
        <div class="game-item">
            <div class="game-name">${game.name}</div>
            <div class="game-meta">
                <span>最后游玩: ${game.lastPlayed}</span>
                <span>总时长: ${game.playtime}</span>
            </div>
        </div>
    `).join('');

    // 显示最新成就
    const achievementsList = document.getElementById('playerAchievementsList');
    achievementsList.innerHTML = player.recentAchievements.map(achievement => `
        <div class="achievement-item">
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-game">${achievement.game}</div>
            <div class="achievement-meta">
                <span>${achievement.date}</span>
                <span>稀有度: ${achievement.rarity}</span>
            </div>
        </div>
    `).join('');

    openModal('playerModal');
}

// 辅助函数：获取状态文本
function getStatusText(status) {
    const statusMap = {
        online: '在线',
        offline: '离线',
        gaming: '游戏中'
    };
    return statusMap[status] || status;
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

// 处理搜索
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredPlayers = playersData.filter(player => 
        player.name.toLowerCase().includes(searchTerm)
    );
    displayPlayers(filteredPlayers);
}

// 初始化事件监听器
function initializeEventListeners() {
    // 搜索功能
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // 分页按钮
    const prevBtn = document.querySelector('.page-btn:first-child');
    const nextBtn = document.querySelector('.page-btn:last-child');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPlayers();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(playersData.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayPlayers();
            }
        });
    }
}// JavaScript Document