<template>
  <br>
  <div class="body2">
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
          <select v-model="queryParams.status">
            <option :value="null">状态</option>
            <option value="通过">通过</option>
            <option value="未通过">未通过</option>
          </select>
          <select v-model="queryParams.probSkill">
            <option :value="null">标签</option>
            <option value="数组">数组</option>
            <option value="字符串">字符串</option>
            <option value="链表">链表</option>
            <option value="栈">栈</option>
            <option value="队列">队列</option>
            <option value="树">树</option>
            <option value="图">图</option>
            <option value="排序">排序</option>
            <option value="查找">查找</option>
            <option value="动态规划">动态规划</option>
            <option value="贪心">贪心</option>
            <option value="回溯">回溯</option>
            <option value="分治">分治</option>
            <option value="二分查找">二分查找</option>
            <option value="位运算">位运算</option>
            <option value="数学">数学</option>
            <option value="几何">几何</option>
            <option value="概率">概率</option>
            <option value="统计">统计</option>
            <option value="图论">图论</option>
            <option value="搜索">搜索</option>
            <option value="并查集">并查集</option>
            <option value="拓扑排序">拓扑排序</option>
            <option value="堆">堆</option>
            <option value="哈希表">哈希表</option>
            <option value="前缀和">前缀和</option>
            <option value="双指针">双指针</option>
            <option value="单调栈">单调栈</option>
            <option value="单调队列">单调队列</option>
          </select>
          <select v-model="queryParams.difficulty">
            <option :value="null">难度</option>
            <option value="简单">简单</option>
            <option value="中等">中等</option>
            <option value="困难">困难</option>
          </select>
          <select v-model="queryParams.desc">
            <option :value="false">排序</option>
            <option value="false">升序</option>
            <option value="true">降序</option>
          </select>
          <input type="text" placeholder="搜索题目" v-model="queryParams.orderBy"/>
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
            <tr v-for="problem in problems" :key="problem.id">
              <td>{{ problem.probId }}</td>
              <td>{{ problem.probTitle }}</td>
              <td>{{ problem.difficulty }}</td>
              <td>{{ problem.probSuccess }}</td>
              <td><RouterLink class="submit-btn" :to="{
                path:'/program',
                query: { id: problem.probId,
                title: problem.probTitle,
                difficulty: problem.difficulty
                 }
              }">挑战</RouterLink></td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button @click="prevPage" :disabled="pageNum === 1">上一页</button>
          <span>第 {{ pageNum }} 页，共 {{ totalPages }} 页</span>
          <button @click="nextPage" :disabled="pageNum === totalPages">下一页</button>
        </div>
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
      <div class="progress-chart">
  <div class="progress-ring" :style="{
    background: `conic-gradient(#1890ff 0% ${processRate}%, #f0f0f0 ${processRate}% 100%)`
  }"></div>
  <div class="progress-center">{{ processRate*100 }}%</div>
</div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter();
const Token = ref();
const processRate = ref(0);

// 修改后的fetchProcessRate
const fetchProcessRate = async () => {
    const response = await axios.get('/api/getProcessRate', {
      headers: { 'Token': Token.value }
    });
    if (response.data.errCode === 1000) {
      processRate.value = response.data.data;
    } else {
      if (response.data.errCode === 1001) {
        alert('服务器内部错误');
      }
      if (response.data.errCode === 1002) {
        alert('验证码错误');
      }
      if (response.data.errCode === 1003) {
        alert('用户名或密码错误'); 
      }
      if(response.data.errCode === 1004){
        alert('幂等性错误'); 
      }
      if(response.data.errCode === 1005){
        alert('用户名已存在');
      }
      if(response.data.errCode === 1006){
        alert('token过期'); 
      }
      if(response.data.errCode === 1007){
        alert('邮箱验证码错误'); 
      }
      if(response.data.errCode === 1008){
        alert('数据不符合规范'); 
      }
      if(response.data.errCode === 1009){
        alert('邮箱已被使用'); 
      }
      if(response.data.errCode === 1010){
        alert('手机号已被使用'); 
      }
      if(response.data.errCode === 1011){
        alert('不存在的静态资源'); 
      }
    }
  } 
onMounted(() => {
  generateCalendar();
  fetchProblems();
  fetchProcessRate(); // 新增调用
});
// 日历相关数据
const currentYear = ref(2025);
const currentMonth = ref(1);

// 题目列表数据
const problems = ref([]);

// 筛选相关数据
const queryParams = ref({
  status: null,
  probSkill: null,
  difficulty: null,
  desc: false,
  orderBy: null,
  vague:null
});
Token.value = localStorage.getItem('token');
// 分页相关数据
const pageNum = ref(1);
const pageSize = ref(15);
const totalPages = ref(1);

// 处理搜索按钮点击事件
const handleSearch = () => {
  pageNum.value = 1; // 搜索时重置到第一页
  fetchProblems();
};

// 切换到上一页
const prevPage = () => {
  if (pageNum.value > 1) {
    pageNum.value--;
    fetchProblems();
  }
};

// 切换到下一页
const nextPage = () => {
  if (pageNum.value < totalPages.value) {
    pageNum.value++;
    fetchProblems();
  }
}; 
// 获取题目数据
const fetchProblems = async () => {
    const response = await axios.get(`/api/getProblems/${pageSize.value}/${pageNum.value}`, {
      params: {
        status: queryParams.value.status,
        probSkill: queryParams.value.probSkill,
        difficulty: queryParams.value.difficulty,
        desc: queryParams.value.desc,
        orderBy: queryParams.value.orderBy,
        vague: queryParams.value.vague,
        Token: Token.value
      }
    });
if(response.data.errCode ===1000){
    problems.value = response.data.data.probList;
    totalPages.value = Math.ceil(response.data.data.total / pageSize.value);
  }
  else{
    if (response.data.errCode === 1001) {
        alert('服务器内部错误');
      }
      if (response.data.errCode === 1002) {
        alert('验证码错误');
      }
      if (response.data.errCode === 1003) {
        alert('用户名或密码错误'); 
      }
      if(response.data.errCode === 1004){
        alert('幂等性错误'); 
      }
      if(response.data.errCode === 1005){
        alert('用户名已存在');
      }
      if(response.data.errCode === 1006){
        alert('token过期'); 
      }
      if(response.data.errCode === 1007){
        alert('邮箱验证码错误'); 
      }
      if(response.data.errCode === 1008){
        alert('数据不符合规范'); 
      }
      if(response.data.errCode === 1009){
        alert('邮箱已被使用'); 
      }
      if(response.data.errCode === 1010){
        alert('手机号已被使用'); 
      }
      if(response.data.errCode === 1011){
        alert('不存在的静态资源'); 
      }
  }
}



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

// 页面加载时生成日历和获取题目数据
onMounted(() => {
  generateCalendar();
  fetchProblems();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.body2 {
  padding: 40px;
  background-color: #f5f5f5;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1rem;
  max-width: 1200px;
  margin: 1rem auto;
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
  height:100vh;
  overflow-y:auto;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1rem;
}
</style>