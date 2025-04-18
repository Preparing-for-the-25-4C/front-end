<template>
  <div class="submission-actions">
    <!-- 提交按钮容器 -->
    <div class="button-container">
      <button class="view-last-submission" @click="showLastSubmission">
        查看上次提交
      </button>
      <button class="submit-answer" @click="submitAnswer">
        提交本题作答
      </button>
    </div>

    <!-- 上次提交详情弹窗 -->
    <div v-if="isModalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>上次提交详情</h3>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="submission-info">
            <div class="info-item">
              <span class="label">提交时间：</span>
              <span>{{ lastSubmission.submitTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">执行结果：</span>
              <span :class="['status', lastSubmission.status.toLowerCase()]">
                {{ lastSubmission.status }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">执行用时：</span>
              <span>{{ lastSubmission.executionTime }}ms</span>
            </div>
            <div class="info-item">
              <span class="label">内存消耗：</span>
              <span>{{ lastSubmission.memoryUsage }}MB</span>
            </div>
          </div>
          <div class="submission-code">
            <h4>提交的代码：</h4>
            <pre><code>{{ lastSubmission.code }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface SubmissionDetail {
  submitTime: string;
  status: string;
  executionTime: number;
  memoryUsage: number;
  code: string;
}

const isModalVisible = ref(false);
const lastSubmission = ref<SubmissionDetail>({
  submitTime: '',
  status: '',
  executionTime: 0,
  memoryUsage: 0,
  code: ''
});

const emit = defineEmits(['submit']);

const showLastSubmission = async () => {
  try {
    // 这里需要调用获取上次提交详情的API
    // const response = await fetchLastSubmission();
    // lastSubmission.value = response.data;
    isModalVisible.value = true;
  } catch (error) {
    console.error('获取上次提交详情失败:', error);
    // 可以添加错误提示
  }
};

const closeModal = () => {
  isModalVisible.value = false;
};

const submitAnswer = () => {
  emit('submit');
};
</script>

<style scoped>
.submission-actions {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
}

.button-container {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-last-submission {
  background-color: #ffffff;
  border: 1px solid #1890ff;
  color: #1890ff;
}

.view-last-submission:hover {
  background-color: #e6f7ff;
}

.submit-answer {
  background-color: #1890ff;
  border: 1px solid #1890ff;
  color: white;
}

.submit-answer:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 16px;
}

.submission-info {
  margin-bottom: 20px;
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
}

.info-item {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.info-item .label {
  color: #666;
  width: 100px;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.status.accepted {
  background-color: #f6ffed;
  color: #52c41a;
}

.status.wrong {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.submission-code {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 16px;
}

.submission-code h4 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #333;
}

.submission-code pre {
  margin: 0;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow-x: auto;
}

.submission-code code {
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}
</style> 