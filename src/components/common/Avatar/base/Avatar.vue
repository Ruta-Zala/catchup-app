<template>
  <div class="avatar" :style="`height:${imageHeight}; width:${imageWidth}`">
    <img />
    <!-- src has fall back until email is passed -->
    <icon :height="imageHeight" :width="imageWidth" :src="iconSource" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'

const avatarDummyURI = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'

@Component({
  components: {
    Icon,
  },
})
export default class Avatar extends Vue {
  @Prop() userImage!: string

  @Prop() imageWidth!: string

  @Prop() imageHeight!: string

  get iconSource() {
    return this.userImage || avatarDummyURI
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  display: flex;
  border-radius: 50%;
  overflow: hidden;
}
</style>
