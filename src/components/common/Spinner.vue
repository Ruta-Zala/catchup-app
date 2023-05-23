<template>
  <icon name="spinner" width="61px" height="61px" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'

@Component({
  components: { Icon },
})
export default class Spinner extends Vue {}
</script>

<style lang="scss" scoped>
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  min-height: 100%;
  animation: spin 4s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
