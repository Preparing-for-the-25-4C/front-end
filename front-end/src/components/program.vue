<template>
  <br>
  <br>
  <div class="container">
    <header class="header">
      <div class="breadcrumb">
        <span class="folder-icon">📁</span>
        <span>题库</span>
      </div>
      <div class="actions">
        <button class="btn btn-primary" @click="runCode">运行</button>
        <button class="btn" @click="submitCode">提交</button>
      </div>
    </header>

    <main class="main-content">
      <!-- 最左侧边栏 -->
      <aside class="far-left-sidebar">
        <div class="sidebar-section">
          <h3 class="sidebar-title">提交记录</h3>
          <ul class="submission-list">
            <li v-for="submission in submissionData" :key="submission.id" 
                class="submission-item" 
                @click="showSubmissionDetails(submission.id)">
              <span :class="['status-indicator', `status-${submission.status === '已通过' ? 'accepted' : 'wrong'}`]"></span>
              #{{ submission.id }} {{ submission.status }}
            </li>
          </ul>
        </div>
        <div class="sidebar-section">
          <h3 class="sidebar-title">题目列表</h3>
          <ul class="problem-list">
            <li v-for="problem in problems" :key="problem.id" class="problem-item">
              {{ problem.id }}. {{ problem.title }}
            </li>
          </ul>
        </div>
      </aside>

      <!-- 中间题目描述 -->
      <div class="problem-description-panel">
        <div class="problem-header">
          <span class="problem-id">001.</span>
          <span>hello world</span>
          <span class="difficulty">简单</span>
        </div>

        <div class="problem-text">
          这是你的第一个题目，你只需要输出hello world就可以了
        </div>

        <div class="io-section">
          <h3 class="section-title">输入格式：</h3>
          <div class="io-content">无</div>

          <h3 class="section-title">输出格式：</h3>
          <div class="io-content">hello world</div>
        </div>

        <div class="limits-grid">
          <div class="limit-item">
            时间限制：<span class="limit-value">1000ms</span>
          </div>
          <div class="limit-item">
            内存限制：<span class="limit-value">64MB</span>
          </div>
          <div class="limit-item">
            输出限制：<span class="limit-value">512KB</span>
          </div>
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
import { ref, reactive } from 'vue';

const code = ref('');
const output = ref('');
const isSubmissionDetailsActive = ref(false);
const activeSubmission = reactive({
  id: null,
  status: '',
  language: '',
  time: '',
  memory: '',
  code: ''
});

const submissionData = reactive([
  { id: 1, status: '已通过', language: 'C++', time: '2ms', memory: '1.2MB', code: '#include <iostream>\n\nint main() {\n    std::cout << "hello world" << std::endl;\n    return 0;\n}' },
  { id: 2, status: '错误答案', language: 'Python', time: '5ms', memory: '2.1MB', code: 'print("Hello World")' },
  { id: 3, status: '已通过', language: 'Java', time: '8ms', memory: '3.5MB', code: 'public class Solution {\n    public static void main(String[] args) {\n        System.out.println("hello world");\n    }\n}' }
]);

const problems = [
  { id: '001', title: 'Hello World' },
  { id: '002', title: '两数之和' },
  { id: '003', title: '无重复字符的最长子串' },
  { id: '004', title: '寻找两个正序数组的中位数' }
];

function runCode() {
  output.value = '运行中...';
  setTimeout(() => {
    output.value = code.value || 'No output';
  }, 500);
}

function submitCode() {
  // Implement submission logic here
  console.log('Code submitted:', code.value);
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

<style>
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