<template>
  <div class="action-drop-menu" :class="position || 'right'">
    <app-menu
      :disable-selection="disableSelection"
      :actions="actions"
      element-border="1px solid #E2E9F9"
      element-color="#445576"
      @anActionClicked="anActionClicked"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

import Menu from '@/components/common/Menu/Menu.vue'
import MenuAction from '@/components/common/Menu/ts/menuAction'

@Component({
  components: {
    'app-menu': Menu,
  },
})
export default class ActionDropMenu extends Vue {
  @Prop() actions!: Array<MenuAction>

  @Prop() disableSelection!: boolean

  @Prop() position!: 'left' | 'right'

  @Emit('anActionClicked')
  anActionClicked(_action, _index, _event) {
    // Emits event to parent
    // automatically passes arguments to parent handler
  }
}
</script>

<style lang="scss" scoped>
.action-drop-menu {
  @include noUserSelect;

  cursor: pointer;
  min-height: 100px;
  background: $whiteColor;
  position: absolute;
  top: 90%;
  min-width: fit-content;
  width: 145px;
  border-radius: 6px;
  box-shadow: $hoverShadow;
  overflow: hidden;
  z-index: 10;

  &.right {
    left: 0;
  }

  &.left {
    right: 0;
  }
}
</style>
