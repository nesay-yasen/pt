
       
        // 标签页切换
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // 移除所有active类
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // 添加active类到当前标签
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // 关闭移动菜单
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                    }
                }
            });
        });
          // 页面加载完成后初始化图表
    document.addEventListener('DOMContentLoaded', function() {
        // 价格趋势图表
        const priceTrendCtx = document.createElement('canvas');
        priceTrendCtx.id = 'priceTrendChart';
        const priceTrendContainer = document.querySelector('#price-trend .chart-container');
        priceTrendContainer.innerHTML = '';
        priceTrendContainer.appendChild(priceTrendCtx);
        
        new Chart(priceTrendCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [
                    {
                        label: '阳光玫瑰',
                        data: [38, 36, 35, 32, 30, 28, 25, 22, 24, 28, 32, 36],
                        borderColor: '#FF6384',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: '巨峰葡萄',
                        data: [12, 11, 10, 9, 8, 7, 6, 5, 6, 8, 10, 12],
                        borderColor: '#36A2EB',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: '红提',
                        data: [18, 17, 16, 15, 14, 13, 12, 11, 12, 14, 16, 18],
                        borderColor: '#FFCE56',
                        backgroundColor: 'rgba(255, 206, 86, 0.1)',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '2025年主要葡萄品种价格趋势(元/斤)'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0
                    }
                }
            }
        });

        // 区域对比图表
        const regionCtx = document.createElement('canvas');
        regionCtx.id = 'regionChart';
        const regionContainer = document.querySelector('#region-comparison .chart-container');
        regionContainer.innerHTML = '';
        regionContainer.appendChild(regionCtx);
        
        new Chart(regionCtx, {
            type: 'bar',
            data: {
                labels: ['新疆', '云南', '河北', '山东', '辽宁'],
                datasets: [
                    {
                        label: '平均价格(元/斤)',
                        data: [12.5, 15.8, 9.2, 8.7, 10.3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(153, 102, 255, 0.7)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '主要产区葡萄平均价格对比'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // 品种分析图表
        const varietyCtx = document.createElement('canvas');
        varietyCtx.id = 'varietyChart';
        const varietyContainer = document.querySelector('#variety-analysis .chart-container');
        varietyContainer.innerHTML = '';
        varietyContainer.appendChild(varietyCtx);
        
        new Chart(varietyCtx, {
            type: 'doughnut',
            data: {
                labels: ['阳光玫瑰', '巨峰葡萄', '红提', '夏黑', '其他'],
                datasets: [{
                    data: [25, 30, 20, 15, 10],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '葡萄品种市场份额(%)'
                    },
                    legend: {
                        position: 'right'
                    }
                }
            }
        });

        // 季节性趋势图表
        const seasonalCtx = document.createElement('canvas');
        seasonalCtx.id = 'seasonalChart';
        const seasonalContainer = document.querySelector('#seasonal-trend .chart-container');
        seasonalContainer.innerHTML = '';
        seasonalContainer.appendChild(seasonalCtx);
        
        new Chart(seasonalCtx, {
            type: 'radar',
            data: {
                labels: ['1-3月', '4-6月', '7-9月', '10-12月'],
                datasets: [
                    {
                        label: '价格指数',
                        data: [120, 90, 70, 100],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                        pointRadius: 5
                    },
                    {
                        label: '供应量指数',
                        data: [60, 80, 120, 90],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '葡萄季节性供需变化(指数)'
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 150
                    }
                }
            }
        });
    });
       // 处理退出登录
        function handleLogout() {
            // 清除sessionStorage和localStorage中的用户数据
            sessionStorage.removeItem('currentUser');
            localStorage.removeItem('rememberedUser');
            
            // 更新显示
            updateUserInfoDisplay();
            
            // 阻止默认行为并返回首页
            window.location.href = 'index.html';
            return false;
        }

       // 更新用户信息显示
       function updateUserInfoDisplay() {
                const userInfoContainer = document.getElementById('userInfoContainer');
                const currentUserStr = sessionStorage.getItem('currentUser') || 
                                    localStorage.getItem('rememberedUser');
                
                if (currentUserStr) {
                    try {
                        const currentUser = JSON.parse(currentUserStr);
                        
                        userInfoContainer.innerHTML = `
                            <div class="user-info">
                                <img src="${currentUser.avatar}" alt="${currentUser.username}的头像" class="user-avatar"
                                onerror="this.src='static/images/VX/putong.png'">
                                
                                <span class="user-name">${currentUser.username}</span>
                                <div class="user-dropdown">
                                    <a href="wode.html" class="profile-btn">个人中心</a>
                                    <a href="index.html" class="logout-btn">退出登录</a>
                                </div>
                            </div>
                        `;
                    } 
                    catch (e) {
                        console.error('解析用户数据失败:', e);
                        showLoginButton();
                    }
                } 
                else {
                    showLoginButton();
                }
            }
        function showLoginButton() {
            userInfoContainer.innerHTML = `
                <a href="denglu.html" class="btn-login">登录/注册</a>
            `;
        }


        // 页面加载时更新用户信息显示
        updateUserInfoDisplay();
        // 监听退出登录链接的点击事件
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('logout-btn')) {
            handleLogout();
        }
    });
 