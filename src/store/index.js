import { defineStore } from 'pinia'

// 生成唯一会话ID
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const useTrialStore = defineStore('trial', {
  state: () => ({
    totalTrials: 48, // 总试验次数 (6算法 × 8图像)
    completedCount: 0,
    sessionId: null, // 会话ID
    
    currentTrial: {
      id: 1,
      leftAlgorithm: 'PGD',
      leftImage: '',
      rightImage: '',
      algorithmId: 1
    },
    
    // 算法列表 (6个对比算法 + JND)
    algorithms: [
      { id: 1, name: 'PGD', displayName: 'PGD' },
      { id: 2, name: 'MIFGSM', displayName: 'MI-FGSM' },
      { id: 3, name: 'BIM', displayName: 'BIM' },
      { id: 4, name: 'DIFGSM', displayName: 'DI²-FGSM' },
      { id: 5, name: 'JND-MGA', displayName: 'JND-MGA' },
      { id: 6, name: 'MND', displayName: 'MND' },
      { id: 7, name: 'JND', displayName: 'JND (Ours)' }
    ],
    
    // 图片数量 (只需知道有8张图片)
    totalImages: 8,
    
    // API配置 - 适配Vercel部署
    apiBaseUrl: process.env.NODE_ENV === 'production' 
      ? '/api'  // Vercel部署时使用相对路径
      : 'http://localhost:3000/api'
  }),
  
  getters: {
    progressPercentage: (state) => {
      return Math.round((state.completedCount / state.totalTrials) * 100)
    },
    
    currentAlgorithm: (state) => {
      return state.algorithms.find(a => a.id === state.currentTrial.algorithmId)
    }
  },
  
  actions: {
    initializeTrials() {
      this.completedCount = 0
      this.sessionId = generateSessionId() // 生成唯一会话ID
      this.loadNextTrial()
      console.log('会话ID:', this.sessionId)
    },
    
    loadNextTrial() {
      const nextIndex = this.completedCount + 1
      
      // 只循环前6个算法（对比算法）
      const algorithmId = (nextIndex % 6) + 1 // 1-6
      
      // 循环8张图片 (1-8)
      const imageId = ((nextIndex - 1) % this.totalImages) + 1
      
      const algorithm = this.algorithms.find(a => a.id === algorithmId)
      
      this.currentTrial = {
        id: nextIndex,
        leftAlgorithm: algorithm.name,
        leftImage: `/images/JND/p_${imageId}.png`,
        rightImage: `/images/${algorithm.name}/p_${imageId}.png`,
        algorithmId
      }
    },
    
    async submitRating(rating) {
      try {
        // 保存到后端
        const response = await fetch(`${this.apiBaseUrl}/ratings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: this.sessionId,
            trialId: this.currentTrial.id,
            leftAlgorithm: this.currentTrial.leftAlgorithm,
            leftImage: this.currentTrial.leftImage,
            rightImage: this.currentTrial.rightImage,
            rating: rating,
            timestamp: new Date().toISOString()
          })
        })
        
        if (!response.ok) {
          throw new Error('网络请求失败')
        }
        
        const result = await response.json()
        console.log('评分保存成功:', result)
        
        // 更新本地状态
        this.completedCount++
        
        if (this.completedCount < this.totalTrials) {
          this.loadNextTrial()
        } else {
          console.log('所有试验已完成!')
          // 可以在这里添加完成提示或跳转
        }
        
      } catch (error) {
        console.error('保存评分失败:', error)
        // 可以选择重试或显示错误信息
        alert('保存评分失败，请检查网络连接后重试')
      }
    }
  }
})