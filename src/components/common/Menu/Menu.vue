<template>
  <ul class="menu">
    <li
      v-for="(action, index) in actions"
      :key="index"
      class="element"
      :class="actionClass(action)"
      :style="style(index)"
      @click="actionClickHandler(action, index, $event)"
    >
      <div class="element-content">
        <icon
          v-if="action.icon"
          :name="action.icon"
          :width="miniMode ? '21px' : '16px'"
          :height="miniMode ? '21px' : '16px'"
          :themable="themable"
        />

        <a
          v-if="!miniMode && !action.inEditMode"
          class="menu-element-text"
          :class="{ disabled: action.disabled }"
          :name="action.text"
        >
          {{ action.text }}
        </a>

        <input
          v-if="action.inEditMode"
          ref="input"
          v-model="action.text"
          type="text"
          :placeholder="editModeText"
          @keyup.enter="aMenuVoiceCreated(action)"
        />

        <div
          v-if="action.subMenu || action.counter"
          class="additional"
          :style="miniMode ? 'right: 28%;top: 35px;' : ''"
        >
          <action-drop
            v-if="action.subMenu && !action.counter"
            class="sub-opener"
            menu-position="left"
            :actions="action.subMenu"
            :active-action="activeAction"
            width="16px"
            height="16px"
            icon-name="drop-down"
            icon-width="16px"
            icon-height="16px"
            disable-selection="true"
          />

          <tag
            v-if="action.counter"
            :text="action.counter"
            :type="tagThemable ? 'themable-secondary' : 'primary'"
            :font-size="tagFontSize || '100%'"
            :expandable="tagExpandable"
          />
        </div>

        <div
          v-else-if="actionsDeleteble && !action.subMenu"
          class="additional"
          :style="miniMode ? 'right: 28%;top: 35px;' : ''"
        >
          <div class="delete-action" @click.stop="deleteAction(action)">
            <icon :actions="[]" name="trash" width="9px" height="9px" disable-selection="true" />
          </div>
        </div>
      </div>

      <sub-menu
        v-if="action.subMenu && action.counter && subMenuOpen === index"
        class="sub-menu"
        :actions="action.subMenu"
        :themable="themable"
        :element-border-radius="elementBorderRadius"
        :tag-expandable="tagExpandable"
        :tag-themable="tagThemable"
        :tag-font-size="tagFontSize"
        :multi="multi"
        :edit-mode-text="editModeText"
        :toggle-selection="toggleSelection"
        :menu-in-edit-mode="menuInEditMode"
        :actions-deleteble="actionsDeleteble"
        @anActionClicked="anActionClicked"
        @aMenuVoiceCreated="aMenuVoiceCreated"
        @deleteAction="deleteAction"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'
import MenuAction from '@/components/common/Menu/ts/menuAction'
import Tag from '@/components/common/Tag.vue'
import clickOutside from '@/directives/clickOutside'

// recursive component, so lazy loading
const ActionDrop = () => import('@/components/common/ActionDrop/ActionDrop.vue')
// const SubMenu = () => import('@/components/common/Menu/Menu.vue')

@Component({
  components: {
    ActionDrop,
    Icon,
    Tag,
  },
  directives: {
    clickOutside,
  },
})
export default class Menu extends Vue {
  @Prop() actions!: Array<MenuAction>

  @Prop() activeAction!: MenuAction

  @Prop() editModeText!: string

  @Prop() miniMode!: boolean

  @Prop() tagFontSize!: boolean

  @Prop() tagExpandable!: boolean

  @Prop() tagThemable!: boolean

  @Prop() disableSelection!: boolean

  @Prop() actionsDeleteble!: boolean

  @Prop() themable!: boolean

  @Prop() elementColor!: string

  @Prop() elementBorder!: string

  @Prop() elementBorderRadius!: string

  @Prop() elementHover!: string

  @Prop() elementSelection!: string

  @Prop() multi!: boolean

  @Prop() toggleSelection!: boolean

  @Prop() menuInEditMode!: boolean

  private subMenuOpen = -1

  /**
   * ! Not used, so should probably be removed
   */
  // disableEdit(action) {
  //   if (!(action.inEditMode && this.menuInEditMode)) {
  //     return
  //   }

  //   action.inEditMode = false
  //   this.menuInEditMode = false
  // }

  actionClickHandler(action: MenuAction, index: number, ev: Event) {
    if (action.inEditMode) {
      ev.stopPropagation()

      return
    }

    if (action.subMenu) {
      this.toggleSubMenu(action, index)

      return
    }

    if (action.action) {
      action.action()
    }

    if (this.disableSelection) {
      return
    }

    this.anActionClicked(action, index, ev)
  }

  toggleSubMenu(_: MenuAction, index: number) {
    this.subMenuOpen = this.subMenuOpen !== index ? index : -1
  }

  actionClass(action: MenuAction) {
    return {
      themable: this.themable,
      selected: this.activeAction?.value ? action.value === this.activeAction.value : false,
    }
  }

  /**
   * TODO: prettify
   * ? Do we really need passing props for styles that way?
   */
  style(index) {
    let style = `color: ${this.elementColor};`

    style += this.miniMode ? 'height: 70px;justify-content: center;' : ''
    style +=
      this.miniMode && (this.actions[index].subMenu || this.actions[index].counter)
        ? ''
        : 'align-content: center;'
    style += index > 0 ? `border-top: ${this.elementBorder};` : ''
    style += this.elementBorderRadius ? `border-radius: ${this.elementBorderRadius};` : ''
    style += this.subMenuOpen === index ? 'background: transparent;' : ''

    return style
  }

  @Emit('anActionClicked')
  anActionClicked(_action, _index, _event) {
    // Emits event to parent
    // automatically passes arguments to parent handler
  }

  @Emit('aMenuVoiceCreated')
  aMenuVoiceCreated(_action) {
    // Emits event to parent
    // automatically passes arguments to parent handler
  }

  @Emit('deleteAction')
  deleteAction(_action) {
    // Emits event to parent
    // automatically passes arguments to parent handler
  }

  @Watch('menuInEditMode')
  menuInEditModeChange() {
    this.$forceUpdate()
  }
}
</script>

<style lang="scss">
.menu {
  @include noUserSelect;
  cursor: pointer;
  list-style: none;

  .element {
    position: relative;
    padding: 12px 15px;
    background-color: none;
    width: 100%;
    text-align-last: justify;
    font-weight: 500;
    font-size: 13px;
    display: flex;
    flex-wrap: wrap;

    .element-content {
      display: flex;
    }

    .sub-menu {
      margin-top: 10px;
      width: 100%;
      position: relative;
    }

    .menu-element-text {
      white-space: nowrap;
      margin-left: 10px;
    }

    .menu-element-text::before {
      display: block;
      content: attr(name);
      font-weight: bold;
      height: 0;
      overflow: hidden;
      visibility: hidden;
    }

    input {
      border: none;
      margin-left: 10px;
      height: 100%;
      width: calc(100% - 10px);
      background: none;
      text-decoration: inherit;
      cursor: pointer;
      outline: none;
      background: transparent;
      border: none;
      font-size: 13px;

      @include themify {
        color: themed(fontColor);
      }
    }

    .disabled {
      color: $borderColorBase;
    }

    &:hover {
      background: $backgroundColor;
      font-weight: 700;
    }

    &.selected {
      background: $backgroundColor;
      font-weight: 700;
      border-left: 5px solid $fontColorBlue;
      padding: 12px 10px 12px 10px;
    }

    &.themable {
      @include themify {
        &:hover {
          background: themed(menuItemActive);
        }

        &.selected {
          background: themed(menuItemActive);
        }
      }
    }
  }

  .additional {
    position: absolute;
    right: 20px;
    align-self: center;

    .sub-opener {
      > span {
        svg {
          transform: rotate(-90deg);
        }
      }
    }

    .delete-action {
      @include transition;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;

      &:hover {
        @include themify {
          color: themed(tagSecondayColor);
          background: themed(tagSecondaryBackground);
        }
      }
    }
  }
}
</style>
