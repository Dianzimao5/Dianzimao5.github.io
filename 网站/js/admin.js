// admin.js
function generateInviteCodes() {
    const amount = document.getElementById('codeAmount').value;
    const newCodes = [];
    
    for (let i = 0; i < amount; i++) {
        const code = generateUniqueCode();
        inviteCodes[code] = {
            used: false,
            generatedAt: new Date(),
            user: null
        };
        newCodes.push(code);
    }
    
    updateInviteCodesList();
    // 可以添加导出功能，将新生成的邀请码导出为文件
}

function generateUniqueCode() {
    const prefix = 'PRISMA';
    const codeLength = 3;
    const currentCount = Object.keys(inviteCodes).length;
    return `${prefix}${(currentCount + 1).toString().padStart(codeLength, '0')}`;
}

function updateInviteCodesList() {
    const tbody = document.getElementById('inviteCodesBody');
    tbody.innerHTML = Object.entries(inviteCodes).map(([code, data]) => `
        <tr>
            <td>${code}</td>
            <td>${data.used ? '已使用' : '未使用'}</td>
            <td>${data.user || '-'}</td>
            <td>${data.generatedAt.toLocaleString()}</td>
        </tr>
    `).join('');
}