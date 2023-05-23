<template>
  <div class="email-list">
    <header-email-list
      :email-limit="emailLimit"
      :email-label-to-search="emailLabelToSearch"
      :selected-email-ids="selectedEmailIds"
      :side-bar-menu-selection-menu="sideBarMenuSelectionMenu"
      @changeLabelToSearch="changeLabelToSearch"
      @changeLimit="changeLimit"
      @actionInList="doAction"
    />
    <spinner v-if="initialLoading" />
    <perfect-scrollbar class="email-cards-list">
      <virtual-list
        class="email-cards"
        :data-key="'id'"
        :data-sources="emails"
        :data-component="cardComponent"
        :keeps="howManyElementsInRealDOMInList"
        :estimate-size="150"
        @tobottom="loadEmails(true)"
      >
        <template slot="footer">
          <spinner v-if="loadingAdditionalEmail" class="additional-loader" />
          <p v-if="isInfiniteEnded" class="infinity-ended">There are no more conversations.</p>
        </template>
      </virtual-list>
    </perfect-scrollbar>
  </div>
</template>

<script lang="ts">
import Push from 'push.js'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import VirtualList from 'vue-virtual-scroll-list'

import { ServiceType } from '@/api/apiService'
import MenuAction from '@/components/common/Menu/ts/menuAction'
import Spinner from '@/components/common/Spinner.vue'
import EmailCard from '@/components/email/EmailList/base/EmailCard.vue'
import HeaderEmailList from '@/components/email/EmailList/base/HeaderEmailList.vue'
import EmailCardModel from '@/components/email/EmailList/base/model/emailCardModel'
import LoadingApiResponse from '@/components/email/EmailList/ts/loadingApiInterface'

@Component({
  components: {
    HeaderEmailList,
    EmailCard,
    Spinner,
    VirtualList,
  },
})
export default class EmailList extends Vue {
  @Prop() private sideBarMenuSelectionMenu!: MenuAction

  @Prop() private labelsSelectedSearchString!: string

  @Prop() searchTerms!: Array<string>

  private cardComponent = EmailCard

  private emails: Array<EmailCardModel> = []

  private latestEmail: EmailCardModel | undefined

  private emailLimit = 20

  private emailLabelToSearch = ''

  private emailInterval: string | number = ''

  private initialLoading = false

  private loadingAdditionalEmail = false

  private isRequestBeginExecuted = false

  private isInfiniteEnded = false

  private nextEmailChunkToken: string | null = ''

  get sideBarMenuSelection() {
    return this.sideBarMenuSelectionMenu.value
  }

  mappedSearchTermsForRequest() {
    if (!this.searchTerms || this.searchTerms.length === 0) {
      return ''
    }

    return this.searchTerms
      .map((searchTerm) => `${searchTerm} OR subject:${searchTerm}`)
      .join(' OR ')
  }

  // eslint-disable-next-line max-lines-per-function
  async loadEmails(additional = false) {
    if (this.isRequestBeginExecuted) {
      return
    }

    this.isRequestBeginExecuted = true
    this.isInfiniteEnded = false

    // if we want to load additional BUT we don't have the next token, abort request
    if (additional && !this.nextEmailChunkToken) {
      this.isInfiniteEnded = true

      return
    }

    this.loadingAdditionalEmail = additional

    let loadingURL

    switch (this.sideBarMenuSelection) {
      case 'in:draft':
        // eslint-disable-next-line max-len
        loadingURL = `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/drafts`
        break
      case 'analytics':
        // eslint-disable-next-line max-len
        loadingURL = `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/emails/tracking`
        break
      default:
        // eslint-disable-next-line max-len
        loadingURL = `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/emails`
    }

    const response: LoadingApiResponse | null = await this.$apiService.request(
      ServiceType.Mail,
      loadingURL,
      'GET',
      this.getRequestParams(),
    )

    if (!response) {
      if (additional) {
        this.loadingAdditionalEmail = false
      }

      this.isRequestBeginExecuted = false
      this.isInfiniteEnded = true

      return
    }

    const messageProperty = this.sideBarMenuSelection !== 'in:draft' ? 'messages' : 'drafts'

    /**
     * TODO: move mapping logic from here
     */

    const jsonData = JSON.parse(<string>(<unknown>response))

    const emailIncluded: string[] = []

    // eslint-disable-next-line max-lines-per-function
    jsonData[messageProperty].forEach((email) => {
      const subEmailList: EmailCardModel[] = []

      jsonData[messageProperty].forEach((i) => {
        const isSubEmail = i.threadId === email.threadId

        if (isSubEmail) {
          emailIncluded.push(email.threadId)
          subEmailList.push(this.getFormatedEmailData({ ...i, subEmails: false }, true, false))
        }

        return isSubEmail
      })

      const mailEmail: EmailCardModel | undefined = subEmailList?.pop()

      if (this.emails.some((i) => i.threadId === email.threadId)) {
        return
      }
      this.emails.splice(0, 0, {
        title: mailEmail?.title,
        message: mailEmail?.message,
        important: mailEmail?.important,
        read: mailEmail?.read,
        seen: mailEmail?.seen,
        date: mailEmail?.date,
        attachments: mailEmail?.attachments,
        draft: mailEmail?.draft,
        selfDestruct: mailEmail?.selfDestruct,
        schedule: mailEmail?.schedule,
        tracked: mailEmail?.tracked,
        selected: mailEmail?.selected,
        open: mailEmail?.open,
        currentlyPrimaryTabOpen: mailEmail?.currentlyPrimaryTabOpen,
        user: mailEmail?.user,
        threadId: mailEmail?.threadId,
        id: mailEmail?.id,
        isEmail: true,
        subEmails: subEmailList,
      })
    })

    this.emailLimit = this.emails.length

    const currentOpenedTabs = this.$store.getters.getOpenEmails
    const openEmailFromListPointer: Array<EmailCardModel> = []

    currentOpenedTabs.forEach((openEmail) => {
      const newEmailLoadedOpened = this.emails.find((email) => email.id === openEmail.id)

      // if exists in EmailList, retain pointer
      if (newEmailLoadedOpened) {
        newEmailLoadedOpened.selected = true
        newEmailLoadedOpened.currentlyPrimaryTabOpen = openEmail.currentlyPrimaryTabOpen
        openEmailFromListPointer.push(newEmailLoadedOpened)
      } else {
        openEmailFromListPointer.push(openEmail)
      }
    })

    this.$store.commit('setOpenEmails', openEmailFromListPointer)

    this.nextEmailChunkToken =
      this.sideBarMenuSelection !== 'in:draft' ? jsonData.head.nextToken : null

    if (!this.nextEmailChunkToken || jsonData[messageProperty].length < this.emailLimit) {
      this.isInfiniteEnded = true
    }

    this.isRequestBeginExecuted = false

    if (additional) {
      this.loadingAdditionalEmail = false
    }
  }

  getFormatedEmailData(email, isSubEmail, isEmail) {
    return {
      id: email.id,
      seen: false,
      title:
        this.sideBarMenuSelection !== 'in:draft'
          ? email.headers.subject
          : email.message.headers.subject,
      message: this.sideBarMenuSelection !== 'in:draft' ? email.snippet : email.message.snippet,
      attachments:
        this.sideBarMenuSelection !== 'in:draft' ? email.attachments : email.message.attachments,
      selfDestruct:
        this.sideBarMenuSelection !== 'in:draft'
          ? email.isSelfDestruct
          : email.message.isSelfDestruct,
      tracked:
        this.sideBarMenuSelection !== 'in:draft' ? email.isTracking : email.message.isTracking,
      user:
        this.sideBarMenuSelection !== 'in:draft' ? email.headers.from : email.message.headers.from,
      date:
        this.sideBarMenuSelection !== 'in:draft' ? email.headers.date : email.message.headers.date,
      draft: this.sideBarMenuSelection === 'in:draft',
      important:
        this.sideBarMenuSelection !== 'in:draft'
          ? email.labels.find((label) => label.name.toLowerCase() === 'important') !== null
          : email.message.labels.find((label) => label.name.toLowerCase() === 'important') !== null,
      read:
        this.sideBarMenuSelection !== 'in:draft'
          ? !(email.labels.find((label) => label.name.toLowerCase() === 'unread') !== null)
          : !(email.message.labels.find((label) => label.name.toLowerCase() === 'unread') !== null),
      selected: false,
      open: false,
      currentlyPrimaryTabOpen: false,
      threadId: email.threadId,
      ...(isSubEmail && { subEmails: email.subEmails }),
      isEmail,
      isSubEmail,
    }
  }

  getRequestParams() {
    let requestParams: { limit: number; search?: string; offset?: string } = {
      limit: this.emailLimit,
    }

    const searchValue = this.composedSearchValue()

    if (searchValue) {
      requestParams = { ...requestParams, search: searchValue }
    }

    if (this.nextEmailChunkToken) {
      requestParams = { ...requestParams, offset: this.nextEmailChunkToken }
    }

    return requestParams
  }

  composedSearchValue() {
    let searchValue = this.sideBarLabelToSearch

    if (this.emailLabelToSearch !== '') {
      searchValue +=
        searchValue === '' ? this.emailLabelToSearch : ` AND ${this.emailLabelToSearch}`
    }

    if (this.labelsSelectedSearchString !== '') {
      searchValue +=
        searchValue === ''
          ? this.labelsSelectedSearchString
          : ` AND (${this.labelsSelectedSearchString})`
    }

    const searchTerms = this.mappedSearchTermsForRequest()

    if (searchTerms !== '') {
      searchValue += searchValue === '' ? searchTerms : ` AND (${searchTerms})`
    }

    return searchValue
  }

  async mounted() {
    this.initialLoading = true
    await this.loadEmails()
    this.initialLoading = false
    this.emailInterval = setInterval(() => this.loadEmails(), 10000)
    const newEmailList = this.emails

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const sortByDate = (newEmailList) => {
      const sorter = (a, b) => {
        return new Date(a.date).getDate() - new Date(b.date).getDate()
      }

      newEmailList.reverse(sorter)
    }

    sortByDate(newEmailList)
    this.emails = newEmailList
  }

  async changeLimit(action) {
    this.cleanEmails()

    this.emailLimit = action.text

    this.initialLoading = true
    await this.loadEmails()
    this.initialLoading = false
  }

  async changeLabelToSearch(action) {
    switch (action.value) {
      case 'recent':
        this.emailLabelToSearch = ''
        break
      case 'unread':
        this.emailLabelToSearch = 'label:unread'
        break
      case 'read':
        this.emailLabelToSearch = 'label:read'
        break
      default:
        break
    }
    this.cleanEmails()

    this.initialLoading = true
    await this.loadEmails()
    this.initialLoading = false
  }

  /**
   * TODO: remove email selection handling from store to local state
   * of this component
   */
  // eslint-disable-next-line max-lines-per-function
  doAction(action) {
    switch (action.value) {
      case 'select-all':
        this.emails.forEach((email) => {
          // eslint-disable-next-line
         email.selected = true
        })
        break
      case 'deselect-all':
        this.emails.forEach((email) => {
          // eslint-disable-next-line
          email.selected = false
        })
        break
      case 'set-selected-as-read':
        this.setSelectedAs(true)
        break
      case 'set-selected-as-unread':
        this.setSelectedAs(false)
        break
      case 'move-to-spam':
        this.moveTo('spam')
        break
      case 'move-to-trash':
        this.moveTo('trash')
        break
      case 'restore-from-spam':
        this.restoreFrom('spam')
        break
      case 'restore-from-trash':
        this.restoreFrom('trash')
        break
      case 'empty-trash':
        this.empty('trash')
        break
      case 'empty-spam':
        this.empty('spam')
        break
      default:
        break
    }
  }

  async setSelectedAs(read: boolean) {
    await this.$apiService.request(
      ServiceType.Mail,
      // eslint-disable-next-line max-len
      `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/emails/modify`,
      'POST',
      {
        ids: this.selectedEmailIds,
        addLabelIds: !read ? ['UNREAD'] : [],
        removeLabelIds: read ? ['UNREAD'] : [],
      },
    )

    this.reloadList()
  }

  async moveTo(kind: 'trash' | 'spam') {
    await this.$apiService.request(
      ServiceType.Mail,
      `providers/${this.$store.getters.getProvider}/users/${
        this.$store.getters.getUser.email
      }/emails/${kind === 'trash' ? 'move-to-trash' : 'move-to-spam'}`,
      'POST',
      {
        ids: this.selectedEmailIds,
      },
    )

    this.reloadList()
  }

  async restoreFrom(kind: 'trash' | 'spam') {
    await this.$apiService.request(
      ServiceType.Mail,
      `providers/${this.$store.getters.getProvider}/users/${
        this.$store.getters.getUser.email
      }/emails/${kind === 'trash' ? 'restore-from-trash' : 'restore-from-spam'}`,
      'POST',
      {
        ids: this.selectedEmailIds,
      },
    )

    this.reloadList()
  }

  async empty(kind: 'trash' | 'spam') {
    await this.$apiService.request(
      ServiceType.Mail,
      `providers/${this.$store.getters.getProvider}/users/${
        this.$store.getters.getUser.email
      }/emails/${kind === 'trash' ? 'empty-trash' : 'empty-spam'}`,
      'DELETE',
    )

    this.reloadList()
  }

  cleanEmails() {
    this.isRequestBeginExecuted = false
    this.nextEmailChunkToken = ''
    this.emails = []
  }

  get selectedEmailIds() {
    if (this.emails.length === 0) {
      return []
    }

    return this.emails.filter((email) => email.selected).map((email) => email.id)
  }

  async reloadList() {
    this.cleanEmails()
    this.initialLoading = true
    await this.loadEmails()
    this.initialLoading = false
  }

  get sideBarLabelToSearch() {
    return this.sideBarMenuSelection !== 'email' && this.sideBarMenuSelection !== 'analytics'
      ? `${this.sideBarMenuSelection}`
      : ''
  }

  get howManyElementsInRealDOMInList() {
    return Math.min(this.emailLimit, 50)
  }

  @Watch('searchTerms')
  searchTermsChanged() {
    this.reloadList()
  }

  @Watch('sideBarMenuSelectionMenu', { deep: true })
  sideBarMenuSelectionMenuChange() {
    this.reloadList()
  }

  @Watch('labelsSelectedSearchString')
  labelsSelectedSearchStringChange() {
    this.reloadList()
  }

  @Watch('emailLimit', { deep: true })
  newEmail(newVal, oldVal) {
    if (this.emails.length > oldVal && oldVal !== 0) {
      // eslint-disable-next-line prefer-destructuring
      this.latestEmail = this.emails[0]

      if (this.latestEmail.isEmail) {
        Push.create(`${this.latestEmail.title}`, {
          body: `${this.latestEmail.message}`,
          icon: '/icon.png',
          timeout: 4000,
          onClick() {
            window.focus()
            window.open('https://test.catchup.email/email')
          },
        })
        this.$store.dispatch('addNewOpenEmail', this.latestEmail)
        this.$store.commit('setCurrentlyPrimaryTabOpen', this.latestEmail)
        this.latestEmail.read = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.email-list {
  position: relative;
  min-width: 440px;
  max-width: 440px;
  overflow: hidden;
  flex: 1;
  flex-direction: column;
  height: 100%;

  @include themify {
    background: themed(emailListBackground);
  }

  .email-cards-list {
    max-height: calc(100vh - 120px);
  }

  .email-cards {
    overflow-y: auto;
    align-items: center;
    padding: 0 20px 0 20px;
  }

  .infinity-ended {
    position: relative;
    margin-top: 50px;
    height: 100px;
    text-align: center;
    font-style: italic;
  }
}
</style>

<style lang="scss">
.additional-loader {
  position: relative;
  margin-top: 50px;
  margin-bottom: 100px;
  height: 100px;

  &.icon {
    min-height: unset;
  }
}
</style>
