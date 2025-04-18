<template>
  <div class="body2">
    <br>
    <br>
    <div class="ranking-table-container">
      <table class="ranking-table">
        <thead>
          <tr>
            <th>排名</th>
            <th>用户名</th>
            <th>AC数</th>
            <th>学校</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="user.userId" :class="{ 'odd-row': (currentPage - 1) * pageSize + index % 2 === 0 }">
            <td class="ranking">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td class="username" @click="visitUser(user.userId)">
  <div class="user-info">
    <div class="avatar" :style="{ backgroundImage: `url(${user.userProfile})` }"></div>
    <span class="clickable">{{ user.userName }}</span>
  </div>
</td>
            <td class="ac-count">{{ user.acCount }}</td>
            <td class="introduction">{{ user.userSchool }}</td>
            <td class="actions">
              
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="page-button">上一页</button>
        <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages" class="page-button">下一页</button>
      </div>
    </div>
  </div>
  <footer class="footer">
  <div class="footer-content">
    <img src="@/pictures/logo.png" alt="Logo" class="footer-logo">
    <p>备案号：鲁ICP备2024065791号</p>
  </div>
</footer>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const visitUser = (userId) => {
  router.push(`/user/${userId}`);
};

const pageSize = 20;
const currentPage = ref(1);
const total = ref(0);
const users = ref([]);
const token = ref(localStorage.getItem('token') || '');

const fetchRankData = async () => {
  try {
    const response = await axios.get(`/api/getRanks/${pageSize}/${currentPage.value}`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    });
    if (response.data.errCode === 1000) {
      users.value = response.data.data.rankData;
      total.value = response.data.data.total;
    } else {
      handleError(response.data.errCode);
    }
  } catch (error) {
    console.error('Error fetching rank data:', error);
  }
};

const handleError = (errCode) => {
  const errorMessages = {
    1001: '服务器内部错误',
    1002: '验证码错误',
    1003: '用户名或密码错误',
    1004: '幂等性错误',
    1005: '用户名已存在',
    1006: 'token过期',
    1007: '邮箱验证码错误',
    1008: '数据不符合规范',
    1009: '邮箱已被使用',
    1010: '手机号已被使用',
    1011: '不存在的静态资源'
  };
  alert(errorMessages[errCode] || '未知错误');
};

const totalPages = computed(() => Math.ceil(total.value / pageSize));

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchRankData();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchRankData();
  }
};

onMounted(() => {
  fetchRankData();
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
.body2{
  padding: 40px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
.ranking-table-container {
  width: 70%;
  overflow-x: auto;
  margin: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
.page-button {
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.page-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.page-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.page-info {
  color: #666;
}
.clickable {
  color: #3ca7dd; /* 将字体颜色改为黑色 */
  cursor: pointer;
  text-decoration: none; /* 去掉下划线 */
}

.clickable:hover {
  color: #555; /* 悬停时字体颜色稍微变深 */
}
.avatar {
  background-size: cover;
  background-position: center;
}
.ranking-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.ranking-table th {
  text-align: left;
  padding: 16px;
  font-weight: 500;
  color: #666;
  border-bottom: 1px solid #eee;
}

.ranking-table td {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.odd-row {
  background-color: #f9f9f9;
}

.ranking {
  color: #666;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #eee;
}

.username {
  color: #43638c;
  font-weight: 500;
}

.ac-count {
  color: #666;
}

.introduction {
  color: #666;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  width: 48px;
}

.expand-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
}

.expand-button:hover {
  background-color: #f0f0f0;
  color: #333;
}

tr:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .introduction {
    max-width: 150px;
  }
  
  .ranking-table td,
  .ranking-table th {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .introduction {
    display: none;
  }
  
  .ranking-table th:nth-child(4),
  .ranking-table td:nth-child(4) {
    display: none;
  }
}
</style>