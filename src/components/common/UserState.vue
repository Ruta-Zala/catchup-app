<template>
  <div class="user-state" :class="$store.getters.getIsMenuCollapsed ? 'collapsed' : ''">
    <avatar image-width="50px" image-height="50px" :user-image="userImage" />
    <div
      class="user-state-container"
      :style="!emailPause ? 'background-color: #01B272;' : ''"
      @click="switchEmailPause"
    >
      <icon v-show="emailPause" name="sleep-dark" width="16px" height="16px" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { ServiceType } from '@/api/apiService'
import Avatar from '@/components/common/Avatar/base/Avatar.vue'
import Icon from '@/components/common/Icon.vue'

@Component({
  components: {
    Avatar,
    Icon,
  },
})
export default class UserState extends Vue {
  @Prop() userImage!: string

  @Prop() emailPause!: boolean

  switchEmailPause() {
    this.$apiService.request(
      ServiceType.Identity,
      `users/${this.$store.getters.getUser.email}/settings/email-pause`,
      'PUT',
      {
        enabled: !this.emailPause,
      },
    )
  }

  get userStateStyle() {
    return this.emailPause ? '' : 'background-color: #01B272;'
  }
}
</script>

<style lang="scss" scoped>
.user-state {
  position: relative;
  width: fit-content;
  height: fit-content;

  &.collapsed {
    .avatar {
      margin-top: 25px;
    }
  }

  .user-state-container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    background-color: $whiteColor;
    border-radius: 50%;
    left: -6px;
    bottom: -6px;
    box-shadow: $tagsShadow;
    cursor: pointer;
  }
}
</style>
