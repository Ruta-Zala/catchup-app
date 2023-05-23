<template>
  <div class="promoBar" :class="{ hide: removePromo }">
    <div class="bt-round">
      Dark-theme
      <label class="switch">
        <input id="themeChanger" type="checkbox" @change="changeTheme" />
        <span class="slider round" :class="{ active: !changeThemeToggle }"></span>
      </label>
    </div>
    <div class="close-icon" @click="removePromobar">
      <icon name="close" width="16px" height="16px" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'

@Component({
  components: {
    Icon,
  },
})
export default class PromoBar extends Vue {
  private changeThemeToggle = false

  private removePromo = false

  changeTheme() {
    this.changeThemeToggle = !this.changeThemeToggle
    const currentTheme = document.body.className

    document.body.className = currentTheme.includes('dark') ? 'theme-light' : 'theme-dark'
    this.$store.commit('changeTheme', document.body.className)
  }

  removePromobar() {
    this.removePromo = true
  }
}
</script>

<style scoped lang="scss">
.promoBar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  &.hide {
    display: none;
  }
}
.close-icon {
  cursor: pointer;
}
.bt-round {
  @include themify {
    border: 1px solid themed('fontColor');
  }
  padding: 5px;
  align-items: center;
  display: flex;
  border-radius: 50px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 23px;
  margin: 0 0 0 15px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
    background-color: initial;
    cursor: default;
    appearance: auto;
    box-sizing: border-box;
    margin: 3px 3px 3px 4px;
    padding: initial;
    border: initial;
  }
  .slider {
    margin: 0;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $borderColorBase;
    transition: all 0.5s ease;
    border-radius: 34px;
    &::before {
      position: absolute;
      content: '';
      height: 17px;
      width: 17px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: all 0.5s ease;
      border-radius: 50%;
    }
    &.active {
      background-color: $fontColorBlue;
      &::before {
        -webkit-transform: translateX(17px);
        -ms-transform: translateX(17px);
        transform: translateX(17px);
      }
    }
  }
}
</style>
