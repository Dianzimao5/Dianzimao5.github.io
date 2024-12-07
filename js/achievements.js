// 模拟成就数据
const achievementsData = [
    {
        id: 1,
        title: "不眠不休",
        game: "赛博朋克2077",
        description: "连续游戏12小时",
        icon: "🏆",
        rarity: 5,
        unlocks: 1234,
        type: "rare",
        recentUnlocks: [
            {
                playerId: 1,
                playerName: "玩家小明",
                avatar: "/api/placeholder/32/32",
                unlockTime: "10分钟前"
            },
            {
                playerId: 2,
                playerName: "游戏达人",
                avatar: "/api/placeholder/32/32",
                unlockTime: "1小时前"
            }
        ]
    },
    {
        id: 2,
        title: "收藏家",
        game: "艾尔登法环",
        description: "收集1000件物品",
        icon: "🌟",
        rarity: 3,
        unlocks: 567,
        type: "legendary",
        recentUnlocks: [
            {
                playerId: 3,
                playerName: "探索者",
                avatar: "/api/placeholder/32/32",
                unlockTime: "2小时前"
            }
        ]
    },
    {
        id: 3,
        title: "初级玩家",
        game: "空洞骑士",
        description: "完成第一个区域",
        icon: "⭐",
        rarity: 45,
        unlocks: 8901,
        type: "common",
        recentUnlocks: [
            {
                playerId: 4,
                playerName: "新手玩家",
                avatar: "/api/placeholder/32/32",
                unlockTime: "30分钟前"
            }
        ]
    }
];

// 当前页面状态
let currentPage = 1;
let itemsPerPage = 12;
let currentSort = 'latest';
let currentGame = '';
let currentRarity = '';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeAchievements();
});

// 初始化成就页面
function initializeAchievements() {
    displayAchievements();
    initializeFilters();
    updateStats();
    initializeEventListeners();
}

// 显示成就列表
function displayAchievements(filteredAchievements = achievementsData) {
    const container = document.getElementById('achievementsList');
    if (!container) return;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const achievementsToShow = filteredAchievements.slice(start, end);

    container.innerHTML = achievementsToShow.map(achievement => `
        <div class="achievement-card" data-id="${achievement.id}" onclick="showAchievementDetails(${achievement.id})">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-game">${achievement.game}</div>
                <div class="achievement-meta">
                    <span>${achievement.unlocks}人解锁</span>
                    <span class="rarity-badge rarity-${achievement.type}">
                        稀有度: ${achievement.rarity}%
                    </span>
                </div>
            </div>
        </div>
    `).join('');

    updatePagination(filteredAchievements.length);
}

// 更新统计信息
function updateStats() {
    const totalUnlocks = achievementsData.reduce((sum, achievement) => sum + achievement.unlocks, 0);
    const averageRarity = (achievementsData.reduce((sum, achievement) => sum + achievement.rarity, 0) / achievementsData.length).toFixed(1);

    // 更新统计卡片
    document.querySelectorAll('.stat-card').forEach(card => {
        const label = card.querySelector('.stat-label').textContent;
        const value = card.querySelector('.stat-value');
        
        switch(label) {
            case '总成就数':
                value.textContent = achievementsData.length;
                break;
            case '今日解锁':
                value.textContent = calculateTodayUnlocks();
                break;
            case '平均稀有度':
                value.textContent = `${averageRarity}%`;
                break;
        }
    });
}

// 初始化筛选器
function initializeFilters() {
    // 游戏筛选器
    const gameSelect = document.getElementById('gameSelect');
    if (gameSelect) {
        gameSelect.addEventListener('change', handleFilters);
    }

    // 稀有度筛选器
    const raritySelect = document.getElementById('raritySelect');
    if (raritySelect) {
        raritySelect.addEventListener('change', handleFilters);
    }

    // 排序选择器
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
}

// 处理筛选
function handleFilters() {
    const game = document.getElementById('gameSelect').value;
    const rarity = document.getElementById('raritySelect').value;
    
    let filteredAchievements = [...achievementsData];

    // 按游戏筛选
    if (game) {
        filteredAchievements = filteredAchievements.filter(achievement => 
            achievement.game.toLowerCase().includes(game.toLowerCase())
        );
    }

    // 按稀有度筛选
    if (rarity) {
        filteredAchievements = filteredAchievements.filter(achievement => {
            switch(rarity) {
                case 'common':
                    return achievement.rarity > 20;
                case 'rare':
                    return achievement.rarity <= 20 && achievement.rarity > 5;
                case 'legendary':
                    return achievement.rarity <= 5;
                default:
                    return true;
            }
        });
    }

    displayAchievements(filteredAchievements);
}

// 处理排序
function handleSort(e) {
    const sortType = e.target.value;
    const sortedAchievements = [...achievementsData];

    switch (sortType) {
        case 'latest':
            // 这里应该根据实际的时间戳排序
            break;
        case 'rarity':
            sortedAchievements.sort((a, b) => a.rarity - b.rarity);
            break;
        case 'popular':
            sortedAchievements.sort((a, b) => b.unlocks - a.unlocks);
            break;
    }

    displayAchievements(sortedAchievements);
}

// 显示成就详情
function showAchievementDetails(achievementId) {
    const achievement = achievementsData.find(a => a.id === achievementId);
    if (!achievement) return;

    document.getElementById('achievementTitle').textContent = achievement.title;
    document.getElementById('achievementIcon').textContent = achievement.icon;
    document.getElementById('achievementGame').textContent = achievement.game;
    document.getElementById('achievementDesc').textContent = achievement.description;
    document.getElementById('achievementUnlocks').textContent = `${achievement.unlocks}人`;
    document.getElementById('achievementRarity').textContent = `${achievement.rarity}%`;

    // 显示最近解锁列表
    const unlocksList = document.getElementById('recentUnlocksList');
    unlocksList.innerHTML = achievement.recentUnlocks.map(unlock => `
        <div class="unlock-item">
            <div class="unlock-player">
                <div class="player-avatar" style="background-image: url('${unlock.avatar}')"></div>
                <span>${unlock.playerName}</span>
            </div>
            <span class="unlock-time">${unlock.unlockTime}</span>
        </div>
    `).join('');

    openModal('achievementModal');
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

// 计算今日解锁数量（模拟数据）
function calculateTodayUnlocks() {
    return Math.floor(Math.random() * 1000);
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
                displayAchievements();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(achievementsData.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayAchievements();
            }
        });
    }
}

// 处理搜索
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredAchievements = achievementsData.filter(achievement => 
        achievement.title.toLowerCase().includes(searchTerm) ||
        achievement.game.toLowerCase().includes(searchTerm) ||
        achievement.description.toLowerCase().includes(searchTerm)
    );
    displayAchievements(filteredAchievements);
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
}// JavaScript Document