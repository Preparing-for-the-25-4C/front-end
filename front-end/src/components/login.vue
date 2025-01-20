<template>
    <br>
    <br>
    <br>
    <form @submit.prevent="login" class="body">
    <h2>欢迎登录</h2>
    <input class="kuang1" v-model="username" placeholder="请输入用户名"><br>
    <input class="kuang2" v-model="password" type="password" placeholder="请输入密码"><br>
    <div>
    <img :src="captchaImage" @click="refreshCaptcha" alt="图片" class="kuang7"/>
    <button @click="refreshCaptcha" class="kuang6">刷新</button>
    <input class="kuang5" v-model="captchaInput" type="text" id="captcha" required placeholder="请输入图片验证码">
    </div>
    <div v-if="Message1"><font color="red" size="1px">{{ Message1 }}</font></div><br>
    <button class="kuang4" type="submit"><font class="font1">登录</font></button>
    <div v-if="Message"><font color="red" size="1px">{{ Message }}</font></div>
    <br>
    <font size="1px"><RouterLink to="/forgetpwd">忘记密码</RouterLink></font>
    </form>
</template>
<script setup lang="ts" name="Login">
import { ref} from 'vue'
import axios from 'axios'
import { RouterLink } from 'vue-router'
import router from '@/router'
const username = ref('')
const password = ref('')
const Message=ref('')
const captchaInput=ref('')
const captchaImage=ref('')
const Message1=ref('')
const captchaToken=ref('')
const login = async () => {
    //interface1
        const response = await axios.post('/api/login', {
           userName: username.value,
           userPassword: password.value,
           captchaText: captchaInput.value,
           captchaToken:captchaToken.value 
          });
        if (response.data.errCode==1000) {
          alert('登录成功');
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('perms', JSON.stringify(response.data.data.perms));
          localStorage.setItem('loginUser', response.data.data.loginUser);
          router.push('/homepage')
        } else {
          Message.value ='登录失败失败，请检查输入';
        }
    }
const refreshCaptcha = async () => {
      // interface2
      const response = await axios.get('/api/getCaptcha');
      captchaImage.value='data:image/png;base64,'+response.data.data.imgOnBase64
      captchaToken.value=response.data.data.captchaToken
      if(response.data.errCode!=1000){
        Message1.value='获取验证码图片失败'
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
.body{
height:650px;
background: rgba(177, 209, 240, 0.28);
}
form{
display: flex;
flex-direction: column;
align-items: center;
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
.kuang6{
width:50px;
height:40px;
}
.kuang7{
width:100px;
height:40px;
vertical-align: middle;
}
</style>