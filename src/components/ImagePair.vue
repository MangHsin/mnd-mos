<template>
    <div class="image-pair-container">
      <div class="image-grid">
        <div class="image-wrapper left-image" @click="$emit('zoom')">
          <div class="aspect-ratio">
            <img :src="leftImage" alt="JND算法" class="image-content">
          </div>
        </div>
        
        <div class="image-wrapper right-image" @click="$emit('zoom')">
          <div class="aspect-ratio">
            <img :src="rightImage" alt="对比算法" class="image-content">
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue'
  // eslint-disable-next-line no-unused-vars
  const props = defineProps({
    leftImage: String,
    rightImage: String,
    leftAlgorithm: String,
    showZoom: {
      type: Boolean,
      default: false
    }
  })
  // eslint-disable-next-line no-unused-vars
  const emit = defineEmits(['zoom'])
  
  const isActiveLeft = ref(false)
  const isActiveRight = ref(false)
  // eslint-disable-next-line no-unused-vars
  const activateLeft = (state) => {
    isActiveLeft.value = state
    if(state) isActiveRight.value = false
  }
  // eslint-disable-next-line no-unused-vars
  const activateRight = (state) => {
    isActiveRight.value = state
    if(state) isActiveLeft.value = false
  }
  </script>
  
  <style scoped>
  .image-pair-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .image-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    width: 100%;
    max-width: 900px;
  }
  
  .image-wrapper {
    overflow: hidden;
    position: relative;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .image-wrapper:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .image-content {
    /* position: absolute; */
    /* width: 100%; */
    /* height: 100%; */
    object-fit: contain;
    display: block;
  }
  
  @media (max-width: 767px) {
    .image-grid {
      grid-template-columns: 1fr;
      max-width: 500px;
    }
    
    .aspect-ratio {
      padding-bottom: 100%; /* 正方形 */
    }
  }
  </style>