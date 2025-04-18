export const chatbotConfig = {
  endpoint: "https://webchatbot-sbit-xuyqjjfhim.cn-hangzhou.fcapp.run/chat",
  displayByDefault: false,
  title: '算小助',
  draggable: true,
  aiChatOptions: {
    conversationOptions: {
      conversationStarters: [
        {prompt: '你是谁'},
        {prompt: '如何用JAVA实现A*算法'},
        {prompt: '如何用Python实现Dijkstra算法'},
      ]
    },
    displayOptions: {
      height: 600,
    },
    personaOptions: {
      assistant: {
        name: '你好，我是你的算小助',
        avatar: 'https://img.alicdn.com/imgextra/i2/O1CN01Pda9nq1YDV0mnZ31H_!!6000000003025-54-tps-120-120.apng',
        tagline: '您可以尝试点击下方的快捷入口开启体验！',
      }
    },
    messageOptions: {
      waitTimeBeforeStreamCompletion: 'never'
    }
  },
  dataProcessor: {
    rewritePrompt(prompt) {
      return prompt;
    }
  }
}; 