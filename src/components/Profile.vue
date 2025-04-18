<template>
  <div class="profile-container">
  <div class="profile-card">
    <!-- 显示头像 -->
    <div class="avatar-container">
      <img :src="userInfo.userProfile || defaultAvatar" alt="头像" class="avatar">
      
      <!-- 添加选择头像部分 -->
      <div class="avatar-section">
        <input type="file" id="avatar-upload" class="avatar-upload" @change="handleAvatarChange" accept=".jpg,.jpeg,.png">
        <label for="avatar-upload" class="upload-btn">选择头像</label>
      </div>
      <p v-if="uploadMessage" class="warning">{{ uploadMessage }}</p>
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
  <footer class="footer">
  <div class="footer-content">
    <img src="@/pictures/logo.png" alt="Logo" class="footer-logo">
    <p>备案号：鲁ICP备2024065791号</p>
  </div>
</footer>
</template>

<script setup name="Profile">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const gender = ref('2'); // 默认值为未知

const avatarUrl = ref('https://example.com/default-avatar.jpg'); // 默认头像 URL
const selectedAvatarFile = ref(null);
const uploadMessage = ref('');
const token = ref(localStorage.getItem('token'));

const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (!file) {
    uploadMessage.value = '请选择一个文件';
    return;
  }

  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    uploadMessage.value = '仅支持上传 jpg, jpeg, png 格式的图片';
    return;
  }

  // 上传头像
  const formData = new FormData();
  formData.append('profile', file);

  axios
    .put('/api/modifyProfile', formData, {
      headers: {
        'Token': token.value,
      },
    })
    .then((response) => {
      if (response.data.errCode === 1000) {
        avatarUrl.value = URL.createObjectURL(file); // 更新头像预览
      } 
    })
    .catch((error) => {
      console.error('头像上传失败:', error);
      uploadMessage.value = '头像上传失败，请检查网络连接';
    });
};
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
onMounted(() => {
  // 从路由参数中获取性别值
  gender.value = route.query.gender || '2';

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
  border: 4px solid #c2c0d8;
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
  background-color: #43638c;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 18px;
  transition: background-color 0.3s ease;
}
.settings-btn:hover {
  background-color: #43638c;
}
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.avatar-upload {
  display: none; /* 隐藏文件选择框 */
}

.upload-btn {
  background-color: #43638c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.upload-btn:hover {
  background-color: #2980b9;
}

.warning {
  color: red;
  margin-top: 10px;
}
</style>