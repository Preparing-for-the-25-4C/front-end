import axios from 'axios';

export const processData = async (data: any, route: string) => {
  try {
    // 如果是题目界面，添加网页内容
    if (route.includes('/problem/')) {
      const problemContent = document.querySelector('.problem-content')?.innerHTML || '';
      data.problemContent = problemContent;
    }

    const response = await axios.post('/api/process', data);
    return response.data;
  } catch (error) {
    console.error('数据处理失败:', error);
    throw error;
  }
}; 