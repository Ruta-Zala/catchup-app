import User from '@/models/userModel'

export default interface UserAuthModel {
  state: boolean
  user: User
  token?: string
}
