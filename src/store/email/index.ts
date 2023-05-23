const initialState = () => ({
  openEmails: [],
  emailContent: '',
  emailSubject: '',
  emailFiles: {
    name: '',
    size: '',
    type: '',
  },
  emailList: {
    emailListTo: [],
    emailListBcc: [],
    emailListCc: [],
  },
  showSubEmail: false,
})

const getters = {
  getOpenEmails(state) {
    return state.openEmails
  },
  getCurrentlyPrimaryTabOpen(state) {
    return state.openEmails.find((email) => email.currentlyPrimaryTabOpen === true)
  },
  getEmailContent(state) {
    return state.emailContent
  },
  getShowSubEmail(state) {
    return state.showSubEmail
  },
  getEmailSubject(state) {
    return state.emailSubject
  },
  getEmailFiles(state) {
    return state.emailFiles
  },
  getEmailList(state) {
    return state.emailList
  },
}

/**
 * TODO: remove mutating args all over the app
 *
 * See #1 for the reference
 */
const actions = {
  addNewOpenEmail(store, openEmailsToAdd) {
    store.commit('addOpenEmail', openEmailsToAdd)
    store.commit('setCurrentlyPrimaryTabOpen', openEmailsToAdd)
  },
  closeEmail(store, emailToRemove) {
    // eslint-disable-next-line
    emailToRemove.selected = false // #1

    if (!emailToRemove.currentlyPrimaryTabOpen) {
      store.commit(
        'setOpenEmails',
        store.getters.getOpenEmails.filter((email) => email.id !== emailToRemove.id),
      )

      return
    }

    let currentSelectedEmailIndex = store.getters.getOpenEmails.indexOf(emailToRemove)

    if (currentSelectedEmailIndex === 0) {
      currentSelectedEmailIndex = 1
    }

    store.commit(
      'setOpenEmails',
      store.getters.getOpenEmails.filter((email) => email.id !== emailToRemove.id),
    )
    store.commit(
      'setCurrentlyPrimaryTabOpen',
      store.getters.getOpenEmails[currentSelectedEmailIndex - 1],
    )
  },
}

const mutations = {
  setOpenEmails(state, openEmails) {
    state.openEmails = openEmails
  },
  addOpenEmail(state, openEmailsToAdd) {
    state.openEmails.push({ ...openEmailsToAdd, selected: true })
  },
  removeOpenEmail(state, emailToRemove) {
    state.openEmails = state.openEmails.filter(({ id }) => id !== emailToRemove.id)
  },
  setCurrentlyPrimaryTabOpen(state, currentlyPrimaryTabOpen) {
    if (!currentlyPrimaryTabOpen) {
      return
    }

    state.openEmails = state.openEmails.map((email) => ({
      ...email,
      currentlyPrimaryTabOpen: email.id === currentlyPrimaryTabOpen.id,
    }))
  },
  resetOpenEmail(state) {
    state.openEmails = []
  },
  editorContent(state, emailContent) {
    state.emailContent = emailContent
  },
  emailSubject(state, subject) {
    state.emailSubject = subject
  },
  emailFiles(state, files) {
    state.emailFiles = files
  },
  emailList(state, list) {
    state.emailList = list
  },
  showSubEmailContainer(state) {
    state.showSubEmail = !state.showSubEmail
  },
}

export default {
  state: initialState,
  getters,
  actions,
  mutations,
}
