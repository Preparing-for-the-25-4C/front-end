<template>
  <form @submit.prevent="submitForm" class="body">
    <div class="body2">
      <br>
      <br>
      <br>
      <div>
        <div class="container">
          <div class="form-header">
            <a href="#" class="logo">注册</a>
          </div>
          <div class="form-group">
            <label>用户名</label>
            <input type="text" placeholder="2至10位，建议大小写字母、数字" v-model="username" :class="{'is-invalid': isInvalid}">
            <p v-if="isInvalid" class="warning">用户名长度应在2 - 10个字符之间</p>
            <p v-if="usernameMessage" :class="{'success': usernameMessage === '用户名可用', 'warning': usernameMessage !== '用户名可用'}">
              {{ usernameMessage }}
            </p>
          </div>
          <div class="form-group">
            <label>密码</label>
            <input type="password" placeholder="8 - 20位，建议大小写字母、数字" v-model="password" :class="{'is-invalid': isInvalid1}">
            <p v-if="isInvalid1" class="warning">密码长度应在8 - 20个字符之间</p>
          </div>
          <div class="form-group">
            <label>确认密码</label>
            <input type="password" placeholder="请再输入一遍" v-model="confirmPassword" :class="{'is-invalid': isInvalid2}">
            <p v-if="isInvalid2" class="warning">两次输入的密码不一致</p>
          </div>
          <div class="form-group">
            <label>验证码信息</label>
            <div class="captcha-group">
              <input type="text" placeholder="右侧图形验证码" v-model="captchaInput">
              <img :src="captchaImage" @click="refreshCaptcha" alt="图片" class="captcha-image">
            </div>
          </div>
          <div class="form-group">
            <div class="captcha-group">
              <input type="email" placeholder="邮箱" v-model="email" id="email" required>
              <button 
                type="button" 
                @click="postEmail" 
                class="send-code"
                :disabled="coolDown > 0"
                :class="{ cooling: coolDown > 0 }"
              >
                {{ coolDown > 0 ? `${coolDown}秒后重试` : '发送验证码' }}
              </button>
            </div>
            <p v-if="isInvalid3" class="warning">{{ isInvalid3 }}</p>
          </div>
          <div class="form-group">
            <input v-model="verificationCode" type="text" id="verificationCode" required placeholder="请输入邮箱验证码">
          </div>
          <div>
            <button type="submit" class="register-btn">注册</button>
            <p v-if="Message2" class="warning">{{ Message2 }}</p>
          </div>
          <div class="login-link">
            已有账号？<RouterLink to="/login">登录</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import router from '@/router';
import { RouterLink } from 'vue-router';

const userSex = ref('2');
const userPhone = ref('');
const userSchool = ref('');
const password = ref('');
const isInvalid = ref(false);
const isInvalid1 = ref(false);
const isInvalid2 = ref(false);
const confirmPassword = ref('');
const captchaImage = ref('');
const captchaToken = ref('');
const email = ref('');
const verificationCode = ref('');
const isInvalid3 = ref('');
const emailVerifyKey = ref('');
const captchaInput = ref('');
const Message2 = ref('');
const selectedAvatarFile = ref(null);
const selectedAvatar = ref('');
const username = ref('');
const usernameMessage = ref('');

// 验证码冷却功能
const coolDown = ref(0);
let timer = null;

const postEmail = async () => {
  if (coolDown.value > 0) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    isInvalid3.value = '请输入有效的邮箱地址';
    return;
  }

  try {
    const response = await axios.get(`/api/getEmailCode/${email.value}`);
    if (response.data.errCode === 1000) {
      // 启动冷却计时
      coolDown.value = 60;
      timer = setInterval(() => {
        coolDown.value--;
        if (coolDown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);

      isInvalid3.value = '验证邮件已发送，请查看您的邮箱。';
      emailVerifyKey.value = response.data.data.emailVerifyKey;
    } else {
      if (response.data.errCode === 1009) {
        isInvalid3.value = '邮箱已被使用';
      }
      if (response.data.errCode === 1001) {
        isInvalid3.value = '服务器内部错误';
      }
      if (response.data.errCode === 1004) {
        alert('用户操作太频繁，请稍后再试');
      }
    }
  } catch (error) {
    console.error('发送验证码失败:', error);
    isInvalid3.value = '发送失败，请稍后重试';
  }
};

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const refreshCaptcha = async () => {
  const response = await axios.get('/api/getCaptcha');
  captchaImage.value = 'data:image/png;base64,' + response.data.data.imgOnBase64;
  captchaToken.value = response.data.data.captchaToken;
};

const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedAvatarFile.value = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      selectedAvatar.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

watch(username, async(newValue) => {
  isInvalid.value = newValue.length < 2 || newValue.length > 10;
  if (!isInvalid.value && newValue) {
    try {
      const base64Username = btoa(newValue);
      const response = await axios.get(`/api/nameUsable/${base64Username}`);
      if (response.data.errCode === 1000) {
        usernameMessage.value = '用户名可用';
      } else {
        usernameMessage.value = '用户名已被使用';
      }
    } catch (error) {
      console.error('用户名检测失败:', error);
      usernameMessage.value = '网络错误，请稍后再试';
    }
  } else {
    usernameMessage.value = '';
  }
});

watch(password, (newValue) => {
  isInvalid1.value = newValue.length < 8 || newValue.length > 20;
});

watch(confirmPassword, (newValue) => {
  isInvalid2.value = newValue !== password.value;
});

const submitForm = async () => {
  const formData = new FormData();
  formData.append('userName', username.value);
  formData.append('userPassword', password.value);
  formData.append('captchaText', captchaInput.value);
  formData.append('userEmail', email.value);
  formData.append('emailVerifyCode', verificationCode.value);
  formData.append('emailVerifyKey', emailVerifyKey.value);
  formData.append('captchaToken', captchaToken.value);

  if (userSex.value) {
    formData.append('userSex', Number(userSex.value));
  }
  if (userPhone.value) {
    formData.append('userPhone', userPhone.value);
  }
  if (userSchool.value) {
    formData.append('userSchool', userSchool.value);
  }

  if (selectedAvatarFile.value) {
    formData.append('profile', selectedAvatarFile.value);
  }

  try {
    const response = await axios.post('/api/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.errCode === 1000) {
      alert('注册成功');
      router.push('/login');
    } else {
      if (response.data.errCode === 1004) {
        alert('用户操作太频繁，请稍后再试');
      } else {
        Message2.value = '注册失败，请检查输入';
      }
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
/* 新增发送按钮冷却样式 */
.send-code {
  padding: 0 1rem;
  background: #6eb8ea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  height: 38px;
  white-space: nowrap;
}

.send-code[disabled] {
  background: #cccccc;
  cursor: not-allowed;
}

.send-code.cooling {
  background: #999999;
}

/* 警告信息样式 */
.is-invalid {
  border: 1px solid red;
}

.warning {
  color: red;
  font-size: 12px;
}

.success {
  color: green;
  font-size: 12px;
}

/* 全局样式 */
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
  background-color: rgba(234, 238, 241, 255);
  color: #333;
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
  cursor: pointer;
}

/* 注册按钮 */
.register-btn {
  width: 100%;
  padding: 0.75rem;
  background: #6eb8ea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s;
}

.register-btn:hover {
  background: #5aa7e0;
}

/* 登录链接 */
.login-link {
  margin-top: 1rem;
  text-align: center;
  color: #666;
}

.login-link a {
  color: #6eb8ea;
  text-decoration: none;
}

/* 头像预览样式 */
.preview-avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-top: 10px;
  border-radius: 50%;
}
</style>