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
        <tr v-for="user in users" :key="user.id" :class="{ 'odd-row': user.id % 2 !== 0 }">
          <td class="ranking">{{ user.ranking }}</td>
          <td class="username">
            <div class="user-info">
              <div class="avatar"></div>
              <span>{{ user.username }}</span>
            </div>
          </td>
          <td class="ac-count">{{ user.acCount }}</td>
          <td class="introduction">{{ user.introduction }}</td>
          <td class="actions">
            <button class="expand-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  {
    id: 1,
    ranking: 1,
    username: '名称1',
    acCount: '数量1',
    introduction: '学校1'
  },
  {
    id: 2,
    ranking: 2,
    username: '名称2',
    acCount: '数量2',
    introduction: '学校2'
  },
  // Add more sample data as needed
])
</script>

<style scoped>
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
  color: #333;
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