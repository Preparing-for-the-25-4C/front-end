<template>
  <div class="body2">
  <br>
  <br>
  <br>
  <div>
    <!-- 注册表单容器 -->
    <div class="container">
      <div class="form-header">
        <a href="#" class="logo">注册</a>
      </div>
      <form>
        <div class="form-group">
          <label>用户名</label>
          <input type="text" placeholder="6至16位，建议大小写字母、数字">
        </div>

        <div class="form-group">
          <label>密码</label>
          <input type="password" placeholder="密码">
        </div>

        <div class="form-group">
          <label>确认密码</label>
          <input type="password" placeholder="请再输入一遍">
        </div>

        <div class="form-group">
          <label>验证码信息</label>
          <div class="captcha-group">
            <input type="text" placeholder="右侧图形验证码">
            <div class="captcha-image">\m4j</div>
          </div>
        </div>

        <div class="form-group">
          <div class="captcha-group">
            <input type="text" placeholder="邮箱">
            <button type="button" class="send-code">发送验证码</button>
          </div>
        </div>

        <div class="form-group">
          <input type="text" placeholder="6位数字验证码">
        </div>

        <button type="submit" class="register-btn">注册</button>

        <div class="agreement">
          <label>
            <input type="checkbox"> 同意
            <a href="#">《用户协议》</a>
          </label>
        </div>

        <div class="login-link">
          已有账号？<a href="#">登录</a>
        </div>
      </form>
    </div>
  </div>
  </div>
</template>

<script setup>
// 这里可以添加组件的逻辑代码，例如处理表单提交等
// 标签切换功能
import { onMounted } from 'vue';

onMounted(() => {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelector('.tab.active').classList.remove('active');
      tab.classList.add('active');
    });
  });
});
</script>

<style scoped>
/* 全局样式重置 */
.body2{
  padding: 40px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: rgba(234, 238, 241, 255); /* 设置页面背景颜色 */
  color: #333;
  /* 图片背景 */
  /* background-image: url('注册.jpg');
  background-size: cover;
  background-repeat: no-repeat; */
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  color: #3498db;
  font-size: 1.5rem;
  text-decoration: none;
  font-weight: bold;
}

.nav-links a {
  color: #666;
  text-decoration: none;
  margin-right: 1rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-right a {
  color: #666;
  text-decoration: none;
}

.nav-right.register {
  color: #3498db;
}

/* 主要内容区域 */
.container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header img {
  width: 120px;
  margin-bottom: 1rem;
}

.form-header p {
  color: #666;
}

/* 表单标签页 */
.tabs {
  display: flex;
  border-bottom: 2px solid #eee;
  margin-bottom: 1.5rem;
}

.tab {
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #666;
}

.tab.active {
  color: #3498db;
  border-bottom: 2px solid #3498db;
  margin-bottom: -2px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

/* 验证码区域 */
.captcha-group {
  display: flex;
  gap: 0.5rem;
}

.captcha-group input {
  flex: 1;
}

.captcha-image {
  width: 100px;
  height: 38px;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.send-code {
  padding: 0 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  padding: 0.75rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.register-btn:hover {
  background: #2980b9;
}

/* 协议同意 */
.agreement {
  margin-top: 1rem;
  text-align: center;
  color: #666;
}

.agreement a {
  color: #3498db;
  text-decoration: none;
}

/* 登录链接 */
.login-link {
  margin-top: 1rem;
  text-align: center;
  color: #666;
}

.login-link a {
  color: #3498db;
  text-decoration: none;
}
</style>