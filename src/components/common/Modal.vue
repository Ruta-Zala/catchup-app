<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <icon name="close-dark" width="16px" height="16px" @click="$emit('click')" />
        </div>
        <div class="modal-body">
          <slot name="modal-content" />
        </div>
        <div class="modal-footer">
          <slot name="modal-footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'

@Component({
  components: {
    Icon,
  },
})
export default class Modal extends Vue {
  @Prop() title!: string
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;

  /**
   * ! It's a very rare case when we really may need that great value,
   * (e.g. overriding some UI library)
   *
   * TODO: update z-index value to more realistic one
   */
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(242, 245, 246, 0.6);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 720px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 3px 31px 0 rgba(0, 0, 0, 0.2);
  margin: 0px auto;
  padding: 13px 22px;
  background-color: #fff;
  transition: all 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
}

.modal-footer {
  margin-top: 70px;
}
</style>
