<template>
  <div class="body2">
  <br>
  <br>
  <br>
  <div>
    <!-- 登录表单容器 -->
    <div class="container">
      <div class="form-header">
        <!-- <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QrdIurZoYoARA5LWsnti4j1bAfAQni.png" alt="洛谷 Logo"> -->
        <a href="#" class="logo">登录</a>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <input type="text" placeholder="用户名或电子邮箱" required>
        </div>

        <div class="form-group">
          <input type="password" placeholder="密码" required>
        </div>

        <div class="form-group">
          <div class="captcha-group">
            <input type="text" placeholder="右侧图形验证码" required>
            <div class="captcha-image">zq8</div>
          </div>
        </div>

        <button type="submit" class="login-btn">登录</button>

        <div class="forgot-password">
          <a href="#">忘记密码</a>
        </div>

        <div class="register-link">
          没有账号？<a href="#">注册</a>
        </div>
      </form>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 处理表单提交的函数
const handleSubmit = () => {
  // 这里添加登录逻辑
  console.log('登录表单提交');
};
</script>
<style scoped>
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
  background-color: #f5f5f5;
  color: #333;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-image: #c5e0f1;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3498db;
  font-size: 1.5rem;
  text-decoration: none;
  font-weight: bold;
}

.logo img {
  height: 30px;
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

.search-icon {
  margin-right: 1rem;
  cursor: pointer;
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

.logo {
  display: inline-block; /* 使元素可以设置宽高，同时保持内联元素的特性 */
  text-transform: uppercase; /* 将文本转换为大写 */
  text-decoration: none; /* 去掉下划线 */
  color: #3498db; /* 设置文本颜色 */
  font-size: 1.5rem; /* 设置字体大小 */
  font-weight: bold; /* 设置字体加粗 */
}

.form-header img {
  width: 120px;
  margin-bottom: 1rem;
}

.form-header p {
  color: #666;
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
  background: #000;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #52ff00;
  font-family: monospace;
  font-size: 1.2rem;
}

/* 登录按钮 */
.login-btn {
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

.login-btn:hover {
  background: #2980b9;
}

/* 其他链接 */
.forgot-password {
  text-align: center;
  margin-top: 1rem;
}

.forgot-password a {
  color: #3498db;
  text-decoration: none;
  font-size: 0.9rem;
}

/* 第三方登录 */
.third-party {
  margin-top: 2rem;
  text-align: center;
}

.third-party p {
  color: #666;
  margin-bottom: 1rem;
}

.third-party-icons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.third-party-icons img {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

/* 注册链接 */
.register-link {
  margin-top: 1rem;
  text-align: center;
  color: #666;
}

.register-link a {
  color: #3498db;
  text-decoration: none;
}
</style>