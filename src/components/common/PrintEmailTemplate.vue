<template>
  <div class="print-read w-100">
    <div v-if="$store.getters.getEmailList.emailListTo.length > 0">
      <div class="print-read">
        <div><img src="../../../public/svg/logo.svg" alt="logo" /></div>
        <div class="print-user">
          <b>
            {{ $store.getters.getUser.firstName }}
            {{ $store.getters.getUser.lastName }}
            &lt;{{ $store.getters.getUser.email }}&gt;
          </b>
        </div>
      </div>
      <hr />
      <p class="print-subject">
        <b v-if="$store.getters.getEmailSubject.length > 0">{{ $store.getters.getEmailSubject }}</b>
        <b v-else>No Subject</b>
      </p>
      <hr />
      <div class="print-body">
        <div>
          <div>
            <b>
              {{ $store.getters.getUser.firstName }}
              {{ $store.getters.getUser.lastName }}
            </b>
            &lt;{{ $store.getters.getUser.email }}&gt;
          </div>

          <div class="d-flex">
            Draft To:
            <div
              v-for="(item, index) in $store.getters.getEmailList.emailListTo"
              :key="index"
              class="d-flex ml-10"
            >
              {{ item.email }}
              <span
                v-if="index !== Object.keys($store.getters.getEmailList.emailListTo).length - 1"
              >
                ,
              </span>
            </div>
          </div>
          <div v-if="$store.getters.getEmailList.emailListCc.length > 0" class="d-flex">
            CC:
            <div
              v-for="(item, index) in $store.getters.getEmailList.emailListCc"
              :key="index"
              class="d-flex ml-10"
            >
              {{ item.email }}
              <span
                v-if="index !== Object.keys($store.getters.getEmailList.emailListCc).length - 1"
              >
                ,
              </span>
            </div>
          </div>
          <div v-if="$store.getters.getEmailList.emailListBcc.length > 0" class="d-flex">
            Bcc:
            <div
              v-for="(item, index) in $store.getters.getEmailList.emailListBcc"
              :key="index"
              class="d-flex ml-10"
            >
              {{ item.email }}
              <span
                v-if="index !== Object.keys($store.getters.getEmailList.emailListBcc).length - 1"
              >
                ,
              </span>
            </div>
          </div>
        </div>
        <div>{{ dayName }}, {{ monthName }} {{ date }},{{ year }} at {{ time }}</div>
      </div>
      <div id="email-body"></div>
      <div v-if="emailFiles.length > 0" class="print-files">
        <div v-for="(file, index) in emailFiles" :key="index" class="mb-10">
          <div class="d-flex">
            <div class="print-file-type">
              <span v-if="file.type === ''">txt</span>
              <span v-else>{{ filterFileType(file.type) }}</span>
            </div>
            <div>
              <div>
                <b>{{ file.name }}</b>
              </div>
              <div class="print-file-size">{{ file.size }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="print-no-data">
        <div><img src="../../../public/svg/logo.svg" alt="logo" /></div>
        <div class="print-msg">
          <b>The conversation has been deleted</b>
        </div>
      </div>
      <div>
        The requested conversation has been deleted and is no longer available.
        <a href="https://test.catchup.email/email">Click here</a> to go to your account.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class EmailPrintTemplate extends Vue {
  private currentDate = new Date()

  private date = this.currentDate.getDate()

  private year = this.currentDate.getFullYear()

  private month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ]

  private monthName = this.month[this.currentDate.getMonth()]

  private days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  private dayName = this.days[this.currentDate.getDay()]

  private time = this.currentDate.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })

  get emailFiles() {
    return this.$store.getters.getEmailFiles
  }

  filterFileType(fileType) {
    const displayFileTypes = {
      'image/jpeg': 'jpeg',
      'image/png': 'png',
      'image/gif': 'gif',
      'application/pdf': 'pdf',
      'application/x-msdownload': 'exe',
      'application/x-zip-compressed': 'zip',
      'application/postscript': 'eps',
      'application/vnd.android.package-archive': 'apk',
      'application/octet-stream': 'bin',
      'text/html': 'html',
      'text/xml': 'xml',
      'text/plain': 'text',
      'text/csv': 'csv',
      'audio/mpeg': 'mp3',
    }

    return displayFileTypes[fileType]
  }
}
</script>
