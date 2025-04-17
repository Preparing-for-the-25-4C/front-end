# 模块及模块的层次结构
以下是src目录下的模块及层次结构：
└─src
    │  App.vue  根组件，存放导航栏信息
    │  main.ts    初始化vue
    │  
    ├─components
    │      forgetpwd.vue 密码重置
    │      homepage.vue 进入首页，包含知识图谱，推荐算法和题单模块
    │      login.vue 登录
    │      Profile.vue 个人主页信息
    │      program.vue 做题界面，可以进行代码的测评
    │      questionbank.vue 展示题库，推荐算法，日历和做题进度
    │      rank.vue 查看用户排名
    │      register.vue 注册
    │      settings.vue 账号设置
    │      testingrecord.vue 查看用户的测评记录
    │      UserProfile.vue 查看其他用户的信息
    │      
    ├─pictures
    │      logo.jpg  网站的logo
    │      
    └─router
            index.ts 存放路由路径信息
# 模块的调用关系
## 路由层面：src/router/index.ts 作为路由配置中心，控制各个组件的加载。
## 数据获取层面：homepage.vue 和 questionbank.vue 组件通过调用 axios 发送请求获取题目数据。
## 导航层面：homepage.vuehomepage.vue、questionbank.vue 中的 goToProblem 方法实现跳转到 program.vue；login.vue 和 forgetpwd.vue 中的路由跳转逻辑用于处理登录和注册成功后的页面导航。
## 交互层面：homepage.vue 中的模态框操作方法控制题单详情模态框的显示和隐藏；settings.vue 通过 activeTab 状态切换显示不同的设置模块。

# 功能模块
## 导航栏布局
导航栏通过 <nav> 元素实现，包含左右两部分：
左侧导航链接：展示应用的主要页面链接，如首页、题库、评测记录和排名。
右侧用户状态显示：根据用户登录状态显示不同内容，登录时显示用户头像、用户名和下拉菜单，未登录时显示登录和注册链接。
## 登录状态管理
使用 ref 定义登录状态、用户名和用户头像链接，并通过 updateUserInfo 函数根据 localStorage 中的 token 更新用户信息。
```
const isLoggedIn = ref(false);
const username = ref('');
const avatar = ref('');

const updateUserInfo = () => {
  const token = localStorage.getItem('token');
  if (token) {
    isLoggedIn
.value = true;
    username
.value = localStorage.getItem('username') || '';
    avatar
.value = localStorage.getItem('avatar') || '';
  } else {
    isLoggedIn
.value = false;
    username
.value = '';
    avatar
.value = '';
  }
};
```
## 处理 Token 过期
handleTokenExpired 函数处理 token 过期情况，清除 localStorage 中的登录信息，更新登录状态并跳转到登录页面。
```
const handleTokenExpired = () => {
  alert('登录已过期，请重新登录！');
  localStorage
.removeItem('token');
  localStorage
.removeItem('username');
  localStorage
.removeItem('avatar');
  isLoggedIn
.value = false;
  router
.push('/login');
};
```
## 退出登录功能
logout 函数实现退出登录逻辑，清除 localStorage 中的登录信息，更新登录状态，隐藏下拉框并跳转到登录页面。
```
const logout = () => {
  localStorage
.removeItem('token');
  localStorage
.removeItem('username');
  localStorage
.removeItem('avatar');
  updateUserInfo();
  isDropdownVisible
.value = false; 
  router
.push('/login');
};
```
## 提供全局函数
使用 provide 函数提供 updateUserInfo 和 handleTokenExpired 函数，以便在其他组件中使用。
```
provide('updateUserInfo', updateUserInfo);
provide('handleTokenExpired', handleTokenExpired);
```
# 模块间接口


## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
