<template>
  <div class="button" :class="buttonClass" :style="style" @click="click">
    <icon
      v-if="icon"
      :name="icon"
      :width="iconWidth"
      :height="iconHeight"
      :themable="type === 'themable'"
    />
    {{ text }}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'

@Component({
  components: {
    Icon,
  },
})
export default class Button extends Vue {
  @Prop() width!: string

  @Prop() height!: string

  @Prop() text!: string

  @Prop() type!: 'primary' | 'default' | 'secondary' | 'themable'

  @Prop() light!: boolean

  @Prop() fontSize!: string

  @Prop() hoverShadow!: boolean

  @Prop() icon!: string

  @Prop() iconWidth!: string

  @Prop() iconHeight!: string

  get buttonClass() {
    const { type } = this

    return {
      [type]: !!type,
      light: this.light,
      hover: this.hoverShadow,
    }
  }

  get style() {
    return `width: ${this.width};height: ${this.height}; font-size: ${this.fontSize};`
  }

  @Emit('click')
  click() {
    // emit to father:
  }
}
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  border-radius: 50px;
  padding: 3px 12px;
  min-width: fit-content;
  min-height: fit-content;
  color: $whiteColor;
  cursor: pointer;

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
    box-shadow: 0px 10px 25px rgba(98, 161, 251, 0.33);
    background: $whiteColor;
    color: $fontColorBase;
  }

  &.themable {
    @include themify {
      background: themed(primaryBackground);
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
