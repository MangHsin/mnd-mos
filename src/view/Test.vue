<template>
    <div class="test-container">
      <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-info">
          <span>已完成: {{ trialStore.completedCount }}/{{ trialStore.totalTrials }}</span>
          <span>剩余: {{ trialStore.totalTrials - trialStore.completedCount }}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
  
      <div class="header">
        <h2>图像质量对比评估</h2>
        <p>算法: Ours vs {{ trialStore.currentTrial.leftAlgorithm }}</p>
      </div>
      
      <!-- 图像对比 -->
      <ImagePair 
        :left-image="currentTrial.leftImage"
        :right-image="currentTrial.rightImage"
        :left-algorithm="currentTrial.leftAlgorithm"
        :show-zoom="true"
        @zoom="showZoomModal = true"
      />
      
      <!-- 评分控件 -->
      <RatingScale 
        class="rating-scale"
        @select="handleRatingSelect"
      />
      
      <!-- 工具条 -->
      <div class="toolbar">
        <button @click="toggleLabels">
          <span class="icon"></span>
          {{ showLabels ? '隐藏标签' : '显示标签' }}
        </button>
        <button @click="toggleGrayscale">
          <span class="icon"></span>
          {{ grayscale ? '彩色模式' : '灰度模式' }}
        </button>
        <button @click="showZoomModal = true">
          <span class="icon"></span>
          放大对比
        </button>
      </div>
      
      <!-- 休息提醒 -->
      <div v-if="showBreak" class="break-modal">
        <div class="break-content">
          <h3>休息一下</h3>
          <p>
            您已完成 {{ trialStore.completedCount }} 组评估，请休息 {{ breakDuration }} 秒再继续
          </p>
          <div class="countdown">{{ countdown }}</div>
          <button v-if="countdown === 0" @click="showBreak = false">
            继续评估
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref, onMounted } from 'vue'
  import { useTrialStore } from '@/store'
  import ImagePair from '@/components/ImagePair.vue'
  import RatingScale from '@/components/RatingScale.vue'
  
  const trialStore = useTrialStore()
  const showLabels = ref(true)
  const grayscale = ref(false)
  const showZoomModal = ref(false)
  const showBreak = ref(false)
  const countdown = ref(30)
  const breakDuration = 30
  
  // 计算进度
  const progressPercentage = computed(() => {
    return (trialStore.completedCount / trialStore.totalTrials) * 100
  })
  
  // 获取当前任务
  const currentTrial = computed(() => {
    return trialStore.currentTrial
  })
  
  // 处理评分选择
  const handleRatingSelect = (rating) => {
    trialStore.submitRating(rating)
    
    // 每10组休息一次
    if (trialStore.completedCount > 0 && trialStore.completedCount % 8 === 0) {
      startBreak()
    }
  }
  
  // 开始休息倒计时
  const startBreak = () => {
    showBreak.value = true
    countdown.value = breakDuration
    const timer = setInterval(() => {
      countdown.value -= 1
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
  
  // 切换标签显示
  const toggleLabels = () => {
    showLabels.value = !showLabels.value
  }
  
  // 切换灰度模式
  const toggleGrayscale = () => {
    grayscale.value = !grayscale.value
    document.documentElement.classList.toggle('grayscale', grayscale.value)
  }
  
  onMounted(() => {
    trialStore.initializeTrials()
  })
  </script>
  
  <style scoped>
  /* 基础容器样式 */
  .test-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  /* 进度条容器 */
  .progress-container {
    margin-bottom: 30px;
  }
  
  .progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .progress-bar {
    height: 16px;
    background-color: #e5e7eb;
    border-radius: 9999px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #3b82f6;
    transition: width 0.5s ease;
  }
  
  /* 头部样式 */
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .header h2 {
    font-size: 28px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 10px;
  }
  
  .header p {
    font-size: 16px;
    color: #666;
  }
  
  /* 评分控件 */
  .rating-scale {
    margin-top: 30px;
  }
  
  /* 工具条 */
  .toolbar {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
  }
  
  .toolbar button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: #f3f4f6;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .toolbar button:hover {
    background-color: #e5e7eb;
  }
  
  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #666;
  }
  
  /* 休息提醒模态框 */
  .break-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }
  
  .break-content {
    background-color: white;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    max-width: 500px;
    width: 100%;
  }
  
  .break-content h3 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .break-content p {
    color: #666;
    margin-bottom: 20px;
  }
  
  .countdown {
    font-size: 36px;
    font-family: monospace;
    font-weight: bold;
  }
  
  .break-content button {
    margin-top: 20px;
    padding: 12px 24px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .break-content button:hover {
    background-color: #2563eb;
  }
  
  /* 全局灰度模式 */
  .grayscale {
    filter: grayscale(100%);
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .toolbar {
      flex-direction: column;
      gap: 10px;
    }
    
    .test-container {
      padding: 15px;
    }
    
    .header h2 {
      font-size: 24px;
    }
  }
  </style>