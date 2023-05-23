import emailInterface from '@/components/email/EmailList/ts/emailInterface'

export default interface LoadingApiResponse {
  messages: emailInterface[]
  drafts: emailInterface[]
  head: {
    nextToken: string
  }
}
