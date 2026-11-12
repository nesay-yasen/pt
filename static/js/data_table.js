/**
 * 数据表格交互逻辑
 * 用于price-data.html页面
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在数据表格页面
    if (!document.getElementById('price-table')) return;
    
    // 全局变量
    let allData = [];
    let filteredData = [];
    let currentPage = 1;
    const rowsPerPage = 20;
    let autoScrollInterval;
    
    // DOM元素
    const tableBody = document.querySelector('#price-table tbody');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const tableContainer = document.getElementById('table-container');
    const paginationElement = document.getElementById('pagination');
    const varietyFilter = document.getElementById('variety-filter');
    const regionFilter = document.getElementById('region-filter');
    const searchInput = document.getElementById('search-input');
    const refreshBtn = document.getElementById('refresh-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageButtons = document.getElementById('page-buttons');
    const varietyCountElement = document.getElementById('variety-count');
    const regionCountElement = document.getElementById('region-count');
    const avgPriceElement = document.getElementById('avg-price');
    const fileInput = document.getElementById('file-input');
    
    // 初始化页面
    initDataTable();
    
    function initDataTable() {
        // 事件监听器
        varietyFilter.addEventListener('change', filterData);
        regionFilter.addEventListener('change', filterData);
        searchInput.addEventListener('input', filterData);
        refreshBtn.addEventListener('click', () => {
            if (allData.length > 0) {
                filterData();
            } else {
                showError('请先选择数据文件');
            }
        });
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
        nextBtn.addEventListener('click', () => {
            if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
                currentPage++;
                renderTable();
            }
        });
        
        // 文件选择事件
        fileInput.addEventListener('change', handleFileSelect);
        
        // 尝试加载默认数据
        loadDefaultData();
    }
    
    function loadDefaultData() {
        showLoading('正在加载默认数据...');
        
        // 这里可以添加从服务器加载默认数据的逻辑
        // 或者使用内置的示例数据
        setTimeout(() => {
            try {
                // 示例数据
                const exampleData = [
                    {
                        "时间": "2023-06-15",
                        "产品": "巨峰葡萄",
                        "产地": "山东",
                        "价格": "12.5",
                        "涨跌": "+0.5",
                        "趋势": "↑"
                    },
                    {
                        "时间": "2023-06-15",
                        "产品": "阳光玫瑰",
                        "产地": "云南",
                        "价格": "25.8",
                        "涨跌": "-1.2",
                        "趋势": "↓"
                    },
                    // 可以添加更多示例数据...
                ];
                
                allData = exampleData;
                filteredData = [...allData];
                currentPage = 1;
                
                populateFilters();
                renderTable();
                updateStats();
                startAutoScroll();
                
                hideLoading();
                tableContainer.style.display = 'block';
                paginationElement.style.display = 'flex';
            } catch (error) {
                showError(`加载默认数据时出错: ${error.message}`);
            }
        }, 1000);
    }
    
    // 处理文件选择
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        showLoading(`正在加载 ${file.name}...`);
        
        const reader = new FileReader();
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        reader.onload = function(e) {
            try {
                let data;
                switch(fileExtension) {
                    case 'csv':
                        data = parseCSV(e.target.result);
                        break;
                    case 'xlsx':
                    case 'xls':
                        data = parseExcel(e.target.result);
                        break;
                    case 'json':
                        data = parseJSON(e.target.result);
                        break;
                    default:
                        throw new Error('不支持的文件格式');
                }
                
                if (data && data.length > 0) {
                    allData = data;
                    filteredData = [...allData];
                    currentPage = 1;
                    
                    populateFilters();
                    renderTable();
                    updateStats();
                    startAutoScroll();
                    
                    hideLoading();
                    tableContainer.style.display = 'block';
                    paginationElement.style.display = 'flex';
                } else {
                    throw new Error('文件中没有有效数据');
                }
            } catch (error) {
                showError(`处理文件时出错: ${error.message}`);
            }
        };
        
        reader.onerror = function() {
            showError('读取文件时出错');
        };
        
        // 根据文件类型调用适当的读取方法
        if (fileExtension === 'csv') {
            reader.readAsText(file);
        } else if (fileExtension === 'json') {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    }
    
    // 解析CSV数据
    function parseCSV(csvText) {
        // 分割行
        const lines = csvText.split('\n');
        
        // 获取标题行
        const headers = lines[0].split(',').map(h => h.trim());
        
        // 检查必要的列是否存在
        const requiredColumns = ['时间', '产品', '产地', '价格', '涨跌', '趋势'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
            throw new Error(`CSV文件中缺少必要的列: ${missingColumns.join(', ')}`);
        }
        
        // 处理数据行
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // 处理包含逗号的字段
            const values = line.split(',').map(v => v.trim());
            if (values.length < headers.length) continue;
            
            const item = {};
            headers.forEach((header, index) => {
                item[header] = values[index] || '';
            });
            
            data.push(item);
        }
        
        return data;
    }
    
    // 解析Excel数据
    function parseExcel(arrayBuffer) {
        // 读取工作簿
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // 检查必要的列是否存在
        const requiredColumns = ['时间', '产品', '产地', '价格', '涨跌', '趋势'];
        const firstRow = jsonData[0] || {};
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));
        
        if (missingColumns.length > 0) {
            throw new Error(`Excel文件中缺少必要的列: ${missingColumns.join(', ')}`);
        }
        
        return jsonData;
    }
    
    // 解析JSON数据
    function parseJSON(jsonText) {
        try {
            const jsonData = JSON.parse(jsonText);
            
            // 检查是否是数组
            if (!Array.isArray(jsonData)) {
                throw new Error('JSON数据应该是一个数组');
            }
            
            // 检查第一个对象的必要属性
            if (jsonData.length > 0) {
                const firstItem = jsonData[0];
                const requiredProps = ['时间', '产品', '产地', '价格', '涨跌', '趋势'];
                const missingProps = requiredProps.filter(prop => !(prop in firstItem));
                
                if (missingProps.length > 0) {
                    throw new Error(`JSON数据中缺少必要的属性: ${missingProps.join(', ')}`);
                }
            }
            
            return jsonData;
        } catch (error) {
            throw new Error(`解析JSON时出错: ${error.message}`);
        }
    }
    
    // 填充筛选器选项
    function populateFilters() {
        // 获取所有品种
        const varieties = [...new Set(allData.map(item => item['产品']))];
        varietyFilter.innerHTML = '<option value="">所有品种</option>';
        varieties.forEach(variety => {
            const option = document.createElement('option');
            option.value = variety;
            option.textContent = variety;
            varietyFilter.appendChild(option);
        });
        
        // 获取所有地区
        const regions = [...new Set(allData.map(item => item['产地']))];
        regionFilter.innerHTML = '<option value="">所有地区</option>';
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        });
    }
    
    // 过滤数据
    function filterData() {
        const selectedVariety = varietyFilter.value;
        const selectedRegion = regionFilter.value;
        const searchText = searchInput.value.toLowerCase();
        
        filteredData = allData.filter(item => {
            const matchesVariety = selectedVariety === '' || item['产品'] === selectedVariety;
            const matchesRegion = selectedRegion === '' || item['产地'] === selectedRegion;
            const matchesSearch = searchText === '' || 
                item['产品'].toLowerCase().includes(searchText) || 
                item['产地'].toLowerCase().includes(searchText) ||
                item['价格'].toString().toLowerCase().includes(searchText);
            
            return matchesVariety && matchesRegion && matchesSearch;
        });
        
        currentPage = 1;
        renderTable();
        updateStats();
    }
    
    // 渲染表格
    function renderTable() {
        // 计算分页
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);
        
        // 清空表格
        tableBody.innerHTML = '';
        
        // 填充数据
        pageData.forEach(item => {
            const row = document.createElement('tr');
            
            // 时间
            const timeCell = document.createElement('td');
            timeCell.textContent = item['时间'] || '';
            row.appendChild(timeCell);
            
            // 产品
            const productCell = document.createElement('td');
            productCell.textContent = item['产品'] || '';
            row.appendChild(productCell);
            
            // 产地
            const regionCell = document.createElement('td');
            regionCell.textContent = item['产地'] || '';
            row.appendChild(regionCell);
            
            // 价格
            const priceCell = document.createElement('td');
            priceCell.textContent = item['价格'] || '';
            row.appendChild(priceCell);
            
            // 涨跌
            const changeCell = document.createElement('td');
            changeCell.textContent = item['涨跌'] || '';
            row.appendChild(changeCell);
            
            // 趋势
            const trendCell = document.createElement('td');
            const trendSymbol = item['趋势'] || '';
            trendCell.textContent = trendSymbol;
            
            // 根据趋势设置样式
            if (trendSymbol === '↑') {
                trendCell.classList.add('up');
            } else if (trendSymbol === '↓') {
                trendCell.classList.add('down');
            }
            
            row.appendChild(trendCell);
            
            tableBody.appendChild(row);
        });
        
        // 更新分页按钮
        updatePagination();
    }
    
    // 更新分页按钮
    function updatePagination() {
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        pageButtons.innerHTML = '';
        
        // 显示最多5个页码按钮
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + 4);
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderTable();
            });
            pageButtons.appendChild(pageBtn);
        }
        
        // 禁用/启用上一页/下一页按钮
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // 更新统计信息
    function updateStats() {
        // 品种数量
        const varieties = new Set(filteredData.map(item => item['产品']));
        varietyCountElement.textContent = varieties.size;
        
        // 地区数量
        const regions = new Set(filteredData.map(item => item['产地']));
        regionCountElement.textContent = regions.size;
        
        // 平均价格
        if (filteredData.length > 0) {
            const total = filteredData.reduce((sum, item) => {
                const priceStr = item['价格'].toString().replace(/[^\d.-]/g, '');
                const price = parseFloat(priceStr) || 0;
                return sum + price;
            }, 0);
            
            const avg = total / filteredData.length;
            avgPriceElement.textContent = avg.toFixed(2) + '元/斤';
        } else {
            avgPriceElement.textContent = '0';
        }
    }
    
    // 自动滚动
    function startAutoScroll() {
        // 先清除之前的定时器
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
        
        // 设置新的定时器
        autoScrollInterval = setInterval(() => {
            const totalPages = Math.ceil(filteredData.length / rowsPerPage);
            if (totalPages > 1) {
                if (currentPage < totalPages) {
                    currentPage++;
                } else {
                    currentPage = 1;
                }
                renderTable();
            }
        }, 3000); // 3秒切换一次
    }
    
    // 显示加载状态
    function showLoading(message = '正在加载数据，请稍候...') {
        loadingElement.textContent = message;
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        tableContainer.style.display = 'none';
        paginationElement.style.display = 'none';
    }
    
    // 隐藏加载状态
    function hideLoading() {
        loadingElement.style.display = 'none';
    }
    
    // 显示错误信息
    function showError(message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        loadingElement.style.display = 'none';
        tableContainer.style.display = 'none';
        paginationElement.style.display = 'none';
    }
});