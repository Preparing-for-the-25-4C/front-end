<template>
  <br>
  <homepage :probList="probList" />
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
      <!-- 日历部分 - 改进版 -->
      <div class="calendar">
        <div class="calendar-header">
          <h3>Calendar</h3>
          <div>
            <span @click="prevMonth" class="month-nav">◀</span>
            <span>{{ currentYear }}年{{ currentMonth }}月</span>
            <span @click="nextMonth" class="month-nav">▶</span>
          </div>
        </div>
        
        <!-- 改进的日历网格 -->
        <div class="calendar-grid">
          <!-- 星期标题 -->
          <div v-for="day in weekDays" :key="day" class="calendar-day-header">
            {{ day }}
          </div>
          
          <!-- 空白格子填充月初前的日期 -->
          <div v-for="i in firstDayOfMonth" :key="'empty-' + i" class="calendar-day empty"></div>
          
          <!-- 当月日期 -->
          <div 
            v-for="day in daysInMonth" 
            :key="day"
            :class="[
              'calendar-day', 
              isToday(day) ? 'today' : '',
              selectedDate === day ? 'selected' : ''
            ]"
            @click="selectDate(day)"
          >
            {{ day }}
          </div>
        </div>
      </div>

      <!-- 进度图表部分 -->
      <div class="progress-chart">
        <div class="progress-ring" :style="{
          background: `conic-gradient(#1890ff 0% ${processRate}%, #f0f0f0 ${processRate}% 100%)`
        }"></div>
        <div class="progress-center">{{ processRate }}%</div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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
        alert('请先登录！');
        router.push('/login'); // 跳转到登录页面
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

// 题目列表数据
const problems = ref([]);

// 筛选相关数据
const queryParams = ref({
  status: null,
  probSkill: null,
  difficulty: null,
  desc: false,
  orderBy: null,
  vague: null
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
  const response = await axios.post(
      `/api/getProblems/${pageSize.value}/${pageNum.value}`,
      {
        "status": queryParams.value.status,
        "probSkill": queryParams.value.probSkill,
        "difficulty": queryParams.value.difficulty,
        "desc": queryParams.value.desc,
        "orderBy": queryParams.value.orderBy,
        "vague": queryParams.value.vague
      },
      {
        headers: {
          'Token': Token.value // 将 Token 放到请求头中
        }
      }
    );
    if(response.data.errCode === 1000){
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

// ===== 改进的日历部分 =====
// 星期几的标签
const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

// 当前日期相关数据
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth() + 1); // JavaScript 月份从0开始，所以+1
const selectedDate = ref(null);

// 计算当月有多少天
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 0).getDate();
});

// 计算当月第一天是星期几（0-6）
const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value - 1, 1).getDay();
});

// 检查是否为今天
const isToday = (day) => {
  return day === today.getDate() && 
         currentMonth.value === today.getMonth() + 1 && 
         currentYear.value === today.getFullYear();
};

// 选择日期
const selectDate = (day) => {
  selectedDate.value = day;
};

// 切换到上一个月
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentYear.value--;
    currentMonth.value = 12;
  } else {
    currentMonth.value--;
  }
  selectedDate.value = null;
};

// 切换到下一个月
const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentYear.value++;
    currentMonth.value = 1;
  } else {
    currentMonth.value++;
  }
  selectedDate.value = null;
};

// 页面加载时初始化
onMounted(() => {
  fetchProblems();
  fetchProcessRate();
  
  // 如果是当月，选中今天的日期
  if (currentMonth.value === today.getMonth() + 1 && 
      currentYear.value === today.getFullYear()) {
    selectedDate.value = today.getDate();
  }
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
  height: 100vh;
  overflow-y: auto;
}

.sidebar:hover {
  border: 2px solid #ddd;
  border-radius: 8px;
}

/* 改进的日历样式 */
.calendar {
  margin-bottom: 2rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.month-nav {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.month-nav:hover {
  background-color: #f0f0f0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
}

.calendar-day-header {
  padding: 0.5rem;
  font-size: 0.875rem;
  font-weight: bold;
}

.calendar-day {
  padding: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 50%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.calendar-day.empty {
  cursor: default;
}

.calendar-day:hover:not(.empty) {
  background-color: #f0f0f0;
}

.calendar-day.today {
  background: #1890ff;
  color: white;
  font-weight: bold;
}

.calendar-day.selected:not(.today) {
  background-color: #e6f7ff;
  border: 1px solid #1890ff;
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
  border-radius: 50%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.progress-ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: absolute;
}
.progress-center {
  position: absolute;
  font-size: 1.5rem;
  color: black;
  font-weight: bold;
  z-index: 2;
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
