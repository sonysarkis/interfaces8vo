import { defineStore } from 'pinia'

export const useCarouselStore = defineStore('carousel', {
  state: () => ({
    userImages: [] as string[],
  }),
  actions: {
    addImage(img: string) {
      this.userImages.push(img)
    },
    removeImage(index: number) {
      this.userImages.splice(index, 1)
    },
    clearImages() {
      this.userImages = []
    }
  }
})
