document.addEventListener('DOMContentLoaded', () => {
  class CodeBlockController {
      constructor(container) {
          this.container = container;
          this.codeElement = container.querySelector('code');
          this.zoomLevel = 1;
          this.hasZoomed = false;  // 新增放大状态标志
          this.initButtons();
      }

      initButtons() {
          // 绑定按钮事件
          const zoomBtn = this.container.querySelector('[aria-label="放大"]');
          zoomBtn.addEventListener('click', () => this.zoomIn());
          
          this.container.querySelector('[aria-label="复制"]')
              .addEventListener('click', () => this.copyCode());
          
          this.container.querySelector('[aria-label="全屏"]')
              .addEventListener('click', () => this.toggleFullscreen());
      }

      // 修改后的放大功能
      zoomIn() {
          if (this.hasZoomed) {
              this.showToast('已达最大缩放级别');
              return;
          }
          
          this.zoomLevel = 1.2;  // 固定放大到1.2倍
          this.codeElement.style.fontSize = `${this.zoomLevel}em`;
          this.hasZoomed = true;
          
          // 禁用按钮视觉反馈
          const zoomBtn = this.container.querySelector('[aria-label="放大"]');
          zoomBtn.style.opacity = '0.6';
          zoomBtn.style.cursor = 'not-allowed';
      }

      // 保持其他方法不变
      async copyCode() { /* 原有实现 */ }
      toggleFullscreen() { /* 原有实现 */ }
      enterFullscreen() { /* 原有实现 */ }
      exitFullscreen() { /* 原有实现 */ }
      showToast(message) { /* 原有实现 */ }
  }

  // 保持其他代码不变
  document.addEventListener('fullscreenchange', () => { /* 原有实现 */ });
  document.querySelectorAll('.code-block').forEach(container => {
      new CodeBlockController(container);
  });
});