import ApiService from '@/api/apiService'

declare module 'vue/types/vue' {
  interface Vue {
    $apiService: ApiService
  }
}
