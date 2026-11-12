// theme.js
function loadThemeSettings() {
    const savedTheme = localStorage.getItem('themeColor') || 'purple';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    applyTheme(savedTheme, savedFontSize);
}

function applyTheme(themeColor, fontSize) {
    // 移除现有主题类
    document.body.classList.remove(
        'theme-purple', 'theme-blue', 'theme-green', 'theme-dark',
        'font-small', 'font-medium', 'font-large'
    );
    
    // 添加新主题类
    document.body.classList.add(`theme-${themeColor}`);
    document.body.classList.add(`font-${fontSize}`);
}
document.addEventListener('DOMContentLoaded', function() {
    updateUserInfoDisplay();
    setupHistoryActions();
    
    // 加载主题设置
    loadThemeSettings();
});

// 加载主题设置
function loadThemeSettings() {
    const savedTheme = localStorage.getItem('themeColor') || 'purple';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    applyTheme(savedTheme, savedFontSize);
}

// 应用主题样式
function applyTheme(themeColor, fontSize) {
    // 移除现有主题类
    document.body.classList.remove(
        'theme-purple', 'theme-blue', 'theme-green', 'theme-dark',
        'font-small', 'font-medium', 'font-large'
    );
    
    // 添加新主题类
    document.body.classList.add(`theme-${themeColor}`);
    document.body.classList.add(`font-${fontSize}`);
}

document.addEventListener('DOMContentLoaded', function() {
            loadThemeSettings();
            // 其他初始化代码...
        });
function applyTheme(themeColor, fontSize) {
    // 移除现有主题类
    document.body.classList.remove(
        'theme-purple', 'theme-blue', 'theme-green', 'theme-dark',
        'theme-red', 'theme-orange', 'theme-pink', 'theme-teal',
        'font-small', 'font-medium', 'font-large'
    );
    
    // 添加新主题类
    document.body.classList.add(`theme-${themeColor}`);
    document.body.classList.add(`font-${fontSize}`);
}

// 更新主题显示函数
function updateThemeDisplay(themeColor) {
    let themeName = '';
    switch(themeColor) {
        case 'purple': themeName = '紫色主题'; break;
        case 'blue': themeName = '蓝色主题'; break;
        case 'green': themeName = '绿色主题'; break;
        case 'dark': themeName = '深色模式'; break;
        case 'red': themeName = '红色主题'; break;
        case 'orange': themeName = '橙色主题'; break;
        case 'pink': themeName = '粉色主题'; break;
        case 'teal': themeName = '青绿色主题'; break;
    }
    document.getElementById('currentTheme').textContent = themeName;
}

// 处理退出登录
function handleLogout() {
    // 只移除用户信息，保留主题等设置
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('rememberedUser');
    window.location.href = 'index.html';
}
// 从本地存储加载设置
function loadSettings() {
    // 主题设置 - 默认使用紫色主题
    const savedTheme = localStorage.getItem('themeColor') || 'purple';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    document.getElementById('themeColor').value = savedTheme;
    document.getElementById('fontSize').value = savedFontSize;
    applyTheme(savedTheme, savedFontSize);
    
    // ... 其他设置加载代码保持不变 ...
}
// 应用主题样式
function applyTheme(themeColor, fontSize) {
    // 移除现有主题类
    document.body.classList.remove(
        'theme-purple', 'theme-blue', 'theme-green', 'theme-dark',
        'font-small', 'font-medium', 'font-large'
    );
    
    // 添加新主题类
    document.body.classList.add(`theme-${themeColor}`);
    document.body.classList.add(`font-${fontSize}`);
}