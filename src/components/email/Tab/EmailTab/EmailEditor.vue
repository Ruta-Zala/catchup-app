<template>
  <div class="email-editor">
    <perfect-scrollbar class="email-body">
      <!-- <trumbowyg v-model="content" name="content" :config="config" /> -->
    </perfect-scrollbar>
    <app-button
      text="Send"
      type="primary"
      hover-shadow="true"
      icon="reply2-white"
      icon-width="24px"
      icon-height="24px"
      font-size="100%"
      height="55px"
      width="100px"
      style="
        position: fixed;
        right: 20px;
        bottom: 5px;
        justify-content: space-evenly;
        z-index: 9999;
      "
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
// import Trumbowyg from 'vue-trumbowyg'

// Import editor css
// import 'trumbowyg/dist/ui/trumbowyg.css'
import { ServiceType } from '@/api/apiService'
import Button from '@/components/common/Button.vue'
import emailApiInterface from '@/components/email/Tab/EmailTab/ts/emailInterface'

@Component({
  components: {
    // Trumbowyg,
    'app-button': Button,
  },
})
export default class EmailEditor extends Vue {
  private content = ''

  private editorConfig = {
    btns: [
      ['undo', 'redo'], // Only supported in Blink browsers
      ['strong', 'em', 'del'],
      ['superscript', 'subscript'],
      ['link'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
      ['unorderedList', 'orderedList'],
      ['removeformat'],
    ],
  }

  private saving = false

  get config() {
    return this.editorConfig
  }

  get email() {
    return this.$store.getters.getCurrentlyPrimaryTabOpen
  }

  async mounted() {
    await this.loadBody()
  }

  @Watch('email', { deep: true })
  async emailChanged() {
    await this.loadBody()
  }

  @Watch('content')
  onContentChange() {
    if (this.saving) {
      return
    }

    this.saving = true

    setTimeout(() => {
      this.saveDraft()
    }, 5000)
  }

  async saveDraft() {
    await this.$apiService.request(
      ServiceType.Mail,
      // eslint-disable-next-line max-len
      `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/drafts/${this.email.id}`,
      'PUT',
      {
        id: this.email.id,
        body: this.content,
      },
    )
  }

  /**
   * TODO: remove duplication with src/components/email/Tab/EmailRead.vue
   */
  async loadBody() {
    if (!this.email) {
      return
    }

    const entityEndpoint = this.email.draft ? 'drafts' : 'emails'
    const params = `${this.$store.getters.getUser.email}/${entityEndpoint}/${this.email.id}`

    const response: emailApiInterface | null = await this.$apiService.request(
      ServiceType.Mail,
      `providers/${this.$store.getters.getProvider}/users/${params}`,
      'GET',
    )

    if (response) {
      this.content = this.email.draft ? response.draft.message.body : response.message.body
    }
  }
}
</script>

<style lang="scss" scoped>
.email-editor {
  display: block;
  position: relative;
  min-height: 100%;
  max-height: 100%;
  height: 100%;
  padding: 20px;
  background: #fff;
  color: #445576;

  .ps {
    margin-top: 20px;
    height: calc(100% - 180px);
  }
}
</style>

<style lang="scss">
.trumbowyg-box {
  height: 100%;
  border: none;

  .trumbowyg-editor {
    height: 100% !important;
  }

  .trumbowyg-fixed-top {
    top: unset !important;
    bottom: 155px !important;
  }

  .trumbowyg-button-pane {
    padding-top: 10px;
    box-shadow: 0px -30px 25px #ffffff;
    background: #ffffff;
    max-width: 33%;
    position: fixed;
    bottom: 10px;
    right: 8%;
    border: none;

    &::after {
      background: none;
    }

    .trumbowyg-open-dropdown {
      &::after {
        top: 17px;
      }
    }

    .trumbowyg-button-group {
      &::after {
        background: none;
      }
    }
  }
}
</style>
