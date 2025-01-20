<template>
    <div class="navigate">
      &nbsp;&nbsp;
      <img :src="logo">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <RouterLink to="/homepage" active-class="active" id="font1">首页</RouterLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <RouterLink to="/questionbank" active-class="active" id="font2">题库</RouterLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <RouterLink to="/testingrecord" active-class="active" id="font3">评测记录</RouterLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <RouterLink to="/rank" active-class="active" id="font4">排名</RouterLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <RouterLink to="/register" id="font5">注册</RouterLink>&nbsp;&nbsp;&nbsp;
      <RouterLink to="/login" id="font6">登录</RouterLink>
    </div>
    <div>
      <RouterView></RouterView>
    </div>
</template>
<script setup lang="ts" name="App">
import {RouterView} from 'vue-router'
import logo from '@/pictures/logo.png'
</script>
<style scoped>
.navigate{
left: 0px;
top: 0px;
width: 1380px;
height: 50px;
opacity: 1;
background: linear-gradient(180deg, rgba(179, 217, 255, 0) 0%, rgba(179, 217, 255, 0.7) 100%);
border: 1px solid rgba(0, 0, 0, 1);
border-radius: 20px;
position: fixed;
}
#font1{
left: 175px;
top: 25px;
width: 72px;
height: 52px;
opacity: 1;
font-size: 20px;
font-weight: 400;
letter-spacing: 0px;
line-height: 51.73px;
color: rgba(0, 0, 0, 1);
text-align: left;
vertical-align: top;
text-decoration: none;
}
#font2{
left: 341px;
top: 25px;
width: 72px;
height: 52px;
opacity: 1;
font-size: 20px;
font-weight: 400;
letter-spacing: 0px;
line-height: 51.73px;
color: rgba(0, 0, 0, 1);
text-align: left;
vertical-align: top;
text-decoration: none;
}
#font3{
left: 496px;
top: 25px;
width: 144px;
height: 52px;
opacity: 1;
font-size: 20px;
font-weight: 400;
letter-spacing: 0px;
line-height: 51.73px;
color: rgba(0, 0, 0, 1);
text-align: left;
vertical-align: top;
text-decoration: none;
}
#font4{
left: 717px;
top: 25px;
width: 72px;
height: 52px;
opacity: 1;
font-size: 20px;
font-weight: 400;
letter-spacing: 0px;
line-height: 51.73px;
color: rgba(0, 0, 0, 1);
text-align: left;
vertical-align: top;
text-decoration: none;
}
#font5{
left: 717px;
top: 25px;
width: 72px;
height: 52px;
opacity: 1;
font-size: 16px;
font-weight: 400;
letter-spacing: 0px;
line-height: 51.73px;
color: rgba(0, 0, 0, 1);
text-align: right;
vertical-align: top;
text-decoration: none;
}
#font6{
left: 717px;
top: 25px;
width: 72px;
height: 52px;
opacity: 1;
font-size: 16px;
font-weight: 400;
letter-spacing: 0px;
line-height: 51.73px;
color: rgba(0, 0, 0, 1);
text-align: left;
vertical-align: top;
text-decoration: none;
}
.active{
text-shadow:0 0 1px black;
}
img{
left: 53px;
padding-top: 0.6%;
width: 30px;
height: 30px;
opacity: 1;
}
</style>