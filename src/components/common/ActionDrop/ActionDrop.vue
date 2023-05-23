<template>
  <div
    v-click-outside="closeDrop"
    class="action-drop"
    :class="{ container: showSelectedText && text }"
    :style="actionDropStyle"
    @mouseover="mouseOverHandler"
    @mouseleave="mouseHover = false"
    @click="toggleDropMenuVisibility"
  >
    <a v-if="showSelectedText">{{ text }}</a>

    <icon
      :name="icon"
      :width="iconWidth"
      :height="iconHeight"
      :themable="isIconThemeable"
      :inverted="isIconInverted"
      :margin="iconMargin"
    />

    <action-drop-menu
      v-if="dropOpen"
      :position="menuPosition"
      :actions="actions"
      :disable-selection="disableSelection"
      @anActionClicked="closeDrop"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

import ActionDropMenu from '@/components/common/ActionDrop/ActionDropMenu.vue'
import Icon from '@/components/common/Icon.vue'
import MenuAction from '@/components/common/Menu/ts/menuAction'
import clickOutside from '@/directives/clickOutside'

@Component({
  name: 'action-drop',
  components: {
    Icon,
    ActionDropMenu,
  },
  directives: {
    clickOutside,
  },
})
export default class ActionDrop extends Vue {
  @Prop() showSelectedText!: string

  @Prop() disableSelection!: boolean

  @Prop() menuPosition!: 'left' | 'right'

  @Prop() overrideHoverIcon!: string

  @Prop() overrideOpenIcon!: string

  @Prop() width!: string

  @Prop() height!: string

  @Prop() hoverBackgroundColor!: string

  @Prop() openBackgroundColor!: string

  @Prop() border!: string

  @Prop() borderRadius!: string

  @Prop() iconName!: string

  @Prop() iconWidth!: string

  @Prop() iconHeight!: string

  @Prop() iconMargin!: string

  @Prop() actions!: Array<MenuAction>

  @Prop() themable!: boolean

  private mouseHover = false

  private dropOpen = false

  get icon(): string {
    if (!this.overrideOpenIcon) {
      return this.iconName
    }

    if (this.mouseHover) {
      return this.overrideHoverIcon
    }

    if (this.overrideOpenIcon && this.dropOpen) {
      return this.overrideOpenIcon
    }

    return this.iconName
  }

  get text(): string {
    return this.actions.find((action) => action.selected)?.text || ''
  }

  toggleDropMenuVisibility(): void {
    this.dropOpen = !this.dropOpen
    this.mouseHover = false
  }

  closeDrop(action, index): void {
    if (action && index >= 0) {
      this.anActionClicked(action, index)
    }

    this.dropOpen = false
  }

  get actionDropStyle(): Record<string, string | boolean> {
    let background

    if (this.dropOpen) {
      background = this.openBackgroundColor
    }

    if (this.mouseHover) {
      background = this.hoverBackgroundColor
    }

    return {
      background,
      border: this.border || 'none',
      borderRadius: this.borderRadius || '0',
      height: this.height,
      width: this.width,
    }
  }

  get isIconThemeable(): boolean {
    const { dropOpen, mouseHover, overrideHoverIcon, overrideOpenIcon, themable } = this

    return themable && !(mouseHover && overrideHoverIcon) && !(dropOpen && overrideOpenIcon)
  }

  get isIconInverted(): boolean {
    const { themable, mouseHover, overrideHoverIcon } = this

    return themable && mouseHover && !overrideHoverIcon
  }

  @Emit('anActionClicked')
  anActionClicked(_action, _index): void {
    // Emit to father
  }

  private mouseOverHandler() {
    if (!this.dropOpen) {
      this.mouseHover = true
    }
  }
}
</script>

<style lang="scss" scoped>
.action-drop {
  @include transition;
  @include noUserSelect;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;

  &.contanier {
    padding: 5px 7px;
    height: 25px !important;
    border-radius: 6px !important;
    width: fit-content !important;
    align-items: center;

    a {
      margin-right: 5px;
      @include themify {
        color: themed(fontColor);
      }
    }

    &:hover {
      box-shadow: 0px 5px 10px rgba(98, 161, 251, 0.24);
      background: #ffffff;

      a {
        color: #445576;
      }
    }
  }
}
</style>
