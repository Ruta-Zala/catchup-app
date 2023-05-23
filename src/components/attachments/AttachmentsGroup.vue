<template>
  <div class="attachments-group" :class="{ expanded: 'expanded' }">
    <div class="attachments-head">
      <div class="attachments-info">
        <icon name="attach" width="16px" height="16px" disable-selection="true" margin="0" />
        <p>{{ attachmentsOutput }}</p>
        <span>{{ fileTotalSize }}</span>
        <icon
          name="drop-down"
          width="16px"
          height="16px"
          :class="{ expanded: 'open' }"
          @click.native="expanded = !expanded"
        />
      </div>
      <div class="attachments-actions">
        <a @click="downloadAll">Download All</a>
      </div>
    </div>
    <div class="attachments-files">
      <attachment-file
        v-for="(attachment, index) in attachments"
        :key="index"
        v-bind="attachment"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import AttachmentFile from '@/components/attachments/base/AttachementFile.vue'
import { humanFileSize } from '@/components/attachments/base/attachmentsUtils'
import Icon from '@/components/common/Icon.vue'

@Component({
  components: {
    Icon,
    AttachmentFile,
  },
})
export default class AttachmentsGroup extends Vue {
  @Prop() private attachments!: Array<{ downloadUrl: string; contentDisposition: string }>

  private expanded = false

  downloadAll() {
    this.attachments.forEach((attachment) => window.open(attachment.downloadUrl))
  }

  get fileTotalSize() {
    const sizeRegex = /size=([0-9]+)/g

    const sizeAccumulator = this.attachments.reduce((result, attachment): number => {
      const [, size = '0'] = sizeRegex.exec(attachment.contentDisposition) || []
      const valueToAdd = parseInt(size, 10)

      return result + valueToAdd
    }, 0)

    return humanFileSize(sizeAccumulator)
  }

  get attachmentsOutput() {
    const { attachments } = this
    const attachmentsQuantity = attachments.length

    const label = attachmentsQuantity > 1 ? 'attachments' : 'attachment'

    return `${attachmentsQuantity} ${label}`
  }
}
</script>

<style lang="scss" scoped>
.attachments-group {
  background: #f1f5ff;
  border-radius: 6px;
  padding: 8px;
  border: 1px solid #e2e9f9;

  .attachments-head {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: fit-content;
  }

  .attachments-info {
    display: flex;
    align-items: center;

    p {
      margin: 0 6px;
      font-size: 14px;
      font-weight: 500;
    }

    span {
      font-size: 11px;
      margin-right: 3px;
    }

    .open {
      transform: rotate(180deg);
    }
  }

  .attachments-actions {
    a {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .attachments-files {
    display: none;
  }

  &.expanded {
    min-height: fit-content;

    .attachments-head {
      border-bottom: 1px solid #e2e9f9;
      padding-bottom: 8px;
    }

    .attachments-files {
      display: flex;
    }
  }
}
</style>
