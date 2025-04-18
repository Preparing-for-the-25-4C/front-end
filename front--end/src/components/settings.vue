<template>
  <div class="body2">
    <br>
    <br>
    <div class="settings-container">
      <button @click="goBack" class="back-btn">返回个人主页</button>
      <h2>账号设置</h2>
      <!-- 返回个人主页按钮 -->
      <!-- 切换模块按钮 -->
      <div class="tab-buttons">
    <span 
      :class="{ active: activeTab === 'password' }" 
      @click="activeTab = 'password'"
    >
      更新密码
    </span>
    <span class="divider">|</span>
    <span 
      :class="{ active: activeTab === 'profile' }" 
      @click="activeTab = 'profile'"
    >
      更新个人信息
    </span>
  </div>

      <!-- 更新密码模块 -->
      <div v-if="activeTab === 'password'">
        <div class="form-group">
          <label>新密码</label>
          <input type="password" v-model="newPassword" placeholder="请输入新密码,长度在8-20个字符之间">
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
            <button 
              @click="sendEmailVerificationCode" 
              class="send-code-btn" 
              :disabled="isCooldown"
            >
              {{ isCooldown ? `${cooldownTime}s后重试` : '发送验证码' }}
            </button>
          </div>
          <p v-if="emailVerificationMessage" class="warning">{{ emailVerificationMessage }}</p>
        </div>
        <button @click="updatePassword" class="update-btn">更新密码</button>
      </div>

      <!-- 更新个人信息模块 -->
      <div v-if="activeTab === 'profile'">
        <div class="form-group">
          <label>性别</label>
          <select v-model="gender">
            <option value="1">男</option>
            <option value="0">女</option>
            <option value="2">未知</option>
          </select>
          <button @click="updateSex" class="update-btn">修改性别</button>
        </div>
        <div class="form-group">
    <label>电话号码</label>
    <input type="text" v-model="phoneNumber" placeholder="请输入电话号码">
    <button @click="updatePhone" class="update-btn">修改电话号码</button>
  </div>
  <div class="form-group">
    <label>学校</label>
    <input type="text" v-model="school" placeholder="请输入学校名称">
    <button @click="updateSchool" class="update-btn">修改学校</button>
  </div>
      </div>
    </div>
  </div>
  <footer class="footer">
    <div class="footer-content">
      <img src="@/pictures/logo.jpg" alt="Logo" class="footer-logo">
      <p>备案号：鲁ICP备2024065791号</p>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const activeTab = ref('password'); // 当前激活的模块
const newPassword = ref('');
const confirmNewPassword = ref('');
const passwordMismatch = ref(false);
const email = ref('');
const emailVerifyCode = ref('');
const emailVerificationMessage = ref('');
const emailVerifyKey = ref('');
const token = ref();
const gender = ref(''); // 性别：0为女，1为男，2为未知
const phoneNumber = ref('');
const school = ref('');
const isCooldown = ref(false); // 冷却状态
const cooldownTime = ref(60); // 冷却时间

onMounted(() => {
  email.value = localStorage.getItem('email');
  token.value = localStorage.getItem('token');
  gender.value = localStorage.getItem('gender') || '2'; // 默认未知
  phoneNumber.value = localStorage.getItem('phoneNumber') || '';
  school.value = localStorage.getItem('school') || '';
});

// 返回到个人主页
const goBack = () => {
  router.push('/profile');
};

const sendEmailVerificationCode = async () => {
  if (isCooldown.value) return;

  try {
    const response = await axios.get(`/api/getEmailCode/${email.value}`);
    if (response.data.errCode === 1000) {
      emailVerificationMessage.value = '验证邮件已发送，请查看您的邮箱。';
      emailVerifyKey.value = response.data.data.emailVerifyKey;
      startCooldown(); // 开始冷却
    } else {
      emailVerificationMessage.value = '发送验证码失败，请重试。';
    }
  } catch (error) {
    console.error('Error sending email verification code:', error);
    emailVerificationMessage.value = '发送验证码失败，请重试。';
  }
};
const updateSchool = async () => {
  if (!school.value || school.value.trim() === '') {
    alert('请输入有效的学校名称');
    return;
  }
  try {
    const response = await axios.put('/api/modifySchool', null, {
      params: { school: school.value },
      headers: { Token: token.value }
    });
    if (response.data.errCode === 1000) {
      alert('学校修改成功');
    } else {
      alert('学校修改失败');
    }
  } catch (error) {
    console.error('Error updating school:', error);
    alert('学校修改失败');
  }
};
const startCooldown = () => {
  isCooldown.value = true;
  cooldownTime.value = 60;

  const interval = setInterval(() => {
    cooldownTime.value -= 1;
    if (cooldownTime.value <= 0) {
      clearInterval(interval);
      isCooldown.value = false;
    }
  }, 1000);
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
      alert('密码更新失败');
    }
  } catch (error) {
    console.error('Error updating password:', error);
    alert('密码更新失败');
  }
};

const updateProfile = async () => {
  try {
    const response = await axios.put('/api/updateProfile', {
      gender: gender.value,
      phoneNumber: phoneNumber.value,
      school: school.value,
      token: token.value
    });
    if (response.data.errCode === 1000) {
      alert('个人信息更新成功');
    } else {
      alert('个人信息更新失败');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('个人信息更新失败');
  }
};

const updateSex = async () => {
  if (!['0', '1', '2'].includes(gender.value)) {
    alert('性别取值无效，请选择正确的性别');
    return;
  }
  try {
    const response = await axios.put('/api/modifySex', null, {
      params: { sex: gender.value },
      headers: { Token: token.value }
    });
    if (response.data.errCode === 1000) {
      alert('性别修改成功');
    } else {
      alert('性别修改失败');
    }
  } catch (error) {
    console.error('Error updating sex:', error);
    alert('性别修改失败');
  }
};
const updatePhone = async () => {
  if (!phoneNumber.value || !/^\d{10,15}$/.test(phoneNumber.value)) {
    alert('请输入有效的电话号码（10到15位数字）');
    return;
  }
  try {
    const response = await axios.put('/api/modifyPhone', null, {
      params: { phone: phoneNumber.value },
      headers: { Token: token.value }
    });
    if (response.data.errCode === 1000) {
      alert('电话号码修改成功');
      // 跳转到个人主页并传递电话号码
    } else {
      alert('电话号码修改失败');
    }
  } catch (error) {
    console.error('Error updating phone:', error);
    alert('电话号码修改失败');
  }
};
</script>

<style scoped>
/* 保留现有样式 */
</style>
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

.tab-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
}

.tab-buttons span {
  padding: 5px 10px;
  cursor: pointer;
  color: #666;
  font-size: 16px;
}

.tab-buttons span.active {
  color: #223c5b;
  font-weight: bold;
}
.tab-buttons .divider {
  color: #ccc;
  cursor: default;
}

.tab-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #95a5a6;
  color: white;
}

.tab-buttons button.active {
  background-color: #3498db;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.captcha-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.update-btn, .send-code-btn {
  display: block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #43638c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.update-btn:hover, .send-code-btn:hover {
  background-color: #43638c;
}

.send-code-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.back-btn {
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #43638c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.back-btn:hover {
  background-color: #7f8c8d;
}

.warning {
  color: red;
  margin-top: 5px;
}
</style>