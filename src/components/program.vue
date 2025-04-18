<template>
  <div class="container">
    <div class="actions-container">
      <SubmissionActions @submit="handleSubmitCode" />
    </div>

    <main class="main-content">
      <!-- 左侧题目描述 -->
      <div class="problem-description-panel" ref="descriptionPanel">
        <article class="problem-container">
          <header class="problem-header">
            <h1 class="problem-title">{{ problemInfo.id }}. {{ problemInfo.title }}</h1>
            <div class="problem-meta">
              <span class="difficulty-box">{{ problemInfo.difficulty }}</span>
              <span class="score">分数 {{ problemInfo.score || 5 }}</span>
            </div>
            <div class="problem-info">
              <span>作者 {{ problemInfo.author || '陈越' }}</span>
              <span>单位 {{ problemInfo.unit || '浙江大学' }}</span>
            </div>
          </header>

          <section class="problem-content">
            <div v-html="problemDetails.description"></div>
            <h3>输入格式:</h3>
            <div class="format-box">{{ problemData.输入格式 || '无' }}</div>
            <h3>输出格式:</h3>
            <div class="format-box">{{ problemData.输出格式 || '无' }}</div>
            <h3>输入样例:</h3>
            <div class="sample-box">{{ problemData.样例?.输入 || '无' }}</div>
            <h3>输出样例:</h3>
            <div class="sample-box">{{ problemData.样例?.输出 || '无' }}</div>
          </section>

          <section class="limits-section">
            <div class="limit-grid">
              <div class="limit-item">
                <span class="limit-label">代码长度限制</span>
                <span class="limit-value">16 KB</span>
              </div>
              <div class="limit-item">
                <span class="limit-label">时间限制</span>
                <span class="limit-value">400 ms</span>
              </div>
              <div class="limit-item">
                <span class="limit-label">内存限制</span>
                <span class="limit-value">64 MB</span>
              </div>
              <div class="limit-item">
                <span class="limit-label">栈限制</span>
                <span class="limit-value">8192 KB</span>
              </div>
            </div>
          </section>
        </article>
      </div>

      <!-- 可拖动分割线 -->
      <div class="splitter" ref="splitter"></div>

      <!-- 右侧代码编辑器和测试用例区域 -->
      <div class="code-panel" ref="codePanel">
        <div class="editor-section">
          <div class="editor-toolbar">
            <div class="toolbar-left">
              <select v-model="selectedLanguage" class="language-select" @change="handleLanguageChange">
                <option v-for="lang in languages" :value="lang.id" :key="lang.id">
                  {{ lang.name }}
                </option>
              </select>
            </div>
            <div class="toolbar-right">
              <button class="icon-button" @click="toggleSettingsPanel" title="设置">
                <i class="fas fa-cog"></i>
              </button>
              <button class="icon-button" @click="toggleFullscreen" title="全屏">
                <i class="fas fa-expand"></i>
              </button>
            </div>
          </div>

          <!-- Settings Panel -->
          <div v-if="showSettingsPanel" class="settings-panel-overlay">
            <div class="settings-panel">
              <h3>编辑器设置</h3>
              <div class="settings-item">
                <label>字号</label>
                <input type="number" v-model.number="tempFontSize" min="8" max="32" /> px
              </div>
              <div class="settings-item">
                <label>Tab长度</label>
                <select v-model.number="tempTabSize">
                  <option value="2">2个空格</option>
                  <option value="4">4个空格</option>
                  <option value="8">8个空格</option>
                </select>
              </div>
              <div class="settings-item">
                <label>主题</label>
                <select v-model="tempTheme">
                  <option value="vs">Light (vs)</option>
                  <option value="vs-dark">Dark (vs-dark)</option>
                  <option value="hc-black">High Contrast (hc-black)</option>
                </select>
              </div>
              <div class="settings-item">
                <label>键位绑定</label>
                <select v-model="tempKeybinding">
                  <option value="default">默认</option>
                  <!-- Add other keybindings if needed -->
                </select>
              </div>
              <div class="settings-item checkbox-item">
                <label>
                  <input type="checkbox" v-model="tempShowWhitespace" />
                  显示空白字符
                </label>
              </div>
              <div class="settings-actions">
                <button @click="cancelSettings">取消</button>
                <button @click="applySettings">确认</button>
              </div>
            </div>
          </div>

          <div class="editor-wrapper">
            <div ref="editorContainer" class="monaco-editor"></div>
          </div>
        </div>

        <!-- 测试用例面板 -->
        <div class="testcase-panel" :class="{ 'collapsed': !showTestCase }">
          <div class="testcase-header" @click="toggleTestCase">
            <span>测试用例</span>
            <button class="toggle-button">
              {{ showTestCase ? '▼' : '▲' }}
            </button>
          </div>
          <div v-show="showTestCase" class="testcase-content">
            <div class="testcase-input">
              <h4>输入</h4>
              <textarea v-model="stdIn" placeholder="请输入测试数据..."></textarea>
            </div>
            <div class="testcase-output">
              <h4>输出</h4>
              <pre>{{ stdOut }}</pre>
            </div>
            <div class="testcase-actions">
              <button class="reset-button" @click="resetTestCase">重置测试用例</button>
              <button class="run-button" @click="runCode">
                <i class="fas fa-play"></i> 运行测试
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import * as monaco from 'monaco-editor';
import router from '@/router';
import SubmissionActions from './SubmissionActions.vue';

const showInputOutput = ref(false);
const selectedStatus = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 5;
const stdIn = ref('');
const stdOut = ref('');
const code = ref('');
const fontSize = ref(14);
const tabSize = ref(4);
const theme = ref('vs-dark');
const showWhitespace = ref(false);
const showSettingsPanel = ref(false);
const showHelp = ref(false);
const editorContainer = ref(null);
let editor = null;

interface SubmissionRecord {
  probName: string;
  status: string;
  language: string;
  time: string;
  code: string;
  recordTime: string;
  compileError?: string;
}

const toggleInputOutput = () => {
  showInputOutput.value = !showInputOutput.value;
};

const togglePanel = (panel) => {
  if (panel === 'help') {
    showHelp.value = !showHelp.value;
    showSettingsPanel.value = false;
  } else if (panel === 'settings') {
    showSettingsPanel.value = !showSettingsPanel.value;
    showHelp.value = false;
  }
};

const languageInfo = {
  c: { name: 'C', compiler: 'gcc', version: '9.2.0', example: 'int main() { return 0; }' },
  cpp: { name: 'C++', compiler: 'gcc', version: '9.2.0', example: 'int main() { return 0; }' },
  java: { name: 'Java', compiler: 'openJDK', version: '13.0.1', example: 'public class Main { public static void main(String[] args) { } }' },
  javascript: { name: 'JavaScript', compiler: 'node.js', version: '12.14.0', example: 'console.log("Hello, World!");' },
  python: { name: 'Python', compiler: 'python3', version: '3.8.1', example: 'print("Hello, World!")' },
};

const descriptionPanel = ref<HTMLElement | null>(null);
const codePanel = ref<HTMLElement | null>(null);
const splitter = ref<HTMLElement | null>(null);

onMounted(() => {
  editor = monaco.editor.create(editorContainer.value, {
    value: languageInfo[language.value].example,
    language: language.value,
    theme: theme.value,
    fontSize: fontSize.value,
    tabSize: tabSize.value,
    renderWhitespace: showWhitespace.value ? 'all' : 'none',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on',
    lineNumbers: 'on',
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
  });

  editor.onDidChangeModelContent(() => {
    code.value = editor.getValue();
  });

  setupSplitter();
  fetchProblemDetails();

  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

const handleLanguageChange = () => {
  const langObj = languages.value.find(l => l.id === selectedLanguage.value);
  if (langObj) {
    language.value = langObj.editorLang;
    updateEditorLanguage();
  }
};

// 修改更新编辑器语言方法
const updateEditorLanguage = () => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel(), language.value);
    editor.setValue(languageInfo[language.value].example);
  }
};
const updateEditorTheme = () => {
  if (editor) {
    monaco.editor.setTheme(theme.value);
  }
};

const updateWhitespace = () => {
  if (editor) {
    editor.updateOptions({ renderWhitespace: showWhitespace.value ? 'all' : 'none' });
  }
};

watch(fontSize, (newValue) => {
  if (editor) {
    editor.updateOptions({ fontSize: newValue });
  }
});

watch(tabSize, (newValue) => {
  if (editor) {
    editor.updateOptions({ tabSize: newValue });
  }
});

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
      submissionData.splice(
        0,
        submissionData.length,
        ...response.data.data.map((record: any) => ({
          probName: record.probName,
          status: record.status,
          language: record.language,
          time: `${record.wallTime}ms`,
          code: decodeURIComponent(
            escape(
              atob(record.codeOnBase64.replace(/-/g, '+').replace(/_/g, '/'))
            )
          ),
          recordTime: record.recordTime,
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
  { id: 50, name: 'C (GCC 9.2.0)', editorLang: 'c' },
  { id: 54, name: 'C++ (GCC 9.2.0)', editorLang: 'cpp' },
  { id: 62, name: 'Java (OpenJDK 13.0.1)', editorLang: 'java' },
  { id: 63, name: 'JavaScript (Node.js 12.14.0)', editorLang: 'javascript' },
  { id: 71, name: 'Python (3.8.1)', editorLang: 'python' }
]);

// 默认选择Java
const selectedLanguage = ref(62);
const language = ref('java');

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
        languageId:selectedLanguage.value,
        probId: route.query.id,
      },
      {
        headers: { 'Token': Token.value },
      }
    );

    if (response.data.errCode === 1000) {
      const judgeToken = response.data.data;

      Object.assign(activeSubmission, {
        status: '评测中',
        language: languages.value.find((lang) => lang.id === selectedLanguage.value)?.name || '未知语言',
        time: '--',
        code: code.value,
        recordTime: new Date().toLocaleString(),
        compileError: '',
      });

      isSubmissionDetailsActive.value = true;
      startPolling(judgeToken);
      
      // 提交后刷新提交记录
      fetchSubmissionRecords(currentPage.value);
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
    currentPage.value = 1;
    fetchSubmissionRecords(1);
  }
});

const pollingInterval = ref<ReturnType<typeof setInterval>>();
const startPolling = (judgeToken: string) => {
  stopPolling();
  pollingInterval.value = setInterval(async () => {
    try {
      const response = await axios.get(`/api/getSubmitRes/${judgeToken}`, {
        headers: { 'Token': Token.value },
      });

      if (response.data.errCode === 1000) {
        const result = response.data.data;

        if (result.judgeStatus === 'Compilation Error') {
          const compileError = result.compileOutput?.trim() || '编译错误信息为空';

          Object.assign(activeSubmission, {
            status: '编译错误',
            compileError: compileError,
          });

          stopPolling();
          return;
        }

        if (result.judgeStatus !== 'Judging') {
          Object.assign(activeSubmission, {
            status: result.judgeStatus,
            time: `${result.time} ms`,
            memory: `${result.memory} KB`,
          });

          stopPolling();
          // 更新提交记录
          fetchSubmissionRecords(currentPage.value);
        }
      }
    } catch (error) {
      stopPolling();
      console.error('获取评测结果失败:', error);
      alert('获取评测结果失败，请检查网络或服务器状态');
    }
  }, 1000);
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
  removeSplitterListeners(); // 移除分割线监听器
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
  alert(errorMap[code] || '未知错误');
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

const isSubmissionDetailsActive = ref(false);
const activeSubmission = reactive({
  status: '',
  language: '',
  time: '',
  memory: '',
  code: '',
  compileError: ''
});

const runCode = async () => {
  if (!code.value.trim()) {
    alert('代码不能为空');
    return;
  }

  showInputOutput.value = true; // 显示输入输出面板

  let retryCount = 0;
  const maxRetries = 5;
  const retryDelay = 1000;

  while (retryCount < maxRetries) {
    try {
      const response = await axios.post(
        '/api/runCode',
        {
          sourceCode: code.value,
          languageId: selectedLanguage.value,
          stdIn: stdIn.value,
        },
        {
          headers: {
            'Token': Token.value,
          },
        }
      );

      if (response.data.errCode === 1000) {
        const runToken = response.data.data;
        await fetchRunResult(runToken);
        return;
      } else {
        handleSubmitError(response.data.errCode);
        return;
      }
    } catch (error) {
      console.error('获取 runToken 失败:', error);
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`重试第 ${retryCount} 次...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        alert('获取 runToken 失败，请稍后重试');
        return;
      }
    }
  }
};

const clearOutput = () => {
  stdOut.value = '';
  stdIn.value = '';
};

const fetchRunResult = async (runToken: any) => {
  try {
    const response = await axios.get(`/api/getRunRes/${runToken}`, {
      headers: {
        'Token': Token.value,
      },
    });

    if (response.data.errCode === 1000) {
      if (response.data.data.stdOut) {
        const decodedOutput = atob(response.data.data.stdOut.trim());
        stdOut.value = decodedOutput;
      } else {
        stdOut.value = '运行结果为空';
      }
    } else if (response.data.errCode === 1016) {
      stdOut.value = '代码正在运行中，请稍后...';
      // 1秒后再次尝试获取结果
      setTimeout(() => fetchRunResult(runToken), 1000);
    } 
     if (response.data.data && response.data.data.compileOutput) {
      const compileError = atob(response.data.data.compileOutput.trim());
      stdOut.value = `编译错误:\n${compileError}`;
    }
  } catch (error) {
    console.error('获取运行结果失败:', error);
    stdOut.value = '获取运行结果失败，请重试';
  }
};

const fetchProblemDetails = async () => {
  try {
    const response = await axios.get(`/api/getProbContent/${route.query.id}`, {
      headers: { 'Token': Token.value }
    });

    if (response.data.errCode === 1000) {
      const data = JSON.parse(response.data.data);
      Object.assign(problemData, data);
      problemDetails.description = data.说明;
    } else {
      handleSubmitError(response.data.errCode);
    }
  } catch (error) {
    console.error('获取题目详情失败:', error);
    alert('获取题目详情失败，请检查网络或服务器状态');
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

function extractJsonItems(jsonStr) {
  const parsedData = JSON.parse(jsonStr);
  const result = [];

  function traverse(obj) {
    if (Array.isArray(obj)) {
      obj.forEach(item => traverse(item));
    } else if (typeof obj === 'object' && obj !== null) {
      Object.values(obj).forEach(value => traverse(value));
    } else {
      result.push(JSON.stringify(obj));
    }
  }

  traverse(parsedData);
  return result.join('\n');
}

// 添加 problemData 数据
const problemData = reactive({
  说明: '',
  输入格式: '',
  输出格式: '',
  样例: {
    输入: '',
    输出: ''
  }
});

// --- 分割线拖动逻辑 --- 
let isDragging = false;
let startX = 0;
let startWidthDescription = 0;

const setupSplitter = () => {
  if (!splitter.value || !descriptionPanel.value || !codePanel.value) return;

  splitter.value.addEventListener('mousedown', onMouseDown);
};

const onMouseDown = (e: MouseEvent) => {
  isDragging = true;
  startX = e.clientX;
  startWidthDescription = descriptionPanel.value!.offsetWidth;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  // 添加样式以防止拖动时选中文本
  document.body.style.userSelect = 'none'; 
  document.body.style.cursor = 'col-resize';
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging || !descriptionPanel.value || !codePanel.value) return;

  const dx = e.clientX - startX;
  const newWidthDescription = startWidthDescription + dx;
  const containerWidth = descriptionPanel.value.parentElement!.offsetWidth;
  const splitterWidth = splitter.value!.offsetWidth;

  // 添加最小宽度限制
  const minWidth = 150; 
  const maxWidthDescription = containerWidth - splitterWidth - minWidth;

  if (newWidthDescription > minWidth && newWidthDescription < maxWidthDescription) {
    descriptionPanel.value.style.width = `${newWidthDescription}px`;
    // codePanel 的宽度会自动调整 (flex: 1)
  } 
};

const onMouseUp = () => {
  if (isDragging) {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    // 恢复默认样式
    document.body.style.userSelect = ''; 
    document.body.style.cursor = '';
  }
};

const removeSplitterListeners = () => {
  if (splitter.value) {
    splitter.value.removeEventListener('mousedown', onMouseDown);
  }
  // 确保在组件卸载时移除 document 上的监听器
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
};

// --- 结束分割线逻辑 ---

// 添加新的响应式变量
const showTestCase = ref(false);
const isFullscreen = ref(false);

// 切换测试用例面板
const toggleTestCase = () => {
  showTestCase.value = !showTestCase.value;
};

// 重置测试用例
const resetTestCase = () => {
  stdIn.value = '';
  stdOut.value = '';
};

// 切换全屏模式
const toggleFullscreen = () => {
  const element = document.documentElement;
  if (!isFullscreen.value) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  isFullscreen.value = !isFullscreen.value;
};

// 监听全屏变化
onMounted(() => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', () => {});
});

// --- Settings Panel Logic --- 
const tempFontSize = ref(fontSize.value);
const tempTabSize = ref(tabSize.value);
const tempTheme = ref(theme.value);
const tempShowWhitespace = ref(showWhitespace.value);
const tempKeybinding = ref('default');

const toggleSettingsPanel = () => {
  if (!showSettingsPanel.value) {
    // Sync temps with current values when opening
    tempFontSize.value = fontSize.value;
    tempTabSize.value = tabSize.value;
    tempTheme.value = theme.value;
    tempShowWhitespace.value = showWhitespace.value;
    tempKeybinding.value = keybinding.value;
  }
  showSettingsPanel.value = !showSettingsPanel.value;
};

const applySettings = () => {
  fontSize.value = tempFontSize.value;
  tabSize.value = tempTabSize.value;
  theme.value = tempTheme.value;
  showWhitespace.value = tempShowWhitespace.value;
  keybinding.value = tempKeybinding.value;
  // Apply changes to the editor
  if (editor) {
    editor.updateOptions({
      fontSize: fontSize.value,
      tabSize: tabSize.value,
      renderWhitespace: showWhitespace.value ? 'all' : 'none',
      // Add keybinding update if needed
    });
    monaco.editor.setTheme(theme.value);
  }
  showSettingsPanel.value = false;
};

const cancelSettings = () => {
  showSettingsPanel.value = false;
  // Temps will reset next time panel is opened
};

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden; /* 严格禁止容器滚动 */
}

.actions-container {
  position: absolute;
  top: 10px; /* 微调位置 */
  right: 20px;
  height: 40px; /* 给按钮容器一个明确高度 */
  display: flex;
  align-items: center; /* 垂直居中按钮 */
  gap: 12px;
  z-index: 10;
}

.main-content {
  display: flex;
  flex: 1; /* 占据剩余所有空间 */
  overflow: hidden; /* 禁止主内容区滚动 */
  position: relative;
  padding-top: 60px; /* 为顶部的 actions-container 留出足够空间 */
  margin-top: -60px; /* 将内容拉回，填补因 padding 产生的空白 */
}

.problem-description-panel {
  width: 40%;
  background-color: white;
  overflow-y: auto; /* 允许此面板内部滚动 */
  padding: 20px;
  padding-top: 70px; /* 确保内容从按钮下方开始 */
  margin-top: -60px; /* 补偿 main-content 的负 margin */
  border-right: 1px solid #e0e0e0;
}

.problem-header {
  margin-bottom: 24px;
}

.problem-title {
  font-size: 20px;
  margin-bottom: 12px;
}

.problem-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.problem-info {
  color: #666;
  font-size: 14px;
}

.format-box, .sample-box {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 12px;
  margin: 8px 0 16px;
  font-family: monospace;
  white-space: pre-wrap;
}

.limits-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.limit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.limit-item {
  background-color: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  overflow: hidden; /* 禁止代码面板自身滚动 */
  padding-top: 60px; /* 确保内容从按钮下方开始 */
  margin-top: -60px; /* 补偿 main-content 的负 margin */
}

.editor-section {
  flex: 1; /* 占据代码面板的剩余空间 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 禁止编辑器区域滚动 */
  min-height: 0; /* Flexbox hack 防止内容溢出 */
}

.editor-toolbar {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  background-color: #252526;
  border-bottom: 1px solid #3c3c3c;
}

.toolbar-left, .toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.language-select {
  padding: 4px 8px;
  background-color: #3c3c3c;
  color: white;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
}

.icon-button {
  padding: 6px;
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  border-radius: 4px;
}

.icon-button:hover {
  background-color: #3c3c3c;
}

.editor-wrapper {
  flex: 1; /* 编辑器包装器占据 editor-section 的剩余空间 */
  position: relative;
  min-height: 0; /* Flexbox hack */
}

.monaco-editor {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

/* 测试用例面板样式 */
.testcase-panel {
  border-top: 1px solid #e0e0e0;
  background-color: white;
}

.testcase-panel.collapsed {
  height: 40px;
}

.testcase-header {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background-color: #f7f7f7;
  cursor: pointer;
}

.testcase-content {
  height: 200px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.testcase-input, .testcase-output {
  margin-bottom: 16px;
}

.testcase-input textarea {
  width: 100%;
  height: 100px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  resize: vertical;
}

.testcase-output pre {
  background-color: #f5f5f5;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
  font-family: monospace;
  margin: 0;
}

.testcase-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.reset-button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

.run-button {
  padding: 8px 16px;
  background-color: #52c41a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.run-button:hover {
  background-color: #49ad15;
}

/* 响应式布局调整 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .problem-description-panel {
    width: 100%;
    height: 40%;
  }
  
  .code-panel {
    height: 60%;
  }
}
</style>