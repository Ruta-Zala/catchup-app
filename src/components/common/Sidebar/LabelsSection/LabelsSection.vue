<template>
  <div class="labels">
    <div class="header">
      <p>Labels</p>
      <div class="header-actions">
        <div class="add-label" @click="addLabel">
          <icon :actions="[]" name="close" width="9px" height="9px" disable-selection="true" />
        </div>
        <action-drop
          class="options"
          menu-position="left"
          :actions="labelActions"
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
        />
      </div>
    </div>
    <app-input :value="labelSearchValue" placeholder="Search for label..." @input="filterLabels" />
    <perfect-scrollbar class="labels-result">
      <app-menu
        :actions="visibleUserLabel"
        :menu-in-edit-mode="labelsInEditMode"
        edit-mode-text="Insert label name..."
        themable="true"
        element-border-radius="50px"
        tag-expandable="true"
        tag-themable="true"
        multi="true"
        toggle-selection="true"
        tag-font-size="11px"
        actions-deleteble="true"
        @anActionClicked="labelSelected"
        @aMenuVoiceCreated="aMenuVoiceCreated"
        @deleteAction="deleteAction"
      />
    </perfect-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'

import { ServiceType } from '@/api/apiService'
import ActionDrop from '@/components/common/ActionDrop/ActionDrop.vue'
import Icon from '@/components/common/Icon.vue'
import Input from '@/components/common/InputGroup/base/Input.vue'
import Menu from '@/components/common/Menu/Menu.vue'
import MenuAction from '@/components/common/Menu/ts/menuAction'
import ApiResponse from '@/components/common/Sidebar/LabelsSection/ts/apiResponse'

@Component({
  components: {
    ActionDrop,
    'app-input': Input,
    'app-menu': Menu,
    Icon,
  },
})
export default class LabelsSection extends Vue {
  private labelSearchValue = ''

  private readonly labelActions: Array<MenuAction> = [
    {
      text: 'Order by name',
      value: 'order:by:name',
      action: () => {
        /**/
      },
    },
    {
      text: 'Order by number',
      value: 'order:by:number',
      action: () => {
        /**/
      },
    },
    {
      text: 'Manage Labels',
      value: 'manage:labels',
      action: () => {
        /**/
      },
    },
  ]

  private userLabel: Array<MenuAction> = []

  private visibleUserLabel: Array<MenuAction> = []

  private lastSelectedLabel: MenuAction | null = null

  private labelsInEditMode = false

  addLabel(): void {
    let labelToPutCreated = this.userLabel

    if (this.lastSelectedLabel) {
      if (!this.lastSelectedLabel.subMenu) {
        this.lastSelectedLabel.subMenu = []
      }

      labelToPutCreated = this.lastSelectedLabel.subMenu
    }

    labelToPutCreated.push({
      text: '',
      inEditMode: true,
      value: '',
    })

    this.labelsInEditMode = true
  }

  async aMenuVoiceCreated(action): Promise<void> {
    await this.$apiService.request(
      ServiceType.Mail,
      // eslint-disable-next-line max-len
      `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/labels`,
      'POST',
      {
        name:
          this.lastSelectedLabel && this.lastSelectedLabel.text
            ? `${this.lastSelectedLabel.text}/${action.text}`
            : action.text,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
      },
    )

    this.loadLabels()
  }

  async deleteAction(action): Promise<void> {
    await this.$apiService.request(
      ServiceType.Mail,
      // eslint-disable-next-line max-len
      `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/labels/${action.id}`,
      'DELETE',
    )

    this.loadLabels()
  }

  filterLabels(event): void {
    if (event.srcElement.value === '') {
      this.visibleUserLabel = this.userLabel

      return
    }

    this.visibleUserLabel = this.userLabel.filter((label) =>
      label.text.toLowerCase().includes(event.srcElement.value.toLowerCase()),
    )
  }

  labelSelected(action): void {
    this.lastSelectedLabel =
      this.lastSelectedLabel === null || this.lastSelectedLabel.value !== action.value
        ? action
        : null

    if (action.subMenu) {
      return
    }

    this.aLabelSelected(action.value)
  }

  /**
   * TODO: conduct refactoring
   */
  // eslint-disable-next-line max-lines-per-function
  async loadLabels(): Promise<void> {
    this.userLabel = []

    const response: ApiResponse | null = await this.$apiService.request(
      ServiceType.Mail,
      // eslint-disable-next-line max-len
      `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/labels`,
      'GET',
    )

    if (!response) {
      return
    }

    /**
     * TODO: conduct refactoring
     */
    // eslint-disable-next-line max-lines-per-function
    response.labels.forEach((label) => {
      if (label.type === 'system' || label.labelListVisibility === 'hide') {
        return
      }

      if (!label.name.includes('/')) {
        this.userLabel.push({
          value: `label:${label.name.toLowerCase().replace(' ', '-')}`,
          text: label.name,
          id: label.id,
        })
      } else {
        const [fatherLabelName] = label.name.split('/')

        const fatherLabel: MenuAction | undefined = this.userLabel.find(
          (userLabelItem) => userLabelItem.text === fatherLabelName,
        )

        if (!fatherLabel) {
          return
        }

        if (!fatherLabel.subMenu) {
          fatherLabel.subMenu = []
        }

        fatherLabel.subMenu.push({
          value: `label:${label.name.toLowerCase().replace('/', '-').split(' ').join('-')}`,
          text: label.name.split('/')[1],
          id: label.id,
        })

        fatherLabel.counter = fatherLabel.subMenu.length.toString()
      }
    })

    this.visibleUserLabel = this.userLabel
  }

  created(): void {
    this.loadLabels()
  }

  /**
   * ! Never used (currently at least)
   */
  async setSelectedAs(read): Promise<void> {
    await this.$apiService.request(
      ServiceType.Mail,
      // eslint-disable-next-line max-len
      `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/emails/modify`,
      'POST',
      {
        addLabelIds: !read ? ['UNREAD'] : [],
        removeLabelIds: read ? ['UNREAD'] : [],
      },
    )
  }

  @Emit('aLabelSelected')
  aLabelSelected(_value): void {
    // Emit to father
  }
}
</script>

<style lang="scss">
.labels {
  @include noUserSelect;
  position: relative;
  padding: 0px 20px;
  height: 280px;
  border-radius: 6px;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    font-weight: 600;
    text-align: left;
    font-size: 100%;

    .header-actions {
      display: flex;
    }

    .add-label {
      @include transition;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;

      svg {
        transform: rotate(45deg);
      }

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }

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

  .labels-result {
    margin-top: 10px;
    height: 110px;
  }
}
</style>
