// 游戏数据模拟
const gamesData = [
    {
        id: 1,
        title: "赛博朋克2077",
        cover: "/api/placeholder/250/150",
        developer: "CD Projekt Red",
        releaseDate: "2020-12-10",
        rating: 4.5,
        price: 298,
        type: ["rpg", "action"],
        description: "在赛博朋克2077中，玩家将在夜之城这座充满力量、魅力与改造身体执念的城市中展开冒险。",
        achievements: [
            { title: "夜之城传奇", description: "完成所有主线任务", rarity: "12%" },
            { title: "改造专家", description: "安装所有类型的植入体", rarity: "8%" }
        ]
    },
    {
        id: 2,
        title: "艾尔登法环",
        cover: "/api/placeholder/250/150",
        developer: "FromSoftware",
        releaseDate: "2022-02-25",
        rating: 4.8,
        price: 298,
        type: ["rpg", "action"],
        description: "艾尔登法环是一款动作角色扮演游戏，在广阔的场景中探索未知，遭遇宏伟的敌人并体验各种惊险场面。",
        achievements: [
            { title: "传火者", description: "成为艾尔登之王", rarity: "5%" },
            { title: "武器大师", description: "收集所有传说武器", rarity: "3%" }
        ]
    },
    {
        id: 3,
        title: "空洞骑士",
        cover: "/api/placeholder/250/150",
        developer: "Team Cherry",
        releaseDate: "2017-02-24",
        rating: 4.9,
        price: 48,
        type: ["adventure", "action"],
        description: "在这款史诗般的动作冒险游戏中探索广阔的地下世界，与虫子和野兽战斗，发现古老的秘密。",
        achievements: [
            { title: "真实结局", description: "击败辐光", rarity: "7%" },
            { title: "钢魂", description: "完成钢魂模式", rarity: "2%" }
        ]
    }
];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initializeGamesPage();
});

// 初始化游戏页面
function initializeGamesPage() {
    displayGames();
    initializeFilters();
    initializeEventListeners();
}

// 显示游戏列表
function displayGames(filteredGames = gamesData) {
    const container = document.getElementById('gamesContainer');
    if (!container) return;

    container.innerHTML = filteredGames.map(game => `
        <div class="game-card" data-id="${game.id}" onclick="showGameDetails(${game.id})">
            <div class="game-cover" style="background-image: url('${game.cover}')"></div>
            <div class="game-info">
                <div class="game-title">${game.title}</div>
                <div class="game-meta">
                    <div class="game-price">¥${game.price}</div>
                    <div class="game-rating">
                        <span>★</span>
                        <span>${game.rating}</span>
                    </div>
                </div>
                <div class="game-types">
                    ${game.type.map(type => `<span class="game-type">${type}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// 初始化筛选器
function initializeFilters() {
    // 监听复选框变化
    document.querySelectorAll('.filter-option input').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilters);
    });

    // 监听排序选择
    document.getElementById('sortSelect').addEventListener('change', handleSort);
}

// 处理筛选
function handleFilters() {
    const selectedTypes = Array.from(document.querySelectorAll('.filter-option input:checked'))
        .map(checkbox => checkbox.value);

    const filteredGames = selectedTypes.length === 0 
        ? gamesData 
        : gamesData.filter(game => game.type.some(type => selectedTypes.includes(type)));

    displayGames(filteredGames);
}

// 处理排序
function handleSort(e) {
    const sortType = e.target.value;
    const sortedGames = [...gamesData];

    switch (sortType) {
        case 'popular':
            sortedGames.sort((a, b) => b.rating - a.rating);
            break;
        case 'new':
            sortedGames.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            break;
        case 'price':
            sortedGames.sort((a, b) => a.price - b.price);
            break;
        case 'rating':
            sortedGames.sort((a, b) => b.rating - a.rating);
            break;
    }

    displayGames(sortedGames);
}

// 显示游戏详情
function showGameDetails(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;

    document.getElementById('gameTitle').textContent = game.title;
    document.getElementById('gameDate').textContent = formatDate(game.releaseDate);
    document.getElementById('gameDeveloper').textContent = game.developer;
    document.getElementById('gameRating').textContent = `${game.rating}/5.0`;
    document.getElementById('gameDescription').textContent = game.description;

    // 显示成就
    const achievementsContainer = document.getElementById('gameAchievements');
    achievementsContainer.innerHTML = game.achievements.map(achievement => `
        <div class="achievement-item">
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.description}</div>
            <div class="achievement-rarity">稀有度: ${achievement.rarity}</div>
        </div>
    `).join('');

    openModal('gameModal');
}

// 初始化事件监听器
function initializeEventListeners() {
    // 加载更多按钮
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreGames);
    }

    // 搜索功能
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// 处理搜索
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredGames = gamesData.filter(game => 
        game.title.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm)
    );
    displayGames(filteredGames);
}

// 加载更多游戏
function loadMoreGames() {
    // 这里可以添加加载更多游戏的逻辑
    console.log('加载更多游戏');
}

// 辅助函数
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('zh-CN');
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