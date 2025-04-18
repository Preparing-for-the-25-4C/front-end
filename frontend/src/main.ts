import {createApp} from 'vue'
import App from './App.vue'
import router from '@/router'
import axios from 'axios';
const app=createApp(App)
app.use(router)
const instance = axios.create({
    baseURL: 'http://120.46.50.140:8088/api', 
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  instance.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
            const token=localStorage.getItem('token')
            const response = await axios.post(`/api/isLogin/${token}` );
            if(response.data.errCode==1006){

            localStorage.removeItem('token');
            alert('Token 已过期，请重新登录');
            router.push('/login');
          }
          return Promise.reject(error);
        }
  );
app.config.globalProperties.$axios = instance;
app.mount('#app')