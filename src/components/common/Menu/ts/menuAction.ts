export default interface MenuAction {
  id?: string
  text: string
  value: string
  icon?: string
  action?: () => void
  subMenu?: Array<MenuAction>
  counter?: string
  selected?: boolean
  disabled?: boolean
  inEditMode?: boolean
}
