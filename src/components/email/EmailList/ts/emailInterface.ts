export default interface emailInterface {
  id: string
  headers: {
    subject: string
    from: string
    date: string
  }
  snippet: string
  attachments: string[]
  isSelfDestruct: boolean
  isTracking: boolean
  labels: {
    name: string
  }[]
  message: emailInterface
}
