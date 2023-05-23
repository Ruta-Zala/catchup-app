<template>
  <div id="app" :class="appClass">
    <promo-bar />
    <div class="main-wrap">
      <sidebar
        v-if="isSidebarVisible"
        :menu-actions="sidebarRoutes"
        :active-action="currentRouteConfig"
        @elementSelectedChange="elementSelectedChange"
        @aLabelSelected="aLabelSelected"
      />

      <div class="page-container" :class="pageContainerClass">
        <spinner v-if="$store.state.loading" />

        <router-view
          v-else
          :side-bar-menu-selection-menu="currentRouteConfig"
          :labels-selected-search-string="labelsSelectedSearchString"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'

import { ServiceType } from '@/api/apiService'
import MenuAction from '@/components/common/Menu/ts/menuAction'
import PromoBar from '@/components/common/PromoBar.vue'
import Spinner from '@/components/common/Spinner.vue'
import appRoutes from '@/router/appRoutes'

const Sidebar = () => import('@/components/common/Sidebar/Sidebar.vue')

@Component({
  components: {
    Sidebar,
    Spinner,
    PromoBar,
  },
})
export default class App extends Vue {
  private readonly sidebarRoutes = appRoutes

  private currentRoute = 'email'

  private labelsSelectedSearchString = ''

  private labelsSelected: Array<string> = []

  get currentRouteConfig() {
    return this.sidebarRoutes.find(({ value }) => value === this.currentRoute)
  }

  get appClass() {
    return {
      'loading-app': this.$store.state.loading,
    }
  }

  get isSidebarVisible() {
    return this.isAuthenticated && this.$route.name !== 'Login'
  }

  async mounted() {
    document.body.classList.remove('{theme}')
    document.body.className = this.$store.getters.getCurrentTheme
    await this.providersInfo()
  }

  elementSelectedChange(action: MenuAction) {
    this.currentRoute = action.value
  }

  aLabelSelected(value) {
    if (this.labelsSelected.includes(value)) {
      this.labelsSelected = this.labelsSelected.filter((label) => label !== value)
    } else {
      this.labelsSelected.push(value)
    }

    let labelsSelectedSearchString = ''

    this.labelsSelected.forEach((label, index) => {
      labelsSelectedSearchString += `${label}`

      if (index < this.labelsSelected.length - 1) {
        labelsSelectedSearchString += ' OR '
      }
    })

    this.labelsSelectedSearchString =
      this.labelsSelected.length > 0 ? labelsSelectedSearchString : ''
  }

  get pageContainerClass() {
    return {
      authed: this.isAuthenticated,
      collapsed: this.$store.getters.getIsMenuCollapsed,
    }
  }

  get isAuthenticated(): boolean {
    return this.$store.state.isAuthenticated
  }

  @Watch('isAuthenticated')
  redirectToLogin(authState: boolean): void {
    if (!authState) {
      this.$router.replace({ name: 'Login' })
    }
  }

  async providersInfo() {
    interface providerInterface {
      id?: string
    }
    const response: providerInterface | null = await this.$apiService.request(
      ServiceType.Mail,
      `providers`,
      'GET',
    )
    const providersInfo = JSON.parse(<string>response)

    await this.$store.commit('providerInfo', providersInfo?.providers[0].id) // loading provider name
  }
}
</script>

<style lang="scss" scoped>
.loading-app {
  background-color: #fff !important;
  min-width: 100vw;
  min-height: 100vh;
}
.main-wrap {
  display: flex;
  flex: 1;
  height: calc(100% - 55px);
}
</style>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-decoration: none;

  -webkit-appearance: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  -moz-tap-highlight-color: rgba(0, 0, 0, 0);
  -moz-tap-highlight-color: transparent;
}

#app {
  @include transition;
  display: flex;
  flex-direction: column;
  height: 100vh;
  @include themify {
    background-color: themed('backgroundColor');
    color: themed('fontColor');
  }

  .page-container {
    min-width: 100%;
    min-height: 100%;

    &.authed {
      min-width: calc(100% - #{$sidebarWidth});

      &.collapsed {
        min-width: calc(100% - #{$sidebarWidthCollapsed});
      }
    }
  }
}

body {
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.3;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}
</style>
