<template>
  <div class="email-read">
    <div class="email-title">
      <icon
        :name="importantIconName"
        width="18px"
        height="18px"
        margin="0"
        @mouseover.native="importantMouseHover(true)"
        @mouseleave.native="importantMouseHover(false)"
        @click.native="setEmailAsImportant"
      />
      <h3>{{ email.title }}</h3>
    </div>
    <div class="email-info">
      <div class="email-info-user">
        <user-state />
        <p>{{ email.user }}</p>
        <tag
          v-if="email.draft"
          class="category-tag"
          text="Draft"
          type="slim"
          font-size="11px"
          text-color="#ffa337"
          background-color="none"
          border="1px solid #ffa337"
          height="20px"
          padding="2px 4px"
          font-weight="500"
        />
        <tag
          v-if="email.selfDestruct"
          class="category-tag"
          themable="true"
          type="slim"
          icon="self-destruct"
          background-color="none"
          border="1px solid #7d9bc3"
          height="20px"
          padding="2px 4px"
          :inverted="email.selected && $store.state.currentTheme.includes('dark')"
        />
        <tag
          v-if="email.schedule"
          class="category-tag"
          themable="true"
          type="slim"
          icon="schedule"
          background-color="none"
          border="1px solid #22aae2"
          height="20px"
          padding="2px 4px"
          :inverted="email.selected && $store.state.currentTheme.includes('dark')"
        />
        <tag
          v-if="email.tracked"
          class="category-tag"
          themable="true"
          type="slim"
          icon="analytics"
          background-color="none"
          border="1px solid #6fcf97"
          height="20px"
          padding="2px 4px"
          :inverted="email.selected && $store.state.currentTheme.includes('dark')"
        />
      </div>
      <aside>{{ formattedDate }}</aside>
    </div>
    <attachments-group
      v-if="email.attachments.length > 0"
      :attachments="email.attachments"
      class="email-attachments"
    />
    <spinner v-if="emailBody === null" />
    <perfect-scrollbar v-show="emailBody !== null" class="email-body">
      <iframe
        ref="iframe"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        width="100%"
        height="100%"
        frameborder="0"
      >
      </iframe>
    </perfect-scrollbar>
    <div class="email-actions" />
    <div v-show="showSubEmail">
      <div
        v-for="(subEmail, index) in email.subEmails"
        :id="subEmail.isSubEmail ? `subEmail-${index}` : ''"
        :key="index"
        class="email-sub-read"
      >
        <div class="email-title">
          <icon
            :name="importantIconName"
            width="18px"
            height="18px"
            margin="0"
            @mouseover.native="importantMouseHover(true)"
            @mouseleave.native="importantMouseHover(false)"
            @click.native="setEmailAsImportant"
          />
          <h3>{{ subEmail.title }}</h3>
        </div>
        <spinner v-if="emailBodySub === null" />
        <perfect-scrollbar v-show="emailBodySub !== null" class="email-body">
          <div :id="[`emailBodySub-${index}`]"></div>
        </perfect-scrollbar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Vue, Watch } from 'vue-property-decorator'

import { ServiceType } from '@/api/apiService'
import AttachmentsGroup from '@/components/attachments/AttachmentsGroup.vue'
import Icon from '@/components/common/Icon.vue'
import Spinner from '@/components/common/Spinner.vue'
import Tag from '@/components/common/Tag.vue'
import UserState from '@/components/common/UserState.vue'
// eslint-disable-next-line import/no-self-import
import subRead from '@/components/email/Tab/EmailTab/EmailRead.vue'
import emailApiInterface from '@/components/email/Tab/EmailTab/ts/emailInterface'

@Component({
  components: {
    Icon,
    Tag,
    UserState,
    Spinner,
    AttachmentsGroup,
    subRead,
  },
})
export default class EmailRead extends Vue {
  private emailBody = ''

  private emailBodySub = ''

  private importantHover = false

  private iFrameElement: HTMLIFrameElement = <HTMLIFrameElement>this.$refs.iframe

  private iFrameElementSub: HTMLIFrameElement = <HTMLIFrameElement>this.$refs.iframeSub

  get email() {
    return this.$store.getters.getCurrentlyPrimaryTabOpen
  }

  get showSubEmail() {
    return this.$store.getters.getShowSubEmail
  }

  async onload(doc) {
    // Open links in new page
    // eslint-disable-next-line no-undef
    const links: HTMLCollectionOf<HTMLAnchorElement> = doc.body.getElementsByTagName('a')

    for (let index = 0; index < links.length; index += 1) {
      links[index]!.target = '_blank'
    }

    // eslint-disable-next-line no-undef
    this.iFrameElement.style.height = `${doc.body.scrollHeight}px`
    this.iFrameElementSub.style.height = `${doc.body.scrollHeight}px`
  }

  async mounted() {
    await this.loadBody()
  }

  @Watch('email', { deep: true })
  async emailChanged() {
    await this.loadBody()
  }

  // eslint-disable-next-line max-lines-per-function
  async loadBody() {
    /**
     * TODO: remove duplication with src/components/email/Tab/EmailTab.vue
     */
    const entityEndpoint = this.email.draft ? 'drafts' : 'emails'
    const params = `${this.$store.getters.getUser.email}/${entityEndpoint}/${this.email.id}`

    const responseEmail: emailApiInterface | null = await this.$apiService.request(
      ServiceType.Mail,
      `providers/${this.$store.getters.getProvider}/users/${params}`,
      'GET',
    )
    const response = JSON.parse(<string>(<unknown>responseEmail))

    if (!response) {
      return
    }

    this.emailBody = this.email.draft ? response!.draft.message.body : response!.message.body
    const iFrameElement: null | HTMLIFrameElement = <HTMLIFrameElement>this.$refs.iframe
    const doc = iFrameElement!.contentWindow!.document

    doc.open()
    doc.write(this.emailBody)
    doc.close()
    iFrameElement.style.height = `${doc.body.scrollHeight}px`
    iFrameElement.onload = this.onload
    if (this.email.subEmails.length > 0) {
      for (let i = 0; i < this.email.subEmails.length; i += 1) {
        // eslint-disable-next-line max-len
        const paramsSub = `${this.$store.getters.getUser.email}/${entityEndpoint}/${this.email.subEmails[i].id}`

        // eslint-disable-next-line no-await-in-loop
        const responseEmailSub: emailApiInterface | null = await this.$apiService.request(
          ServiceType.Mail,
          `providers/${this.$store.getters.getProvider}/users/${paramsSub}`,
          'GET',
        )

        const responseSub = JSON.parse(<string>(<unknown>responseEmailSub))

        this.emailBodySub = responseSub!.message.body

        const myVar = `emailBodySub-${i}`
        const emailContentBody = document.getElementById(myVar)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        emailContentBody!.innerHTML = this.emailBodySub
      }
    }
  }

  /**
   * ? Should proably put in mixin or some utility function,
   * assuming it may be used in more than one place
   */
  get formattedDate() {
    return moment(this.email.date, 'DD-MM-YYYY HH:mm').format('ddd DD. MMMM YYYY | HH:mm')
  }

  /**
   * TODO: this series of functions are repeated from EmailCard, we need to centralize them
   */
  importantMouseHover(hover) {
    this.importantHover = hover
  }

  async setEmailAsImportant() {
    const response: string | null = await this.$apiService.request(
      ServiceType.Mail,
      // eslint-disable-next-line max-len
      `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/emails/modify`,
      'POST',
      {
        ids: [this.email.id],
        addLabelIds: !this.email.important ? ['IMPORTANT'] : [], // TODO: change the way labels are handled

        removeLabelIds: this.email.important ? ['IMPORTANT'] : [],
      },
    )

    if (response) {
      this.email.important = !this.email.important
    }
  }

  get importantIconName() {
    return this.email.important || this.importantHover ? 'important-yellow' : 'important'
  }
}
</script>

<style lang="scss" scoped>
.email-read {
  display: block;
  position: relative;
  height: calc(100% - 120px);
  overflow: auto;
  padding: 20px;
  background: #fff;
  color: #445576;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #aaa;
    border-radius: 6px;
  }
  .email-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    border-bottom: 1px solid #e2e9f9;
    padding-bottom: 15px;

    h3 {
      font-weight: 700;
      margin-left: 6px;
    }
  }

  .email-info {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    justify-content: space-between;

    .email-info-user {
      display: flex;
      align-items: center;
      font-weight: 500;
    }

    p {
      font-weight: 700;
      margin-left: 6px;
    }
  }

  .ps {
    margin-top: 20px;
    max-height: calc(100vh - 300px);
  }

  .email-attachments {
    margin-top: 20px;
  }

  .email-sub-read {
    margin-top: 20px;
  }
}
</style>
