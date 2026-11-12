/**
 * 用户访问权限检查脚本
 * 将此脚本放在需要登录才能访问的页面的<head>或<body>最前面
 */

(function() {
    'use strict';
    
    // 定义公开页面（不需要登录即可访问）
    const PUBLIC_PAGES = [
        'index.html',        // 首页
        'denglu.html',       // 登录页
        'zhuce.html',        // 注册页
        'forgot-password.html' // 忘记密码页
    ];
    
    // 获取当前页面文件名
    function getCurrentPage() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    }
    
    // 检查用户是否已登录
    function isUserLoggedIn() {
        const currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('rememberedUser');
        if (!currentUser) return false;
        
        try {
            JSON.parse(currentUser);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // 获取要返回的URL参数
    function getReturnUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('return') || 'index.html';
    }
    
    // 主验证函数
    function checkAuth() {
        const currentPage = getCurrentPage();
        
        // 如果是公开页面，直接放行
        if (PUBLIC_PAGES.includes(currentPage)) {
            return true;
        }
        
        // 检查登录状态
        if (!isUserLoggedIn()) {
            // 存储当前想访问的页面地址
            const returnUrl = encodeURIComponent(window.location.href);
            // 跳转到登录页，并带上返回地址参数
            window.location.href = `denglu.html?return=${returnUrl}`;
            return false;
        }
        
        return true;
    }
    
    // 立即执行验证
    window.addEventListener('DOMContentLoaded', function() {
        checkAuth();
    });
    
    // 提供全局函数用于其他脚本检查登录状态
    window.auth = window.auth || {};
    window.auth.isLoggedIn = isUserLoggedIn;
    window.auth.getCurrentUser = function() {
        const userStr = sessionStorage.getItem('currentUser') || localStorage.getItem('rememberedUser');
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    };
    window.auth.logout = function() {
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('rememberedUser');
        window.location.href = 'denglu.html';
    };
})();