<template>
  <div class="user-section" :class="{ collapsed: $store.getters.getIsMenuCollapsed }">
    <user-state
      class="user-state"
      :user-image="currentUser.profileUrlPicture"
      :email-pause="$store.getters.getIsInSleepMode"
      @click.native="toggleSleepMode"
    />
    <div class="user-info">
      <div class="top-section">
        <div class="tags">
          <tag text="Business" type="primary" hover-shadow="true" />

          <tag text="Default" type="default" hover-shadow="true" />
        </div>

        <action-drop
          v-if="!$store.getters.getIsMenuCollapsed"
          class="user-actions"
          menu-position="left"
          :actions="userAction"
          width="26px"
          height="26px"
          hover-background-color="rgba(255, 255, 255, 0.05)"
          border="1px solid #ea3d3d"
          border-radius="50%"
          icon-name="user-red"
          icon-width="12px"
          icon-height="12px"
          icon-margin="auto 25px"
          disable-selection="true"
        />
      </div>
      <div v-if="!$store.getters.getIsMenuCollapsed" class="data">
        <p>{{ currentUser.firstName }} {{ currentUser.lastName }}</p>
        <p>{{ currentUser.email }}</p>
        <action-drop
          class="user-actions rotate-img"
          menu-position="left"
          :actions="userAction"
          width="32px"
          height="32px"
          hover-background-color="rgba(255, 255, 255, 0.05)"
          border="none"
          border-radius="50%"
          icon-name="sub-menu"
          icon-width="16px"
          icon-height="18px"
          icon-margin="auto 25px"
          style="right: -3px"
          disable-selection="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import ActionDrop from '@/components/common/ActionDrop/ActionDrop.vue'
import MenuAction from '@/components/common/Menu/ts/menuAction'
import Tag from '@/components/common/Tag.vue'
import UserState from '@/components/common/UserState.vue'

@Component({
  components: {
    ActionDrop,
    UserState,
    Tag,
  },
})
export default class UserSection extends Vue {
  private readonly userAction: Array<MenuAction> = [
    {
      text: 'Edit Profile',
      icon: 'user-dark',
      value: 'edit:profile',
    },
    {
      text: 'Account Settings',
      icon: 'settings-dark',
      value: 'account:settings',
    },
    {
      text: 'Sign out',
      icon: 'exit-dark',
      value: 'sign:out',
    },
  ]

  toggleSleepMode() {
    const isInSleepMode = this.$store.getters.getIsInSleepMode

    this.$store.commit('setSleepMode', !isInSleepMode)
  }

  get currentUser() {
    return this.$store.getters.getUser
  }

  get emailPause() {
    return this.currentUser.settings.find((setting) => setting.name === 'email-pause').value
  }
}
</script>

<style lang="scss">
.user-section {
  @include transition;
  padding: 20px;
  margin: 1vh 0 1vh 0;
  display: flex;
  width: 100%;

  &.collapsed {
    flex-direction: column-reverse;
    margin: 0;
    align-items: center;
    padding: 10px;

    .user-info {
      padding-left: 5px;
    }

    .tags {
      flex-direction: column;

      .tag {
        margin-right: 0 !important;

        &:not(:first-of-type) {
          margin-top: 6px;
        }
      }
    }
  }

  .user-state {
    margin-top: 6px;
  }

  .user-info {
    padding-left: 20px;
    width: 100%;
    .top-section {
      position: relative;
      display: flex;
      .tags {
        height: 24px;
        display: flex;

        > * {
          &:first-of-type {
            margin-right: 6px;
          }
        }
      }
    }

    .data {
      text-align: left;
      margin-top: 6px;
      position: relative;
      @include noUserSelect;

      p {
        font-size: 14px;
        font-weight: 500;

        @include themify {
          color: themed(fontColor);
        }

        &:not(:first-of-type) {
          font-size: 11px;
          font-weight: 300;
          color: $borderColorDark;
        }
      }
      .user-actions {
        display: none;
      }
      &:hover {
        .user-actions {
          display: flex;
        }
      }
    }
  }
  .user-actions {
    position: absolute;
    right: 0;
    top: 0;

    &.rotate-img {
      span {
        svg {
          transform: rotate(90deg);
        }
      }

      li {
        span {
          svg {
            transform: none;
          }
        }
      }
    }
  }
}
</style>
