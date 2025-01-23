<template>
  <br>
  <br>
  <div class="submission-container">
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <div class="filter-item">
            <label>由用户名或UID</label>
            <input type="text" class="filter-input" v-model="filters.user">
          </div>
          <div class="filter-item">
            <label>由题目</label>
            <input type="text" class="filter-input" v-model="filters.problem">
          </div>
          <div class="filter-item">
            <label>由比赛</label>
            <input type="text" class="filter-input" v-model="filters.contest">
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
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>
        <div class="filter-actions">
          <button class="filter-button primary">筛选</button>
          <button class="filter-button">重置</button>
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
            <th>递交者</th>
            <th>时间</th>
            <th>内存</th>
            <th>语言</th>
            <th>递交时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="submission in submissions" :key="submission.id">
            <td class="status-cell">
              <span :class="['status-icon', submission.status]">
                {{ submission.status === 'accepted' ? '✓' : '✕' }}
              </span>
            </td>
            <td>{{ submission.problem }}</td>
            <td>{{ submission.submitter }}</td>
            <td>{{ submission.time }}</td>
            <td>{{ submission.memory }}</td>
            <td>{{ submission.language }}</td>
            <td>{{ submission.submissionTime }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filters = ref({
  user: '',
  problem: '',
  contest: '',
  status: '',
  language: ''
})

const submissions = ref([
  {
    id: 1,
    status: 'accepted',
    problem: 'P1 跳台阶',
    submitter: 'czy',
    time: '51ms',
    memory: '54kB',
    language: 'c++17',
    submissionTime: '4分钟前'
  },
  {
    id: 2,
    status: 'rejected',
    problem: 'P2 动态规划',
    submitter: 'user2',
    time: '62ms',
    memory: '48kB',
    language: 'python3',
    submissionTime: '10分钟前'
  }
])
</script>

<style scoped>
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
  width:75%;
  margin:auto;
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
  width: 120px;
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
  height: 38px; /* Match input height */
  width:70px;
}

.filter-button:hover {
  background: #f5f5f5;
}

.filter-button.primary {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
  width:70px;
}

.filter-button.primary:hover {
  background: #40a9ff;
}

.table-container {
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  width:78%;
  margin:auto;
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