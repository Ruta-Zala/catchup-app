<template>
  <div id="email-editor-main">
    <ValidationObserver v-slot="{ handleSubmit }">
      <form class="editor-main" @submit.prevent="handleSubmit(onsubmit)">
        <div class="editor-container">
          <ValidationProvider v-slot="{ errors }" name="EmailToWrap" rules="email">
            <div ref="getEmailTo" class="user flex" :class="{ invalidEmail: errors[0] }">
              <div class="left-place flex">
                <div class="space-name">To</div>
                <div class="to-selects flex">
                  <div
                    v-for="(email, index) in emailListTo"
                    :key="index"
                    class="user-block flex items-center"
                  >
                    <user-state class="user-send" />
                    <div class="user-info flex items-center">
                      <p class="user-name">
                        <span class="user-name-main">{{ email.name }}</span>
                        <span class="user-name-email">({{ email.email }})</span>
                      </p>
                      <span @click="removeEmail({ email: email, mode: 'to' })">
                        <icon name="close" width="10px" height="10px" class="mx-5"></icon>
                      </span>
                    </div>
                  </div>
                  <input
                    v-model="emailTo"
                    type="email"
                    :class="{ invalidEmail: errors[0] }"
                    class="test"
                    multiple
                    @keyup.enter="
                      addEmail({
                        email: emailTo,
                        mode: 'to',
                        callback: () => {
                          emailTo = ''
                        },
                      })
                    "
                  />
                </div>
              </div>
              <div class="email-actions flex items-center">
                <a
                  class="button cc-bt"
                  :class="[!isMinimizeData ? 'flex' : 'hidden']"
                  @click="isCCOpen = !isCCOpen"
                >
                  Cc Bcc
                </a>
                <a @click="removeAllEmailTo">
                  <icon name="trash" width="16px" height="16px" class="mx-10" />
                </a>
                <a
                  :class="[!isMinimizeData ? '' : 'active']"
                  class="flex minimize"
                  @click="isMinimizeData = !isMinimizeData"
                >
                  <icon
                    :name="[!isMinimizeData ? 'minimize' : 'expand-white']"
                    width="16px"
                    height="16px"
                    class="mx-10"
                  />
                </a>
                <a @click="closeEditor">
                  <icon name="close" width="12px" height="12px" class="mx-10" />
                </a>
                <action-drop
                  class="options"
                  menu-position="left"
                  :actions="labelActions"
                  width="32px"
                  height="32px"
                  hover-background-color="rgba(255, 255, 255, 0.05)"
                  border="none"
                  border-radius="50%"
                  icon-name="sub-menu"
                  icon-width="16px"
                  icon-height="16px"
                  icon-margin="auto 25px"
                  style="right: -3px"
                  @anActionClicked="changeComposeActions"
                />
              </div>
            </div>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" name="EmailCc" rules="email">
            <div
              class="email-cc-users"
              :class="[
                !isMinimizeData ? '' : 'hidden',
                !isCCOpen ? 'hidden' : 'flex',
                { invalidEmail: errors[0] },
              ]"
            >
              <div class="space-name flex">Cc</div>
              <div class="to-selects flex">
                <div
                  v-for="(email, index) in emailListCc"
                  :key="index"
                  class="user-block flex items-center"
                >
                  <user-state class="user-send" />
                  <div class="user-info flex items-center">
                    <p class="user-name">
                      <span class="user-name-main">{{ email.name }}</span>
                      <span class="user-name-email">({{ email.email }})</span>
                    </p>
                    <span @click="removeEmail({ email: email, mode: 'cc' })">
                      <icon name="close" width="10px" height="10px" class="mx-5"></icon>
                    </span>
                  </div>
                </div>

                <input
                  v-model="emailCc"
                  type="email"
                  @keyup.enter="
                    addEmail({
                      email: emailCc,
                      mode: 'cc',
                      callback: () => {
                        emailCc = ''
                      },
                    })
                  "
                />
              </div>
            </div>
          </ValidationProvider>
          <ValidationProvider v-slot="{ errors }" name="EmailBcc" rules="email">
            <div
              class="email-bcc-users"
              :class="[
                !isMinimizeData ? '' : 'hidden',
                !isCCOpen ? 'hidden' : 'flex',
                { invalidEmail: errors[0] },
              ]"
            >
              <div class="space-name flex">Bcc</div>
              <div class="to-selects flex">
                <div
                  v-for="(email, index) in emailListBcc"
                  :key="index"
                  class="user-block flex items-center"
                >
                  <user-state class="user-send" />
                  <div class="user-info flex items-center">
                    <p class="user-name">
                      <span class="user-name-main">{{ email.name }}</span>
                      <span class="user-name-email">({{ email.email }})</span>
                    </p>
                    <span @click="removeEmail({ email: email, mode: 'bcc' })">
                      <icon name="close" width="10px" height="10px" class="mx-5"></icon>
                    </span>
                  </div>
                </div>
                <input
                  v-model="emailBcc"
                  type="email"
                  @keyup.enter="
                    addEmail({
                      email: emailBcc,
                      mode: 'bcc',
                      callback: () => {
                        emailBcc = ''
                      },
                    })
                  "
                />
              </div>
            </div>
          </ValidationProvider>
          <div class="email-subject" :class="[!isMinimizeData ? 'flex' : 'hidden']">
            <div class="space-name flex">Subject</div>
            <div class="to-selects flex">
              <input v-model="subject" type="text" placeholder="" @change="getSubject(subject)" />
            </div>
          </div>
        </div>
        <div class="editor-statusBar" :class="[!isMinimizeData ? 'flex' : 'hidden']">
          <div v-if="updateScheuled" class="scheduled-email box">
            <div class="icon flex"><icon name="clock-white"></icon></div>
            <p>
              <span class="activity">Scheduled</span> for
              <span class="whitespace-nowrap">{{ scheduledDate }} {{ scheduledTime }}</span>
            </p>
            <a class="small-bts" @click="removeScheduleModal">
              <icon name="close" width="12px" height="12px"></icon>
            </a>
          </div>
          <div v-if="isSelfDestructIn" class="self-destruct-email box">
            <div class="icon flex"><icon name="self-destruct-white"></icon></div>
            <p class="flex">
              <span class="activity">Self-Destruct</span> in
              <span>{{ selfDestructTime }} {{ daysLabel }} after opened</span>
            </p>
            <a class="small-bts" @click="removeSelfDestruct">
              <icon name="close" width="12px" height="12px"></icon>
            </a>
          </div>
        </div>
        <div
          class="editor-attachmentBlock"
          :class="[{ expanded: !isExpanded }, !isMinimizeData ? '' : 'hidden']"
        >
          <div class="values-attachments flex">
            <div class="attachments-title flex" @click="isExpanded = !isExpanded">
              <icon name="attach"></icon>
              <div class="mx-10">{{ attacthFile.length }} attachments</div>
              <icon name="drop-down" class="drop-down-arrow" :class="{ open: !isExpanded }" />
            </div>
            <a class="delete-all" @click="resetAttachFile">Delete All</a>
          </div>
          <div class="accounts-select flex" :class="{ 'list-selects': !isExpanded }">
            <div v-for="(emailAttach, index) in attacthFile" :key="index">
              <a v-if="emailAttach.name" class="bt">
                <div class="flex container">
                  <span class="file-type avi flex">{{ filterFileType(emailAttach.type) }}</span>
                  <div>
                    <span class="file-name">{{ emailAttach.name }}</span>
                    <br />
                    <span>{{ emailAttach.size }}</span>
                  </div>
                </div>
                <span class="small-bts" @click="closeAttachFile(emailAttach)">
                  <icon name="close" width="12px" height="12px"></icon>
                </span>
              </a>
            </div>
            <div v-if="zeroFileAttach" class="error-msg">
              This file is 0 bytes, so it will not be attached.
            </div>
            <div>
              <a class="bt add-attachments-bt">
                <input
                  ref="fileInput"
                  type="file"
                  class="hidden-input"
                  multiple
                  @change="addAttachFile"
                />
                <span class="file-type flex add-icon"><icon name="close"></icon></span>
                <span>Add attachments</span>
              </a>
            </div>
          </div>
        </div>
        <div class="editor-wrapper">
          <div class="editor-body">
            <editor :class="{ hiddenToolbar: modelArray.isFormatDark }" />
            <menu id="contextMenu" class="context-menu" style="display: none"> </menu>
          </div>
          <div class="editor-footer flex">
            <div
              v-if="
                modelArray.isSelfDestruct === true ||
                modelArray.isScheduled === true ||
                modelArray.isAnalytics === true ||
                modelArray.isFormatDark === true
              "
              class="backDrop"
              @click="outSideCloseModal"
            ></div>
            <div class="customModal">
              <div @click="openModal('isFormatDark')">
                <icon
                  name="format-dark"
                  class="customModalIcon"
                  :class="{ active: modelArray.isFormatDark }"
                />
              </div>
            </div>
            <div class="customModal">
              <div class="customModalIcon"></div>
            </div>
            <div class="customModal">
              <div class="customModalIcon"></div>
            </div>
            <div class="customModal">
              <div v-if="modelArray.isSelfDestruct === true" class="customModalOpen">
                <div class="sub-title flex">
                  <p class="small-bt-font-size">Self-destruct in</p>
                  <a href="#">View All</a>
                </div>
                <div class="dates-to-schedule flex">
                  <div class="date-picker-destruct box flex">
                    <input v-model="selfDestructTime" type="number" placeholder="0" />
                    <action-drop
                      class="options dayOptions"
                      menu-position="left"
                      :actions="daysActions"
                      height="16px"
                      hover-background-color="rgba(255, 255, 255, 0.05)"
                      border="none"
                      border-radius="50%"
                      icon-name="drop-down"
                      icon-width="16px"
                      icon-height="16px"
                      icon-margin="auto 10px"
                      style="right: -3px"
                      show-selected-text="true"
                      @anActionClicked="changeDaysActions"
                    />
                  </div>
                  <div class="after-date flex">
                    <p>After opened</p>
                  </div>
                  <label class="switch">
                    <input type="checkbox" @change="checkIsSelfDestructIn($event)" />
                    <span class="slider round" :class="{ active: isSelfDestructIn }"></span>
                  </label>
                </div>
                <div v-if="errorSelfDestructIn" class="error-msg mt-1">Please Select days</div>
                <div class="note-destruct flex">
                  <p class="flex">
                    <icon name="attention" width="16px" height="16px"></icon>
                    All emails will automatically be deleted after 6 months
                  </p>
                </div>
              </div>
              <span @click="openModal('isSelfDestruct')">
                <div>
                  <icon
                    name="self-destruct-dark"
                    class="customModalIcon"
                    :class="{ active: modelArray.isSelfDestruct }"
                  />
                </div>
              </span>
            </div>
            <div class="customModal">
              <div v-if="modelArray.isScheduled === true">
                <div class="customModalOpen">
                  <div class="sub-title flex">
                    <p class="small-bt-font-size">Schedule email</p>
                    <a href="#">View All</a>
                  </div>
                  <div class="dates-to-schedule flex">
                    <div class="dateTime-picker">
                      <div class="date-picker flex">
                        <date-picker v-model="scheduledDate" type="date" value-type="YYYY-MM-DD" />
                      </div>
                      <div class="time-picker flex">
                        <date-picker
                          v-model="scheduledTime"
                          type="time"
                          value-type="HH:mm A"
                          placeholder="00:00:00"
                        />
                      </div>
                    </div>
                    <label class="switch">
                      <input type="checkbox" @change="checkScheduleModal($event)" />
                      <span class="slider round" :class="{ active: updateScheuled }"></span>
                    </label>
                  </div>
                  <div v-if="errorSchedule" class="error-msg mt-1">Please Select Date and Time</div>
                </div>
              </div>
              <div>
                <div @click="openModal('isScheduled')">
                  <icon
                    name="clock-dark"
                    class="customModalIcon"
                    :class="{ active: modelArray.isScheduled }"
                  ></icon>
                </div>
              </div>
            </div>
            <div class="customModal">
              <div v-if="modelArray.isAnalytics === true">
                <div class="customModalOpen">
                  <div class="sub-title flex">
                    <p class="small-bt-font-size">Email Analytics</p>
                    <a href="#">View All</a>
                  </div>
                  <div class="dates-to-schedule flex">
                    <div class="after-date flex">
                      <p>Track this email</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" @change="checkEmailAnalytics($event)" />
                      <span class="slider round" :class="{ active: isEmailTracking }"></span>
                    </label>
                  </div>
                  <div class="note-destruct flex">
                    <p class="flex">
                      <icon name="attention" width="16px" height="16px"></icon>
                      You can change the default behaviour in options panel
                    </p>
                  </div>
                </div>
              </div>
              <div @click="openModal('isAnalytics')">
                <div>
                  <icon
                    name="analytics-dark"
                    class="customModalIcon"
                    :class="{ active: modelArray.isAnalytics }"
                  />
                </div>
              </div>
            </div>
            <app-button
              text="Send"
              type="primary"
              hover-shadow="true"
              icon="reply2-white"
              icon-width="16px"
              icon-height="16px"
              font-size="100%"
              height="45px"
              width="100px"
              class="send-btn"
              @click="onSubmitData"
            />
          </div>
        </div>
      </form>
    </ValidationObserver>
    <email-print-template id="emailEditorPrint" />
  </div>
</template>

<script lang="ts">
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import { Component, Vue, Ref } from 'vue-property-decorator'
import DatePicker from 'vue2-datepicker'

import { ServiceType } from '@/api/apiService'
import ActionDrop from '@/components/common/ActionDrop/ActionDrop.vue'
import Button from '@/components/common/Button.vue'
import Editor from '@/components/common/Editor.vue'
import Icon from '@/components/common/Icon.vue'
import MenuAction from '@/components/common/Menu/ts/menuAction'
import EmailPrintTemplate from '@/components/common/PrintEmailTemplate.vue'
import UserState from '@/components/common/UserState.vue'

import 'vue2-datepicker/index.css'

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule])
})

@Component({
  components: {
    Icon,
    ActionDrop,
    'app-button': Button,
    UserState,
    Editor,
    DatePicker,
    ValidationProvider,
    ValidationObserver,
    EmailPrintTemplate,
  },
})
export default class EmailEditorMain extends Vue {
  @Ref('getEmailTo') readonly getEmailToRef

  data() {
    return {
      emailTo: '',
      emailBcc: '',
      emailCc: '',
      isExpanded: false,
      isCCOpen: false,
      isMinimizeData: false,
      subject: '',
    }
  }

  private modelArray = {
    isSelfDestruct: false,
    isScheduled: false,
    isAnalytics: false,
    isFormatDark: false,
  }

  private emailListTo: {
    name: string
    email: string
  }[] = []

  private emailListCc: {
    name: string
    email: string
  }[] = []

  private emailListBcc: {
    name: string
    email: string
  }[] = []

  private emailValidation = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}'

  private readonly labelActions: Array<MenuAction> = [
    {
      text: 'Print Email',
      value: 'print:email',
      selected: false,
    },
    {
      text: 'Check Spelling',
      value: 'check:spelling',
      selected: false,
    },
    {
      text: 'Translate',
      value: 'translate',
      selected: false,
    },
    {
      text: 'Simple Mode',
      value: 'simple:mode',
      selected: false,
    },
  ]

  private daysActions: Array<MenuAction> = [
    {
      text: 'Days',
      value: 'days',
      selected: true,
    },
    {
      text: 'Hours',
      value: 'hours',
      selected: false,
    },
    {
      text: 'Minutes',
      value: 'minutes',
      selected: false,
    },
    {
      text: 'Seconds',
      value: 'seconds',
      selected: false,
    },
  ]

  private daysLabel: string | undefined = 'Days'

  private composeLabel = 'Print Email'

  private scheduledDate = new Date().toISOString().slice(0, 10)

  private scheduledTime = null

  private selfDestructTime = null

  private updateScheuled = false

  private isSelfDestructIn = false

  private isEmailTracking = false

  private errorSchedule = false

  private errorSelfDestructIn = false

  private attacthFile: Array<{ name: string; size: number; type: string }> = []

  private emailSelected = {
    selected: true,
    currentlyPrimaryTabOpen: true,
    isEmail: false,
    id: 1,
  }

  // Add Email, Remove Email
  async list() {
    const emailList = {
      emailListTo: this.emailListTo,
      emailListBcc: this.emailListBcc,
      emailListCc: this.emailListCc,
    }

    this.$store.commit('emailList', emailList)
  }

  async addEmail(emailList) {
    const element = {
      name: emailList.email.split('@')[0],
      email: emailList.email.toLowerCase(),
    }

    if (element.email !== '' && element.email.match(this.emailValidation)) {
      if (emailList.mode === 'to') {
        this.emailListTo.push(element)
      } else if (emailList.mode === 'cc') {
        this.emailListCc.push(element)
      } else if (emailList.mode === 'bcc') {
        this.emailListBcc.push(element)
      }
      emailList.callback()
    }
    await this.list()
  }

  removeEmail(removeEmail) {
    if (removeEmail.mode === 'to') {
      this.emailListTo.splice(this.emailListTo.indexOf(removeEmail.email), 1)
    } else if (removeEmail.mode === 'cc') {
      this.emailListCc.splice(this.emailListCc.indexOf(removeEmail.email), 1)
    } else if (removeEmail.mode === 'bcc') {
      this.emailListBcc.splice(this.emailListBcc.indexOf(removeEmail.email), 1)
    }
  }

  removeAllEmailTo() {
    this.emailListTo = []
  }

  // Close Editor
  get openEmails() {
    return this.$store.getters.getOpenEmails
  }

  get currentlyPrimaryTabOpen() {
    return this.$store.getters.getCurrentlyPrimaryTabOpen
  }

  get currentEmailIndex() {
    return this.openEmails.indexOf(
      this.openEmails.find((openEmail) => openEmail.id === this.currentlyPrimaryTabOpen.id),
    )
  }

  closeEditor() {
    const currentSelectedEmailIndex = this.currentEmailIndex

    this.$store.commit('setCurrentlyPrimaryTabOpen', this.openEmails[currentSelectedEmailIndex - 1])
    this.$store.dispatch('closeEmail', this.emailSelected)
  }

  // Add Attach file

  private zeroFileAttach = false

  async listFile() {
    const fileList: Array<{ name: string; size: number }> = []

    for (let i = 0; i < this.attacthFile.length; i += 1) {
      const emailFiles = {
        name: this.attacthFile[i].name,
        size: this.attacthFile[i].size,
        type: this.attacthFile[i].type,
      }

      fileList.push(emailFiles)
    }
    this.$store.commit('emailFiles', fileList)
  }

  async addAttachFile(e) {
    const file = e.target.files[0]

    if (file.size > 0) {
      this.attacthFile.push(file)
      this.zeroFileAttach = false
    } else {
      this.zeroFileAttach = true
    }
    await this.listFile()
  }

  async closeAttachFile(emailAttach) {
    this.attacthFile.splice(this.attacthFile.indexOf(emailAttach), 1)
    await this.listFile()
  }

  resetAttachFile() {
    this.attacthFile = []
  }

  // close modal

  removeScheduleModal() {
    this.scheduledTime = null
    this.scheduledDate = new Date().toISOString().slice(0, 10)
    this.updateScheuled = !this.updateScheuled
  }

  removeSelfDestruct() {
    this.selfDestructTime = null
    this.isSelfDestructIn = !this.isSelfDestructIn
  }

  clearModelObj() {
    this.modelArray = {
      isSelfDestruct: false,
      isScheduled: false,
      isAnalytics: false,
      isFormatDark: false,
    }
  }

  // Outside click of modal

  outSideCloseModal() {
    if (
      this.modelArray.isSelfDestruct ||
      this.modelArray.isScheduled ||
      this.modelArray.isAnalytics ||
      this.modelArray.isFormatDark
    ) {
      this.clearModelObj()
    }
  }

  // Open footer modal

  openModal(model) {
    this.clearModelObj()
    this.modelArray[model] = !this.modelArray[model]
  }

  checkScheduleModal(e) {
    if (this.scheduledDate !== '' && this.scheduledTime !== null) {
      this.updateScheuled = !this.updateScheuled
      this.errorSchedule = false
    } else {
      this.updateScheuled = false
      this.errorSchedule = true
    }
    // eslint-disable-next-line no-param-reassign
    e.target.checked = this.updateScheuled
  }

  checkIsSelfDestructIn(e) {
    if (this.selfDestructTime !== null) {
      this.isSelfDestructIn = !this.isSelfDestructIn
      this.errorSelfDestructIn = false
    } else {
      this.isSelfDestructIn = false
      this.errorSelfDestructIn = true
    }
    // eslint-disable-next-line no-param-reassign
    e.target.checked = this.isSelfDestructIn
  }

  checkEmailAnalytics() {
    this.isEmailTracking = !this.isEmailTracking
  }

  filterFileType(fileType) {
    const displayFileTypes = [
      'txt',
      'pdf',
      'xls',
      'doc ',
      'jpeg',
      'xml',
      'docx',
      'pdf',
      'jpg',
      'png',
      'ppt',
      'pptx',
      'psd',
      'rif',
      'xls',
      'zip',
      'html',
      'csv',
      'java',
      'eps',
      'gif',
      'ai',
      'tif',
      'mp3',
      'apk',
      'jar',
      'bin',
      'rar',
    ]
    let displayFileType = 'txt'

    displayFileTypes.forEach((file) => {
      if (fileType.includes(file)) {
        displayFileType = file
      }
    })

    return displayFileType
  }

  getSubject(subject) {
    this.$store.commit('emailSubject', subject)
  }

  onSubmitData() {
    if (this.emailListTo.length <= 0) {
      this.getEmailToRef.classList.value = `${this.getEmailToRef.classList.value}
      invalidEmail`
    } else {
      const newEmailPayload = {
        to: this.emailListTo.map((email) => email.email),
        subject: this.getSubject,
        body: this.$store.getters.getEmailContent,
        cc: this.emailListCc.map((email) => email.email),
        bcc: this.emailListBcc.map((email) => email.email),
        threadId: '',
        emailTracking: this.isEmailTracking,
      }

      this.$apiService.request(
        ServiceType.Mail,
        // eslint-disable-next-line max-len
        `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/emails/send`,
        'POST',
        newEmailPayload,
      )
      const currentSelectedEmailIndex = this.currentEmailIndex

      this.$store.commit(
        'setCurrentlyPrimaryTabOpen',
        this.openEmails[currentSelectedEmailIndex - 1],
      )
      this.$store.dispatch('closeEmail', this.emailSelected)
    }
  }

  changeDaysActions(_action) {
    // eslint-disable-next-line no-return-assign,no-param-reassign
    this.daysActions.map((action) => (action.selected = false))
    if (!_action.selected) {
      // eslint-disable-next-line no-param-reassign
      _action.selected = !_action.selected
    }
    this.daysLabel = this.daysActions.find((action) => action.selected === true)?.text
  }

  // Print Email & check spelling
  // eslint-disable-next-line max-lines-per-function
  changeComposeActions(_action) {
    // eslint-disable-next-line no-return-assign,no-param-reassign
    this.labelActions.map((action) => (action.selected = false))
    // eslint-disable-next-line no-param-reassign
    _action.selected = !_action.selected
    this.composeLabel = this.labelActions.find((action) => action.selected === true)!.text
    if (this.composeLabel === 'Print Email') {
      if (this.$store.getters.getEmailContent !== '') {
        const emailContentBody = document.getElementById('email-body')

        emailContentBody!.innerHTML = this.$store.getters.getEmailContent
      }
      const emailContent = document.getElementById('emailEditorPrint')!.innerHTML
      const printEmail = window.open('', '_blank')

      printEmail?.document.write(
        `<html lang="en"><head><title>Catchup ${this.$store.getters.getEmailSubject}</title>`,
      )
      printEmail?.document.write(
        '<link rel="stylesheet" type="text/css" href="http://test.catchup.email/print.css"/>',
      )
      printEmail?.document.write('</head><body>')
      printEmail?.document.write(emailContent)
      printEmail?.document.write('</body></html>')
      printEmail?.document.close()
      setTimeout(function () {
        printEmail?.focus()
        printEmail?.print()
      }, 100)
      window.localStorage.clear()
    }
  }
}
</script>

<style lang="scss">
.highlight {
  /*background-color: #f1f5ff;*/
  background-color: red;
}
menu.context-menu {
  position: absolute;
  z-index: 1;
  top: 30px;
  left: 0;
  ul {
    width: 145px;
    border-radius: 6px;
    box-shadow: 0 10px 25px rgb(98 161 251 / 33%);
    z-index: 10;
    background: #fff;
    max-height: 160px;
    overflow: auto;
    li {
      color: rgb(68, 85, 118);
      padding: 12px 15px;
      font-weight: 500;
      font-size: 13px;

      &:not(:first-child) {
        border-top: 1px solid rgb(226, 233, 249);
      }
      &:hover {
        background: #f8faff;
        font-weight: 700;
        cursor: pointer;
      }
    }
  }
}

.backDrop {
  position: fixed;
  inset: 0;
  background: #00000000;
  z-index: 10;
}
#emailEditorPrint {
  display: none;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.disableBtn {
  opacity: 0.5;
  pointer-events: none;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.flex {
  display: flex;
}
.hidden {
  display: none;
}
.items-center {
  align-items: center;
}
.mx-10 {
  margin: 0 10px;
}
.mx-5 {
  margin: 0 5px;
}
.mt-1 {
  margin-top: 10px;
}
.box {
  min-width: 250px;
  min-height: 30px;
  border-radius: 6px;
  z-index: 1;
  border: 1px solid $borderColorBase;
  user-select: none;
  margin: 0.5%;
  flex: 1;
  overflow: hidden;
  transition: all 0.5s ease;
  align-items: center;
  display: flex;
  &:hover {
    box-shadow: 0 5px 10px rgb(98 161 251 / 24%);
    cursor: pointer;
  }
}
.error-msg {
  color: $dangerColor;
  font-size: 12px;
}
input {
  min-height: 30px;
  width: 100%;
  overflow: hidden;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  border: none;
  outline: none;
  font-weight: 500;
  font-size: 13px;
  color: $fontColorBase;
  height: 100%;
}
#email-editor-main {
  width: 100%;
  max-height: 100%;
  height: calc(100% - 45px);
}
.editor {
  &-main {
    background: $whiteColor;
    flex: 1;
    padding: 15px 25px 20px;
    display: flex;
    flex-direction: column;
    height: calc(100% - 65px);
    @include themify {
      background: themed(panelGradient);
    }
  }

  &-container {
    padding-bottom: 10px;
    .email-cc-users,
    .email-bcc-users,
    .email-subject,
    .user {
      border-bottom: 1px solid $borderColorBase;
      flex: 1;
      align-items: center;
      padding: 5px 0;
      &.invalidEmail {
        border-bottom-color: red;
      }
      .left-place {
        align-items: center;
        flex: 1;
      }
      .to-selects {
        border-bottom: 0;
        margin: 0;
        width: auto;
        flex-wrap: wrap;
        min-height: 25px;
        align-items: center;
        flex: 1;

        .user-block {
          margin: 2px;
          .user-send {
            .avatar,
            .avatar span,
            .avatar span img {
              height: 32px !important;
              width: 32px !important;
            }
            .avatar span.icon {
              margin: 0;
            }
            &.user-state {
              & > .user-state-container {
                display: none;
              }
            }
          }
          .user-info {
            word-break: break-word;
            .icon {
              opacity: 0;
            }
            &:hover {
              .icon {
                opacity: 0.5;
                cursor: pointer;
              }
            }
          }
        }
        input {
          min-width: 85px;
        }
      }
      .space-name {
        font-size: 13px;
        font-weight: 500;
        margin-right: 10px;
      }
      .user-name {
        font-size: 14px;
        font-weight: 600;
        margin-left: 10px;
        &-email {
          font-size: 11px;
          margin: 0 0 0 5px;
          font-weight: 500;
          line-height: 18px;
        }
        &-main {
          text-transform: capitalize;
          font-weight: 600;
        }
      }
    }
    .email-actions {
      margin-left: 5px;
      .cc-bt:hover {
        font-weight: bold;
        cursor: pointer;
      }
      .icon {
        cursor: pointer;
        svg {
          * {
            @include themify {
              fill: themed('fontColor');
            }
          }
        }
      }
      .options {
        span {
          svg {
            transform: rotate(90deg);
          }
        }
      }
      a.minimize {
        border-radius: 50%;
        height: 36px;
        justify-content: center;
        align-items: center;
        &.active {
          background: linear-gradient(to right, $gradient1 0%, $gradient2 100%);
          .icon {
            svg {
              path {
                fill: $whiteColor;
              }
            }
          }
        }
      }
    }
  }

  &-statusBar {
    justify-content: space-between;
    margin-bottom: 5px;

    .box {
      .small-bts {
        opacity: 0;
      }
      &:hover {
        .small-bts {
          opacity: 0.5;
        }
      }

      p {
        font-size: 13px;
        margin: 0;
        flex-wrap: wrap;
        flex: 1;

        span {
          font-weight: 600;
          margin: 0 5px;
        }
      }

      &.scheduled-email {
        & > .icon {
          background: $fontColorBlue;
        }
      }

      &.self-destruct-email {
        border: 1px solid $dangerColor;

        & > .icon {
          background: $dangerColor;
        }
      }

      .icon {
        height: 101%;
        width: 32px;
        min-height: 31px;
        align-items: center;
        min-width: 32px;
        margin-right: 10px;
      }
    }
  }

  &-attachmentBlock {
    background: $backgroundColorSlim;
    border-radius: 6px;
    padding-top: 8px;
    border: 1px solid $borderColorBase;
    min-width: 99%;
    max-width: 99%;
    width: auto;
    margin: 0 0.5% 20px 0.5%;
    color: $fontColorBase;

    .values-attachments {
      padding: 0 0 8px 0;
      border-bottom: none;
      margin: 0 10px 0 10px;
      justify-content: space-between;
      .attachments-title {
        cursor: pointer;
        .drop-down-arrow {
          &.open {
            transform: rotate(180deg);
          }
        }
      }
      .delete-all {
        text-decoration: underline;
        padding-right: 10px;
        cursor: pointer;
      }
    }

    .accounts-select {
      height: 0;
      margin: 0;
      max-height: 180px;
      flex-wrap: wrap;
      border: none;
      align-items: normal;
      overflow: auto;
    }

    .bt {
      background: $whiteColor;
      border-radius: 6px;
      border: 1px solid $borderColorBase;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      width: auto;
      font-size: 14px;
      min-width: 170px;
      margin: 3px 5px;
      padding: 5px 10px;

      .file-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        font-size: 13px;
        font-weight: 500;
      }

      span {
        font-size: 11px;
        font-weight: 400;
        white-space: nowrap;
        &.small-bts {
          opacity: 0;
          margin-left: 10px;
        }
      }

      .container {
        max-width: 90%;
        align-items: center;
        padding-right: 10px;
      }

      .file-type {
        margin: 0 15px 0 0 !important;
        font-size: 11px;
        font-weight: 600;
        padding: 0;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        min-width: 32px;
        min-height: 32px;
        border-radius: 50%;
        &.avi {
          background: $dangerColor;
          color: $whiteColor;
        }
        &.add-icon {
          background: $borderColorBase;
          transform: rotate(45deg);
        }
      }

      &:hover {
        box-shadow: 0 5px 10px rgb(98 161 251 / 24%);
        color: inherit;
        cursor: pointer;
        .small-bts {
          opacity: 0.5;
        }
      }

      &.add-attachments-bt {
        background: transparent;
        border: none;
        position: relative;
        .hidden-input {
          opacity: 0;
          width: 100%;
          position: absolute;
          cursor: pointer;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
        }
      }
    }

    &.expanded {
      padding-bottom: 10px;

      .values-attachments {
        border-bottom: 1px solid $borderColorBase;
      }
      .accounts-select {
        height: auto;
      }
      .list-selects {
        padding: 10px;
      }
    }
  }

  &-body {
    height: calc(100% - 60px);
    position: relative;
    &-h {
      height: calc(100% - 120px);
    }
  }
  &-wrapper {
    flex: 1;
    height: 10%;
    overflow: visible;
  }

  &-footer {
    padding-top: 10px;
    box-shadow: 0 -30px 25px $whiteColor;
    position: relative;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    z-index: 11;
    @include themify {
      box-shadow: 0 -30px 25px themed('panelBackground');
    }
    .send-btn {
      margin-left: 10px;
      .icon {
        margin-right: 10px;
      }
    }
    .customModalWrapper {
      display: flex;
    }
    .customModal {
      position: relative;
      color: $fontColorBase;
      z-index: 12;
      .customModalIcon {
        border-radius: 6px;
        padding: 10px;
        margin: 3px;
        cursor: pointer;
        height: 36px;
        width: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover,
        &.active {
          @include themify {
            background: themed('backgroundColor');
          }
        }
        svg {
          path {
            @include themify {
              fill: themed('fontColor');
            }
          }
        }
      }

      .customModalOpen {
        position: absolute;
        width: 390px;
        padding: 25px;
        border: 1px solid $borderColorBase;
        overflow: visible;
        bottom: 46px;
        right: 0;
        box-shadow: 0 10px 25px rgb(98 161 251 / 33%);
        border-radius: 6px;
        z-index: 12;
        background: $whiteColor;
        .sub-title {
          padding-bottom: 15px;
          border-bottom: 1px solid $borderColorBase;
          justify-content: space-between;
          p {
            align-self: center;
            margin: 0;
            font-weight: 600;
          }
          a {
            font-size: 12px;
            color: $fontColorBase;
            text-decoration: inherit;
            outline: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            &:hover {
              background: $backgroundColor;
              font-weight: 700;
            }
          }
        }
        .dates-to-schedule {
          padding: 20px 0 0 0;
          align-items: center;
          flex-wrap: wrap;
          .after-date {
            flex: 1;
            margin-left: 10px;
            p {
              margin: 0;
              font-weight: 600;
              font-size: 13px;
            }
          }
          .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 23px;
            margin: 0 0 0 15px;
            input {
              opacity: 0;
              width: 0;
              height: 0;
              background-color: initial;
              cursor: default;
              appearance: auto;
              box-sizing: border-box;
              margin: 3px 3px 3px 4px;
              padding: initial;
              border: initial;
            }
            .slider {
              margin: 0;
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: $borderColorBase;
              transition: all 0.5s ease;
              border-radius: 34px;
              &::before {
                position: absolute;
                content: '';
                height: 17px;
                width: 17px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: all 0.5s ease;
                border-radius: 50%;
              }
              &.active {
                background-color: $fontColorBlue;
                &::before {
                  -webkit-transform: translateX(17px);
                  -ms-transform: translateX(17px);
                  transform: translateX(17px);
                }
              }
            }
          }
          .box {
            flex-direction: row;
            font-size: 13px;
            padding: 10px;
            justify-content: space-between;
            font-weight: 500;
            min-width: 100px;
            max-width: 130px;
            overflow: visible;
            align-items: center;
            & > input {
              min-height: auto;
            }
          }
          .dateTime-picker {
            display: flex;
            .mx-datepicker {
              width: auto;
              border-radius: 6px;
              & svg {
                color: $fontColorBase;
              }
              .mx-input {
                border: 1px solid $borderColorBase;
                width: 130px;
                border-radius: 6px;
                height: 40px;
                color: $fontColorBase;
              }
              &:hover {
                box-shadow: 0 5px 10px rgb(98 161 251 / 24%);
              }
            }

            .time-picker {
              margin-left: 10px;
            }
          }
          .dayOptions {
            .action-drop-menu {
              top: unset;
              bottom: 20px;
            }
          }
        }
        .note-destruct {
          padding-top: 20px;
          p {
            margin: 0;
            font-size: 11px;
            font-weight: 500;
            color: $fontColorBase;
            .icon {
              margin: 0 10px;
            }
          }
        }
        &.formatModal {
          flex: 1;
          flex-wrap: wrap;
          padding: 0;
          z-index: 10;
          .text-tools {
            .box {
              min-width: fit-content;
              padding: 0 10px;
              font-size: 13px;
              justify-content: space-between;
              font-weight: 500;
              overflow: visible;
            }
          }
        }
      }
    }
  }
}
//Calender design according theme
.mx-calendar-content {
  .cell {
    border-radius: 6px;
    &.active,
    &:hover {
      background: $backgroundColorSlim;
      color: $fontColorBase;
      font-weight: 600;
    }
  }

  .today {
    color: $fontColorBase;
  }
}
.mx-time-column .mx-time-item.active {
  color: $fontColorBase;
}
</style>
