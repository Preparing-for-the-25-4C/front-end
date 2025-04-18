<template>
  <br>
  <br>
  <br>
  <div class="container">
    <div class="header">
      <div class="breadcrumb">
        <span class="folder-icon">📝 </span>
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
            <li
  v-for="(submission, index) in submissionData"
  :key="index"
  class="submission-item"
  @click="showSubmissionDetails(index)"
>
  <span
    :class="['status-indicator', `status-${getStatusClass(submission.status)}`]"
  ></span>
  <div class="submission-meta">
    <span class="problem-name">{{ submission.probName }}</span>
    <span class="status">{{ submission.status }}</span>
    <span class="time">{{ submission.recordTime }}</span>
    <!-- 显示编译错误 -->
  </div>
</li>
</ul>
          <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
            <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
            <button @click="nextPage" :disabled="submissionData.length < pageSize">下一页</button>
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
    <p>状态: <span>{{ activeSubmission.status }}</span></p>
    <p>语言: <span>{{ activeSubmission.language }}</span></p>
    <p>执行用时: <span>{{ activeSubmission.time }}</span></p>
  </div>
  <h3>提交的代码：</h3>
  <pre>{{ activeSubmission.code }}</pre>
  <!-- 显示编译错误 -->
  <div :class="['submission-details', { active: isSubmissionDetailsActive }]">
  <span class="close-details" @click="closeSubmissionDetails">&times;</span>
  <h2>提交详情</h2>
  <div class="submission-info">
    <p>状态: <span>{{ activeSubmission.status }}</span></p>
    <p>语言: <span>{{ activeSubmission.language }}</span></p>
    <p>执行用时: <span>{{ activeSubmission.time }}</span></p>
  </div>
  <h3>提交的代码：</h3>
  <pre>{{ activeSubmission.code }}</pre>
  <!-- 显示编译错误 -->
  <div v-if="activeSubmission.compileError" class="compile-error">
    <h3>编译错误：</h3>
    <pre>{{ activeSubmission.compileError }}</pre>
  </div>
</div>
  </div>
</div>

      <!-- 右侧代码编辑区域 -->
      <div class="code-panel">
    <textarea class="code-editor" v-model="code" placeholder="在这里编写代码..."></textarea>
    
    <!-- 添加控制按钮 -->
    <div class="io-control">
      <button @click="toggleIO" class="btn-toggle">
        {{ showInputOutput ? '隐藏输入输出' : '显示输入输出' }}
        <i :class="['arrow', showInputOutput ? 'down' : 'up']"></i>
      </button>
    </div>

    <!-- 包裹输入输出容器 -->
    <div class="output-panel" v-show="showInputOutput">
      <div class="panel-content">
        <div class="input-output-container">
          <!-- 原有输入输出内容 -->
          <div class="input-section">
            <h3>输入数据</h3>
            <textarea v-model="stdIn" class="input-box" placeholder="请输入运行时的输入数据..."></textarea>
          </div>
          <div class="output-section">
            <h3>运行结果</h3>
            <pre class="output-box">{{ stdOut }}</pre>
          </div>
        </div>
        <div class="panel-actions">
          <button class="btn" @click="clearOutput">清空</button>
        </div>
      </div>
    </div>
  </div>
    </main>
  </div>
</template>


<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useRouter } from 'vue-router';
import router from '@/router';
import { extractJsonItems } from '../router/main.js';
const showInputOutput = ref(true);

// 添加切换方法
const toggleIO = () => {
  showInputOutput.value = !showInputOutput.value;
};
const selectedStatus = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 5;
const stdIn = ref(''); // 输入数据
const stdOut = ref(''); // 输出结果
const code = ref(''); // 用户编写的代码
const selectedLanguage = ref(71); // 默认语言 ID
interface SubmissionRecord {
  probName: string;
  status: string;
  language: string;
  time: string;
  code: string;
  recordTime: string;
  compileError?: string; // 新增字段，用于存储编译错误
}

const submissionData = reactive<SubmissionRecord[]>([]);

const fetchSubmissionRecords = async (page: number) => {
try {
  const response = await axios.get(`/api/getRecord/${pageSize}/${page}`, {
    headers: { 'Token': Token.value },
    params: {
      probName: problemInfo.title || null,
      languageId: selectedLanguage.value || null,
      status: selectedStatus.value === 'Accepted' ? 'Accepted' : 'No Accepted'
    }
  });

  if (response.data.errCode === 1000) {
    submissionData.splice(0, submissionData.length, 
        ...response.data.data.map((record: any) => ({
          probName: record.probName,
          status: record.status,
          language: record.language,
          time: `${record.wallTime}ms`,
          code: decodeURIComponent(escape(atob(record.codeOnBase64.replace(/-/g, '+').replace(/_/g, '/')))),
          recordTime: record.recordTime
        }))
      );
      totalPages.value = response.data.data.length < pageSize ? currentPage.value : currentPage.value + 1;
  } else {
    handleSubmitError(response.data.errCode);
  }
} catch (error) {
  console.error('请求提交记录失败:', error);
  alert('请求提交记录失败，请检查网络或服务器状态');
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
]);

const handleSubmitCode = async () => {
  if (!code.value.trim()) {
    alert('代码不能为空');
    return;
  }

  try {
    const response = await axios.post(
      '/api/submit',
      {
        sourceCode: code.value,
        languageId: selectedLanguage.value,
        probId: route.query.id,
      },
      {
        headers: { 'Token': Token.value },
      }
    );

    if (response.data.errCode === 1000) {
      const judgeToken = response.data.data;

      // 设置 activeSubmission 数据
      Object.assign(activeSubmission, {
        status: '评测中',
        language: languages.value.find((lang) => lang.id === selectedLanguage.value)?.name || '未知语言',
        time: '--',
        code: code.value,
        recordTime: new Date().toLocaleString(),
        compileError: '', // 清空编译错误
      });

      // 激活提交详情页面
      isSubmissionDetailsActive.value = true;

      // 开始轮询获取评测结果
      startPolling(judgeToken);
    } else {
      handleSubmitError(response.data.errCode);
    }
  } catch (error) {
    console.error('提交代码失败:', error);
    alert('提交代码失败，请检查网络或服务器状态');
  }
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
  currentPage.value = 1; // 确保从第一页开始
  fetchSubmissionRecords(1); // 加载第一页数据
}
});

const pollingInterval = ref<ReturnType<typeof setInterval>>();
  const startPolling = (judgeToken: string) => {
  stopPolling(); // 先停止已有轮询
  pollingInterval.value = setInterval(async () => {
    try {
      const response = await axios.get(`/api/getSubmitRes/${judgeToken}`, {
        headers: { 'Token': Token.value },
      });

      if (response.data.errCode === 1000) {
        const result = response.data.data;

        // 检查是否存在编译错误
        if (result.judgeStatus === 'Compilation Error') {
          const compileError = result.compileOutput?.trim() || '编译错误信息为空';

          // 更新 activeSubmission 数据
          Object.assign(activeSubmission, {
            status: '编译错误',
            compileError: compileError,
          });

          stopPolling(); // 停止轮询
          return;
        }

        // 如果评测状态不是 "Judging"，更新 activeSubmission 数据
        if (result.judgeStatus !== 'Judging') {
          Object.assign(activeSubmission, {
            status: result.judgeStatus,
            time: `${result.time} ms`,
            memory: `${result.memory} KB`,
          });

          stopPolling(); // 停止轮询
        }
      }
    } catch (error) {
      stopPolling();
      console.error('获取评测结果失败:', error);
      alert('获取评测结果失败，请检查网络或服务器状态');
    }
  }, 1000); // 每 1 秒轮询一次
};

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = undefined;
  }
};

const showResultPopup = (result: any) => {
  const msg = `评测状态: ${result.judgeStatus}\n`
    + `内存使用: ${result.memory} KB\n`
    + `执行耗时: ${result.time} ms`;
  alert(msg);
};

onUnmounted(() => {
  stopPolling();
});

const handleSubmitError = (code: number) => {
  const errorMap: { [key: number]: string } = {
    1001: '服务器内部错误',
    1002: '验证码错误',
    1003: '权限验证失败',
    1008: '代码不符合规范',
    1012: '不存在的题目ID',
    1013: '不支持的语言类型'
  };
};

const Token = ref();
Token.value = localStorage.getItem('token');

const problemDetails = reactive({ description: '加载中' });
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
    problemDetails.description=extractJsonItems(problemDetails.description);
    console.log('题目描述:', response.data.data);
  } else {
    if (response.data.errCode === 1001) {
            alert('请先登录！');
            router.push('/login'); // 重定向到登录页面
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
            router.push('/login'); // 重定向到登录页面
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
};
const isSubmissionDetailsActive = ref(false);
const activeSubmission = reactive({
  status: '',
  language: '',
  time: '',
  memory: '',
  code: '',
  compileError: '' // Add compileError property
});
const runCode = async () => {
  if (!code.value.trim()) {
    alert('代码不能为空');
    return;
  }

  let retryCount = 0; // 当前重试次数
  const maxRetries = 5; // 最大重试次数
  const retryDelay = 1000; // 每次重试的间隔时间（毫秒）

  while (retryCount < maxRetries) {
    try {
      // 调用 /api/runCode 接口
      const response = await axios.post(
        '/api/runCode',
        {
          sourceCode: code.value,
          languageId: selectedLanguage.value,
          stdIn: stdIn.value,
        },
        {
          headers: {
            'Token': Token.value, // 添加 Token 到请求头
          },
        }
      );

      if (response.data.errCode === 1000) {
        const runToken = response.data.data; // 获取 runToken
        await fetchRunResult(runToken); // 获取运行结果
        return; // 成功获取 runToken 后退出循环
      } else {
        if (response.data.errCode === 1001) {
            alert('内部服务器错误，请稍后重试！');
            router.push('/login'); // 重定向到登录页面
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
            router.push('/login'); // 重定向到登录页面
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
        return; // 如果接口返回错误码，直接退出
      }
    } catch (error) {
      console.error('获取 runToken 失败:', error);
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`重试第 ${retryCount} 次...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay)); // 等待一段时间后重试
      } else {
        alert('获取 runToken 失败，请稍后重试');
        return;
      }
    }
  }
};
const clearOutput = () => {
  stdOut.value = ''; // 清空运行结果
};

const fetchRunResult = async (runToken: any) => {
    // 调用 /api/getRunRes/{runToken} 接口
    const response = await axios.get(`/api/getRunRes/${runToken}`, {
      headers: {
        'Token': Token.value, // 添加 Token 到请求头
      },
    });

    if (response.data.errCode === 1000) {
      // 解码 Base64 编码的 stdOut
      if (response.data.data.stdOut) {
        const decodedOutput = atob(response.data.data.stdOut.trim());
        stdOut.value = decodedOutput; // 设置运行结果
      } else {
        console.error('stdOut is null or undefined');
        stdOut.value = '运行结果为空';
      }
    } 
    if (response.data.errCode === 1016) {
      stdOut.value = '代码正在运行中，请稍后...';
    }
    if (response.data.data && response.data.data.compileOutput) {
      // 如果存在编译错误，显示 compileOutput
      const compileError = atob(response.data.data.compileOutput.trim());
      stdOut.value = `编译错误:\n${compileError}`;
    } 
};

function showSubmissionDetails(submissionId: number) {
  const submission = submissionData.find((s, index) => index === submissionId);
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
/* 添加控制按钮样式 */
.btn-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  margin: 12px 0;
}

.btn-toggle:hover {
  background: #e0e0e0;
}
.arrow {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}

.arrow.down {
  border-top: 5px solid #666;
}

.arrow.up {
  border-bottom: 5px solid #666;
}

/* 调整输入输出容器动画 */
.output-panel {
  transition: all 0.3s ease;
}
.code-panel:has(.output-panel:not([style*="display: none"])) {
  padding-bottom: 24px;
}

/* 保持原有输入输出样式 */
.input-output-container {
  /* 保持之前修改的样式 */
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 16px;
}

.input-box, .output-box {
  /* 保持之前的高度和样式 */
  height: 200px;
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
.output-section h3 {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
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
  font-size: 12px;
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
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background: white;
}

.btn-primary {
  background-color: #add1f3;
  color: white;
  border-color: #add1f3;
}

.btn-primary:hover {
  background-color: #add1f3;
}

.btn:hover {
  background-color: #f0f0f0;
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
  max-height: 400px; /* 设置最大高度 */
  overflow-y: auto; /* 启用垂直滚动 */
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
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  background: #f8f9fa;
}

.panel-header {
  display: none; /* 隐藏标题部分 */
}

.panel-title {
  font-size: 14px;
  color: #666;
}

.panel-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
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
.output-box {
  height: 150px;
  overflow-y: auto;
  background: #f5f5f5;
  white-space: pre-wrap; /* 保留换行符并自动换行 */
  word-wrap: break-word; /* 长单词换行 */
  font-family: monospace; /* 使用等宽字体 */
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
.input-output-container {
  display: flex;
  gap: 16px;
}

.input-section,
.output-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-box,
.output-box {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  font-family: monospace;
  font-size: 14px;
  resize: none;
  background: white;
}
.input-box {
  height: 150px;
}

.output-box {
  height: 150px;
  overflow-y: auto;
  background: #f5f5f5;
}
.compile-error {
  display: block;
  color: red;
  font-size: 12px;
  margin-top: 4px;
  word-wrap: break-word; /* 长单词换行 */
}
/* 输入输出容器 */
.input-output-container {
  display: flex;
  gap: 16px;
  align-items: stretch; /* 强制等高 */
  margin-top: 16px;
}

/* 标题统一样式 */
.input-section h3,
.output-section h3 {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 输入输出区域基础样式 */
.input-section,
.output-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 防止内容溢出 */
}

/* 统一输入输出框样式 */
.input-box,
.output-box {
  flex: 1;
  font-family: 'Menlo', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.5;
  padding: 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 0;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-y: auto;
  tab-size: 2;
  
  /* 统一滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: #ddd #f5f5f5;
}

/* 针对 textarea 的特殊处理 */
.input-box {
  resize: vertical;
  min-height: 200px;
  outline: none;
  transition: border-color 0.2s;
}

.input-box:focus {
  border-color: #1890ff;
}

/* 输出框高度同步 */
.output-box {
  min-height: 200px;
  background: #fafafa;
}

/* 统一滚动条样式 */
.input-box::-webkit-scrollbar,
.output-box::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.input-box::-webkit-scrollbar-track,
.output-box::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.input-box::-webkit-scrollbar-thumb,
.output-box::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
</style>