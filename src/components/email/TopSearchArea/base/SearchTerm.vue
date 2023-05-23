<template>
  <div class="search-term" @mouseenter="setMouseHover(true)" @mouseleave="setMouseHover(false)">
    <span>{{ searchTerm }}</span>

    <div class="delete-term" @click="deleteSearchTerm">
      <icon
        v-if="mouseHover"
        name="close"
        width="9px"
        height="9px"
        disable-selection="true"
        @click="deleteSearchTerm"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'

@Component({
  components: {
    Icon,
  },
})
export default class SearchTerm extends Vue {
  @Prop() searchTerm!: string

  private mouseHover = false

  private setMouseHover(value) {
    this.mouseHover = value
  }

  @Emit('deleteSearchTerm')
  private deleteSearchTerm() {
    // Emit to father
  }
}
</script>

<style lang="scss" scoped>
.search-term {
  @include transition;
  @include noUserSelect;
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0px 6px 0px 0;
  padding: 7px 10px 7px 10px;
  background-color: #ffffff;
  color: #445576;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0px 5px 10px rgba(98, 161, 251, 0.24);
  min-width: fit-content;

  &:hover {
    box-shadow: 0px 5px 10px rgba(98, 161, 251, 0.54);
    padding: 7px 30px 7px 10px;
  }

  .delete-term {
    cursor: pointer;
    position: absolute;
    right: 14px;
  }
}
</style>
