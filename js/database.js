// database.js

// 管理员权限级别
const AdminLevel = {
    SUPER: 3,    // 超级管理员
    NORMAL: 2,   // 普通管理员
    MOD: 1       // 版主
};

// 系统数据存储
const DB = {
    // 管理员数据
    admins: new Map([
        ['admin', {
            id: 'admin',
            password: 'hashed_admin_password', // 实际使用时需要加密
            level: AdminLevel.SUPER,
            createdAt: new Date('2024-01-01'),
            lastLoginAt: null,
            loginHistory: []
        }]
    ]),

    // 邀请码数据
    inviteCodes: new Map(),

    // 用户数据
    users: new Map(),

    // 操作日志
    logs: [],

    // 全局配置
    config: {
        inviteCodeExpiry: 7 * 24 * 60 * 60 * 1000, // 7天有效期
        maxInvitesPerAdmin: 50,  // 每个管理员最多可以生成的邀请码数量
        sessionDuration: 24 * 60 * 60 * 1000 // 24小时会话有效期
    }
};

// 权限检查函数
function checkPermission(adminId, requiredLevel) {
    const admin = DB.admins.get(adminId);
    return admin && admin.level >= requiredLevel;
}

// 记录操作日志
function logOperation(adminId, operation, details) {
    const log = {
        id: DB.logs.length + 1,
        adminId,
        operation,
        details,
        timestamp: new Date(),
        ip: null // 实际应用中需要获取IP
    };
    DB.logs.push(log);
    return log;
}

// 加密工具函数
function hashPassword(password) {
    // 实际应用中应使用真实的加密函数
    return `hashed_${password}`;
}

// 导出数据和工具函数
export {
    DB,
    AdminLevel,
    checkPermission,
    logOperation,
    hashPassword
};