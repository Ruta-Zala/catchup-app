import MenuAction from '@/components/common/Menu/ts/menuAction'

const appRoutes: Array<MenuAction> = [
  {
    text: 'Email',
    icon: 'email',
    value: 'email',
    counter: '20',
  },
  {
    text: 'Analytics',
    icon: 'analytics',
    value: 'analytics',
  },
  {
    text: 'Important',
    icon: 'important',
    value: 'label:important',
  },
  {
    text: 'Social',
    icon: 'help',
    value: 'label:social',
  },
  {
    text: 'Promotions',
    icon: 'promotions',
    value: 'label:promotions',
  },
  {
    text: 'Drats',
    icon: 'draft',
    value: 'in:draft',
  },
  {
    text: 'Sent',
    icon: 'reply2',
    value: 'in:sent',
  },
  {
    text: 'Spam',
    icon: 'spam',
    value: 'in:spam',
  },
  {
    text: 'Trash',
    icon: 'trash',
    value: 'in:trash',
  },
]

export default appRoutes
