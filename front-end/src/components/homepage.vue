<template>
  <br>
  <br>
  <div>
    <main class="container">
      <section class="section">
        <h2 class="section-title">
          <span>📚</span>
          知识图谱
        </h2>
        <div class="tags">
          <span v-for="(tag, index) in knowledgeTags" :key="index" class="tag" :style="tag.style">
            {{ tag.text }}
          </span>
        </div>
      </section>
       <br>
       <br>
      <section class="section">
        <h2 class="section-title">推荐算法</h2>
        <div class="algorithm-grid">
          <div class="algorithm-card" v-for="i in 3" :key="i"></div>
        </div>
      </section>
      <br>
      <br>
      <section class="section">
        <h2 class="section-title">题单</h2>
        <div class="problem-grid" id="problemGrid">
          <div v-for="(problem, index) in problemSets" :key="index" class="problem-card" @click="openModal(index + 1)">
            <div class="problem-content">
              <div class="problem-image"></div>
              <div class="problem-info">
                <p>{{ problem.title }} 题单{{ index + 1 }}</p>
                <p>{{ problem.difficulty }} 中等</p>
                <p>{{ problem.count }} 100</p>
                <p>{{ problem.rating }} 1000</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <div class="modal-overlay" :style="{ display: modalVisible ? 'block' : 'none' }" @click="closeModal"></div>
    <div class="modal" :style="{ display: modalVisible ? 'block' : 'none' }">
      <div class="modal-header">
        <h2 class="modal-title">《题单{{ currentProblemSetId }}》题目练习</h2>
        <button class="modal-close" @click="closeModal">&times;</button>
      </div>
      <div class="modal-content">
        <div class="modal-stats">
          通过题目：0题（共100题）
        </div>
        <div class="modal-filter">
          <input type="checkbox" id="hideCompleted" v-model="hideCompleted">
          <label for="hideCompleted">隐藏未通过</label>
        </div>
        <table class="modal-table">
          <thead>
            <tr>
              <th>题号</th>
              <th>标题</th>
              <th>通过率</th>
              <th>我的状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="problem in filteredProblems" :key="problem.id">
              <td>{{ problem.id.toString().padStart(3, '0') }}</td>
              <td>{{ problem.title }}</td>
              <td>{{ problem.passRate }}%</td>
              <td>{{ problem.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const knowledgeTags = [
  { text: '数据结构内容', style: { backgroundColor: '#e3f2fd', color: '#1976d2' } },
  { text: '算法内容', style: { backgroundColor: '#f3e5f5', color: '#9c27b0' } },
  { text: '动态规划', style: { backgroundColor: '#e8f5e9', color: '#388e3c' } },
  { text: '图论', style: { backgroundColor: '#fff3e0', color: '#f57c00' } },
  { text: '高级数据结构', style: { backgroundColor: '#fce4ec', color: '#c2185b' } },
  { text: '数学知识', style: { backgroundColor: '#e0f7fa', color: '#0097a7' } },
]

const problemSets = Array(6).fill({
  title: '题目名:',
  difficulty: '难度:',
  count: '题目量:',
  rating: '点击量:'
})

const modalVisible = ref(false)
const currentProblemSetId = ref(0)
const hideCompleted = ref(false)

const problems = ref([])

function openModal(problemSetId) {
  currentProblemSetId.value = problemSetId
  modalVisible.value = true
  document.body.style.overflow = 'hidden'
  generateProblems()
}

function closeModal() {
  modalVisible.value = false
  document.body.style.overflow = 'auto'
}

function generateProblems() {
  problems.value = Array(10).fill(null).map((_, index) => ({
    id: index + 1,
    title: `标题${index + 1}`,
    passRate: Math.floor(Math.random() * 100),
    status: Math.random() > 0.5 ? '已通过' : '未提交'
  }))
}

const filteredProblems = computed(() => {
  if (hideCompleted.value) {
    return problems.value.filter(problem => problem.status !== '已通过')
  }
  return problems.value
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: rgba(250,255,253,255);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #eee;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links span {
  cursor: pointer;
  transition: border 0.3s ease;
}

.nav-links span:hover {
  border: 2px solid #1890ff;
  border-radius: 4px;
}

.nav-links span:first-child {
  font-weight: bold;
  font-size: 1.25rem;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-container {
  position: relative;
}

.search-input {
  padding: 0.5rem 2.5rem;
  width: 250px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border 0.3s ease;
}

.search-input:hover {
  border: 2px solid #1890ff;
  border-radius: 4px;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #e2e2e2;
  transition: border 0.3s ease;
}

.user-avatar:hover {
  border: 2px solid #1890ff;
  border-radius: 50%;
}

.container {
  padding: 40px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.section {
  margin-bottom: 2rem;
  width:78%;
  margin:auto;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
}

.algorithm-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.algorithm-card {
  height: 8rem;
  background-color: #e2e2e2;
  border-radius: 0.5rem;
}

.problem-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.problem-card {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.problem-content {
  display: flex;
  gap: 1rem;
}

.problem-image {
  width: 4rem;
  height: 4rem;
  background-color: #e2e2e2;
  border-radius: 0.25rem;
}

.problem-info {
  flex: 1;
}

.problem-info p {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: #666;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-content {
  margin-bottom: 1rem;
}

.modal-stats {
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.modal-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.modal-table {
  width: 100%;
  border-collapse: collapse;
}

.modal-table th,
.modal-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.modal-table th {
  font-weight: bold;
  background-color: #f9f9f9;
}

@media (max-width: 1024px) {
  .problem-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .algorithm-grid {
    grid-template-columns: 1fr;
  }

  .problem-grid {
    grid-template-columns: 1fr;
  }

  .nav-links {
    gap: 1rem;
  }

  .search-input {
    width: 200px;
  }
}
</style>
