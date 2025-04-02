<template>
  <nav class="navbar" id="body">
    <div class="nav-links">
      <RouterLink to="/" active-class="active">首页</RouterLink>
      <RouterLink to="/questionbank" active-class="active">题库</RouterLink>
      <RouterLink to="/testingrecord" active-class="active">评测记录</RouterLink>
      <RouterLink to="/rank" active-class="active">排名</RouterLink>
    </div>
    <div class="nav-right">
      <div v-if="isLoggedIn">
        <!-- 显示用户头像 -->
        <img :src="avatar" alt="Avatar" class="avatar"> 
        <!-- 显示用户名 -->
        <span @click="toggleDropdown" class="username-span">{{ username }}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <!-- 下拉框 -->
        <div v-if="isDropdownVisible" class="dropdown">
  <RouterLink to="/profile">个人主页</RouterLink>
  <RouterLink to="/login" @click="logout">退出登录</RouterLink>
</div>
      </div>
      <div v-else>
        <!-- 未登录时显示登录和注册链接 -->
        <RouterLink to="/login">登录</RouterLink>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <RouterLink to="/register">注册</RouterLink>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
    </div>
  </nav>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from 'vue';
import { RouterView, RouterLink, useRouter } from 'vue-router';

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
  if (token) {
    isLoggedIn.value = true;
    username.value = localStorage.getItem('username') || '';
    // Update this line to use the full avatar URL
    avatar.value = localStorage.getItem('avatar') || '';
  } else {
    isLoggedIn.value = false;
    username.value = '';
    avatar.value = '';
  }
};

// 退出登录函数
const logout = () => {
  // 清除 localStorage 中的登录信息
  localStorage.removeItem('token');
  localStorage.removeItem('perms');
  localStorage.removeItem('loginUser');
  localStorage.removeItem('avatar');
  localStorage.removeItem('username');
  // 更新登录状态
  updateUserInfo();
  // 隐藏下拉框
  isDropdownVisible.value = false; 
  // 跳转到登录页面
  router.push('/login');
};

// 切换下拉框显示状态
const toggleDropdown = () => {
  isDropdownVisible.value =!isDropdownVisible.value;
};
// 点击页面其他地方关闭下拉框
const handleClickOutside = (event: MouseEvent) => {
  const dropdown = document.querySelector('.dropdown');
  const usernameElement = document.querySelector('.username-span');
  if (
    isDropdownVisible.value && 
    dropdown && 
    usernameElement && 
    (!dropdown.contains(event.target as Node) &&!usernameElement.contains(event.target as Node))
  ) {
    isDropdownVisible.value = false;
  }
};

onMounted(() => {
  updateUserInfo();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 提供更新用户信息的函数
provide('updateUserInfo', updateUserInfo);
</script>

<style scoped>
#body {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 减少右侧的 padding */
  padding: 1rem 0.5rem; 
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.active {
  text-shadow: 0 0 1px black;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px; /* Add some space between avatar and username */
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 下拉框样式 */
.dropdown {
  position: absolute;
  top: 40px; /* 根据实际情况调整，确保下拉框在用户名下方 */
  right: 10px; /* 根据实际情况调整，确保下拉框位置合适 */
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

/* 用户名样式，添加 cursor: pointer */
.username-span {
  cursor: pointer;
}
</style>