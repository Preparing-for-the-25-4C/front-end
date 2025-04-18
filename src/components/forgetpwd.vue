<script setup lang="ts" name="Forgetpwd">
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router';

const email = ref('');
const Message3 = ref('');
const password = ref('');
const confirmPassword = ref('');
const passwordMessage = ref('');
const verificationCode = ref('');
let emailVerifyKey = ref('');
const cooldown = ref(0); // 冷却时间

const handleSubmit = async () => {
  if (!isValidEmail(email.value)) {
    Message3.value = '请输入有效的邮箱地址';
    return;
  }
  try {
    const response = await axios.get(`/api/getEmailCode/${email.value}`);
    if (response.data.errCode === 1000) {
      emailVerifyKey.value = response.data.data.emailVerifyKey;
      startCooldown(); // 开始冷却
    } else {
      handleError(response.data.errCode);
    }
  } catch (error) {
    console.error('发送验证码失败:', error);
    Message3.value = '发送验证码失败，请稍后重试。';
  }
};

const startCooldown = () => {
  cooldown.value = 60; // 设置冷却时间为 60 秒
  const interval = setInterval(() => {
    if (cooldown.value > 0) {
      cooldown.value--;
    } else {
      clearInterval(interval); // 倒计时结束，清除计时器
    }
  }, 1000);
};

const handleResetPassword = async () => {
  if (password.value.length < 8 || password.value.length > 20) {
    passwordMessage.value = '密码长度必须为8-20个字符';
    return;
  }
  if (password.value !== confirmPassword.value) {
    passwordMessage.value = '两次输入的密码不一致，请重新输入';
    return;
  }
  try {
    const response = await axios.put('/api/modifyPassword', {
      userEmail: email.value,
      emailVerifyCode: verificationCode.value,
      newPassword: password.value,
      emailVerifyKey: emailVerifyKey.value
    });
    if (response.data.errCode === 1000) {
      passwordMessage.value = '密码重置成功';
      router.push('/login');
    } else {
      handleError(response.data.errCode);
    }
  } catch (error) {
    console.error('重置密码失败:', error);
    passwordMessage.value = '密码重置失败，请稍后重试。';
  }
};

const handleError = (errCode: number) => {
  switch (errCode) {
    case 1001:
      Message3.value = '服务器内部错误';
      break;
    case 1004:
      alert('用户操作太频繁，请稍后再试');
      break;
    case 1009:
      Message3.value = '邮箱已被使用';
      break;
    default:
      Message3.value = '未知错误';
  }
};

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
</script>

<template>
  <div class="body2">
    <br />
    <br />
    <br />
    <div>
      <div class="container">
        <form @submit.prevent="handleSubmit">
          <div class="form-header">
            <a href="#" class="logo">重置密码</a>
          </div>
          <div class="form-group">
            <div class="captcha-group">
              <input
                type="email"
                placeholder="邮箱"
                v-model="email"
                id="email"
                required
              />
              <button
                type="button"
                class="send-code"
                @click="handleSubmit"
                :disabled="cooldown > 0"
              >
                {{ cooldown > 0 ? `${cooldown}秒后重试` : '发送验证码' }}
              </button>
            </div>
            <p v-if="Message3" class="warning">{{ Message3 }}</p>
          </div>
        </form>
        <div class="form-group">
          <input
            v-model="verificationCode"
            type="text"
            id="verificationCode"
            required
            placeholder="请输入邮箱验证码"
          />
        </div>
        <form @submit.prevent="handleResetPassword">
          <div class="form-group">
            <input
              v-model="password"
              type="password"
              id="password"
              required
              placeholder="请输入新密码"
              class="kuang1"
            />
          </div>
          <div class="form-group">
            <input
              v-model="confirmPassword"
              type="password"
              id="confirmPassword"
              required
              placeholder="请确认新密码"
              class="kuang1"
            />
          </div>
          <div>
            <button type="submit" class="login-btn">重置密码</button>
            <p v-if="passwordMessage" class="warning">{{ passwordMessage }}</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.body2 {
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

.warning {
  color: red;
  font-size: 12px;
}

.captcha-group {
  display: flex;
  gap: 0.5rem;
}

.send-code {
  padding: 0 1rem;
  background: #6eb8ea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
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