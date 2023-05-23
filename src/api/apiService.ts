import axios, { AxiosInstance, Method } from 'axios'
import humps from 'humps'
import _Vue from 'vue'

/**
 * TODO: remove store dependency from here
 *
 * TODO: apply comprehensive refactoring
 */
import router from '@/router'
import store from '@/store'

export const enum ServiceType {
  Identity = 'identity',
  Mail = 'email',
}

const getCurrectServiceEndpoint = (serviceType: ServiceType) => {
  switch (serviceType) {
    case ServiceType.Identity: {
      const { VUE_APP_API_IDENTITY_ENDPOINT, VUE_APP_API_IDENTITY_VERSION } = process.env

      return `${VUE_APP_API_IDENTITY_ENDPOINT}/${VUE_APP_API_IDENTITY_VERSION}/`
    }
    case ServiceType.Mail: {
      const { VUE_APP_API_MAIL_ENDPOINT, VUE_APP_API_MAIL_VERSION } = process.env

      return `${VUE_APP_API_MAIL_ENDPOINT}/${VUE_APP_API_MAIL_VERSION}/`
    }

    default:
      throw new Error('Provided service type is not specified')
  }
}

export default class ApiService {
  private readonly axiosInstance: AxiosInstance

  private readonly baseUrl: string

  constructor() {
    this.baseUrl = process.env.VUE_APP_API_URL
    this.axiosInstance = axios.create({
      transformResponse: [(data) => humps.camelizeKeys(data)],
      responseType: 'json',
      timeout: 30000,
      validateStatus: (status) => {
        if (status === 401 || status === 403) {
          store.commit('setAuthStatus', false)
          store.commit('resetToken')

          if (router.currentRoute.name !== 'Login') {
            router.push('login')
          }

          return false
        }

        return true
      },
    })
  }

  // eslint-disable-next-line max-lines-per-function
  public async request<GetType, SendType>(
    serviceType: ServiceType,
    path: string,
    type: Method,
    data?: SendType,
  ): Promise<GetType | null> {
    let apiResponse: GetType | null = null

    const dataToSend = type !== 'GET' ? { data } : { params: data }
    const currentToken = store.getters.getCurrentToken
    const microServiceUrl = this.baseUrl.replace('{microservice}', serviceType)

    const request = {
      headers: {
        Authorization: currentToken ? `Bearer ${currentToken}` : '',
        'Content-Type': 'application/json',
      },
      method: type,
      url: `${microServiceUrl}${getCurrectServiceEndpoint(serviceType)}${path}`,
      ...dataToSend,
    }

    try {
      const response = await this.axiosInstance.request(request)

      if (response.status >= 200 && response.status < 400) {
        apiResponse = response.data as GetType
      }
    } catch (err) {
      // log...
    }

    return apiResponse
  }
}

export const apiServicePlugin = {
  install: (Vue: typeof _Vue): void => {
    Vue.prototype.$apiService = new ApiService()
  },
}
