import { defineStore } from 'pinia'

export const useVideoCarouselStore = defineStore('videoCarousel', {
  state: () => ({
    userVideos: [] as any[],
  }),
  actions: {
    addVideo(video: any) {
      this.userVideos.push(video)
    },
    removeVideo(index: number) {
      this.userVideos.splice(index, 1)
    },
    clearVideos() {
      this.userVideos = []
    }
  }
})
