<template>
  <br>
  <br>
  <br>
  <div class="body">
  <form @submit.prevent="handleSubmit">
    <h2>重置密码</h2>
      <div>
      <input class="kuang2" v-model="email" type="email" id="email" required placeholder="请输入邮箱">
      <button type="submit" class="kuang5">发送</button>
      </div>
      <div v-if="Message3"><font color="red" size="1px">{{ Message3 }}</font></div>
      <br>
  </form>
      <input class="kuang1" v-model="verificationCode" type="text" id="verificationCode" required placeholder="请输入邮箱验证码"><br>
  <form @submit.prevent="handleResetPassword">
      <input v-model="password" type="password" id="password" required placeholder="请输入新密码" class="kuang1"><br>
      <input v-model="confirmPassword" type="password" id="confirmPassword" required placeholder="请确认新密码" class="kuang1"><br>
      <button type="submit" class="kuang4"><font class="font1">重置密码</font></button>
  </form>
    <div v-if="passwordMessage"><font color="red" size="1px">{{ passwordMessage }}</font></div>
  </div>
</template>
<script setup lang="ts" name="Forgetpwd">
import { ref } from 'vue';
import axios from 'axios';
import router from '@/router';
  const email = ref('');
  const Message3 = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const passwordMessage = ref('');
  const verificationCode=ref('')
  let emailVerifyKey=ref('')
  const handleSubmit = async () => {
    if (!isValidEmail(email.value)) {
      Message3.value = '请输入有效的邮箱地址';
      return;
    }
    //interface1
    const response = await axios.post(`/api/getEmailCode/${email}`);
      if (response.data.errCode==1000) {
        Message3.value = '验证邮件已发送，请查看您的邮箱。';
        emailVerifyKey=response.data.data.emailVerifyKey
      } 
      else {
        if(response.data.errCode==1009){
        Message3.value='邮箱已被使用'
        }
        if(response.data.errCode==1001){
          Message3.value='服务器内部错误'
        }
      }
  }

  const handleResetPassword = async () => {
    if (password.value!== confirmPassword.value) {
      passwordMessage.value = '两次输入的密码不一致，请重新输入';
      return;
    }
      //interface2
      const response = await axios.post('/api/modifyPassword', { 
        userEmail: email.value, 
        emailVerifyCode: verificationCode.value,
        newPassword: password.value ,
        emailVerifyKey:emailVerifyKey.value
      });
      if (response.data.errCode==1000) {
        passwordMessage.value = '密码重置成功';
        router.push('/login')
      } else {
        passwordMessage.value = '密码重置失败，请稍后重试';
      }
  }
  const isValidEmail = (email:any) => {
    // 基本的邮箱格式验证正则表达式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
</script>
<style scoped>
.body{
height:650px;
background: rgba(177, 209, 240, 0.28);
display: flex;
flex-direction: column;
align-items: center;
}
form{
display: flex;
flex-direction: column;
align-items: center;
}
.kuang1{
left: 0px;
top: 0px;
width: 300px;
height: 40px;
opacity: 1;
border-radius: 10px;
background: rgba(255, 255, 255, 1);
box-shadow:inset 0px 3px 7px  rgba(34, 24, 21, 0.35);
}
.kuang2{
left: 0px;
top: 0px;
width: 255px;
height: 40px;
opacity: 1;
border-radius: 10px;
background: rgba(255, 255, 255, 1);
box-shadow:inset 0px 3px 7px  rgba(34, 24, 21, 0.35);
}
.kuang4{
left: 0px;
top: 0px;
width: 300px;
height: 40px;
opacity: 1;
border-radius: 10px;
background: rgba(92, 119, 179, 1);
}
.kuang5{
width: 45px;
height: 40px;
}
.font1{
font-size: 20px;
font-weight: 400;
letter-spacing: 0px;
line-height: 26px;
color: rgba(255, 254, 254, 1);
text-align: left;
vertical-align: top;
}
</style>