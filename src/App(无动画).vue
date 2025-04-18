<template>
  <div id="app">
    <nav class="navbar" id="body">
      <div class="nav-links">
        <img src="@/pictures/logo.png" alt="Logo" class="navbar-logo">
        <RouterLink to="/" active-class="active">首页</RouterLink>
        <RouterLink to="/questionbank" active-class="active">题库</RouterLink>
        <RouterLink to="/testingrecord" active-class="active">评测记录</RouterLink>
        <RouterLink to="/rank" active-class="active">排名</RouterLink>
      </div>
      <div class="nav-right">
        <div v-if="isLoggedIn">
          <img :src="avatar" alt="Avatar" class="avatar"> 
          <span @click="toggleDropdown" class="username-span">{{ username }}</span>
          <div v-if="isDropdownVisible" class="dropdown">
            <RouterLink to="/profile">个人主页</RouterLink>
            <RouterLink to="/login" @click="logout">退出登录</RouterLink>
          </div>
        </div>
        <div v-else>
          <RouterLink to="/login">登录</RouterLink>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <RouterLink to="/register">注册</RouterLink>
        </div>
      </div>
    </nav>
    <div class="router-view-container">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from 'vue';
import { RouterView, RouterLink, useRouter } from 'vue-router';
import axios from 'axios';

// 定义是否登录的状态
const isLoggedIn = ref(false);
// 定义用户名
const username = ref('');
// 定义用户头像链接
const avatar = ref('');
// 控制下拉框显示隐藏
const isDropdownVisible = ref(false); 
const router = useRouter();

// 更新用户信息的函数
const updateUserInfo = () => {
  const token = localStorage.getItem('token');
  const storedUsername = localStorage.getItem('username');
  const storedAvatar = localStorage.getItem('avatar');
  
  isLoggedIn.value = !!token;
  username.value = storedUsername || '';
  avatar.value = storedAvatar || '';
};

// 处理token过期的函数
const handleTokenExpired = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('avatar');
  updateUserInfo();
  router.push('/login');
};

// 提供这些函数给子组件使用
provide('updateUserInfo', updateUserInfo);
provide('handleTokenExpired', handleTokenExpired);

// 检查token是否有效
const checkTokenValidity = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    updateUserInfo();
    return;
  }

  try {
    const response = await axios.get('/api/checkToken', {
      headers: { Token: token }
    });
    
    if (response.data.errCode === 1006) {
      handleTokenExpired();
    } else {
      updateUserInfo();
    }
  } catch (error) {
    console.error('检查token失败:', error);
    handleTokenExpired();
  }
};

// 切换下拉框显示状态
const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};

// 点击其他地方关闭下拉框
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.dropdown');
  const usernameSpan = document.querySelector('.username-span');
  
  if (dropdown && usernameSpan && 
      !dropdown.contains(event.target) && 
      !usernameSpan.contains(event.target)) {
    isDropdownVisible.value = false;
  }
};

// 退出登录
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('avatar');
  updateUserInfo();
  isDropdownVisible.value = false;
};

onMounted(() => {
  checkTokenValidity();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  overflow: auto;
}

#body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  margin: 0;
  padding: 0;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: 60px;
  background: linear-gradient(90deg, #84caf9, white);
  box-shadow: none;
  border-bottom: none;
}

.router-view-container {
  margin-top: 60px;
  min-height: calc(100vh - 60px);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 4px;
}

.nav-links a {
  color: #f6f5f6;
  text-decoration: none;
  font-size: 1.15rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 2rem;
}

.nav-right a {
  color: #666;
  text-decoration: none;
}

.nav-right.register {
  color: #3498db;
}

.nav-links a.active {
  color: white;
  font-weight: bold;
  text-decoration: none;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 40px;
  right: 10px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.username-span {
  cursor: pointer;
  position: relative;
  top: -5px;
}

.navbar-logo {
  width: 40px;
  height: 40px;
  margin-right: 1rem;
  margin-left: 4rem;
}
</style>