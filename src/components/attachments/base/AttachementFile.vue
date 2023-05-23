<template>
  <div class="attachment-file" @click="downloadFile">
    <span>{{ extension }}</span>
    <p>{{ fileName }}</p>
    <icon name="download" width="16px" height="16px" disable-selection="true" margin="0" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'

@Component({
  components: {
    Icon,
  },
})
export default class AttachmentsFile extends Vue {
  @Prop() private downloadUrl!: string

  @Prop() private filename!: string

  downloadFile() {
    window.open(this.downloadUrl)
  }

  get extension() {
    const [, extension] = this.filename.split('.')

    return extension
  }

  get fileName() {
    const [name] = this.filename.split('.')

    return name
  }
}
</script>

<style lang="scss" scoped>
.attachment-file {
  cursor: pointer;
  display: flex;
  min-width: 170px;
  margin: 3px 5px;
  padding: 5px 10px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e2e9f9;
  align-items: center;
  flex-wrap: wrap;
  width: auto;
  font-size: 14px;

  span {
    &:first-of-type {
      display: flex;
      margin: 0 15px 0px 0 !important;
      font-size: 11px;
      font-weight: 600;
      padding: 0;
      justify-content: center;
      align-items: center;
      background: #ea3d3d;
      width: 32px;
      height: 32px;
      min-height: 32px;
      min-width: 32px;
      color: #fff;
      border-radius: 50%;
    }
  }

  p {
    margin-right: 15px;
  }
}
</style>
