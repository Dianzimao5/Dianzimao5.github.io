// admin.js

document.addEventListener('DOMContentLoaded', function() {
    // 检查管理员登录状态
    if (!checkAdminLogin()) {
        return; // 如果未登录，checkAdminLogin 会自动跳转到登录页面
    }

    // 显示当前管理员信息
    const currentAdmin = getCurrentAdmin();
    document.getElementById('currentAdmin').textContent = currentAdmin.name;

    // 初始化其他功能...
    initializeAdminPanel();
});

// 管理员数据
const adminData = {
    admins: {
        'admin': {
            username: 'admin',
            password: 'admin123', // 实际使用时应该加密
            level: 3, // 超级管理员
            name: '超级管理员',
            status: 'active'
        },
        'mod': {
            username: 'mod',
            password: 'mod123',
            level: 2, // 普通管理员
            name: '管理员小王',
            status: 'active'
        }
    },
    currentAdmin: null
};

// 管理员登录函数
function adminLogin(username, password) {
    const admin = adminData.admins[username];
    
    if (!admin || admin.password !== password) {
        throw new Error('用户名或密码错误');
    }
    
    if (admin.status !== 'active') {
        throw new Error('该管理员账号已被禁用');
    }
    
    // 设置当前管理员
    adminData.currentAdmin = admin;
    
    // 保存到 sessionStorage
    sessionStorage.setItem('currentAdmin', JSON.stringify({
        username: admin.username,
        name: admin.name,
        level: admin.level
    }));
    
    return admin;
}

// 检查管理员登录状态
function checkAdminLogin() {
    const savedAdmin = sessionStorage.getItem('currentAdmin');
    if (!savedAdmin) {
        window.location.href = 'admin-login.html';
        return false;
    }
    
    adminData.currentAdmin = JSON.parse(savedAdmin);
    return true;
}

// 管理员登出
function adminLogout() {
    adminData.currentAdmin = null;
    sessionStorage.removeItem('currentAdmin');
    window.location.href = 'admin-login.html';
}

// 获取当前管理员
function getCurrentAdmin() {
    return adminData.currentAdmin;
}

// 检查管理员权限
function checkAdminPermission(requiredLevel) {
    const currentAdmin = getCurrentAdmin();
    return currentAdmin && currentAdmin.level >= requiredLevel;
}

// 存储管理员信息
let currentAdmin = {
    id: 'admin',
    name: '管理员',
    level: 3
};

// 存储邀请码数据
let inviteCodes = {};

// 存储用户数据
let users = [];

// 存储操作日志
let operationLogs = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

// 初始化管理员面板
function initializeAdminPanel() {
    // 显示当前管理员
    document.getElementById('currentAdmin').textContent = currentAdmin.name;
    
    // 加载初始数据
    loadInviteCodes();
    loadUsers();
    loadLogs();
}

// 生成邀请码

// 生成邀请码时检查权限
function generateInviteCodes() {
    // 检查是否有生成邀请码的权限（需要普通管理员及以上权限）
    if (!checkAdminPermission(2)) {
        showNotification('没有权限执行此操作', 'error');
        return;
    }
    
    // 继续生成邀请码的逻辑...
}

function generateInviteCodes() {
    const amount = parseInt(document.getElementById('codeAmount').value) || 1;
    
    // 检查数量限制
    if (amount < 1 || amount > 10) {
        showNotification('生成数量必须在1-10之间', 'error');
        return;
    }

    // 生成新的邀请码
    for (let i = 0; i < amount; i++) {
        const code = generateUniqueCode();
        inviteCodes[code] = {
            code: code,
            status: 'unused',
            generatedBy: currentAdmin.id,
            generatedAt: new Date(),
            usedBy: null,
            usedAt: null
        };
    }

    // 更新显示
    updateInviteCodesList();
    
    // 记录操作
    addOperationLog('生成邀请码', `生成了 ${amount} 个邀请码`);
    
    // 显示成功提示
    showNotification(`成功生成 ${amount} 个邀请码`, 'success');
}

// 生成唯一邀请码
function generateUniqueCode() {
    const prefix = 'PRISMA';
    const codeLength = 6;
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code;
    
    do {
        code = prefix;
        for (let i = 0; i < codeLength; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    } while (inviteCodes[code]); // 确保不重复
    
    return code;
}

// 更新邀请码列表显示
function updateInviteCodesList() {
    const tbody = document.getElementById('inviteCodesBody');
    if (!tbody) return;

    tbody.innerHTML = Object.values(inviteCodes)
        .sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
        .map(code => `
            <tr>
                <td>${code.code}</td>
                <td>
                    <span class="status-badge status-${code.status}">
                        ${getStatusText(code.status)}
                    </span>
                </td>
                <td>${code.usedBy || '-'}</td>
                <td>${formatDate(code.generatedAt)}</td>
                <td>
                    <button onclick="copyInviteCode('${code.code}')" class="btn-copy">
                        复制
                    </button>
                    ${code.status === 'unused' ? `
                        <button onclick="invalidateCode('${code.code}')" class="btn-invalidate">
                            作废
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
}

// 复制邀请码
function copyInviteCode(code) {
    navigator.clipboard.writeText(code)
        .then(() => showNotification('邀请码已复制到剪贴板', 'success'))
        .catch(() => showNotification('复制失败，请手动复制', 'error'));
}

// 使邀请码失效
function invalidateCode(code) {
    if (inviteCodes[code]) {
        inviteCodes[code].status = 'expired';
        updateInviteCodesList();
        addOperationLog('作废邀请码', `作废了邀请码: ${code}`);
        showNotification('邀请码已成功作废', 'success');
    } else {
        showNotification('找不到指定的邀请码', 'error');
    }
}

// 加载邀请码列表
function loadInviteCodes() {
    // 模拟一些初始数据
    inviteCodes = {
        'PRISMA001': {
            code: 'PRISMA001',
            status: 'unused',
            generatedBy: currentAdmin.id,
            generatedAt: new Date(),
            usedBy: null,
            usedAt: null
        },
        'PRISMA002': {
            code: 'PRISMA002',
            status: 'used',
            generatedBy: currentAdmin.id,
            generatedAt: new Date(Date.now() - 86400000), // 1天前
            usedBy: 'user123',
            usedAt: new Date()
        }
    };
    updateInviteCodesList();
}

// 加载用户列表
function loadUsers() {
    // 模拟一些用户数据
    users = [
        {
            id: 'user123',
            username: '测试用户1',
            registerDate: new Date(Date.now() - 86400000),
            status: 'active'
        },
        {
            id: 'user124',
            username: '测试用户2',
            registerDate: new Date(),
            status: 'active'
        }
    ];
    updateUsersList();
}

// 更新用户列表显示
function updateUsersList() {
    const tbody = document.getElementById('usersBody');
    if (!tbody) return;

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${formatDate(user.registerDate)}</td>
            <td>
                <span class="status-badge status-${user.status}">
                    ${getUserStatusText(user.status)}
                </span>
            </td>
            <td>
                <button onclick="manageUser('${user.id}')" class="btn-manage">
                    管理
                </button>
            </td>
        </tr>
    `).join('');
}

// 管理用户
function manageUser(userId) {
    const user = users.find(u => u.id === userId);
    if (user) {
        showNotification(`管理用户: ${user.username}`, 'info');
        addOperationLog('管理用户', `访问了用户 ${user.username} 的管理页面`);
    }
}

// 加载操作日志
function loadLogs() {
    updateLogsList();
}

// 添加操作日志
function addOperationLog(operation, details) {
    operationLogs.unshift({
        time: new Date(),
        admin: currentAdmin.name,
        operation: operation,
        details: details
    });
    updateLogsList();
}

// 更新日志列表显示
function updateLogsList() {
    const tbody = document.getElementById('logsBody');
    if (!tbody) return;

    tbody.innerHTML = operationLogs.map(log => `
        <tr>
            <td>${formatDate(log.time)}</td>
            <td>${log.admin}</td>
            <td>${log.operation}</td>
            <td>${log.details}</td>
        </tr>
    `).join('');
}

// 处理登出
function handleLogout() {
    if (confirm('确定要登出吗？')) {
        addOperationLog('登出', '管理员登出系统');
        window.location.href = 'index.html';
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // 3秒后自动隐藏
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        unused: '未使用',
        used: '已使用',
        expired: '已过期'
    };
    return statusMap[status] || status;
}

// 获取用户状态文本
function getUserStatusText(status) {
    const statusMap = {
        active: '正常',
        banned: '禁用',
        pending: '待审核'
    };
    return statusMap[status] || status;
}

// 格式化日期
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// 验证邀请码
function verifyInviteCode(code) {
    const inviteCode = inviteCodes[code];
    
    if (!inviteCode) {
        throw new Error('邀请码不存在');
    }
    
    if (inviteCode.status === 'used') {
        throw new Error('邀请码已被使用');
    }
    
    if (inviteCode.status === 'expired') {
        throw new Error('邀请码已过期');
    }
    
    return true;
}

// 使用邀请码
function useInviteCode(code, userId) {
    try {
        verifyInviteCode(code);
        
        inviteCodes[code].status = 'used';
        inviteCodes[code].usedBy = userId;
        inviteCodes[code].usedAt = new Date();
        
        addOperationLog('使用邀请码', `用户 ${userId} 使用了邀请码 ${code}`);
        updateInviteCodesList();
        
        return true;
    } catch (error) {
        throw error;
    }
}

// 导出需要在其他文件中使用的函数
window.generateInviteCodes = generateInviteCodes;
window.verifyInviteCode = verifyInviteCode;
window.useInviteCode = useInviteCode;
window.copyInviteCode = copyInviteCode;
window.invalidateCode = invalidateCode;
window.handleLogout = handleLogout;
window.manageUser = manageUser;