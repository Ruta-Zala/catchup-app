<template>
  <div class="email-welcome">
    <div class="top-welcome">
      <div class="headline">
        <icon name="logo-color" width="61px" />

        <p class="headline-main">Welcome to Catchup.email</p>

        <p>
          A place where you can work at your pace and focused on what matters _ get things done
          quickly and smooth
        </p>

        <metrics-section
          schedule-value="20"
          self-desctruct-value="10"
          analytics-value="120"
          analytics-trend="top"
          expanded="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import Icon from '@/components/common/Icon.vue'
import MetricsSection from '@/components/common/Sidebar/base/MetricsSection.vue'

@Component({
  components: {
    Icon,
    MetricsSection,
  },
})
export default class EmailWelcome extends Vue {
  private content = ''
}
</script>

<style lang="scss" scoped>
.email-welcome {
  background: url('/svg/backgtound-welcome.svg') left bottom no-repeat;
  padding: 20px;
  width: 100%;
  height: 100%;
  font-weight: 500;
  .top-welcome {
    flex-direction: column;
    width: 100%;
    justify-content: center;
    padding: 10vh 0;
    align-items: center;
    flex: 1;

    .headline {
      display: flex;
      flex-direction: column;
      padding: 0 0 30px 0px;
      align-items: center;
      text-align: center;
      max-width: 60%;
      margin: 0 auto;

      .headline-main {
        font-size: 35px;
        margin: 15px auto;
      }
    }
  }
}
</style>
