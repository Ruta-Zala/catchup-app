<template>
  <input
    class="input"
    type="text"
    :placeholder="placeholder"
    :value="value"
    @input="$emit('input', $event)"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Input extends Vue {
  @Prop() placeholder!: string

  @Prop() value!: string
}
</script>

<style lang="scss" scoped>
.input {
  background: $backgroundColorSlim;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid $borderColorBase;
  outline: none;
  padding-bottom: 10px;
  width: 100%;
  height: 33px;
  color: $fontColorBase;

  &::placeholder {
    color: $borderColorDark;
  }
}
</style>
