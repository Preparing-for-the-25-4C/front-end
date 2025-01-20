<template>
    <br>
    <br>
    <br>
    <form @submit.prevent="submitForm" class="body">
        <h2>欢迎注册</h2>
        <input class="kuang1" v-model="username" placeholder="请输入用户名" minlength="2" maxlength="10">
        <p v-if="!isValidUsername" style="color: red;"><font size="1px">用户名长度必须在2到10位之间</font></p><br>
        <input class="kuang2" v-model="password" type="password" placeholder="请输入密码" minlength="8" maxlength="20">
        <p v-if="!isValidPassword" style="color: red;"><font size="1px">密码长度必须在8到20位之间</font></p><br>
        <input class="kuang3" v-model="confirmPassword" type="password" placeholder="再次输入密码">
        <p v-if="password!== confirmPassword" style="color: red;"><font size="1px">两次输入的密码不一致</font></p><br>
        <div>
        <img :src="captchaImage" @click="refreshCaptcha" alt="图片" class="kuang10"/>
        <button @click="refreshCaptcha" class="kuang8">刷新</button>
        <input class="kuang5" v-model="captchaInput" type="text" id="captcha" required placeholder="请输入图片验证码">
        </div>
        <div v-if="Message1"><font color="red" size="1px">{{ Message1 }}</font></div><br>
        <div>
        <form @submit.prevent="postEmail">
        <div><input class="kuang6" v-model="email" type="email" id="email" required placeholder="请输入邮箱">
        <button type="submit" class="kuang9">发送</button>
        </div>
        <div v-if="Message3"><font color="red" size="1px">{{ Message3 }}</font></div>
        </form><br>
        <input class="kuang1" v-model="verificationCode" type="text" id="verificationCode" required placeholder="请输入邮箱验证码">
        </div>
        <br>
        <button class="kuang4" type="submit"><font class="font1">注册</font></button>
        <div v-if="Message2"><font color="red" size="1px">{{ Message2 }}</font></div>
    </form>
</template>
<script setup lang="ts" name="Register">
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '@/router'
let username = ref('')
let password = ref('')
let confirmPassword = ref('')
let captchaInput = ref('')
let captchaImage = ref('')
let Message1 = ref('')
let email = ref('')
let verificationCode = ref('')
let Message3 = ref('')
let Message2=ref('')
let captchaToken=ref('')
let emailVerifyKey=ref('')
const isValidUsername = computed(() => {
    return username.value.length >= 2 && username.value.length <= 10;
})
const isValidPassword = computed(() => {
    return password.value.length >= 8 && password.value.length <= 20;
})
const refreshCaptcha = async () => {
     // interface1
     const response = await axios.get('/api/getCaptcha');
      captchaImage.value='data:image/png;base64,'+response.data.data.imgOnBase64
      captchaToken.value=response.data.data.captchaToken
      if(response.data.errCode!=1000){
        Message1.value='获取验证码图片失败'
      }
    }
const submitForm = async () => {
    if (!isValidUsername.value) {
        return;
    }
    if (!isValidPassword.value) {
        return;
    }
    if (password.value!== confirmPassword.value) {
        return;
    }
    // interface2
         const response = await axios.post('/api/register', {
          userName:username.value,
          userPassword:password.value,
          captchaText: captchaInput.value,
          userEmail: email.value, 
          emailVerifycode: verificationCode.value,
          emailVerifyKey:emailVerifyKey.value,
          captchaToken:captchaToken.value
        });
        if (response.data.errCode==1000) {
          alert('注册成功');
          router.push('/login')
        } else {
          Message2.value =  '注册失败，请检查输入';
        }
      }
const postEmail = async () => {
        // interface3
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
</script>
<style scoped>
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
width: 300px;
height: 40px;
opacity: 1;
border-radius: 10px;
background: rgba(255, 255, 255, 1);
box-shadow:inset 0px 3px 7px  rgba(34, 24, 21, 0.35);
}
.kuang3{
left: 0px;
top: 0px;
width: 300px;
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
left: 0px;
top: 0px;
width: 150px;
height: 40px;
opacity: 1;
border-radius: 10px;
background: rgba(255, 255, 255, 1);
box-shadow:inset 0px 3px 7px  rgba(34, 24, 21, 0.35);
}
.kuang6{
left: 0px;
top: 0px;
width: 255px;
height: 40px;
opacity: 1;
border-radius: 10px;
background: rgba(255, 255, 255, 1);
box-shadow:inset 0px 3px 7px  rgba(34, 24, 21, 0.35);
}
.kuang7{
left: 0px;
top: 0px;
width: 205px;
height: 20px;
opacity: 1;
border-radius: 10px;
background: rgba(255, 255, 255, 1);
box-shadow:inset 0px 3px 7px  rgba(34, 24, 21, 0.35);
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
form{
display: flex;
flex-direction: column;
align-items: center;
}
.body{
height:700px;
background: rgba(177, 209, 240, 0.28);
}
.kuang8{
width:50px;
height:40px;
}
.kuang9{
width:45px;
height:40px;
}
.kuang10{
width:100px;
height:40px;
vertical-align: middle;
}
</style>