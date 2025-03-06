<template>
  <br>
  <br>
  <div class="container">
    <div class="header">
      <div class="breadcrumb">
        <span class="folder-icon">📁</span>
        <span>题库</span>
      </div>
      <div class="actions">
        <select v-model="selectedLanguage" class="language-select">
          <option v-for="lang in languages" :value="lang.id" :key="lang.id">
            {{ lang.name }}
          </option>
        </select>
        <button class="btn btn-primary" @click="runCode">运行</button>
        <button class="btn" @click="handleSubmitCode">提交</button>
      </div>
    </div>

    <main class="main-content">
      <!-- 最左侧边栏 -->
      <aside class="far-left-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">提交记录</h3>
          <ul class="submission-list">
            <li v-for="submission in submissionData" :key="submission.id" 
                class="submission-item" 
                @click="showSubmissionDetails(submission.id)">
                <span :class="['status-indicator', `status-${getStatusClass(submission.status)}`]"></span>
                <div class="submission-meta">
                <span class="problem-name">{{ submission.probName }}</span>
                <span class="status">{{ submission.status }}</span>
                <span class="time">{{ submission.recordTime }}</span>
              </div>
            </li>
          </ul>
          <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
            <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
            <button @click="nextPage" :disabled="currentPage >= totalPages">下一页</button>
          </div>
        </div>
      </aside>

      <!-- 中间题目描述 -->
      <div class="problem-description-panel">
        <div class="problem-header">
          <span class="problem-id">{{ problemInfo.id }}.</span>
          <span>{{ problemInfo.title }}</span>
          <span class="difficulty">{{ problemInfo.difficulty }}</span>
        </div>

        <div class="problem-text">
          {{ problemDetails.description }}
        </div>

        <!-- 提交详情覆盖层 -->
        <div :class="['submission-details', { active: isSubmissionDetailsActive }]">
          <span class="close-details" @click="closeSubmissionDetails">&times;</span>
          <h2>提交详情</h2>
          <div class="submission-info">
            <p>序号: <span>{{ activeSubmission.id }}</span></p>
            <p>状态: <span>{{ activeSubmission.status }}</span></p>
            <p>语言: <span>{{ activeSubmission.language }}</span></p>
            <p>执行用时: <span>{{ activeSubmission.time }}</span></p>
            <p>消耗内存: <span>{{ activeSubmission.memory }}</span></p>
          </div>
          <h3>提交的代码：</h3>
          <pre>{{ activeSubmission.code }}</pre>
        </div>
      </div>
      <!-- 右侧代码编辑区域 -->
      <div class="code-panel">
        <textarea class="code-editor" v-model="code" placeholder="在这里编写代码..."></textarea>
        <div class="output-panel">
          <div class="panel-header">
            <span class="panel-title">运行结果</span>
            <div class="panel-actions">
              <button class="btn" @click="clearOutput">清空</button>
              <button class="btn" @click="copyOutput">复制</button>
            </div>
          </div>
          <div class="panel-content">{{ output }}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive,onMounted,onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 3;
interface SubmissionRecord {
  id: number;
  probName: string;
  status: string;
  language: string;
  time: BigInteger;
  code: string;
  recordTime: string;
}
const submissionData = reactive<SubmissionRecord[]>([]);
  const fetchSubmissionRecords = async (page: number) => {
    const response = await axios.get(`/api/getRecord/${pageSize}/${page}`, {
      headers: { 'Token': Token.value },
      params: {
        probName: problemInfo.title,
        languageId: selectedLanguage.value,
        status: activeSubmission.status
      }
    });
    if (response.data.errCode === 1000) {
      alert('获取提交记录成功');
      submissionData.splice(0, submissionData.length, 
        ...response.data.data.records.map((record: any) => ({
          id: record.id,
          probName: record.probName,
          status: formatStatus(record.status),
          language: record.language,
          time: `${record.wallTime}ms`,
          code: atob(record.codeOnBase64),
          recordTime: record.recordTime
        }))
      );
      totalPages.value = Math.ceil(response.data.data.total / pageSize);
    }else{
      handleSubmitError(response.data.errCode)
      alert('获取提交记录失败');
    }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchSubmissionRecords(currentPage.value);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchSubmissionRecords(currentPage.value);
  }
};
const languages = ref([
  { id: 50, name: 'C (GCC 9.2.0)' },
  { id: 54, name: 'C++ (GCC 9.2.0)' },
  { id: 62, name: 'Java (OpenJDK 13.0.1)' },
  { id: 63, name: 'JavaScript (Node.js 12.14.0)' },
  { id: 71, name: 'Python (3.8.1)' }
])
const selectedLanguage = ref(71)
const handleSubmitCode = async () => {
  if (!code.value.trim()) {
    alert('代码不能为空')
    return
  }
    const response = await axios.post('/api/submit', {
      sourceCode: code.value,
      languageId: selectedLanguage.value,
      probId: route.query.id
    }, {
      headers: { 'Token': Token.value }
    })
    if (response.data.errCode === 1000) {
      const token=response.data.data;
      startPolling(token)
      currentPage.value = 1;  // 重置到第一页
      fetchSubmissionRecords(1);
      // 刷新提交记录（需自行实现）
    } else {
      handleSubmitError(response.data.errCode)
    }
  } 
  const formatStatus = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'Accepted': '已通过',
    'WrongAnswer': '答案错误',
    'Judging': '评测中'
  };
  return statusMap[status] || status;
};
const getStatusClass = (status: string) => {
  switch(status) {
    case '已通过': return 'accepted';
    case '答案错误': return 'wrong';
    default: return 'judging';
  }
};
onMounted(async () => {
  if (route.query.id) {
    await fetchProblemDetails();
    fetchSubmissionRecords(1);
  }
});
  const pollingInterval = ref<ReturnType<typeof setInterval>>();
const startPolling = (judgeToken: string) => {
  stopPolling(); // 先停止已有轮询
  pollingInterval.value = setInterval(async () => {
    try {
      const response = await axios.get(`/api/getSubmitRes/${judgeToken}`, {
        headers: { 'Token': Token.value }
      });
      
      if (response.data.errCode === 1000) {
        const result = response.data.data;
        if (result.judgeStatus !== 'Judging') { // 假设状态为Judging表示还在评测
          stopPolling();
          showResultPopup(result);
        }
      }
    } catch (error) {
      stopPolling();
      alert('获取评测结果失败');
    }
  }, 1000); // 每1秒轮询一次
}
const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = undefined;
  }
}
const showResultPopup = (result: any) => {
  const msg = `评测状态: ${result.judgeStatus}\n`
    + `内存使用: ${result.memory} KB\n`
    + `执行耗时: ${result.time} ms`;
  alert(msg);
}
onUnmounted(() => {
  stopPolling();
});
const handleSubmitError = (code: number) => {
  const errorMap: { [key: number]: string } = {
    1001: '服务器内部错误',
    1002: '验证码错误',
    1003: '权限验证失败',
    1006: 'Token已过期',
    1008: '代码不符合规范',
    1012: '不存在的题目ID',
    1013: '不支持的语言类型'
  }
  alert(errorMap[code] || `未知错误 (代码: ${code})`)
}
const Token=ref()
Token.value=localStorage.getItem('token')
const problemDetails=reactive({description:'加载中'});
const route = useRoute();
const problemInfo = reactive({
  id: route.query.id || '001',
  title: route.query.title || 'hello world',
  difficulty: route.query.difficulty || '简单'
});
onMounted(() => {
  Object.assign(problemInfo, {
    id: route.query.id || '001',
    title: route.query.title || 'hello world',
    difficulty: route.query.difficulty || '简单'
  });
});
const fetchProblemDetails = async () => {
    const response = await axios.get(`/api/getProbContent/${route.query.id}`, {
      headers: { 'Token': Token.value }
    });

    if (response.data.errCode === 1000) {
      problemDetails.description = response.data.data;
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
      problemDetails.description = '题目加载失败';
    }
  }
  onMounted(async () => {
  if (route.query.id) {
    await fetchProblemDetails();
  }
});
const code = ref('');
const output = ref('');
const isSubmissionDetailsActive = ref(false);
const activeSubmission = reactive({
  id: '',
  status: '',
  language: '',
  time: '',
  memory: '',
  code: ''
});

function runCode() {
  output.value = '运行中...';
  setTimeout(() => {
    output.value = code.value || 'No output';
  }, 500);
}
function clearOutput() {
  output.value = '';
}

function copyOutput() {
  navigator.clipboard.writeText(output.value)
    .then(() => alert('已复制到剪贴板'))
    .catch(err => console.error('复制失败:', err));
}

function showSubmissionDetails(submissionId: number) {
  const submission = submissionData.find(s => s.id === submissionId);
  if (submission) {
    Object.assign(activeSubmission, submission);
    isSubmissionDetailsActive.value = true;
  }
}

function closeSubmissionDetails() {
  isSubmissionDetailsActive.value = false;
}
</script>

<style scoped>
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.language-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;  /* 增加与运行按钮的间距 */
  font-size: 14px;
  background: white;
  cursor: pointer;
  height: 32px;       /* 与按钮高度保持一致 */
}
.btn {
  height: 32px;       /* 统一按钮高度 */
  display: flex;
  align-items: center;
  padding: 0 12px;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
  color: #333;
}
.language-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}
.container {
  max-width: 1600px;
  margin: 0 auto;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  min-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-top: 1px solid #eee;
}
.pagination button {
  padding: 6px 12px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  background: #e6f7ff;
  color: #1890ff;
  cursor: pointer;
  transition: all 0.2s;
}
.pagination button:disabled {
  border-color: #ddd;
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}
.submission-meta {
  display: flex;
  flex-direction: column;
  margin-left: 8px;
}
.status {
  font-size: 12px;
  color: #666;
}

.time {
  font-size: 12px;
  color: #999;
}

.status-judging {
  background-color: #faad14;
}
.problem-name {
  font-weight: 500;
  margin-bottom: 2px;
}
.pagination span {
  font-size: 14px;
  color: #666;
}
/* 头部导航 */
.header {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
}

.folder-icon {
  color: #999;
}

.actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.btn {
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: white;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

/* 主要内容区域 - 四列布局 */
.main-content {
  display: flex;
  flex: 1;
}

/* 最左侧边栏 */
.far-left-sidebar {
  width: 200px;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.sidebar-section {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}

.submission-list, .problem-list {
  list-style-type: none;
}

.submission-item, .problem-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  cursor: pointer;
}

.submission-item:last-child, .problem-item:last-child {
  border-bottom: none;
}

.submission-item:hover, .problem-item:hover {
  background-color: #f0f0f0;
}

/* 中间题目描述 */
.problem-description-panel {
  width: 40%;
  padding: 20px;
  border-right: 1px solid #eee;
  overflow-y: auto;
  position: relative;
}

.problem-header {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.problem-id {
  color: #666;
}

.difficulty {
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 4px;
  font-size: 12px;
}

.problem-text {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.io-section {
  margin-bottom: 20px;
}

.section-title {
  font-weight: normal;
  margin-bottom: 8px;
}

.io-content {
  background: #f8f9fa;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 12px;
  font-family: monospace;
  margin-bottom: 16px;
}

.limits-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.limit-item {
  color: #666;
  font-size: 14px;
}

.limit-value {
  float: right;
  color: #333;
}

/* 右侧代码编辑区域 */
.code-panel {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.code-editor {
  flex: 1;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  margin-bottom: 20px;
}

.output-panel {
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.panel-title {
  font-size: 14px;
  color: #666;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.panel-content {
  flex: 1;
  padding: 12px;
  font-family: monospace;
  font-size: 14px;
  overflow-y: auto;
  background: white;
}

/* 提交详情覆盖层 */
.submission-details {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  padding: 20px;
  display: none;
  overflow-y: auto;
}

.submission-details.active {
  display: block;
}

.submission-details h2 {
  margin-bottom: 20px;
}

.submission-info {
  margin-bottom: 20px;
}

.submission-info p {
  margin-bottom: 10px;
}

.close-details {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}

.status-accepted {
  background-color: #52c41a;
}

.status-wrong {
  background-color: #f5222d;
}
</style>