<template>
  <div class="problem-details-container">
    <div class="detail-section description-section">
      <h3>说明</h3>
      <p>{{ problemData.说明 }}</p>
    </div>

    <div class="detail-section input-format-section">
      <h3>输入格式</h3>
      <p>{{ problemData.输入格式 }}</p>
    </div>

    <div class="detail-section output-format-section">
      <h3>输出格式</h3>
      <p>{{ problemData.输出格式 }}</p>
    </div>

    <div v-if="problemData.样例" class="detail-section examples-section">
      <h3>样例</h3>
      <div class="example-pair">
        <div class="example">
          <h4>输入样例:</h4>
          <pre>{{ problemData.样例.输入 }}</pre>
        </div>
        <div class="example">
          <h4>输出样例:</h4>
          <pre>{{ problemData.样例.输出 }}</pre>
        </div>
      </div>
      <!-- Add logic here if multiple examples need to be supported -->
    </div>

    <!-- Display original limits in a separate, styled section -->
    <div class="limits-section">
        <h4>限制</h4>
        <div class="limits-grid">
            <div class="limit-box">
                <span class="limit-label">代码长度:</span>
                <span class="limit-value">{{ limits.codeLengthLimit }}</span>
            </div>
            <div class="limit-box">
                <span class="limit-label">时间:</span>
                <span class="limit-value">{{ limits.timeLimit }}</span>
            </div>
            <div class="limit-box">
                <span class="limit-label">内存:</span>
                <span class="limit-value">{{ limits.memoryLimit }}</span>
            </div>
            <div class="limit-box">
                <span class="limit-label">栈:</span>
                <span class="limit-value">{{ limits.stackLimit }}</span>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Example {
  输入: string;
  输出: string;
}

interface ProblemData {
  说明: string;
  输入格式: string;
  输出格式: string;
  样例?: Example; // Make examples optional
}

interface Limits {
  codeLengthLimit: string;
  timeLimit: string;
  memoryLimit: string;
  stackLimit: string;
}

// Define props to accept the structured data and the original limits
defineProps<{
  problemData: ProblemData;
  limits: Limits;
}>();

</script>

<style scoped>
.problem-details-container {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  font-family: sans-serif;
  color: #333;
  margin-bottom: 20px; /* Add margin to separate from other elements */
}

.detail-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.detail-section h3 {
  font-size: 18px;
  color: #1a73e8; /* Use a distinct color for headings */
  margin-bottom: 10px;
}

.detail-section h4 {
    font-size: 16px;
    color: #555;
    margin-bottom: 8px;
}

.detail-section p {
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap; /* Preserve whitespace and newlines */
}

.examples-section .example-pair {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Display input and output side-by-side */
  gap: 20px;
}

.example h4 {
  font-size: 15px;
  color: #444;
  margin-bottom: 5px;
}

.example pre {
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  white-space: pre-wrap; /* Ensure long lines wrap */
  word-wrap: break-word;
  overflow-x: auto; /* Add scrollbar if needed */
}

/* Styles for the limits section */
.limits-section {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #f0f0f0;
}

.limits-section h4 {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
}

.limits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Responsive grid */
    gap: 10px;
}

.limit-box {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    display: flex;
    justify-content: space-between; /* Align label and value */
    align-items: center;
}

.limit-label {
    color: #6c757d; /* Softer color for label */
    margin-right: 8px;
}

.limit-value {
    font-weight: 600;
    color: #343a40; /* Darker color for value */
}

</style> 