<template>
  <div class="top-search-area">
    <div class="collapse-sidebar" @click="toggleCollapseMenu">
      <icon :name="collapseIconName" width="16px" height="16px" disable-selection="true" />
    </div>
    <div class="search">
      <icon name="search" width="16px" height="16px" disable-selection="true" themable="true" />
    </div>
    <search-email-box @searchTermsChange="searchTermsChange" />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'
import SearchEmailBox from '@/components/email/TopSearchArea/base/SearchEmailBox.vue'

@Component({
  components: {
    Icon,
    SearchEmailBox,
  },
})
export default class TopSearchArea extends Vue {
  toggleCollapseMenu() {
    const isMenuCollapsed = this.$store.getters.getIsMenuCollapsed

    this.$store.commit('setCollapsedMenu', !isMenuCollapsed)
  }

  get collapseIconName() {
    return this.$store.getters.getIsMenuCollapsed ? 'collapse-open' : 'collapse'
  }

  @Emit('searchTermsChange')
  searchTermsChange(_searchTerms) {
    // Emit to father
  }
}
</script>

<style lang="scss" scoped>
.top-search-area {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  box-shadow: 0px 10px 40px rgba(98, 161, 251, 0.2);
  height: 70px;
  min-height: 70px;
  background: #32415e;
  z-index: 5;

  @include themify {
    background: themed(panelBackground);
  }

  .collapse-sidebar,
  .search {
    @include transition;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 25px;
    width: 32px;
    height: 32px;
    border-radius: 50%;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  .search {
    margin: 10px;
  }
}
</style>
