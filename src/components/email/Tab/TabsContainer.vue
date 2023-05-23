<template>
  <div class="tabs-container">
    <div class="tabs-header">
      <div class="tabs-selectors">
        <div
          v-for="(email, index) in openEmails"
          :key="index"
          class="tab-selector"
          :class="email.currentlyPrimaryTabOpen ? 'selected' : ''"
          @click="selectEmail(email)"
        >
          <div v-if="email.isEmail" class="tab-selector-inner">
            <avatar image-width="24px" image-height="24px" />
            <p>{{ email.title }}</p>
            <div class="close-container" @click.stop="tabEmailClosed(email)">
              <icon name="close" width="12px" height="12px" disable-selection="true" />
            </div>
          </div>
          <div v-else class="tab-selector-inner">
            <p>New Email</p>
            <div class="close-container" @click.stop="tabEmailClosed(email)">
              <icon name="close" width="12px" height="12px" disable-selection="true" />
            </div>
          </div>
        </div>
      </div>

      <div class="tabs-navigator">
        <div class="direction" @click="selectPrevTab">
          <icon class="left-direction" name="drop-down" width="12px" height="12px" />
        </div>

        <div class="direction" @click="selectNextTab">
          <icon class="right-direction" name="drop-down" width="12px" height="12px" />
        </div>

        <span>{{ openEmails.length }}</span>
      </div>
    </div>
    <keep-alive>
      <email-editor-main
        v-if="currentlyPrimaryTabOpen && currentlyPrimaryTabOpen.isEmail === false"
      />
      <email-read v-if="currentlyPrimaryTabOpen && !currentlyPrimaryTabOpen.draft" />
      <email-editor v-else-if="currentlyPrimaryTabOpen && currentlyPrimaryTabOpen.draft" />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import Avatar from '@/components/common/Avatar/base/Avatar.vue'
import Icon from '@/components/common/Icon.vue'
import Tag from '@/components/common/Tag.vue'
import EmailEditorMain from '@/components/email/EmailEditor/EmailEditorMain.vue'
import EmailEditor from '@/components/email/Tab/EmailTab/EmailEditor.vue'
import EmailRead from '@/components/email/Tab/EmailTab/EmailRead.vue'

@Component({
  components: {
    Icon,
    Avatar,
    Tag,
    EmailRead,
    EmailEditor,
    EmailEditorMain,
  },
})
export default class TabsContainer extends Vue {
  get openEmails() {
    return this.$store.getters.getOpenEmails
  }

  get currentlyPrimaryTabOpen() {
    return this.$store.getters.getCurrentlyPrimaryTabOpen
  }

  selectEmail(email) {
    this.$store.commit('setCurrentlyPrimaryTabOpen', email)
  }

  get currentEmailIndex() {
    return this.openEmails.indexOf(
      this.openEmails.find((openEmail) => openEmail.id === this.currentlyPrimaryTabOpen.id),
    )
  }

  selectNextTab() {
    const currentSelectedEmailIndex = this.currentEmailIndex

    if (currentSelectedEmailIndex === this.openEmails.length - 1) {
      return
    }

    this.$store.commit('setCurrentlyPrimaryTabOpen', this.openEmails[currentSelectedEmailIndex + 1])
  }

  selectPrevTab() {
    const currentSelectedEmailIndex = this.currentEmailIndex

    if (currentSelectedEmailIndex <= 0) {
      return
    }

    this.$store.commit('setCurrentlyPrimaryTabOpen', this.openEmails[currentSelectedEmailIndex - 1])
  }

  tabEmailClosed(emailToClose) {
    this.$store.dispatch('closeEmail', emailToClose)
  }
}
</script>

<style lang="scss" scoped>
.tabs-container {
  @include noUserSelect;
  height: 100%;

  /**
  * ! It's not clear where does 440 come from
  */
  width: calc(100% - 440px);

  .tabs-header {
    display: flex;
  }

  .tabs-selectors {
    max-width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex: 1;

    .tab-selector {
      display: flex;
      height: 100%;
      background: #f1f5ff;
      border-right: 1px solid #e2e9f9;
      cursor: pointer;
      align-items: center;
      justify-content: space-between;
      flex: 1;
      overflow: hidden;
      padding: 0 7px;
      &-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      .avatar {
        min-width: 24px;
        min-height: 24px;
        margin-right: 2px;
      }

      .tag {
        height: 20px;
        margin-right: 6px;
      }

      &:hover,
      &.selected {
        background: #32415e;

        p {
          color: #ffffff;
        }
      }

      p {
        color: #445576;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 13px;
        font-weight: 500;
        margin: 0;
        max-width: 80%;
      }

      .close-container {
        @include transition;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 32px;
        min-height: 32px;
        border-radius: 50%;
        &:hover {
          background: #f1f5ff;
        }
      }
    }
  }
  .tabs-navigator {
    display: flex;
    float: right;
    height: 45px;
    background: #ffffff;
    box-shadow: 0 10px 25px rgba(98, 161, 251, 0.33);
    justify-content: center;
    align-items: center;
    padding: 10px;
    z-index: 1;

    & > * {
      margin: 0 5px;
    }

    .direction {
      @include transition;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;

      &:hover {
        background: #f1f5ff;
      }

      .left-direction {
        transform: rotate(90deg);
      }
      .right-direction {
        transform: rotate(-90deg);
      }
    }

    span {
      color: #445576;
      font-weight: 600;
      font-size: 13px;
    }
  }
}
.sub-email-opener {
  @include noUserSelect;
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 7px 10px 7px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  height: 28px;
  background: #e2e9f9;
  color: #7d9bc3;

  a {
    margin-right: 6px;
  }
}
</style>
