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
        <!-- 返回按钮 -->
        <button @click="goBack" class="back-btn">返回</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const router = useRouter();
  
  const userInfo = ref({
    userProfile: '',
    userName: '',
    userSex: '',
    userPhone: '',
    userEmail: '',
    userSchool: ''
  });
  
  // 默认头像 URL
  const defaultAvatar = 'https://example.com/default-avatar.jpg';
  
  // 返回按钮逻辑
  const goBack = () => {
    router.back();
  };
  
  // 获取用户信息
  onMounted(async () => {
    const userId = route.params.userId;
    try {
      const response = await axios.get(`/api/visitUser/${userId}`);
      if (response.data.errCode === 1000) {
        userInfo.value = {
          userProfile: response.data.data.userProfile || defaultAvatar,
          userName: response.data.data.userName || '未知',
          userSex: mapGender(response.data.data.userSex),
          userPhone: response.data.data.userPhone || '未知',
          userEmail: response.data.data.userEmail || '未知',
          userSchool: response.data.data.userSchool || '未知'
        };
      } else {
        alert('获取用户信息失败');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('获取用户信息失败');
    }
  });
  
  // 性别映射函数
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
  </script>
  
  <style scoped>
  .profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 20px;
  }
  
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
  
  .avatar-container {
    margin-bottom: 20px;
  }
  
  .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 4px solid #3498db;
    object-fit: cover;
  }
  
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
  
  .back-btn {
    margin-top: 20px;
    padding: 12px 24px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    cursor: pointer;
  }
  
  .back-btn:hover {
    background-color: #2980b9;
  }
  </style>