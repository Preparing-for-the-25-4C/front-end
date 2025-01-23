<template>
    <br>
    <br>
    <div class="body2">
      <div class="container">
        <!-- 左侧主要内容 -->
        <main>
          <!-- 推荐算法部分 -->
          <section class="algorithm-section">
            <div class="algorithm-title">
              <h3>推荐算法</h3>
              <span>></span>
            </div>
            <div class="algorithm-cards">
              <div class="algorithm-card"></div>
              <div class="algorithm-card"></div>
              <div class="algorithm-card"></div>
            </div>
          </section>
  
          <!-- 题目列表部分 -->
          <section class="problem-section">
            <div class="search-bar">
              <select>
                <option>状态</option>
              </select>
              <select>
                <option>标签</option>
              </select>
              <select>
                <option>难度</option>
              </select>
              <input type="text" placeholder="搜索题目" />
              <button @click="handleSearch">搜索</button>
            </div>
  
            <table class="problem-table">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>题目</th>
                  <th>难度</th>
                  <th>通过率</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>题目1</td>
                  <td>中等</td>
                  <td>0/0</td>
                  <td><RouterLink class="submit-btn" to="/program">挑战</RouterLink></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>题目2</td>
                  <td>中等</td>
                  <td>0/0</td>
                  <td><RouterLink class="submit-btn" to="/program">挑战</RouterLink></td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
        <!-- 右侧边栏 -->
        <aside class="sidebar">
          <!-- 日历部分 -->
          <div class="calendar">
            <div class="calendar-header">
              <h3>Calendar</h3>
              <div>
                <span @click="prevMonth">◀</span>
                <span>{{ currentYear }}年{{ currentMonth }}月</span>
                <span @click="nextMonth">▶</span>
              </div>
            </div>
            <div class="calendar-grid" id="calendarGrid" ref="calendarGrid">
              <!-- 日历内容由 JavaScript 生成 -->
            </div>
          </div>
  
          <!-- 进度图表部分 -->
          <div class="progress-section">
            <h3>刷题进度</h3>
            <div class="progress-chart">
              <div class="progress-ring"></div>
              <div class="progress-center">70%</div>
            </div>
            <p>学习进度正常率</p>
          </div>
        </aside>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, onMounted } from 'vue';
  import { RouterLink } from 'vue-router';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  // 日历相关数据
  const currentYear = ref(2025);
  const currentMonth = ref(1);
  // 挑战题目
  // 处理搜索按钮点击事件
  const handleSearch = () => {
    console.log('搜索按钮被点击');
  };
  // 切换到上一个月
  const prevMonth = () => {
    if (currentMonth.value === 1) {
      currentYear.value--;
      currentMonth.value = 12;
    } else {
      currentMonth.value--;
    }
    generateCalendar();
  };
  
  // 切换到下一个月
  const nextMonth = () => {
    if (currentMonth.value === 12) {
      currentYear.value++;
      currentMonth.value = 1;
    } else {
      currentMonth.value++;
    }
    generateCalendar();
  };
  
  // 生成日历
  const generateCalendar = () => {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = ''; // 清空日历内容
  
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  
    // 添加星期标题
    weekDays.forEach(day => {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = day;
      calendarGrid.appendChild(dayElement);
    });
  
    // 获取当前月的第一天是星期几
    const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1).getDay();
    const daysInMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();
  
    // 添加空白天数
    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'calendar-day';
      calendarGrid.appendChild(emptyDay);
    }
  
    // 添加日期
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement('div');
      dayElement.className = 'calendar-day';
      dayElement.textContent = i;
      if (i === 15) { // 假设今天是15号
        dayElement.classList.add('today');
      }
      calendarGrid.appendChild(dayElement);
    }
  };
  
  // 页面加载时生成日历
  onMounted(() => {
    generateCalendar();
  });
  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .body2{
  padding: 40px;
  background-color: #f5f5f5;
  min-height: 100vh;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background-color: rgba(253, 255, 253, 255); /* 设置页面背景颜色 */
  }
  
  /* 导航栏 */
  .navbar {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: white;
    border-bottom: 1px solid #eee;
  }
  
  .nav-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  
  .nav-item.active {
    color: #1890ff;
  }
  
  .nav-item:hover {
    border: 2px solid #1890ff;
    border-radius: 4px;
  }
  
  /* 主要内容区域 */
  .container {
    max-width: 1200px;
  margin: 1rem auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1rem;
  background-color: #f5f5f5;
  }
  
  /* 推荐算法区域 */
  .algorithm-section {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .algorithm-section:hover {
    border: 2px solid #ddd;
    border-radius: 8px;
  }
  
  .algorithm-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .algorithm-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  
  .algorithm-card {
    height: 100px;
    background: #f0f0f0;
    border-radius: 4px;
  }
  
  .algorithm-card:hover {
    border: 2px solid #ddd;
    border-radius: 4px;
  }
  
  /* 题目列表区域 */
  .problem-section {
    background: white;
    padding: 1rem;
    border-radius: 8px;
  }
  
  .problem-section:hover {
    border: 2px solid #ddd;
    border-radius: 8px;
  }
  
  .search-bar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .search-bar select,
  .search-bar input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .search-bar input {
    flex: 1;
  }
  
  .search-bar button {
    padding: 0.5rem 1rem;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .search-bar button:hover {
    border: 2px solid #126dbe;
    border-radius: 4px;
  }
  
  .problem-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .problem-table th,
  .problem-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  .problem-table th {
    background: #fafafa;
    font-weight: normal;
  }
  
  .submit-btn {
    padding: 0.25rem 0.75rem;
    background: #52c41a;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
  }
  
  .submit-btn:hover {
    border: 2px solid #3d9412;
    border-radius: 4px;
  }
  
  /* 右侧边栏 */
  .sidebar {
    background: white;
    padding: 1rem;
    border-radius: 8px;
  }
  
  .sidebar:hover {
    border: 2px solid #ddd;
    border-radius: 8px;
  }
  
  /* 日历样式 */
  .calendar {
    margin-bottom: 2rem;
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.25rem;
    text-align: center;
  }
  
  .calendar-day {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
  
  .calendar-day.today {
    background: #1890ff;
    color: white;
    border-radius: 50%;
  }
  
  .calendar-day:hover {
    border: 2px solid #ddd;
    border-radius: 50%;
  }
  
  /* 进度图表 */
  .progress-section {
    text-align: center;
  }
  
  .progress-chart {
    width: 150px;
    height: 150px;
    margin: 1rem auto;
    position: relative;
  }
  
  .progress-ring {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: conic-gradient(#1890ff 0% 70%, #f0f0f0 70% 100%);
  }
  
  .progress-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .progress-section:hover {
    border: 2px solid #ddd;
    border-radius: 8px;
  }
  </style>