<template>
    <div class="rating-scale">
      <h3 class="title">请评估左侧图像相对于右侧图像的质量差异：</h3>
      
      <div class="slider-container">
        <div class="slider-track">
          <!-- 只有选择后才显示滑块和填充色 -->
          <div 
            v-if="selected !== null"
            class="slider-thumb" 
            :style="{ left: thumbPosition + '%' }"
            @mousedown="startDragging"
            @touchstart="startDragging"
          ></div>
          <div 
            v-if="selected !== null"
            class="slider-fill" 
            :style="{ width: thumbPosition + '%' }"
          ></div>
          
          <!-- 关键值标记 -->
          <div 
            v-for="option in options" 
            :key="option.value"
            class="key-point"
            :style="{ left: getKeyPointPosition(option.value) + '%' }"
            :class="{ 'active': selected === option.value }"
            @click="selectKeyPoint(option.value)"
          >
            <span class="key-label">{{ option.label }}</span>
          </div>
        </div>
        
        <!-- 当前选择的值显示（已移除） -->
        <!-- <div class="current-value" v-if="selected !== null">
          <span class="value-text">{{ getSelectedLabel() }}</span>
        </div> -->
      </div>
      
      <button 
        v-if="showUncertain" 
        class="uncertain-button"
        @click="selectOption(null)">
        无法判断
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits, computed, onUnmounted } from 'vue'
  
  const emit = defineEmits(['select'])
  
  // 定义props
  defineProps({
    showUncertain: {
      type: Boolean,
      default: true
    }
  })
  
  const selected = ref(null)
  const isDragging = ref(false)
  
  const options = [
    { value: 3, label: '左侧远好' },
    { value: 2, label: '左侧较好' },
    { value: 1, label: '左侧稍好' },
    { value: 0, label: '相同' },
    { value: -1, label: '左侧稍差' },
    { value: -2, label: '左侧较差' },
    { value: -3, label: '左侧远差' },
    // { value: -2, label: '左侧较差' },
    // { value: -1, label: '左侧稍差' },
    // { value: 1, label: '左侧稍好' },
    // { value: 2, label: '左侧较好' },
    // { value: 3, label: '左侧远好' }
  ]
  
  // 计算滑块位置
  const thumbPosition = computed(() => {
    if (selected.value === null) return 50 // 默认在中间
    const minValue = -3
    const maxValue = 3
    const range = maxValue - minValue
    const normalizedValue = (selected.value - minValue) / range
    return normalizedValue * 100
  })
  
  // 获取关键点位置
  const getKeyPointPosition = (value) => {
    const minValue = -3
    const maxValue = 3
    const range = maxValue - minValue
    const normalizedValue = (value - minValue) / range
    return normalizedValue * 100
  }
  
  // 选择关键点
  const selectKeyPoint = (value) => {
    selected.value = value
    emit('select', value)
  }
  
  // 选择选项（兼容原有接口）
  const selectOption = (value) => {
    selected.value = value
    emit('select', value)
  }
  
  // 开始拖拽
  const startDragging = () => {
    isDragging.value = true
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDragging)
    document.addEventListener('touchmove', handleDrag)
    document.addEventListener('touchend', stopDragging)
  }
  
  // 处理拖拽
  const handleDrag = (event) => {
    if (!isDragging.value) return
    
    event.preventDefault()
    const slider = event.target.closest('.slider-track') || document.querySelector('.slider-track')
    if (!slider) return
    
    const rect = slider.getBoundingClientRect()
    const clientX = event.clientX || (event.touches && event.touches[0].clientX)
    const position = ((clientX - rect.left) / rect.width) * 100
    
    // 限制在0-100范围内
    const clampedPosition = Math.max(0, Math.min(100, position))
    
    // 找到最近的关键点
    const nearestKeyPoint = findNearestKeyPoint(clampedPosition)
    if (nearestKeyPoint !== selected.value) {
      selected.value = nearestKeyPoint
      emit('select', nearestKeyPoint)
    }
  }
  
  // 停止拖拽
  const stopDragging = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDragging)
    document.removeEventListener('touchmove', handleDrag)
    document.removeEventListener('touchend', stopDragging)
  }
  
  // 找到最近的关键点
  const findNearestKeyPoint = (position) => {
    let nearest = options[0].value
    let minDistance = Math.abs(getKeyPointPosition(options[0].value) - position)
    
    options.forEach(option => {
      const distance = Math.abs(getKeyPointPosition(option.value) - position)
      if (distance < minDistance) {
        minDistance = distance
        nearest = option.value
      }
    })
    
    return nearest
  }
  
  // 组件卸载时清理事件监听器
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDragging)
    document.removeEventListener('touchmove', handleDrag)
    document.removeEventListener('touchend', stopDragging)
  })
  </script>
  
  <style scoped>
  .rating-scale {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .title {
    font-size: 1.125rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .slider-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 0;
  }
  
  .slider-track {
    position: relative;
    width: 100%;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .slider-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #3b82f6;
    border-radius: 4px;
    transition: width 0.2s ease;
  }
  
  .slider-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: #3b82f6;
    border: 3px solid white;
    border-radius: 50%;
    cursor: grab;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: left 0.2s ease;
    z-index: 10;
  }
  
  .slider-thumb:active {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.1);
  }
  
  .key-point {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background-color: #9ca3af;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 5;
  }
  
  .key-point.active {
    background-color: #3b82f6;
    transform: translate(-50%, -50%) scale(1.2);
  }
  
  .key-label {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    color: #6b7280;
    white-space: nowrap;
    text-align: center;
    min-width: 60px;
  }
  
  .key-point.active .key-label {
    color: #3b82f6;
    font-weight: 600;
  }
  
  .current-value {
    display: none;
  }
  
  .value-text {
    display: none;
  }
  
  .uncertain-button {
    margin-top: 1.5rem;
    padding: 0.5rem 1.5rem;
    background-color: #e5e7eb;
    color: #374151;
    border-radius: 0.5rem;
    border: none;
    transition: background-color 0.2s ease;
    cursor: pointer;
  }
  
  .uncertain-button:hover {
    background-color: #d1d5db;
  }
  
  @media (min-width: 768px) {
    .slider-container {
      max-width: 700px;
    }
    
    .key-label {
      font-size: 0.875rem;
      min-width: 80px;
    }
  }
  </style>