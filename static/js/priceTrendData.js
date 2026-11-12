// 生成模拟价格趋势数据（过去30天+未来7天预测）
function generatePriceTrendData() {
    const basePrice = 100 + Math.random() * 50; // 基准价格
    const trendData = {
        labels: [],
        datasets: [
            {
                label: '历史价格',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            },
            {
                label: '预测价格',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false
            }
        ]
    };

    // 生成过去30天数据（带随机波动）
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        trendData.labels.push(date.toLocaleDateString());
        
        // 模拟价格波动（基于前一日价格）
        const prevPrice = trendData.datasets[0].data.length > 0 ? 
            trendData.datasets[0].data[trendData.datasets[0].data.length - 1] : basePrice;
        const fluctuation = (Math.random() - 0.5) * 10; // -5~5随机波动
        trendData.datasets[0].data.push(prevPrice + fluctuation);
    }

    // 生成未来7天预测数据（基于线性趋势）
    const lastPrice = trendData.datasets[0].data[trendData.datasets[0].data.length - 1];
    const trendSlope = (Math.random() - 0.3) * 2; // 轻微上升或下降趋势
    
    for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        trendData.labels.push(date.toLocaleDateString());
        
        const predictedPrice = lastPrice + (trendSlope * i) + (Math.random() - 0.5) * 5;
        trendData.datasets[1].data.push(predictedPrice);
    }

    return trendData;
}