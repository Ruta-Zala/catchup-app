<template>
  <div class="sidebar" :class="$store.getters.getIsMenuCollapsed ? 'collapsed' : ''">
    <sidebar-head />

    <div>
      <perfect-scrollbar>
        <div class="content">
          <div class="sidebar-upper">
            <user-section />

            <app-button
              :text="$store.getters.getIsMenuCollapsed ? '' : 'New Email'"
              type="primary"
              hover-shadow="true"
              icon="write-email-white"
              icon-width="24px"
              icon-height="24px"
              font-size="100%"
              height="50px"
              :width="$store.getters.getIsMenuCollapsed ? '50px' : 'auto'"
              :style="
                $store.getters.getIsMenuCollapsed
                  ? 'margin: 10px auto'
                  : 'margin-left:20px;margin-right:20px'
              "
              @click="openEditorMail"
            />

            <metrics-section
              schedule-value="20"
              self-desctruct-value="10"
              analytics-value="120"
              analytics-trend="top"
            />

            <span class="application-version">{{ $store.getters.appVersion }}</span>

            <app-menu
              :mini-mode="$store.getters.getIsMenuCollapsed"
              :actions="menuActions"
              :active-action="activeAction"
              themable="true"
              @anActionClicked="elementSelectedChange"
            />
          </div>
          <div v-if="!$store.getters.getIsMenuCollapsed" class="sidebar-labes">
            <separator />

            <labels-section @aLabelSelected="aLabelSelected" />
          </div>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

import Button from '@/components/common/Button.vue'
import Menu from '@/components/common/Menu/Menu.vue'
import MenuAction from '@/components/common/Menu/ts/menuAction'
import Separator from '@/components/common/Separator.vue'
import LabelsSection from '@/components/common/Sidebar/LabelsSection/LabelsSection.vue'
import MetricsSection from '@/components/common/Sidebar/base/MetricsSection.vue'
import SidebarHead from '@/components/common/Sidebar/base/SidebarHead.vue'
import UserSection from '@/components/common/Sidebar/base/UserSection.vue'

@Component({
  components: {
    SidebarHead,
    UserSection,
    'app-button': Button,
    'app-menu': Menu,
    MetricsSection,
    Separator,
    LabelsSection,
  },
})
export default class Sidebar extends Vue {
  @Prop() private menuActions!: MenuAction[]

  @Prop() private activeAction!: MenuAction

  @Emit('elementSelectedChange')
  elementSelectedChange(_action): void {
    // Emit to father
  }

  @Emit('aLabelSelected')
  aLabelSelected(_value): void {
    // Emit to father
  }

  openEditorMail() {
    const email = {
      selected: true,
      currentlyPrimaryTabOpen: true,
      isEmail: false,
      id: 1,
    }

    this.$store.dispatch('addNewOpenEmail', email)
    this.$store.commit('setCurrentlyPrimaryTabOpen', email)
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  position: relative;
  max-width: 315px;
  width: 100%;
  height: 100%;
  display: flex;
  text-align: center;
  flex: 0 0 auto;
  flex-direction: column;
  box-shadow: $mainShadow;
  z-index: 10;
  overflow: hidden;

  @include themify {
    background: themed(panelGradient);
  }

  .ps {
    max-height: inherit;
  }
  .content {
    display: flex;
    justify-content: space-between;
    flex: 0 0 auto;
    flex-direction: column;
    overflow-x: hidden;
  }

  &.collapsed {
    max-width: 100px;
  }

  .application-version {
    float: right;
    margin-bottom: 15px;
    margin-right: 15px;
  }
}
</style>
