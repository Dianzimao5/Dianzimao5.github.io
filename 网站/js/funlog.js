// funlog.js

document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据
    initializeProfile();
    loadPhotoWall();
    loadAchievements();
    loadRecentGames();
});

// 初始化个人资料
function initializeProfile() {
    const profileData = {
        name: "玩家昵称",
        level: 42,
        games: 156,
        achievements: 487
    };

    document.querySelector('.profile-name').textContent = profileData.name;
    document.querySelector('.level').textContent = `Level ${profileData.level}`;
    document.querySelector('.games').textContent = `游戏: ${profileData.games}`;
    document.querySelector('.achievements').textContent = `成就: ${profileData.achievements}`;
}

// 加载照片墙
function loadPhotoWall() {
    const photos = [
        { id: 1, url: "/api/placeholder/200/200", title: "史诗胜利" },
        { id: 2, url: "/api/placeholder/200/200", title: "隐藏彩蛋" },
        { id: 3, url: "/api/placeholder/200/200", title: "团队合影" }
    ];

    const photoWall = document.getElementById('photoWall');
    photoWall.innerHTML = photos.map(photo => `
        <div class="photo-card">
            <img src="${photo.url}" alt="${photo.title}">
        </div>
    `).join('');
}

// 加载成就列表
function loadAchievements() {
    const achievements = [
        { id: 1, title: "不眠不休", description: "连续游戏12小时", icon: "🏆" },
        { id: 2, title: "收藏家", description: "收集1000件物品", icon: "🌟" }
    ];

    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = achievements.map(achievement => `
        <div class="achievement-item">
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
        </div>
    `).join('');
}

// 加载最近游戏
function loadRecentGames() {
    const recentGames = [
        { id: 1, name: "赛博朋克2077", playTime: "24小时" },
        { id: 2, name: "艾尔登法环", playTime: "12小时" }
    ];

    const recentGamesList = document.getElementById('recentGames');
    recentGamesList.innerHTML = recentGames.map(game => `
        <div class="game-item">
            <div class="game-icon">🎮</div>
            <div class="game-info">
                <h4>${game.name}</h4>
                <p>游戏时间: ${game.playTime}</p>
            </div>
        </div>
    `).join('');
}