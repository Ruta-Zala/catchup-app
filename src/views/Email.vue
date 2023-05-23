<template>
  <div class="email">
    <top-search-area @searchTermsChange="searchTermsChange" />
    <div class="content">
      <email-list
        :search-terms="searchTerms"
        :side-bar-menu-selection-menu="sideBarMenuSelectionMenu"
        :labels-selected-search-string="labelsSelectedSearchString"
      />
      <tabs-container v-if="$store.getters.getOpenEmails.length > 0" />
      <email-welcome v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import MenuAction from '@/components/common/Menu/ts/menuAction'
import EmailList from '@/components/email/EmailList/EmailList.vue'
import EmailWelcome from '@/components/email/EmailWelcome.vue'
import TabsContainer from '@/components/email/Tab/TabsContainer.vue'
import TopSearchArea from '@/components/email/TopSearchArea/TopSearchArea.vue'

@Component({
  components: {
    TopSearchArea,
    EmailList,
    TabsContainer,
    EmailWelcome,
  },
})
export default class EmailView extends Vue {
  @Prop() private sideBarMenuSelectionMenu!: MenuAction

  @Prop() private labelsSelectedSearchString!: string

  private searchTerms: Array<string> = []

  searchTermsChange(searchTerms) {
    this.searchTerms = searchTerms
  }
}
</script>

<style lang="scss" scoped>
.email {
  height: 100%;
  width: 100%;

  .content {
    position: relative;
    display: flex;
    height: calc(100% - 70px);
    width: 100%;
  }
}
</style>
