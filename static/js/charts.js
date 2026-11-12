/**
 * 图表功能
 * 用于market-analysis.html页面
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在市场分析页面
    if (!document.getElementById('price-chart')) return;
    
    // 引入Chart.js库
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = initCharts;
    document.head.appendChild(script);
    
    function initCharts() {
        // 价格趋势图表
        const priceCtx = document.getElementById('price-chart').getContext('2d');
        const priceChart = new Chart(priceCtx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [
                    {
                        label: '巨峰葡萄',
                        data: [12.5, 13.2, 14.0, 13.8, 12.9, 12.5, 11.8, 12.2, 13.5, 14.2, 14.8, 15.0],
                        borderColor: '#6a3093',
                        backgroundColor: 'rgba(106, 48, 147, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: '阳光玫瑰',
                        data: [22.8, 23.5, 24.2, 23.8, 22.5, 21.8, 20.5, 21.2, 23.8, 25.2, 26.5, 27.0],
                        borderColor: '#a044ff',
                        backgroundColor: 'rgba(160, 68, 255, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: '红提',
                        data: [15.2, 16.0, 16.5, 16.0, 15.5, 15.0, 14.5, 15.2, 16.5, 17.2, 17.8, 18.0],
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '2023年全国葡萄价格趋势（元/斤）'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: '价格（元/斤）'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
        
        // 地区价格对比图表
        const regionCtx = document.getElementById('region-chart').getContext('2d');
        const regionChart = new Chart(regionCtx, {
            type: 'bar',
            data: {
                labels: ['山东', '云南', '新疆', '河北', '浙江', '辽宁'],
                datasets: [
                    {
                        label: '巨峰葡萄',
                        data: [12.5, 13.8, 14.2, 12.8, 13.5, 12.2],
                        backgroundColor: 'rgba(106, 48, 147, 0.7)'
                    },
                    {
                        label: '阳光玫瑰',
                        data: [25.8, 26.5, 24.8, 25.2, 26.8, 24.5],
                        backgroundColor: 'rgba(160, 68, 255, 0.7)'
                    },
                    {
                        label: '红提',
                        data: [16.5, 17.2, 16.8, 16.2, 17.5, 16.0],
                        backgroundColor: 'rgba(40, 167, 69, 0.7)'
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '2023年6月各地区葡萄价格对比（元/斤）'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: '价格（元/斤）'
                        }
                    }
                }
            }
        });
        
        // 品种占比图表
        const varietyCtx = document.getElementById('variety-chart').getContext('2d');
        const varietyChart = new Chart(varietyCtx, {
            type: 'pie',
            data: {
                labels: ['巨峰葡萄', '阳光玫瑰', '红提', '夏黑', '玫瑰香', '其他'],
                datasets: [{
                    data: [35, 25, 15, 10, 8, 7],
                    backgroundColor: [
                        '#6a3093',
                        '#a044ff',
                        '#28a745',
                        '#17a2b8',
                        '#ffc107',
                        '#6c757d'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '2023年全国葡萄品种占比'
                    },
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
        
        // 图表切换按钮
        const chartToggles = document.querySelectorAll('.chart-toggle');
        chartToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const chartType = this.dataset.chartType;
                const chartId = this.dataset.chartId;
                const chart = getChartById(chartId);
                
                if (chart) {
                    chart.config.type = chartType;
                    chart.update();
                    
                    // 更新按钮状态
                    chartToggles.forEach(btn => {
                        if (btn.dataset.chartId === chartId) {
                            btn.classList.remove('active');
                        }
                    });
                    this.classList.add('active');
                }
            });
        });
        
        function getChartById(chartId) {
            switch(chartId) {
                case 'price-chart': return priceChart;
                case 'region-chart': return regionChart;
                case 'variety-chart': return varietyChart;
                default: return null;
            }
        }
        
        // 初始化按钮状态
        chartToggles.forEach(toggle => {
            if (toggle.dataset.chartDefault === 'true') {
                toggle.classList.add('active');
            }
        });
    }
});