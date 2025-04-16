<template>
  <br>
  <br>
  <div class="submission-container">
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <div class="filter-item">
            <label>由题目</label>
            <input type="text" class="filter-input" v-model="filters.problem" @keyup.enter="applyFilters">
          </div>
          <div class="filter-item">
            <label>由比赛</label>
            <input type="text" class="filter-input" v-model="filters.contest" @keyup.enter="applyFilters">
          </div>
          <div class="filter-item">
            <label>由状态</label>
            <select class="filter-select" v-model="filters.status">
              <option value="">全部</option>
              <option value="accepted">通过</option>
              <option value="rejected">未通过</option>
            </select>
          </div>
          <div class="filter-item">
            <label>由语言</label>
            <select class="filter-select" v-model="filters.language">
              <option value="">全部</option>
              <option value="C">C</option>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
            </select>
          </div>
        </div>
        <div class="filter-actions">
          <button class="filter-button primary" @click="applyFilters">筛选</button>
          <button class="filter-button" @click="resetFilters">重置</button>
        </div>
      </div>
    </div>
    <br>
    <div class="table-container">
      <table class="submissions-table">
        <thead>
          <tr>
            <th>状态</th>
            <th>题目</th>
            <th>时间</th>
            <th>语言</th>
            <th>递交时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="submission in currentPageData" :key="submission.id">
            <td class="status-cell">
              <span :class="['status-icon', submission.status === 'Accepted' ? 'accepted' : 'rejected']">
                {{ submission.status === 'Accepted' ? '✓' : '✕' }}
              </span>
            </td>
            <td>{{ submission.probName }}</td>
            <td>{{ submission.wallTime }}</td>
            <td>{{ submission.language }}</td>
            <td>{{ submission.recordTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">上一页</button>
      <span class="pagination-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages" class="pagination-button">下一页</button>
    </div>
  </div>
  <footer class="footer">
  <div class="footer-content">
    <img src="@/pictures/logo.jpg" alt="Logo" class="footer-logo">
    <p>备案号：鲁ICP备2024065791号</p>
  </div>
</footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';

const router = useRouter();
const Token = ref(localStorage.getItem('token'));

const filters = ref({
  problem: '',
  contest: '',
  status: '',
  language: ''
});

const allData = ref([]); // 存储所有数据
const filteredData = ref([]); // 筛选后的数据
const currentPage = ref(1);
const pageSize = 15;

// 计算属性
const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize));
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredData.value.slice(start, end);
});

// 获取所有数据
const fetchAllData = async () => {
  try {
    allData.value = [];
    let page = 1;
    let hasMore = true;
    
    while(hasMore) {
      const url = buildUrl(page);
      const response = await axios.get(url, {
        headers: { 'Token': Token.value }
      });
      
      if(response.data.errCode === 1000) {
        const records = response.data.data.records || response.data.data;
        if(records.length > 0) {
          allData.value.push(...records);
          page++;
          hasMore = records.length === pageSize;
        } else {
          hasMore = false;
        }
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
        alert('请先登录！');
        router.push('/login'); // 跳转到登录页面
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
        hasMore = false;
      }
    }
    
    applyFiltersToData();
  } catch (error) {
    console.error('API请求失败:', error);
  }
};

// 构建请求URL
const buildUrl = (page) => {
  let url = `/api/getRecord/${pageSize}/${page}`;
  const queryParams = [];
  
  if(filters.value.problem) queryParams.push(`problem=${encodeURIComponent(filters.value.problem)}`);
  if(filters.value.contest) queryParams.push(`contest=${encodeURIComponent(filters.value.contest)}`);
  if(filters.value.status) {
    const statusValue = filters.value.status === 'accepted' ? 'Accepted' : '';
    queryParams.push(`status=${encodeURIComponent(statusValue)}`);
  }
  if(filters.value.language) queryParams.push(`language=${encodeURIComponent(filters.value.language)}`);
  
  if(queryParams.length > 0) {
    url += `?${queryParams.join('&')}`;
  }
  
  return url;
};

// 应用筛选条件
const applyFiltersToData = () => {
  filteredData.value = allData.value.filter(submission => {
    const problemMatch = !filters.value.problem || 
      submission.probName.toLowerCase().includes(filters.value.problem.toLowerCase());
    const contestMatch = !filters.value.contest || 
      (submission.contest && submission.contest.toLowerCase().includes(filters.value.contest.toLowerCase()));
    const statusMatch = filters.value.status === 'accepted' ? 
      submission.status === 'Accepted' : 
      filters.value.status === 'rejected' ? 
      submission.status !== 'Accepted' : 
      true;
    const languageMatch = !filters.value.language || 
      submission.language.toLowerCase().includes(filters.value.language.toLowerCase());
    
    return problemMatch && contestMatch && statusMatch && languageMatch;
  });
  
  currentPage.value = 1;
};

// 筛选操作
const applyFilters = () => {
  fetchAllData();
};

// 重置筛选
const resetFilters = () => {
  filters.value = {
    problem: '',
    contest: '',
    status: '',
    language: ''
  };
  fetchAllData();
};

// 分页控制
const prevPage = () => currentPage.value > 1 && currentPage.value--;
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++;

const handleError = (errCode) => {
  // 保持原有的错误处理逻辑
  switch (errCode) {
    case 1001:
      alert('请先登录！');
      router.push('/login');
      break;
    // ...其他错误处理
  }
};

onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
.footer {
  background-color: #f5f5f5;
  padding: 1rem 0;
  text-align: center;
  border-top: 1px solid #ddd;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-logo {
  width: 40px;
  height: 40px;
}

.footer-content p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}
.submission-container {
  padding: 40px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.filter-section {
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 78%;
  margin: auto;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}

.filter-group {
  display: flex;
  gap: 16px;
  flex: 1;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 180px;
}

.filter-input:focus,
.filter-select:focus {
  border-color: #1890ff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.filter-actions {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.filter-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  height: 38px;
  width: 70px;
}

.filter-button:hover {
  background: #f5f5f5;
}

.filter-button.primary {
  background: #9597be;
  color: white;
  border-color: #9597be;
  width: 70px;
}

.filter-button.primary:hover {
  background: #40a9ff;
}

.table-container {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  width: 78%;
  margin: auto;
}

.submissions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.submissions-table th,
.submissions-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.submissions-table th {
  background: #fafafa;
  font-weight: 500;
  color: #666;
}

.submissions-table tr:nth-child(even) {
  background: #fafafa;
}

.submissions-table tr:hover {
  background: #f0f7ff;
}

.status-cell {
  width: 60px;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 14px;
}

.status-icon.accepted {
  background: #f6ffed;
  color: #52c41a;
}

.status-icon.rejected {
  background: #fff2f0;
  color: #ff4d4f;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid #eee;
}

.pagination button {
  padding: 4px 8px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  background: #e6f7ff;
  color: #1890ff;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.pagination button:disabled {
  border-color: #ddd;
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.pagination span {
  font-size: 12px;
  color: #666;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background: #40a9ff;
}

.pagination-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 1rem;
  color: #666;
}

@media (max-width: 1200px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-wrap: wrap;
  }

  .filter-actions {
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .submission-container {
    padding: 20px;
  }
  
  .submissions-table {
    font-size: 13px;
  }
  
  .submissions-table th,
  .submissions-table td {
    padding: 8px 12px;
  }
}
</style>