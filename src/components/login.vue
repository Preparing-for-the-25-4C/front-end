<template>
  <div class="body2">
    <br>
    <br>
    <br>
    <div>
      <!-- 登录表单容器 -->
      <div class="container">
        <div class="form-header">
          <a href="#" class="logo">登录</a>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <input type="text" placeholder="用户名" required v-model="username">
          </div>

          <div class="form-group">
            <input type="password" placeholder="密码" required v-model="password">
          </div>

          <div class="form-group">
            <div class="captcha-group">
              <input type="text" placeholder="右侧图形验证码" required v-model="captchaInput">
              <img :src="captchaImage" @click="refreshCaptcha" alt="图片" class="captcha-image">
            </div>
          </div>

          <button type="submit" class="login-btn">登录</button>

          <div class="forgot-password">
            <RouterLink to="/forgetpwd">忘记密码</RouterLink>
          </div>

          <div class="register-link">
            没有账号？<RouterLink to="/register">注册</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
  <footer class="footer">
  <div class="footer-content">
    <img src="@/pictures/logo.png" alt="Logo" class="footer-logo">
    <p><a href="https://beian.miit.gov.cn/" target="_blank">鲁ICP备2024065791号</a></p>
    
  </div>
</footer>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';
import { RouterLink, useRouter } from 'vue-router';

const captchaImage = ref('');
const captchaToken = ref('');
const username = ref('');
const password = ref('');
const captchaInput = ref('');
const router = useRouter();

// 注入更新用户信息的函数
const updateUserInfo = inject<() => void>('updateUserInfo');

const refreshCaptcha = async () => {
  const response = await axios.get('/api/getCaptcha');
  captchaImage.value = 'data:image/png;base64,' + response.data.data.imgOnBase64;
  captchaToken.value = response.data.data.captchaToken;
};

const handleSubmit = async () => {
  try {
    const response = await axios.post('/api/login', {
      userName: username.value,
      userPassword: password.value,
      captchaText: captchaInput.value,
      captchaToken: captchaToken.value
    });
    if (response.data.errCode === 1000) {
      alert('登录成功');
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('perms', JSON.stringify(response.data.data.perms));
      localStorage.setItem('loginUser', JSON.stringify(response.data.data.loginUser));
      localStorage.setItem('username', response.data.data.loginUser.userName);
      // 存储用户头像信息
      localStorage.setItem('avatar', response.data.data.loginUser.userProfile);
      localStorage.setItem('email', response.data.data.loginUser.userEmail);

      // 调用更新用户信息的函数
      if (updateUserInfo) {
        updateUserInfo();
      }

      // 跳转到首页
      router.push('/');
    } else {
      const errorMessage = response.data.errMsg || '登录失败，请稍后再试';
      alert(errorMessage);
    }
  } catch (error) {
    alert('网络错误，请检查网络连接');
  }
};

onMounted(() => {
  refreshCaptcha();
});
</script>

<style scoped>
.footer {
  background-color: #f5f5f5;
  padding: 1rem 0;
  text-align: center;
  border-top: 1px solid #ddd;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.footer-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-logo {
  width: 40px;
  height: 40px;
}

.footer-content p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}
.body2{
  padding: 40px;
  background-color: rgb(245, 249, 252);
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
  color: #6eb8ea;
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
  color: #6eb8ea;
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
  color: #6eb8ea; /* 设置文本颜色 */
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
  border-color: #6eb8ea;
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
  font-family: monospace;
  font-size: 1.2rem;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 0.75rem;
  background: #6eb8ea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.login-btn:hover {
  background: #6eb8ea;
}

/* 其他链接 */
.forgot-password {
  text-align: center;
  margin-top: 1rem;
}

.forgot-password a {
  color: #6eb8ea;
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
  color: #6eb8ea;
  text-decoration: none;
}
</style>