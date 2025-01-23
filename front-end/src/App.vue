<template>
    <nav class="navbar" id="body">
            <div class="nav-links">
                <RouterLink to="/" active-class="active">首页</RouterLink>
                <RouterLink to="/questionbank" active-class="active">题库</RouterLink>
                <RouterLink to="/testingrecord" active-class="active">评测记录</RouterLink>
                <RouterLink to="/rank" active-class="active">排名</RouterLink>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <RouterLink to="/login">登录</RouterLink>
                <RouterLink to="/register">注册</RouterLink>
            </div>
    </nav>
    <div>
      <RouterView></RouterView>
    </div>
</template>
<script setup lang="ts" name="App">
import {RouterView} from 'vue-router'
import logo from '@/pictures/logo.png'
import {RouterLink} from 'vue-router'
</script>
<style scoped>
#body{
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
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  /* border-radius: 30px;  将导航栏的边框半径设置为一个较大的值，使其呈现圆形效果 
  overflow: hidden; */
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  color: #3498db;
  font-size: 1.5rem;
  text-decoration: none;
  font-weight: bold;
}

.nav-links a {
  color: #666;
  text-decoration: none;
  margin-right: 1rem;
}

.nav-right a {
  color: #666;
  text-decoration: none;
}

.nav-right.register {
  color: #3498db;
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