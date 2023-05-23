<template>
  <div class="header-email-list">
    <div class="selector">
      <a>Inbox</a>
      <tag :text="emailLimit" type="primary-themable" font-size="100%" />
      <action-drop
        class="email-folder-selector"
        :actions="limits"
        menu-position="left"
        width="16px"
        height="16px"
        icon-name="drop-down"
        icon-width="16px"
        icon-height="16px"
        disable-selection="true"
        @anActionClicked="changeLimit"
      />
    </div>
    <div class="selector">
      <action-drop
        class="email-folder-selector"
        :actions="emailTypes"
        show-selected-text="true"
        menu-position="left"
        width="16px"
        height="16px"
        icon-name="drop-down"
        icon-width="16px"
        icon-height="16px"
        @anActionClicked="changeLabelToSearch"
      />
      <action-drop
        class="options"
        :actions="actions"
        menu-position="left"
        width="32px"
        height="32px"
        hover-background-color="rgba(255, 255, 255, 0.05)"
        border="none"
        border-radius="50%"
        icon-name="sub-menu"
        icon-width="16px"
        icon-height="16px"
        icon-margin="auto 25px"
        style="right: -3px"
        disable-selection="true"
        @anActionClicked="actionInList"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'

import ActionDrop from '@/components/common/ActionDrop/ActionDrop.vue'
import MenuAction from '@/components/common/Menu/ts/menuAction'
import Tag from '@/components/common/Tag.vue'

@Component({
  components: {
    Tag,
    ActionDrop,
  },
})
export default class HeaderEmailList extends Vue {
  @Prop() private emailLimit!: number

  @Prop() private selectedEmailIds!: Array<string>

  @Prop() private sideBarMenuSelectionMenu!: MenuAction

  private readonly limits: Array<MenuAction> = [
    {
      text: '20',
      value: '20',
    },
    {
      text: '50',
      value: '50',
    },
    {
      text: '100',
      value: '100',
    },
    {
      text: '150',
      value: '150',
    },
  ]

  private readonly emailTypes: Array<MenuAction> = [
    {
      text: 'Recent',
      selected: true,
      value: 'recent',
    },
    {
      text: 'Unread',
      selected: false,
      value: 'unread',
    },
    {
      text: 'Read',
      selected: false,
      value: 'read',
    },
  ]

  private actions: Array<MenuAction> = [
    {
      text: 'Select all',
      value: 'select-all',
    },
    {
      text: 'Deselect all',
      value: 'deselect-all',
    },
    {
      text: 'Mark selected as read',
      disabled: this.isMultiActionDisabled,
      value: 'mark-selected-as-read',
    },
    {
      text: 'Mark selected as unread',
      disabled: this.isMultiActionDisabled,
      value: 'mark-selected-as-unread',
    },
  ]

  get isMultiActionDisabled() {
    return this.selectedEmailIds.length === 0
  }

  // eslint-disable-next-line max-lines-per-function
  @Watch('selectedEmailIds')
  selectedIdsChanged() {
    this.actions = [
      {
        text: 'Select all',
        value: 'select:all',
      },
      {
        text: 'Deselect all',
        value: 'deselect:all',
      },
      {
        text: 'Mark selected as read',
        value: 'set-selected-as-read',
        disabled: this.isMultiActionDisabled,
      },
      {
        text: 'Mark selected as unread',
        value: 'set-selected-as-unread',
        disabled: this.isMultiActionDisabled,
      },
      this.sideBarMenuSelectionMenu.value !== 'in:spam'
        ? {
            text: 'Move to Spam',
            value: 'move-to-spam',
            disabled: this.isMultiActionDisabled,
          }
        : {
            text: 'Restore from Spam',
            value: 'restore-from-spam',
            disabled: this.isMultiActionDisabled,
          },
      this.sideBarMenuSelectionMenu.value !== 'in:trash'
        ? {
            text: 'Move to Trash',
            value: 'move-to-trash',
            disabled: this.isMultiActionDisabled,
          }
        : {
            text: 'Restore from Trash',
            value: 'restore-from-trash',
            disabled: this.isMultiActionDisabled,
          },
    ]

    if (this.sideBarMenuSelectionMenu.value === 'in:trash') {
      this.actions = [
        {
          text: 'Empty Trash',
          value: 'empty-trash',
        },
        ...this.actions,
      ]
    } else if (this.sideBarMenuSelectionMenu.value === 'in:spam') {
      this.actions = [
        {
          text: 'Empty Spam',
          value: 'empty-spam',
        },
        ...this.actions,
      ]
    }
  }

  @Emit('changeLimit')
  changeLimit(_action) {
    // Emit to father
  }

  @Emit('changeLabelToSearch')
  changeLabelToSearch(_action) {
    // Emit to father
  }

  @Emit('actionInList')
  actionInList(_action) {
    // Emit to father
  }
}
</script>

<style lang="scss" scoped>
.header-email-list {
  display: flex;
  padding: 0 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  z-index: 5;

  a {
    font-weight: 500;
    font-size: 20px;
  }

  .selector {
    display: flex;
    align-items: center;

    a {
      margin-right: 10px;
    }

    .email-folder-selector {
      margin: 0px 10px 0px 10px;
    }
  }
}
</style>

<style lang="scss">
.selector {
  .options {
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
</style>
