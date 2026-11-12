// 生成模拟葡萄品种分布数据
function generateVarietyDistributionData() {
    const varieties = [
        '赤霞珠', '梅洛', '霞多丽', '黑皮诺', '西拉', 
        '雷司令', '长相思', '品丽珠', '歌海娜', '丹魄'
    ];
    
    const distributionData = {
        labels: varieties,
        datasets: [{
            label: '种植面积占比(%)',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(199, 199, 199, 0.7)',
                'rgba(83, 102, 255, 0.7)',
                'rgba(40, 208, 148, 0.7)',
                'rgba(255, 99, 71, 0.7)'
            ],
            borderWidth: 1
        }]
    };

    // 生成随机占比数据（总和为100%）
    let remaining = 100;
    for (let i = 0; i < varieties.length; i++) {
        let percentage;
        if (i === varieties.length - 1) {
            percentage = remaining;
        } else {
            percentage = Math.random() * (remaining / 2);
            remaining -= percentage;
        }
        distributionData.datasets[0].data.push(parseFloat(percentage.toFixed(1)));
    }

    return distributionData;
}