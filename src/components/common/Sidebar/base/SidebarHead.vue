<template>
  <div class="sidebar-head">
    <action-drop
      :actions="appAction"
      :width="actionDropWidth"
      height="75px"
      hover-background-color="#F8FAFF"
      open-background-color="linear-gradient(to right, #82e0db 0%, #22aae2 100%)"
      override-hover-icon="app-dark"
      override-open-icon="app-white"
      icon-name="app"
      icon-width="24px"
      icon-height="24px"
      icon-margin="auto 25px"
      themable="true"
    />
    <icon
      v-if="!$store.getters.getIsMenuCollapsed"
      name="catchupemail-logo"
      width="200px"
      height="50px"
      themable="true"
      margin="auto 25px"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import ActionDrop from '@/components/common/ActionDrop/ActionDrop.vue'
import Icon from '@/components/common/Icon.vue'
import MenuAction from '@/components/common/Menu/ts/menuAction'

@Component({
  components: {
    Icon,
    ActionDrop,
  },
})
export default class SidebarHead extends Vue {
  private readonly appAction: Array<MenuAction>

  constructor() {
    super()

    this.appAction = [
      {
        text: 'Welcome',
        icon: 'logo-icon-dark',
        value: 'welcome',
      },
      {
        text: 'Email',
        icon: 'email-dark',
        value: 'email',
      },
      {
        text: 'Schedule',
        icon: 'schedule-dark',
        value: 'schedule',
      },
      {
        text: 'Self-Destruct',
        icon: 'self-destruct-dark',
        value: 'self:destruct',
      },
      {
        text: 'Analytics',
        icon: 'analytics-dark',
        value: 'analytics',
      },
      {
        text: 'Dashboard',
        icon: 'user-dark',
        value: 'dashboard',
      },
    ]
  }

  get actionDropWidth() {
    return this.$store.getters.getIsMenuCollapsed ? '100px' : '75px'
  }
}
</script>

<style lang="scss" scoped>
.sidebar-head {
  @include themify {
    background: themed(panelBackground);
    border-left: 1px solid themed(borderColor);
    box-shadow: themed(sidebarHeadShadow);
  }

  display: flex;
  align-items: center;
  height: 70px;
  min-height: 70px;
}
</style>
