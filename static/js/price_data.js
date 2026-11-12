
    // 全局变量
    let allData = [];
    let filteredData = [];
    let currentPage = 1;
    const rowsPerPage = 10;
    let autoScrollInterval;
    
    // DOM元素（保持不变）
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
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
    const exportBtn = document.getElementById('export-btn');
    
    // 初始化页面（保持不变）
    document.addEventListener('DOMContentLoaded', () => {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        varietyFilter.addEventListener('change', filterData);
        regionFilter.addEventListener('change', filterData);
        searchInput.addEventListener('input', filterData);
        refreshBtn.addEventListener('click', () => {
            if (allData.length > 0) filterData();
            else showError('请先选择数据文件');
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
        fileInput.addEventListener('change', handleFileSelect);
        exportBtn.addEventListener('click', exportData);
    });

    // 处理文件选择（保持不变）
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
                    case 'csv': data = parseCSV(e.target.result); break;
                    case 'xlsx':
                    case 'xls': data = parseExcel(e.target.result); break;
                    case 'json': data = parseJSON(e.target.result); break;
                    default: throw new Error('不支持的文件格式');
                }
                
                if (data?.length > 0) {
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
                    showSuccess(`成功加载 ${data.length} 条数据`);
                } else {
                    throw new Error('文件中没有有效数据');
                }
            } catch (error) {
                showError(`处理文件时出错: ${error.message}`);
            }
        };
        
        reader.onerror = () => showError('读取文件时出错');
        
        if (fileExtension === 'csv' || fileExtension === 'json') {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    }

    // 辅助函数：统一格式化日期为"年/月/日"
    function formatDateToYMD(dateValue) {
        // 处理Excel日期数字（如45801）
        if (typeof dateValue === 'number' && dateValue > 0) {
            const date = new Date((dateValue - 25568) * 86400 * 1000);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}/${month}/${day}`;
        }
        // 处理日期字符串（如"2025-05-24"）
        else if (typeof dateValue === 'string') {
            // 尝试解析ISO格式（YYYY-MM-DD）
            let date = new Date(dateValue);
            if (isNaN(date.getTime())) {
                // 尝试解析其他格式
                date = new Date(dateValue.replace(/\//g, '-'));
            }
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}/${month}/${day}`;
            }
        }
        // 其他情况返回原始值
        return dateValue;
    }

    // 辅助函数：移除价格中的"元/斤"单位
    function formatPrice(item) {
        if (item['价格'] !== undefined) {
            // 提取纯数字部分（移除所有非数字字符）
            const num = parseFloat(item['价格'].toString().replace(/[^\d.-]/g, ''));
            if (!isNaN(num)) {
                item['价格'] = num.toFixed(2); // 保留两位小数
            }
        }
    }

    // 解析Excel数据（移除价格单位）
    function parseExcel(arrayBuffer) {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        return jsonData.map(item => {
            // 统一处理日期
            if (item['时间'] !== undefined) {
                item['时间'] = formatDateToYMD(item['时间']);
            }
            
            // 处理价格（移除单位）
            formatPrice(item);
            
            return item;
        });
    }

    // 解析CSV数据（移除价格单位）
    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',').map(v => v.trim());
            if (values.length < headers.length) continue;
            
            const item = {};
            headers.forEach((header, index) => {
                item[header] = values[index] || '';
            });

            // 统一处理日期
            if (item['时间'] !== undefined) {
                item['时间'] = formatDateToYMD(item['时间']);
            }
            
            // 处理价格（移除单位）
            formatPrice(item);
            
            data.push(item);
        }
        return data;
    }

    // 解析JSON数据（移除价格单位）
    function parseJSON(jsonText) {
        try {
            const jsonData = JSON.parse(jsonText);
            if (!Array.isArray(jsonData)) throw new Error('JSON数据应该是一个数组');
            
            return jsonData.map(item => {
                // 统一处理日期
                if (item['时间'] !== undefined) {
                    item['时间'] = formatDateToYMD(item['时间']);
                }
                
                // 处理价格（移除单位）
                formatPrice(item);
                
                return item;
            });
        } catch (error) {
            throw new Error(`解析JSON时出错: ${error.message}`);
        }
    }

    // 填充筛选器选项（保持不变）
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

    // 过滤数据（保持不变）
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

    // 渲染表格（修改价格显示）
    function renderTable() {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);
        
        tableBody.innerHTML = '';
        
        pageData.forEach(item => {
            const row = document.createElement('tr');
            
            // 时间（统一格式）
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
            
            // 价格（不带单位）
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
            
            if (trendSymbol === '↑') {
                trendCell.classList.add('up');
            } else if (trendSymbol === '↓') {
                trendCell.classList.add('down');
            }
            
            row.appendChild(trendCell);
            tableBody.appendChild(row);
        });
        
        updatePagination();
    }
    
    // 更新分页按钮（保持不变）
    function updatePagination() {
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        pageButtons.innerHTML = '';
        
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
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // 更新统计信息（修改价格计算）
    function updateStats() {
        // 品种数量
        const varieties = new Set(filteredData.map(item => item['产品']));
        varietyCountElement.textContent = varieties.size;
        
        // 地区数量
        const regions = new Set(filteredData.map(item => item['产地']));
        regionCountElement.textContent = regions.size;
        
        // 平均价格（直接使用数字值）
        if (filteredData.length > 0) {
            const total = filteredData.reduce((sum, item) => {
                const price = parseFloat(item['价格']) || 0;
                return sum + price;
            }, 0);
            
            const avg = total / filteredData.length;
            avgPriceElement.textContent = avg.toFixed(2); // 不带单位
        } else {
            avgPriceElement.textContent = '0';
        }
    }
    
    // 导出数据（保持不变）
    function exportData() {
        if (filteredData.length === 0) {
            showError('没有数据可导出');
            return;
        }
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(filteredData);
        XLSX.utils.book_append_sheet(wb, ws, "葡萄价格数据");
        XLSX.writeFile(wb, `葡萄价格数据_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }
    
    // 自动滚动（保持不变）
    function startAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
        
        autoScrollInterval = setInterval(() => {
            const totalPages = Math.ceil(filteredData.length / rowsPerPage);
            if (totalPages > 1) {
                currentPage = currentPage < totalPages ? currentPage + 1 : 1;
                renderTable();
            }
        }, 5000);
    }
    
    // 显示加载状态（保持不变）
    function showLoading(message = '正在加载数据，请稍候...') {
        loadingElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message}`;
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        tableContainer.style.display = 'none';
        paginationElement.style.display = 'none';
    }
    
    // 隐藏加载状态（保持不变）
    function hideLoading() {
        loadingElement.style.display = 'none';
    }
    
    // 显示错误信息（保持不变）
    function showError(message) {
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorElement.style.display = 'block';
        loadingElement.style.display = 'none';
        tableContainer.style.display = 'none';
        paginationElement.style.display = 'none';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
    
    // 显示成功信息（保持不变）
    function showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        successElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.5s, fadeOut 0.5s 2.5s forwards;
        `;
        
        document.body.appendChild(successElement);
        setTimeout(() => successElement.remove(), 3000);
    }
    
    // 添加CSS动画（保持不变）
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
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

   