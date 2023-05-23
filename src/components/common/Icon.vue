<template>
  <span class="icon" :style="`width:${width};height:${height};margin:${margin}`">
    <svg v-if="!src" />
    <img v-else-if="src" :src="src" :width="width" :height="height" />
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

const svgCache = new Map()
let loadingSvgs: Array<string> = []

@Component
export default class Icon extends Vue {
  @Prop() private name!: string

  @Prop() private width!: string

  @Prop() private height!: string

  @Prop() private margin!: string

  @Prop() private themable!: boolean

  @Prop() private inverted!: boolean

  @Prop() private src!: string

  private svg = `svg/${this.extendedName}.svg`

  // if we are in dark mode return white icon
  get extendedName(): string | null {
    if (this.src) {
      return null
    }

    if (!this.themable) {
      return this.name
    }

    if (!this.inverted) {
      return this.isCurrentThemeDark ? `${this.name}-white` : `${this.name}-dark`
    }

    return this.isCurrentThemeDark ? `${this.name}-dark` : `${this.name}-white`
  }

  get isCurrentThemeDark(): boolean {
    return this.$store.state.currentTheme === 'theme-dark'
  }

  // load svg from cache if it is already loaded, otherwise load it
  mounted(): void {
    if (this.src) {
      return
    }

    this.fetchIcon()
  }

  async fetchIcon(): Promise<void> {
    await loadingSvgs.includes(this.svg)

    loadingSvgs.push(this.svg)

    if (!svgCache.has(this.svg)) {
      try {
        svgCache.set(
          this.svg,
          fetch(this.svg).then((r) => r.text()),
        )
      } catch (e) {
        svgCache.delete(this.svg)
      }
    }
    if (svgCache.has(this.svg)) {
      this.$el.innerHTML = await svgCache.get(this.svg)

      try {
        const [svgElement] = this.$el.getElementsByTagName('svg')

        svgElement.style.width = this.width
        svgElement.style.height = this.height
        svgElement.style.pointerEvents = 'none'
      } catch {
        /* ignored */
      }
    }

    loadingSvgs = loadingSvgs.filter((svg) => this.svg !== svg)
  }

  @Watch('extendedName')
  changedIcon(): void {
    if (this.src) {
      return
    }

    this.svg = `svg/${this.extendedName}.svg`
    this.fetchIcon()
  }
}
</script>

<style lang="scss" scoped>
.icon {
  @include noUserSelect;
  display: flex;
  justify-content: center;
}
</style>
