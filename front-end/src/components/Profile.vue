<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- 显示头像 -->
      <div class="avatar-container">
        <img :src="userInfo.userProfile || defaultAvatar" alt="头像" class="avatar">
      </div>
      <!-- 用户信息 -->
      <div class="user-info">
        <h2>{{ userInfo.userName }}</h2>
        <p><strong>性别：</strong>{{ userInfo.userSex }}</p>
        <p><strong>手机号：</strong>{{ userInfo.userPhone }}</p>
        <p><strong>邮箱：</strong>{{ userInfo.userEmail }}</p>
        <p><strong>学校：</strong>{{ userInfo.userSchool }}</p>
      </div>
      <!-- 按钮区域 -->
      <RouterLink to="/settings" class="settings-btn">账号设置</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const userInfo = ref({
  userName: '',
  userSex: '',
  userPhone: '',
  userEmail: '',
  userProfile: '',
  userSchool: ''
});
const mapGender = (gender) => {
  const genderNum = Number(gender);
  switch (genderNum) {
    case 0:
      return '女';
    case 1:
      return '男';
    case 2:
      return '未知';
    default:
      return '未知';
  }
};
// 默认头像 URL
const defaultAvatar = 'https://example.com/default-avatar.jpg';

onMounted(() => {
  // 从 localStorage 中获取用户信息
  const loginUser = JSON.parse(localStorage.getItem('loginUser') || '{}');
  userInfo.value = {
    userName: loginUser.userName || '未知',
    userSex: mapGender(loginUser.userSex),
    userPhone: loginUser.userPhone || '未知',
    userEmail: loginUser.userEmail || '未知',
    userProfile: loginUser.userProfile || defaultAvatar,
    userSchool: loginUser.userSchool || '未知'
  };
});
</script>

<style scoped>
/* 整体容器样式 */
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

/* 卡片样式 */
.profile-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  padding: 40px;
  width: 50%; /* 设置卡片宽度为屏幕的一半 */
  height: 50%; /* 设置卡片高度为屏幕的一半 */
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 头像容器样式 */
.avatar-container {
  margin-bottom: 20px;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #3498db;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  object-fit: cover;
}

/* 用户信息样式 */
.user-info h2 {
  margin-bottom: 20px;
  font-size: 28px;
  color: #333;
}

.user-info p {
  margin: 10px 0;
  font-size: 18px;
  color: #666;
}

/* 按钮样式 */
.settings-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 18px;
  transition: background-color 0.3s ease;
}
.settings-btn:hover {
  background-color: #2980b9;
}
</style>