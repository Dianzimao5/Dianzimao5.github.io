// adminData.js
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

// 导出为全局变量
window.adminData = adminData;
window.adminLogin = adminLogin;