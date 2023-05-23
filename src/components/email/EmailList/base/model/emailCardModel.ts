export default interface EmailCardModel {
  id?: string
  title?: string
  message?: string
  important?: boolean
  read?: boolean
  seen?: boolean
  date?: string
  attachments?: Array<string>
  draft?: boolean
  selfDestruct?: boolean
  schedule?: boolean
  tracked?: boolean
  selected?: boolean
  open?: boolean
  currentlyPrimaryTabOpen?: boolean
  user?: string
  threadId?: string
  subEmails?: Array<EmailCardModel>
  isEmail?: boolean
}
