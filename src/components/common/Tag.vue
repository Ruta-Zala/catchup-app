<template>
  <div class="tag" :class="tagClass" :style="style">
    <icon
      v-if="icon"
      :name="icon"
      width="12px"
      height="12px"
      :themable="type === 'themable' || themable"
      :inverted="inverted"
    />

    {{ text }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'

@Component({
  components: { Icon },
})
export default class Tag extends Vue {
  @Prop() text!: string

  @Prop() type!:
    | 'primary'
    | 'default'
    | 'themable'
    | 'themable-secondary'
    | 'primary-themable'
    | 'secondary'

  @Prop() light!: boolean

  @Prop() themable!: boolean

  @Prop() inverted!: boolean

  @Prop() textColor!: string

  @Prop() backgroundColor!: string

  @Prop() border!: string

  @Prop() height!: string

  @Prop() padding!: string

  @Prop() expandable!: boolean

  @Prop() fontSize!: string

  @Prop() fontWeight!: string

  @Prop() hoverShadow!: boolean

  @Prop() icon!: string

  get style() {
    let style = this.fontSize ? `font-size:${this.fontSize};` : ''

    if (this.textColor) {
      style += `color: ${this.textColor};`
    }

    if (this.backgroundColor) {
      style += `background: ${this.backgroundColor};`
    }

    if (this.border) {
      style += `border: ${this.border};`
    }

    if (this.height) {
      style += `height: ${this.height};`
    }

    if (this.padding) {
      style += `padding: ${this.padding};`
    }

    if (this.fontWeight) {
      style += `font-weight: ${this.fontWeight};`
    }

    return style
  }

  get tagClass() {
    const { type } = this

    return {
      [type]: !!type,
      light: this.light,
      hover: this.hoverShadow,
      expandable: this.expandable,
    }
  }
}
</script>

<style lang="scss" scoped>
.tag {
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  border-radius: 50px;
  padding: 3px 12px;
  min-width: fit-content;
  min-height: fit-content;
  color: $whiteColor;

  @include noUserSelect;
  @include transition;

  &.primary {
    @include horizontalGradient;
  }

  &.default {
    background: $borderColorBase;
    color: $fontColorBase;
  }

  &.secondary {
    background: $backgroundColorDark;
  }

  &.themable {
    @include themify {
      background: themed(primaryBackground);
    }
  }

  &.themable-secondary {
    background: none;
    @include themify {
      color: themed(fontColor);
    }
  }

  &.primary-themable {
    @include themify {
      background: themed(tagPrimaryThemableBackground);
    }
  }

  &.expandable {
    font-weight: 400;
    background: none;
    &:hover {
      &.primary {
        @include horizontalGradient;
      }

      &.default {
        background: $borderColorBase;
        color: $fontColorBase;
      }

      &.themable {
        @include themify {
          background: themed(primaryBackground);
        }
      }

      &.themable-secondary {
        @include themify {
          color: themed(tagSecondayColor);
          background: themed(tagSecondaryBackground);
        }
      }

      &.primary-themable {
        @include themify {
          background: themed(tagPrimaryThemableBackground);
        }
      }

      padding: 7px 30px 7px 10px;
      font-weight: 600;
    }
  }
  &.hover {
    &:hover {
      box-shadow: $tagsShadowDark;
    }
  }

  &.light {
    padding: 0;
  }
}
</style>
