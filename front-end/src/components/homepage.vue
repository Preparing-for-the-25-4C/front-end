<template>
  <br>
  <br>
  <main>
    <section class="section">
      <h2 class="section-title">
        <span>📚</span>
        知识图谱
      </h2>
      <div class="knowledge-cards">
        <div 
          v-for="(tag, index) in filteredKnowledgeTags" 
          :key="index" 
          class="knowledge-card" 
          :style="tag.style"
          @click="openModal(problemSets.find(set => set.title === tag.text))"
        >
          <div class="knowledge-content">
            <div class="knowledge-icon">{{ tag.icon }}</div>
            <div class="knowledge-info">
              <h3>{{ tag.text }}</h3>
              <p>{{ getProblemCount(tag.text) }}题</p>
            </div>
          </div>
        </div>
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
        <div v-for="(problemSet, index) in paginatedProblemSets" :key="index" class="problem-card" @click="openModal(problemSet)">
          <div class="problem-content">
            <div class="problem-image" :class="getProblemSetClass(problemSet.title)"></div>
            <div class="problem-info">
              <p>{{ problemSet.title }}</p>
              <p>题目数量: {{ problemSet.problems.length }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      </div>
    </section>
  </main>

  <div class="modal-overlay" :style="{ display: modalVisible ? 'block' : 'none' }" @click="closeModal"></div>
  <div class="modal" :style="{ display: modalVisible ? 'block' : 'none' }">
    <div class="modal-header">
      <h2 class="modal-title">《{{ currentProblemSet.title }}》题目练习</h2>
      <button class="modal-close" @click="closeModal">&times;</button>
    </div>
    <div class="modal-content">
      <div class="modal-stats">
        通过题目：0题（共{{ currentProblemSet.problems.length }}题）
      </div>
      <table class="modal-table">
        <thead>
          <tr>
            <th>题号</th>
            <th>标题</th>
            <th>通过率</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="problem in currentProblemSet.problems" :key="problem.id">
            <td>{{ problem.id.toString().padStart(3, '0') }}</td>
            <td>{{ problem.title }}</td>
            <td>{{ problem.passRate }}%</td>
            <td>
              <RouterLink 
                class="submit-btn" 
                :to="{
                  path: '/program',
                  query: { 
                    id: problem.id,
                    title: problem.title,
                    difficulty: problem.difficulty || '未知'
                  }
                }"
              >
                挑战
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { RouterLink } from 'vue-router'

const props = defineProps({
  probList: {
    type: Array,
    required: true
  }
})

// 知识图谱标签 - 只包含回溯算法和枚举算法
const knowledgeTags = [
  { 
    text: '回溯算法', 
    icon: '🔍',
    style: { 
      backgroundColor: '#e8f5e9', 
      color: '#388e3c',
      borderLeft: '4px solid #388e3c'
    } 
  },
  { 
    text: '枚举算法', 
    icon: '🔢',
    style: { 
      backgroundColor: '#fff3e0', 
      color: '#f57c00',
      borderLeft: '4px solid #f57c00'
    } 
  }
]

// 过滤出只包含这两个标签的数组
const filteredKnowledgeTags = computed(() => {
  return knowledgeTags
})

// 题单数据
const problemSets = ref([
{ title: '排序算法', problems: [] },
  { title: '查找算法', problems: [] },
  { title: '递归', problems: [] },
  { title: '分治算法', problems: [] },
  { title: '贪心算法', problems: [] },
  { title: '动态规划', problems: [] },
  { title: '回溯算法', problems: [] },
  { title: '枚举算法', problems: [] },
  { title: '模拟算法', problems: [] },
  { title: '数组', problems: [] },
  { title: '链表', problems: [] },
  { title: '栈', problems: [] },
  { title: '队列', problems: [] },
  { title: '哈希表', problems: [] },
  { title: '堆', problems: [] },
  { title: '树', problems: [] },
  { title: '二叉树', problems: [] },
  { title: '二叉搜索树', problems: [] },
  { title: '平衡二叉树', problems: [] },
  { title: '红黑树', problems: [] },
  { title: 'AVL树', problems: [] },
  { title: 'B树', problems: [] },
  { title: 'B+树', problems: [] },
  { title: '图', problems: [] },
  { title: '邻接表', problems: [] },
  { title: '邻接矩阵', problems: [] },
  { title: '并查集', problems: [] },
  { title: '字典树', problems: [] },
  { title: '线段树', problems: [] },
  { title: '树状数组', problems: [] },
  { title: '跳表', problems: [] },
  { title: '字符串处理', problems: [] },
  { title: '字符串匹配', problems: [] },
  { title: 'KMP算法', problems: [] },
  { title: '正则表达式', problems: [] },
  { title: '字符串哈希', problems: [] },
  { title: '后缀数组', problems: [] },
  { title: '后缀自动机', problems: [] },
  { title: '图论', problems: [] },
  { title: '最短路径算法', problems: [] },
  { title: 'Dijkstra算法', problems: [] },
  { title: 'Floyd-Warshall算法', problems: [] },
  { title: 'Bellman-Ford算法', problems: [] },
  { title: '最小生成树', problems: [] },
  { title: 'Prim算法', problems: [] },
  { title: 'Kruskal算法', problems: [] },
  { title: '拓扑排序', problems: [] },
  { title: '强连通分量', problems: [] },
  { title: '网络流', problems: [] },
  { title: '最大流算法', problems: [] },
  { title: '二分图匹配', problems: [] },
  { title: '数论算法', problems: [] },
  { title: '组合数学', problems: [] },
  { title: '概率算法', problems: [] },
  { title: '随机化算法', problems: [] },
  { title: '近似算法', problems: [] },
  { title: '并行算法', problems: [] },
  { title: '分布式算法', problems: [] },
  { title: '机器学习算法', problems: [] },
  { title: '深度学习算法', problems: [] },
  { title: '强化学习算法', problems: [] },
  { title: '其他', problems: [] },
  { title: '暴力算法', problems: [] },
  { title: '双指针算法', problems: [] },
  { title: '滑动窗口', problems: [] },
  { title: '前缀和', problems: [] },
  { title: '差分数组', problems: [] },
  { title: '位运算', problems: [] },
  { title: '状态压缩', problems: [] },
  { title: '几何算法', problems: [] },
  { title: '计算几何', problems: [] },
  { title: '高精度计算', problems: [] }

])

const modalVisible = ref(false)
const currentProblemSet = ref({ title: '', problems: [] })

const currentPage = ref(1)
const pageSize = 6
const totalPages = computed(() => Math.ceil(problemSets.value.length / pageSize))

const paginatedProblemSets = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return problemSets.value.slice(start, end)
})

// 获取特定题单的题目数量
const getProblemCount = (title) => {
  const set = problemSets.value.find(set => set.title === title)
  return set ? set.problems.length : 0
}

// 从API获取问题
const fetchProblems = async () => {
  try {
    const Token = localStorage.getItem('token');
    const response = await axios.get(`/api/getProblems/100/1`, {
      params: {
        Token: Token
      }
    });
    
    if (response.data.errCode === 1000) {
      const problems = response.data.data.probList;
      problemSets.value.forEach(set => set.problems = []);
      
      problems.forEach(problem => {
        const skills = (problem.probSkills || '').split(';');
        skills.forEach(skill => {
          const cleanSkill = skill.trim().toLowerCase();
          if (!cleanSkill) return;
          
          const matchingSet = problemSets.value.find(set => 
            set.title.toLowerCase().includes(cleanSkill)
          );
          if (matchingSet) {
            matchingSet.problems.push({
              id: problem.probId,
              title: problem.probTitle,
              passRate: problem.probSuccess,
              difficulty: problem.difficulty
            });
          }
        });
      });
    } else {
      console.error('Error fetching problems:', response.data);
    }
  } catch (error) {
    console.error('API call failed:', error);
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function openModal(problemSet) {
  currentProblemSet.value = problemSet
  modalVisible.value = true
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  modalVisible.value = false
  document.body.style.overflow = 'auto'
}

// 组件挂载时获取问题
onMounted(() => {
  fetchProblems();
});

// 监听prop变化更新问题
watch(() => props.probList, (newProbList) => {
  problemSets.value.forEach(set => set.problems = [])

  newProbList?.forEach(problem => {
    const skills = (problem.probSkills || '').split(';')
    skills.forEach(skill => {
      const cleanSkill = skill.trim().toLowerCase()
      if (!cleanSkill) return
      const matchingSet = problemSets.value.find(set => 
        set.title.toLowerCase().includes(cleanSkill)
      )
      if (matchingSet) {
        matchingSet.problems.push({
          id: problem.probId,
          title: problem.probTitle,
          passRate: problem.probSuccess,
          difficulty: problem.difficulty
        })
      }
    })
  })
}, { immediate: true })
const getProblemSetClass = (title) => {
  const mapping = {
    // 算法类
    '排序算法': 'sort',
    '查找算法': 'search',
    '递归': 'recursion',
    '分治算法': 'divide-conquer',
    '贪心算法': 'greedy',
    '动态规划': 'dynamic-programming',
    '回溯算法': 'backtracking',
    '枚举算法': 'enumeration',
    '模拟算法': 'simulation',
    
    // 数据结构类
    '数组': 'array',
    '链表': 'linked-list',
    '栈': 'stack',
    '队列': 'queue',
    '哈希表': 'hash-table',
    '堆': 'heap',
    '树': 'tree',
    '二叉树': 'binary-tree',
    '二叉搜索树': 'bst',
    '平衡二叉树': 'avl',
    '红黑树': 'red-black-tree',
    'AVL树': 'avl-tree',
    'B树': 'b-tree',
    'B+树': 'b-plus-tree',
    '图': 'graph',
    '邻接表': 'adjacency-list',
    '邻接矩阵': 'adjacency-matrix',
    '并查集': 'union-find',
    '字典树': 'trie',
    '线段树': 'segment-tree',
    '树状数组': 'fenwick-tree',
    '跳表': 'skip-list',
    
    // 字符串处理
    '字符串处理': 'string',
    '字符串匹配': 'string-match',
    'KMP算法': 'kmp',
    '正则表达式': 'regex',
    '字符串哈希': 'string-hash',
    '后缀数组': 'suffix-array',
    '后缀自动机': 'suffix-automaton',
    
    // 图论
    '图论': 'graph-theory',
    '最短路径算法': 'shortest-path',
    'Dijkstra算法': 'dijkstra',
    'Floyd-Warshall算法': 'floyd-warshall',
    'Bellman-Ford算法': 'bellman-ford',
    '最小生成树': 'mst',
    'Prim算法': 'prim',
    'Kruskal算法': 'kruskal',
    '拓扑排序': 'topological-sort',
    '强连通分量': 'scc',
    '网络流': 'network-flow',
    '最大流算法': 'max-flow',
    '二分图匹配': 'bipartite-matching',
    
    // 数论和数学
    '数论算法': 'number-theory',
    '组合数学': 'combinatorics',
    '概率算法': 'probability',
    '随机化算法': 'randomized',
    '近似算法': 'approximation',
    
    // 其他
    '双指针算法': 'two-pointers',
    '滑动窗口': 'sliding-window',
    '前缀和': 'prefix-sum',
    '差分数组': 'difference-array',
    '位运算': 'bitwise',
    '状态压缩': 'bitmask',
    '几何算法': 'geometry',
    '计算几何': 'computational-geometry',
    '高精度计算': 'big-number',
    '暴力算法': 'brute-force',
    '并行算法': 'parallel',
    '分布式算法': 'distributed',
    '机器学习算法': 'machine-learning',
    '深度学习算法': 'deep-learning',
    '强化学习算法': 'reinforcement-learning',
    '其他': 'other'
  };
  
  return mapping[title] || 'default';
};
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

main {
  padding: 40px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.section {
  margin-bottom: 2rem;
  width: 78%;
  margin: auto;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

/* 知识卡片样式 */
.knowledge-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.knowledge-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.knowledge-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.knowledge-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.knowledge-icon {
  font-size: 2rem;
}

.knowledge-info h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.knowledge-info p {
  color: #666;
  font-size: 0.9rem;
}

/* 算法网格样式 */
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

/* 问题网格样式 */
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
  transition: transform 0.2s;
}

.problem-card:hover {
  transform: translateY(-5px);
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

/* 分页样式 */
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

/* 模态框样式 */
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

.modal-table .submit-btn {
  padding: 0.25rem 0.75rem;
  background: #52c41a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.modal-table .submit-btn:hover {
  background: #3d9412;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .problem-grid,
  .knowledge-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .algorithm-grid,
  .problem-grid,
  .knowledge-cards {
    grid-template-columns: 1fr;
  }

  .section {
    width: 95%;
  }
}
/* 基础图形样式 */
.problem-image {
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
}

.problem-image::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.9;
}

.problem-image::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.9;
}

/* 排序算法 - 动画条形图 */
.problem-image.sort::before {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  animation: gradient 3s ease infinite;
}

.problem-image.sort::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M5 9h4v12H5zm6-4h4v16h-4zm6-2h4v18h-4z'/%3E%3C/svg%3E");
}

/* 查找算法 - 放大镜+数据点 */
.problem-image.search::before {
  background: radial-gradient(circle, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.search::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3Ccircle cx='7' cy='9' r='1'/%3E%3Ccircle cx='11' cy='9' r='1'/%3E%3Ccircle cx='9' cy='7' r='1'/%3E%3C/svg%3E");
}

/* 递归 - 分形图案 */
.problem-image.recursion::before {
  background: conic-gradient(from 90deg at 50% 50%, #fbc2eb 0%, #a6c1ee 100%);
}

.problem-image.recursion::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z'/%3E%3Cpath d='M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E");
}

/* 分治算法 - 分割图案 */
.problem-image.divide-conquer::before {
  background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.divide-conquer::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 3h8v8H3zm10 0h8v8h-8zm-10 10h8v8H3zm10 0h8v8h-8z'/%3E%3C/svg%3E");
}

/* 贪心算法 - 硬币堆叠 */
.problem-image.greedy::before {
  background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
}

.problem-image.greedy::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ccircle cx='12' cy='8' r='5'/%3E%3Ccircle cx='12' cy='16' r='3'/%3E%3C/svg%3E");
}

/* 动态规划 - 网格+箭头 */
.problem-image.dynamic-programming::before {
  background: linear-gradient(to right, #ff758c, #ff7eb3);
}

.problem-image.dynamic-programming::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M10 10h4v4h-4zm6 0h4v4h-4zm-6 6h4v4h-4zm6 0h4v4h-4z'/%3E%3Cpath d='M19 3h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v-2h2v-2h-2v-2h2v-2h-2v-2h2V9h-2V7h2V5h-2V3zm-4 18h-2v2h2v-2zm-4 0H9v2h2v-2zm-4 0H5v2h2v-2zm-4 0H1v2h2v-2z'/%3E%3C/svg%3E");
}

/* 回溯算法 - 迷宫图案 */
.problem-image.backtracking::before {
  background: linear-gradient(to bottom, #a18cd1, #fbc2eb);
}

.problem-image.backtracking::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M10 4h4v2h-4zm0 4h4v2h-4zm0 4h4v2h-4zm0 4h4v2h-4z'/%3E%3Cpath d='M4 4h2v16H4zm14 0h2v16h-2z'/%3E%3Cpath d='M7 7h2v2H7zm4 4h2v2h-2zm4 4h2v2h-2z'/%3E%3C/svg%3E");
}

/* 枚举算法 - 列表循环 */
.problem-image.enumeration::before {
  background: linear-gradient(to bottom, #ffc3a0, #ffafbd);
}

.problem-image.enumeration::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 10h16v2H4zm0-4h16v2H4zm0 8h16v2H4zm0 4h16v2H4z'/%3E%3Cpath d='M2 4h2v2H2zm0 4h2v2H2zm0 4h2v2H2zm0 4h2v2H2zm0 4h2v2H2z'/%3E%3C/svg%3E");
  animation: rotate 4s linear infinite;
}

/* 数组 - 方框堆叠 */
.problem-image.array::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.problem-image.array::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z'/%3E%3C/svg%3E");
}

/* 链表 - 节点连接 */
.problem-image.linked-list::before {
  background: linear-gradient(to right, #43e97b, #38f9d7);
}

.problem-image.linked-list::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='12' r='2'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Ccircle cx='18' cy='12' r='2'/%3E%3Cpath d='M8 12h2m4 0h2' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
  animation: pulse 2s infinite;
}

/* 栈 - 堆叠效果 */
.problem-image.stack::before {
  background: linear-gradient(to top, #a8edea, #fed6e3);
}

.problem-image.stack::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z'/%3E%3C/svg%3E");
}

/* 队列 - 进出箭头 */
.problem-image.queue::before {
  background: linear-gradient(to top, #a8edea, #fed6e3);
}

.problem-image.queue::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 12h16v2H4zm4-6l4 4-4 4zm8 0l4 4-4 4z'/%3E%3C/svg%3E");
}

/* 哈希表 - 钥匙图案 */
.problem-image.hash-table::before {
  background: linear-gradient(to right, #ff758c, #ff7eb3);
}

.problem-image.hash-table::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3C8.14 3 5 6.14 5 10c0 2.38 1.19 4.47 3 5.74V21h4v-2h2v2h4v-5.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm0 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/svg%3E");
}

/* 堆 - 金字塔结构 */
.problem-image.heap::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.heap::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3L2 12h5v8h10v-8h5L12 3zm0 3.5l5 4.5h-3v6H10v-6H7l5-4.5z'/%3E%3C/svg%3E");
}

/* 树 - 树形结构 */
.problem-image.tree::before {
  background: linear-gradient(to bottom, #4facfe, #00f2fe);
}

.problem-image.tree::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M20 10v10h-4V10h4zM8 4v16H4V4h4zm6 8v8h-4v-8h4z'/%3E%3C/svg%3E");
}

/* 二叉树 - 二叉结构 */
.problem-image.binary-tree::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.binary-tree::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v4m-4 4H4m8 0h4m-8 4v4m8-4v4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='3' r='2'/%3E%3Ccircle cx='8' cy='11' r='2'/%3E%3Ccircle cx='16' cy='11' r='2'/%3E%3Ccircle cx='8' cy='19' r='2'/%3E%3Ccircle cx='16' cy='19' r='2'/%3E%3C/svg%3E");
}

/* 二叉搜索树 */
.problem-image.bst::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.bst::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v4m-4 4H4m8 0h4m-8 4v4m8-4v4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='3' r='2'/%3E%3Ccircle cx='8' cy='11' r='2'/%3E%3Ccircle cx='16' cy='11' r='2'/%3E%3Ccircle cx='8' cy='19' r='2'/%3E%3Ccircle cx='16' cy='19' r='2'/%3E%3Cpath d='M12 7v4m-4 0h8' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* 平衡二叉树 */
.problem-image.avl::before {
  background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
}

.problem-image.avl::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v4m-4 4H4m8 0h4m-8 4v4m8-4v4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='3' r='2'/%3E%3Ccircle cx='8' cy='11' r='2'/%3E%3Ccircle cx='16' cy='11' r='2'/%3E%3Ccircle cx='8' cy='19' r='2'/%3E%3Ccircle cx='16' cy='19' r='2'/%3E%3Cpath d='M12 7v4m-4 0h8' stroke='white' stroke-width='1'/%3E%3Cpath d='M6 15l4-4m4 0l4 4' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* 红黑树 */
.problem-image.red-black-tree::before {
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
}

.problem-image.red-black-tree::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v4m-4 4H4m8 0h4m-8 4v4m8-4v4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='3' r='2' fill='red'/%3E%3Ccircle cx='8' cy='11' r='2' fill='black'/%3E%3Ccircle cx='16' cy='11' r='2' fill='red'/%3E%3Ccircle cx='8' cy='19' r='2' fill='black'/%3E%3Ccircle cx='16' cy='19' r='2' fill='black'/%3E%3C/svg%3E");
}

/* AVL树 */
.problem-image.avl-tree::before {
  background: linear-gradient(135deg, #a6c0fe 0%, #f68084 100%);
}

.problem-image.avl-tree::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v4m-4 4H4m8 0h4m-8 4v4m8-4v4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='3' r='2'/%3E%3Ccircle cx='8' cy='11' r='2'/%3E%3Ccircle cx='16' cy='11' r='2'/%3E%3Ccircle cx='8' cy='19' r='2'/%3E%3Ccircle cx='16' cy='19' r='2'/%3E%3Cpath d='M12 7v4m-4 0h8' stroke='white' stroke-width='1'/%3E%3Cpath d='M6 15l4-4m4 0l4 4' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* B树 */
.problem-image.b-tree::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.b-tree::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v4m-4 4H4m8 0h4m-8 4v4m8-4v4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='3' r='2'/%3E%3Ccircle cx='8' cy='11' r='2'/%3E%3Ccircle cx='12' cy='11' r='2'/%3E%3Ccircle cx='16' cy='11' r='2'/%3E%3Ccircle cx='8' cy='19' r='2'/%3E%3Ccircle cx='12' cy='19' r='2'/%3E%3Ccircle cx='16' cy='19' r='2'/%3E%3C/svg%3E");
}

/* B+树 */
.problem-image.b-plus-tree::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.b-plus-tree::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v4m-4 4H4m8 0h4m-8 4v4m8-4v4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='3' r='2'/%3E%3Ccircle cx='8' cy='11' r='2'/%3E%3Ccircle cx='12' cy='11' r='2'/%3E%3Ccircle cx='16' cy='11' r='2'/%3E%3Ccircle cx='8' cy='19' r='2'/%3E%3Ccircle cx='12' cy='19' r='2'/%3E%3Ccircle cx='16' cy='19' r='2'/%3E%3Cpath d='M10 15h4' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* 图 - 节点连接 */
.problem-image.graph::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.graph::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 8l4 4m4 0l4-4m-8 4l4 4m0-4l4 4' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E");
}

/* 邻接表 */
.problem-image.adjacency-list::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.adjacency-list::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v4H4zm0 6h10v4H4zm0 6h16v4H4z'/%3E%3Cpath d='M14 10h6v2h-6zm0 6h6v2h-6z'/%3E%3C/svg%3E");
}

/* 邻接矩阵 */
.problem-image.adjacency-matrix::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.adjacency-matrix::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 3h18v18H3zm2 2v14h14V5zm2 2h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z'/%3E%3C/svg%3E");
}

/* 并查集 */
.problem-image.union-find::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.problem-image.union-find::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 6l12 12M6 18l12-12' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E");
}

/* 字典树 */
.problem-image.trie::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.trie::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v4m-4 4H4m8 0h4m-8 4v4m8-4v4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='3' r='2'/%3E%3Ccircle cx='8' cy='11' r='2'/%3E%3Ccircle cx='12' cy='11' r='2'/%3E%3Ccircle cx='16' cy='11' r='2'/%3E%3Ccircle cx='8' cy='19' r='2'/%3E%3Ccircle cx='12' cy='19' r='2'/%3E%3Ccircle cx='16' cy='19' r='2'/%3E%3Cpath d='M10 7v4m4-4v4' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* 线段树 */
.problem-image.segment-tree::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.segment-tree::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v4m-4 4H4m8 0h4m-8 4v4m8-4v4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='3' r='2'/%3E%3Ccircle cx='8' cy='11' r='2'/%3E%3Ccircle cx='16' cy='11' r='2'/%3E%3Ccircle cx='8' cy='19' r='2'/%3E%3Ccircle cx='16' cy='19' r='2'/%3E%3Cpath d='M12 7v4m-4 0h8' stroke='white' stroke-width='1'/%3E%3Cpath d='M8 15l4-4m4 0l4 4' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}
/* 跳表 */
.problem-image.skip-list::before {
  background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
}

.problem-image.skip-list::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v4H4zm0 6h10v4H4zm0 6h16v4H4z'/%3E%3Cpath d='M14 10h6v2h-6z'/%3E%3C/svg%3E");
}

/* 字符串处理 */
.problem-image.string::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.string::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 9h16v2H4zm0 4h16v2H4z'/%3E%3C/svg%3E");
}

/* 字符串匹配 */
.problem-image.string-match::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.string-match::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 9h16v2H4zm0 4h16v2H4z'/%3E%3Cpath d='M8 9l-4 4m0-4l4 4' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
}

/* KMP算法 */
.problem-image.kmp::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.kmp::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 9h16v2H4zm0 4h16v2H4z'/%3E%3Cpath d='M12 9l-4 4m0-4l4 4' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
}

/* 正则表达式 */
.problem-image.regex::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.problem-image.regex::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v4m-4 4H4m8 0h4m-8 4v4m8-4v4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='3' r='2'/%3E%3Ccircle cx='8' cy='11' r='2'/%3E%3Ccircle cx='16' cy='11' r='2'/%3E%3Ccircle cx='8' cy='19' r='2'/%3E%3Ccircle cx='16' cy='19' r='2'/%3E%3Cpath d='M10 7v4m4-4v4' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* 字符串哈希 */
.problem-image.string-hash::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.string-hash::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 9h16v2H4zm0 4h16v2H4z'/%3E%3Cpath d='M8 9l-4 4m0-4l4 4' stroke='white' stroke-width='2'/%3E%3Cpath d='M12 9l-4 4m0-4l4 4' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
}

/* 后缀数组 */
.problem-image.suffix-array::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.suffix-array::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z'/%3E%3C/svg%3E");
}

/* 后缀自动机 */
.problem-image.suffix-automaton::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.suffix-automaton::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z'/%3E%3Cpath d='M8 4v16m8-16v16' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
}

/* 图论 */
.problem-image.graph-theory::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.problem-image.graph-theory::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 6l12 12M6 18l12-12' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E");
}

/* 最短路径算法 */
.problem-image.shortest-path::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.shortest-path::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='5' cy='12' r='2'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Ccircle cx='19' cy='12' r='2'/%3E%3Cpath d='M7 12l3-3m2 0l6 6' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* Dijkstra算法 */
.problem-image.dijkstra::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.dijkstra::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='5' cy='12' r='2'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Ccircle cx='19' cy='12' r='2'/%3E%3Cpath d='M7 12l3-3m2 0l6 6' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 12l-3 3m2 0l6-6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* Floyd-Warshall算法 */
.problem-image.floyd-warshall::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.floyd-warshall::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 6l12 12M6 18l12-12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M6 12l12 0' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E");
}

/* Bellman-Ford算法 */
.problem-image.bellman-ford::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.problem-image.bellman-ford::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='5' cy='12' r='2'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Ccircle cx='19' cy='12' r='2'/%3E%3Cpath d='M7 12l3-3m2 0l6 6' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 12l-3 3m2 0l6-6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 5v14' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 最小生成树 */
.problem-image.mst::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.mst::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 6l12 12M6 18l12-12' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E");
}

/* Prim算法 */
.problem-image.prim::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.prim::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 6l12 12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M6 18l12-12' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E");
}

/* Kruskal算法 */
.problem-image.kruskal::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.kruskal::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 6l12 12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M6 18l12-12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M6 12h12' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E");
}

/* 拓扑排序 */
.problem-image.topological-sort::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.problem-image.topological-sort::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z'/%3E%3Cpath d='M8 4v16m8-16v16' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
}

/* 强连通分量 */
.problem-image.scc::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.scc::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 6l12 12M6 18l12-12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M6 12h12' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E");
}

/* 网络流 */
.problem-image.network-flow::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.network-flow::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 6l12 12M6 18l12-12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M6 12h12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M12 6v12' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E");
}

/* 最大流算法 */
.problem-image.max-flow::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.max-flow::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 6l12 12M6 18l12-12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M6 12h12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M12 6v12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M9 9l6 6m0-6l-6 6' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* 二分图匹配 */
.problem-image.bipartite-matching::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.problem-image.bipartite-matching::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 6l12 12M6 18l12-12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M6 12h12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M12 6v12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M9 9l6 6m0-6l-6 6' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* 数论算法 */
.problem-image.number-theory::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.number-theory::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 组合数学 */
.problem-image.combinatorics::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.combinatorics::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 6l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 概率算法 */
.problem-image.probability::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.probability::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 6l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 12l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 随机化算法 */
.problem-image.randomized::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.problem-image.randomized::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 6l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 12l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 18l-4-6m8 6l-4-6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 近似算法 */
.problem-image.approximation::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.approximation::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 6l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 12l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 18l-4-6m8 6l-4-6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 12l-4-6m8 6l-4-6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 双指针算法 */
.problem-image.two-pointers::before {
  background: linear-gradient(45deg, #ff7e5f, #feb47b);
}

.problem-image.two-pointers::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M5 5l4 4m0-4l-4 4m10 6l4 4m0-4l-4 4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3Ccircle cx='19' cy='19' r='2'/%3E%3C/svg%3E");
}

/* 滑动窗口 */
.problem-image.sliding-window::before {
  background: linear-gradient(45deg, #ff7e5f, #feb47b);
}

.problem-image.sliding-window::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v16H4zm2 2v12h12V6z'/%3E%3Cpath d='M8 6v12m4-12v12m4-12v12' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* 前缀和 */
.problem-image.prefix-sum::before {
  background: linear-gradient(45deg, #ff7e5f, #feb47b);
}

.problem-image.prefix-sum::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v16H4zm2 2v12h12V6z'/%3E%3Cpath d='M8 6v12m4-12v12m4-12v12' stroke='white' stroke-width='1'/%3E%3Cpath d='M6 8h12m-12 4h12m-12 4h12' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}
/* 模拟算法 */
.problem-image.simulation::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.simulation::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 6l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 树状数组 */
.problem-image.fenwick-tree::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.fenwick-tree::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 3v4m-4 4H4m8 0h4m-8 4v4m8-4v4' stroke='white' stroke-width='2'/%3E%3Ccircle cx='12' cy='3' r='2'/%3E%3Ccircle cx='8' cy='11' r='2'/%3E%3Ccircle cx='16' cy='11' r='2'/%3E%3Ccircle cx='8' cy='19' r='2'/%3E%3Ccircle cx='16' cy='19' r='2'/%3E%3Cpath d='M12 7v4m-4 0h8' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* 并行算法 */
.problem-image.parallel::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.parallel::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z'/%3E%3Cpath d='M8 4v16m8-16v16' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
}

/* 分布式算法 */
.problem-image.distributed::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.problem-image.distributed::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Ccircle cx='6' cy='6' r='2'/%3E%3Ccircle cx='18' cy='6' r='2'/%3E%3Ccircle cx='6' cy='18' r='2'/%3E%3Ccircle cx='18' cy='18' r='2'/%3E%3Cpath d='M6 6l12 12M6 18l12-12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M6 12h12' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M12 6v12' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E");
}

/* 机器学习算法 */
.problem-image.machine-learning::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.machine-learning::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 6l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 深度学习算法 */
.problem-image.deep-learning::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.deep-learning::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 6l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 12l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 强化学习算法 */
.problem-image.reinforcement-learning::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.reinforcement-learning::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 6l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 12l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 18l-4-6m8 6l-4-6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 其他 */
.problem-image.other::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.problem-image.other::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 8v8' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M8 12h8' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 暴力算法 */
.problem-image.brute-force::before {
  background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%);
}

.problem-image.brute-force::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z'/%3E%3Cpath d='M8 4v16m8-16v16' stroke='white' stroke-width='2'/%3E%3C/svg%3E");
}

/* 差分数组 */
.problem-image.difference-array::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.difference-array::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z'/%3E%3Cpath d='M8 4v16m8-16v16' stroke='white' stroke-width='2'/%3E%3Cpath d='M6 8h12m-12 4h12m-12 4h12' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* 位运算 */
.problem-image.bitwise::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.bitwise::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z'/%3E%3Cpath d='M8 4v16m8-16v16' stroke='white' stroke-width='2'/%3E%3Cpath d='M6 8h12m-12 4h12m-12 4h12' stroke='white' stroke-width='1'/%3E%3Cpath d='M8 8l8 8m0-8l-8 8' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}

/* 状态压缩 */
.problem-image.bitmask::before {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.problem-image.bitmask::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z'/%3E%3Cpath d='M8 4v16m8-16v16' stroke='white' stroke-width='2'/%3E%3Cpath d='M6 8h12m-12 4h12m-12 4h12' stroke='white' stroke-width='1'/%3E%3Cpath d='M8 8l8 8m0-8l-8 8' stroke='white' stroke-width='1'/%3E%3Cpath d='M8 12h8m-8 4h8' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}
/* 几何算法 - 多边形与测量工具组合 */
.problem-image.geometry::before {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  animation: gradient 3s ease infinite;
}

.problem-image.geometry::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5z'/%3E%3Cpath d='M2 7l10 5 10-5M2 12l10 5 10-5M2 17l10 5 10-5' stroke='white' stroke-width='1'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Cpath d='M12 12l5-5m-10 0l5 5' stroke='white' stroke-width='1.5'/%3E%3C/svg%3E");
  animation: pulse 2s infinite;
}

/* 计算几何 - 更复杂的几何图形组合 */
.problem-image.computational-geometry::before {
  background: linear-gradient(45deg, #a18cd1 0%, #fbc2eb 100%);
}

.problem-image.computational-geometry::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5z'/%3E%3Cpath d='M2 7l10 5 10-5M2 12l10 5 10-5M2 17l10 5 10-5' stroke='white' stroke-width='1'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Cpath d='M12 12l5-5m-10 0l5 5' stroke='white' stroke-width='1.5'/%3E%3Cpath d='M6 6l12 12M6 18l12-12' stroke='white' stroke-width='1'/%3E%3C/svg%3E");
}




/* 计算几何 */
.problem-image.computational-geometry::before {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.problem-image.computational-geometry::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 6l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 12l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 高精度计算 */
.problem-image.big-number::before {
  background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
}

.problem-image.big-number::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3Cpath d='M12 6v6l4 2' stroke='white' stroke-width='2' stroke-linecap='round'/%3E%3Cpath d='M12 6l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 12l-4 6m8-6l-4 6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3Cpath d='M12 18l-4-6m8 6l-4-6' stroke='white' stroke-width='1' stroke-linecap='round'/%3E%3C/svg%3E");
}

/* 动画效果 */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% {background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

@keyframes rotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.1); }
}
</style>