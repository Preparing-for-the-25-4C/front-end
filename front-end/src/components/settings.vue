<template>
  <div class="body2">
    <br>
    <br>
    <div class="settings-container">
      <h2>账号设置</h2>
      <div class="form-group">
        <label>选择头像</label>
        <input type="file" @change="handleAvatarChange">
        <img v-if="selectedAvatar" :src="selectedAvatar" alt="选择的头像" class="preview-avatar">
        <button @click="updateAvatar" class="update-btn">更新头像</button>
      </div>
      <div class="form-group">
        <label>新密码</label>
        <input type="password" v-model="newPassword" placeholder="请输入新密码">
      </div>
      <div class="form-group">
        <label>确认新密码</label>
        <input type="password" v-model="confirmNewPassword" placeholder="请再次输入新密码">
        <p v-if="passwordMismatch" class="warning">两次输入的密码不一致</p>
      </div>
      <div class="form-group">
        <label>邮箱</label>
        <input type="text" v-model="email" placeholder="邮箱" disabled>
      </div>
      <div class="form-group">
        <label>邮箱验证码</label>
        <div class="captcha-group">
          <input type="text" v-model="emailVerifyCode" placeholder="请输入邮箱验证码" class="short-input">
          <button @click="sendEmailVerificationCode" class="send-code-btn">发送验证码</button>
        </div>
        <p v-if="emailVerificationMessage" class="warning">{{ emailVerificationMessage }}</p>
      </div>
      <button @click="updatePassword" class="update-btn">更新密码</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const selectedAvatarFile = ref(null);
const selectedAvatar = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const passwordMismatch = ref(false);
const email = ref('');
const emailVerifyCode = ref('');
const emailVerificationMessage = ref('');
const emailVerifyKey = ref('');
const token=ref();

onMounted(() => {
  email.value = localStorage.getItem('email');
  token.value = localStorage.getItem('token');
});

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

const updateAvatar = async () => {
  if (!selectedAvatarFile.value) {
    alert('请选择一个头像');
    return;
  }
  const formData = new FormData();
  formData.append('profile', selectedAvatarFile.value);
  try {
    const response = await axios.put('/api/modifyProfile', formData, {
      headers: {
        'Token': token.value
      }
    });
    if (response.data.errCode === 1000) {
      alert('头像更新成功');
    } else {
      if (response.data.errCode === 1001) {
        alert('服务器内部错误');
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
        alert('token过期'); 
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
      else{
        alert('头像更新失败');
      }
    }
  } catch (error) {
    console.error('Error updating avatar:', error);
    alert('头像更新失败');
  }
};

const sendEmailVerificationCode = async () => {
  try {
    const response = await axios.get(`/api/getEmailCode/${email.value}`);
    if (response.data.errCode === 1000) {
      emailVerificationMessage.value = '验证邮件已发送，请查看您的邮箱。';
      emailVerifyKey.value = response.data.data.emailVerifyKey;
    } else {
      if (response.data.errCode === 1009) {
        emailVerificationMessage.value = '邮箱已被使用';
      } else if (response.data.errCode === 1001) {
        emailVerificationMessage.value = '服务器内部错误';
      } else if (response.data.errCode === 1004) {
        emailVerificationMessage.value = '用户操作太频繁，请稍后再试';
      } else {
        emailVerificationMessage.value = '发送验证码失败，请重试。';
      }
    }
  } catch (error) {
    console.error('Error sending email verification code:', error);
    emailVerificationMessage.value = '发送验证码失败，请重试。';
  }
};

const updatePassword = async () => {
  if (newPassword.value !== confirmNewPassword.value) {
    passwordMismatch.value = true;
    return;
  }
  passwordMismatch.value = false;
  try {
    const response = await axios.put('/api/modifyPassword', {
      userEmail: email.value,
      newPassword: newPassword.value,
      emailVerifyKey: emailVerifyKey.value,
      emailVerifyCode: emailVerifyCode.value
    });
    if (response.data.errCode === 1000) {
      alert('密码更新成功');
    } else {
      if (response.data.errCode === 1001) {
        alert('服务器内部错误');
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
        alert('token过期'); 
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
      else{
        alert('密码更新失败');
      }
    }
  } catch (error) {
    console.error('Error updating password:', error);
    alert('密码更新失败');
  }
};
</script>

<style scoped>
.body2 {
  padding: 40px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.settings-container {
  width: 50%;
  margin: auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.captcha-group {
  display: flex;
  gap: 0.5rem;
  align-items: center; /* 确保输入框和按钮垂直对齐 */
}

.captcha-group .short-input {
  flex: 1;
  height: 34px;
  max-width: 500px; /* 调整输入框的最大宽度 */
}

.preview-avatar {
  display: block;
  margin-top: 10px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.update-btn, .send-code-btn {
  display: block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap; /* 确保按钮文字不换行 */
}
.send-code-btn {
  padding: 8px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap; /* 确保按钮文字不换行 */
  margin-top: 0; /* 移除顶部外边距 */
  height: 34px; /* 与输入框高度保持一致 */
}

.update-btn:hover, .send-code-btn:hover {
  background-color: #2980b9;
}

.warning {
  color: red;
  margin-top: 5px;
}
</style>