<template>
  <div class="metrics-section" :class="metricsSectionClass">
    <div v-if="shouldBeVisibleWhenCollapsed" class="metric">
      <!-- TODO: remove passing width/height & pass classes instead -->
      <icon
        class="metric-icon"
        name="analytics"
        :width="expanded ? '32px' : '24px'"
        :height="expanded ? '32px' : '24px'"
        themable="true"
      />

      <div class="value">
        <icon v-if="!expanded" class="trend" :name="analyticsTrendIcon" width="10px" height="7px" />
        <p v-if="expanded">Analytics</p>

        <span>{{ analyticsValue }}</span>
      </div>
    </div>

    <div v-if="shouldBeVisibleWhenCollapsed" class="metric">
      <!-- TODO: remove passing width/height & pass classes instead -->
      <icon
        class="metric-icon"
        name="clock"
        :width="expanded ? '32px' : '24px'"
        :height="expanded ? '32px' : '24px'"
        themable="true"
      />
      <div class="value">
        <p v-if="expanded">Scheduled</p>

        <span>{{ scheduleValue }}</span>
      </div>
    </div>

    <div v-if="shouldBeVisibleWhenCollapsed" class="metric">
      <icon
        class="metric-icon"
        name="self-destruct"
        :width="expanded ? '32px' : '24px'"
        :height="expanded ? '32px' : '24px'"
        themable="true"
      />
      <div class="value">
        <p v-if="expanded">Self-destruct</p>

        <span>{{ selfDesctructValue }}</span>
      </div>
    </div>

    <icon
      v-if="$store.getters.getIsMenuCollapsed && !expanded"
      name="drop-down"
      width="16px"
      height="16px"
      :style="iconCollapsedStyle"
      @click.native="metricsCollapseToggle"
    />
    <separator v-if="$store.getters.getIsMenuCollapsed && !expanded" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'
import Separator from '@/components/common/Separator.vue'

@Component({
  components: {
    Icon,
    Separator,
  },
})
export default class MetricsSection extends Vue {
  @Prop() scheduleValue!: string

  @Prop() selfDesctructValue!: string

  @Prop() analyticsValue!: string

  @Prop() analyticsTrend!: 'top' | 'down'

  @Prop() expanded!: boolean

  metricsCollapseToggle() {
    const isMetricsCollapsed = this.$store.getters.getIsMetricsCollapsed

    this.$store.commit('setCollapsedMetrics', !isMetricsCollapsed)
  }

  get analyticsTrendIcon() {
    let iconName = `arrow-${this.analyticsTrend}-`

    iconName += this.analyticsTrend === 'top' ? 'green' : 'red'

    return iconName
  }

  get metricsSectionClass() {
    return {
      expanded: this.expanded,
      collapsed: this.$store.getters.getIsMenuCollapsed,
    }
  }

  get iconCollapsedStyle() {
    let style = 'align-self: center;cursor: pointer;'

    style += this.$store.getters.getIsMetricsCollapsed ? '' : 'transform: rotate(180deg);'

    return style
  }

  get shouldBeVisibleWhenCollapsed() {
    return (
      !this.$store.getters.getIsMetricsCollapsed ||
      this.expanded ||
      !this.$store.getters.getIsMenuCollapsed
    )
  }
}
</script>

<style lang="scss" scoped>
.metrics-section {
  @include noUserSelect;
  position: relative;
  display: flex;
  padding: 25px 20px;
  height: 127px;

  &.collapsed {
    flex-direction: column;
    padding: 0;
    height: fit-content;

    .metric {
      border: 0 !important;
      width: 100%;
      border-radius: 0 !important;

      &:hover {
        @include themify {
          background: themed(metricSelectCollapseHover) !important;
        }
        box-shadow: none !important;
      }
    }
    .separator {
      margin-bottom: 20px;
      margin-top: 0 !important;
    }
  }

  .metric {
    @include themify {
      border: 1px solid themed(scondaryBorderColor);
    }
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    border-radius: 6px;
    justify-content: center;
    width: 86px;
    height: 71px;
    flex-wrap: wrap;
    padding: 10px;
    margin: 1%;

    .metric-icon {
      /**
      * TODO: remove important 
      */
      width: 100% !important;
    }

    &:hover {
      @include themify {
        box-shadow: themed(cardShadowHover);
        background: themed(cardBackgroundHover);
        border: 1px solid themed(borderColor);
      }
    }

    .value {
      display: flex;
      align-items: center;
      .trend {
        margin-right: 5px;
      }
    }
  }

  &.expanded {
    width: 100%;

    .metric {
      align-items: center;
      flex-wrap: unset;
      width: 100%;
      height: 71px;

      .metric-icon {
        width: 32px !important;
        margin-right: 15px;
      }
      .value {
        font-size: 13px;
        align-items: start;
        flex-direction: column;
        span {
          font-size: 19px;
        }
      }
    }
  }
}
</style>
