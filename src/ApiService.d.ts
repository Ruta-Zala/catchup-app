import { Method } from 'axios'

import { ServiceType } from './api/apiService'

type ApiServiceResponse = Record<string, unknown> | string

/**
 * ? Why do we have this
 */
export default interface ApiService {
  request(
    serviceType: ServiceType,
    path: string,
    type: Method,
    data?: Record<string, unknown>,
  ): Promise<ApiServiceResponse>
}
