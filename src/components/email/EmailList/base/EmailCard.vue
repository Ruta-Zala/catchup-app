<template>
  <div>
    <div
      v-if="Object.keys(email).length > 0"
      class="email-card"
      :class="email && email.selected ? 'selected' : ''"
      @click="toggleOpenEmail(email, `subEmail-${index}`)"
      @contextmenu.prevent="openDrop"
    >
      <div class="email-user-info">
        <user-state />
        <div
          v-if="email && email.subEmails && email.subEmails.length >= 1"
          class="sub-email-opener"
          @click="showThreadEmail"
        >
          <a>{{ email.subEmails.length }}</a>
          <icon name="drop-down" width="16px" height="16px" disable-selection="true" margin="0" />
        </div>
      </div>
      <div class="email-primary-info">
        <div class="email-primary-info-head">
          <icon
            :name="importantIconName"
            class="important-icon"
            width="18px"
            height="18px"
            margin="0"
            @mouseover.native="importantMouseHover(true)"
            @mouseleave.native="importantMouseHover(false)"
            @click.native="setEmailAsImportant"
          />
          <h3 v-if="email" :class="email && email.read === false ? 'unread' : ''">
            {{ email.title }}
          </h3>
        </div>
        <div class="email-primary-info-title">
          <p v-if="email && email.user">{{ email.user }}</p>
          <tag
            v-if="email && email.draft"
            class="category-tag"
            text="Draft"
            type="slim"
            font-size="11px"
            text-color="#ffa337"
            background-color="none"
            border="1px solid #ffa337"
            height="20px"
            padding="2px 4px"
            font-weight="500"
          />
          <tag
            v-if="email && email.selfDestruct"
            class="category-tag"
            themable="true"
            type="slim"
            icon="self-destruct"
            background-color="none"
            border="1px solid #7d9bc3"
            height="20px"
            padding="2px 4px"
            :inverted="isTagInverted"
          />
          <tag
            v-if="email && email.schedule"
            class="category-tag"
            themable="true"
            type="slim"
            icon="schedule"
            background-color="none"
            border="1px solid #22aae2"
            height="20px"
            padding="2px 4px"
            :inverted="isTagInverted"
          />
          <tag
            v-if="email && email.tracked"
            class="category-tag"
            themable="true"
            type="slim"
            icon="analytics"
            background-color="none"
            border="1px solid #6fcf97"
            height="20px"
            padding="2px 4px"
            :inverted="isTagInverted"
          />
        </div>
        <div class="email-message-info">
          <p v-if="email">{{ email.message }}</p>
        </div>
      </div>
      <div class="email-info">
        <h3 :class="email && email.read === false ? 'unread' : ''">
          {{ formattedDate }}
        </h3>
        <div v-if="email && email.attachments.length > 0" class="email-attachments">
          <p>{{ email.attachments.length }}</p>
          <icon name="attach" width="16px" height="16px" disable-selection="true" margin="0" />
        </div>
      </div>
      <action-drop-menu
        v-if="dropOpen"
        :actions="emailActions"
        position="left"
        disable-selection="true"
        @anActionClicked="closeDrop"
      />
    </div>
    <div v-show="showSubEmail">
      <div v-if="email && email.subEmails.length >= 1" class="subEmails-container">
        <div v-for="(subEmail, index) in email.subEmails" :key="index">
          <sub-email :email="subEmail" :index="index" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Vue, Prop } from 'vue-property-decorator'

import { ServiceType } from '@/api/apiService'
import ActionDropMenu from '@/components/common/ActionDrop/ActionDropMenu.vue'
import Icon from '@/components/common/Icon.vue'
import MenuAction from '@/components/common/Menu/ts/menuAction'
import Tag from '@/components/common/Tag.vue'
import UserState from '@/components/common/UserState.vue'
import EmailCardModel from '@/components/email/EmailList/base/model/emailCardModel'
import clickOutside from '@/directives/clickOutside'

@Component({
  name: 'sub-email',
  components: {
    UserState,
    ActionDropMenu,
    Tag,
    Icon,
  },
  directives: {
    clickOutside,
  },
})
export default class EmailCard extends Vue {
  @Prop() source!: EmailCardModel

  @Prop() email!: EmailCardModel

  @Prop() index!: string

  private dropOpen = false

  private importantHover = false

  /**
   * the virtual-scroll components passes us the source prop BUT
   * for consistency we use the email as the property
   */
  created(): void {
    this.email = this.source
  }

  get formattedDate() {
    if (this.email && this.email.date) {
      return moment(this.email.date, 'DD-MM-YYYY hh:mm').format('MMM Do YYYY hh:mm')
    }

    return ''
  }

  get showSubEmail() {
    return this.$store.getters.getShowSubEmail
  }

  importantMouseHover(hover) {
    this.importantHover = hover
  }

  async setEmailAsImportant() {
    const response: string | null = await this.$apiService.request(
      ServiceType.Mail,
      // eslint-disable-next-line max-len
      `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/emails/modify`,
      'POST',
      {
        ids: [this.email.id],
        addLabelIds: !this.email.important ? ['IMPORTANT'] : [],
        removeLabelIds: this.email.important ? ['IMPORTANT'] : [],
      },
    )

    if (response) {
      this.email.important = !this.email.important
    }
  }

  async setEmailAsRead() {
    if (this.email.read || this.email.draft) {
      return
    }

    const response: string | null = await this.$apiService.request(
      ServiceType.Mail,
      // eslint-disable-next-line max-len
      `providers/${this.$store.getters.getProvider}/users/${this.$store.getters.getUser.email}/emails/modify`,
      'POST',
      {
        ids: [this.email.id],
        addLabelIds: [],
        removeLabelIds: ['UNREAD'],
      },
    )

    if (response) {
      this.email.read = true
    }
  }

  get isTagInverted() {
    return this.email.selected && this.$store.state.currentTheme.includes('dark')
  }

  get importantIconName() {
    return (this.email && this.email.important) || this.importantHover
      ? 'important-yellow'
      : 'important'
  }

  private readonly emailActions: Array<MenuAction> = [
    {
      text: 'Reply',
      icon: 'reply-dark',
      value: 'reply',
    },
    {
      text: 'Reply all',
      icon: 'foward2-dark',
      value: 'reply-all',
    },
    {
      text: 'Foward',
      icon: 'foward-dark',
      value: 'forward',
    },
    {
      text: 'Mark as Unread',
      icon: 'email-dark',
      value: 'mark-as-unread',
    },
    {
      text: 'Mark as Spam',
      icon: 'spam-dark',
      value: 'mark-as-spam',
    },
    {
      text: 'Mark as...',
      icon: 'tag-dark',
      value: 'mark-as',
    },
    {
      text: 'Snooze',
      icon: 'sleep-dark',
      value: 'snooze',
    },
    {
      text: 'Print',
      icon: 'print-dark',
      value: 'print',
    },
    {
      text: 'Delete',
      icon: 'trash-dark',
      value: 'delete',
    },
  ]

  openDrop() {
    this.dropOpen = true
  }

  closeDrop() {
    this.dropOpen = false
  }

  toggleOpenEmail(email, id) {
    if (!email) {
      return
    }

    if (!email.read) {
      this.setEmailAsRead()
    }

    const isOpenEmail =
      this.$store.getters.getOpenEmails.filter((openEmail) => openEmail.id === email.id).length ===
      0

    if (email.isEmail && isOpenEmail) {
      this.$store.dispatch('addNewOpenEmail', email)

      return
    }

    if (email.isEmail) {
      this.$store.commit('setCurrentlyPrimaryTabOpen', email)
    }

    if (email.isSubEmail) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      document.getElementById(id)!.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }

  showThreadEmail() {
    this.$store.commit('showSubEmailContainer')
  }
}
</script>

<style lang="scss" scoped>
.email-card {
  @include transition;
  @include noUserSelect;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
  margin: 4px 0;
  padding: 13px 22px;
  position: relative;
  cursor: pointer;
  border-radius: 6px;
  display: flex;

  @include themify {
    background: themed(emailCardBackground);
  }

  &:hover {
    @include themify {
      box-shadow: themed(cardShadowHover);
      background: themed(emailCardHoverBackground);
    }
  }

  &.selected {
    @include themify {
      background: themed(emailCardBackgroundSelected);
      border: themed(emailCardSelectedBorder);
      border-left: themed(emailCardSelectedBorderLeft);
      color: themed(emailCardSelectedFontColor);
    }
  }

  .unread {
    font-weight: 700 !important;
  }

  .sub-email-opener {
    @include noUserSelect;
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 20px 0 10px 0;
    padding: 7px 10px 7px 10px;
    background-color: #ffffff;
    color: #445576;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 600;
    height: 28px;
    background: #e2e9f9;
    color: #7d9bc3;

    a {
      margin-right: 6px;
    }
  }
  .email-primary-info {
    position: relative;
    max-width: 238px;
    padding: 0 10px;

    .email-primary-info-head {
      display: inline;

      .important-icon {
        display: inline;
      }

      h3 {
        display: inline;
        font-size: 14px;
        font-weight: 400;
      }
    }

    .email-primary-info-title {
      display: flex;
      align-items: center;
      margin-top: 3px;

      p {
        font-size: 11px;
        margin-right: 6px;
      }

      .category-tag {
        margin-right: 3px;
      }
    }
    .email-message-info {
      margin-top: 12px;
      p {
        font-size: 13px;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .email-info {
    text-align: end;
    h3 {
      font-size: 13px;
      display: inline;
      font-weight: 400;
    }
    .email-attachments {
      display: flex;
      margin-top: 10px;
      justify-content: flex-end;

      p {
        margin-right: 5px;
        font-size: 13px;
        font-weight: 400;
      }
    }
  }
}

.subEmails-container {
  margin-left: 20px;
  margin-bottom: 20px;
}
</style>
