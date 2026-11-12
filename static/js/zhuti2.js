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