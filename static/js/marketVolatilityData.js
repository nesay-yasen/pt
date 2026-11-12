// 生成模拟市场波动数据（包含成交量与价格波动）
function generateMarketVolatilityData() {
    const volatilityData = {
        labels: [], // 时间标签
        datasets: [
            {
                label: '价格波动(%)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y',
                borderWidth: 2
            },
            {
                label: '成交量(万箱)',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                yAxisID: 'y1',
                type: 'bar'
            }
        ]
    };

    // 生成30天数据
    const baseVolume = 50;
    let prevPriceChange = 0;
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        volatilityData.labels.push(date.toLocaleDateString());

        // 生成价格波动（与前一日相关）
        const priceChange = prevPriceChange * 0.7 + (Math.random() - 0.5) * 3;
        volatilityData.datasets[0].data.push(parseFloat(priceChange.toFixed(2)));
        prevPriceChange = priceChange;

        // 生成成交量（与价格波动负相关）
        const volume = baseVolume * (1 + Math.random() * 0.5) * (1 - Math.abs(priceChange) / 10);
        volatilityData.datasets[1].data.push(parseFloat(volume.toFixed(1)));
    }

    return volatilityData;
}