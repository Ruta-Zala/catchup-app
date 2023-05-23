<template>
  <div class="search-email-box">
    <input
      v-model="searchValue"
      class="input"
      type="text"
      placeholder="Search for email, file or attachements"
      @keyup.enter="addSearchTerm()"
    />
    <search-term
      v-for="(searchTerm, index) in searchTerms"
      :key="index"
      :class="index === alreadyExistsIndex ? 'exsists' : 'new-term'"
      :search-term="searchTerm"
      @deleteSearchTerm="deleteSearchTerm(index)"
    />
    <aside class="actions">
      <div class="action-search" @click="cleanSearchTerms">
        <icon name="close" width="16px" height="16px" disable-selection="true" />
      </div>
      <div class="action-search">
        <icon name="settings" width="16px" height="16px" disable-selection="true" />
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'
import SearchTerm from '@/components/email/TopSearchArea/base/SearchTerm.vue'

@Component({
  components: {
    Icon,
    SearchTerm,
  },
})
export default class SearchEmailBox extends Vue {
  private readonly maxTerms = 10

  private searchTerms: Array<string> = []

  private alreadyExistsIndex = -1

  searchValue = ''

  addSearchTerm() {
    if (!this.searchValue) {
      return
    }

    if (this.searchTerms.length === this.maxTerms) {
      return
    }

    const alreadyExistsIndex = this.searchTerms.indexOf(this.searchValue)

    if (alreadyExistsIndex > -1) {
      this.alreadyExistsIndex = alreadyExistsIndex

      setTimeout(() => {
        this.alreadyExistsIndex = -1
      }, 1000)

      return
    }

    this.searchTerms.push(this.searchValue)
    this.searchValue = ''

    this.searchTermsChange()
  }

  deleteSearchTerm(index) {
    this.searchTerms.splice(index, 1)

    this.searchTermsChange()
  }

  cleanSearchTerms() {
    this.searchTerms = []
    this.searchTermsChange()
  }

  @Emit('searchTermsChange')
  searchTermsChange() {
    return this.searchTerms
  }
}
</script>

<style lang="scss" scoped>
.search-email-box {
  display: flex;
  align-items: center;
  height: 70px;
  min-height: 70px;
  width: 100%;

  input {
    height: 100%;
    width: 100%;
    text-decoration: inherit;
    cursor: pointer;
    outline: none;
    background: transparent;
    border: none;

    @include themify {
      color: themed(fontColor);
    }
    &::placeholder {
      color: $borderColorDark;
    }
  }

  .exsists {
    background-color: #edb5a1;
    animation: shake 1s linear;
  }

  .new-term {
    animation: toRight 0.1s linear;
  }

  .actions {
    display: flex;

    .action-search {
      @include transition;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 25px;
      width: 32px;
      height: 32px;
      border-radius: 50%;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

@keyframes toRight {
  0% {
    left: -50%;
  }
  100% {
    left: 0;
  }
}
</style>
