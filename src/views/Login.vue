<template>
  <div class="login">
    <div class="login-section">
      <div class="login-trial">
        <p>No account? Don’t worry! Try all features for free</p>
        <app-button
          text="15 days trial"
          hover-shadow="true"
          height="48px"
          type="primary"
          font-size="100%"
          style="margin-left: 20px"
        />
      </div>
      <div class="login-actions">
        <div class="login-container">
          <icon name="catchupemail-logo-dark" width="170px" />
          <div class="login-call-to-action">
            <h1>Login your account with</h1>
            <app-button
              text="Google Account"
              icon="google-account-color"
              hover-shadow="true"
              height="54px"
              type="secondary"
              font-size="100%"
              @click="login"
            />
          </div>
        </div>
        <div class="login-intro">
          <icon name="logo-white" width="100px" />
          <h1>Welcome to<br />Catchup.email</h1>
          <p>The right place to be with your emails</p>
          <div class="login-intro-quote">
            <p>
              One of the best email clients i’ve used. Clean and packed with a lot of professional
              feautres.<br /><span>__ Jon from epoxy.lda</span>
            </p>
          </div>
          <a>Discover more about Catchup.email</a>
        </div>
      </div>
      <div class="login-copyright">
        <a>© Cacthup.email</a>
        <div class="login-links">
          <a href="">Help</a>
          <a href="">Forum</a>
          <a href="">Terms of use</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { ServiceType } from '@/api/apiService'
import Button from '@/components/common/Button.vue'
import Icon from '@/components/common/Icon.vue'
import UserAuthModel from '@/models/userAuthModel'

const callBackUrl = process.env.VUE_APP_CALLBACK_URL

@Component({
  components: {
    'app-button': Button,
    Icon,
  },
})
export default class Login extends Vue {
  async login() {
    if (!this.$route.query.code) {
      const getCallToLoginProvider: string | null = await this.$apiService.request(
        ServiceType.Identity,
        `providers/${this.$store.getters.getProvider}/login-url`,
        'GET',
        {
          callBackUrl,
        },
      )

      if (getCallToLoginProvider) {
        document.location = JSON.parse(getCallToLoginProvider).authRedirectUrl
      }

      return
    }

    const userDetails: UserAuthModel | null = await this.$apiService.request<
      UserAuthModel,
      {
        code: string | (string | null)[]
        callBackUrl: string
      }
    >(ServiceType.Identity, `providers/${this.$store.getters.getProvider}/login`, 'POST', {
      code: this.$route.query.code,
      callBackUrl,
    })

    if (userDetails) {
      this.$store.commit('setToken', userDetails?.token)
      this.$store.commit('setUser', userDetails?.user)
      this.$store.commit('setAuthStatus', true)
      this.$router.push('email')

      return
    }

    if (!userDetails && this.$route.query.code) {
      this.$router.push('login')
    }
  }

  mounted() {
    this.$store.commit('setAuthStatus', false)
    this.$store.commit('resetToken')
    this.$store.commit('resetOpenEmail')

    this.login()
  }
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  font-size: 14px;
  overflow: auto;
  background-color: #f8faff;
  color: #445576;

  .login-section {
    flex-shrink: 0;
    margin: 0 auto;
    max-width: 1155px;
    width: 85%;
    padding: 20px 0;

    .login-trial {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 15px;
    }

    .login-actions {
      background-color: #ffffff;
      border-radius: 15px;
      display: flex;
      z-index: 1;
      position: relative;
      overflow: hidden;
      box-shadow: 0px 40px 90px rgba(98, 161, 251, 0.35);
      min-height: 600px;

      .login-container {
        flex: 1;
        padding: 5%;
        position: relative;
        flex-direction: column;

        .login-call-to-action {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;

          h1 {
            font-size: 19px;
            font-weight: 500;
            padding: 20px 0;
          }
        }
      }

      .login-intro {
        display: flex;
        padding: 5%;
        position: relative;
        flex-direction: column;
        max-width: 684px;
        min-width: 684px;
        background: linear-gradient(to right, #82e0db 0%, #22aae2 100%);
        color: #ffffff;
        &::after {
          content: '';
          background: url('/svg/login-background.svg');
          width: 150%;
          height: 150%;
          position: absolute;
          left: 0;
          top: 0;
          animation: size 10s linear infinite alternate;
        }

        h1 {
          margin-top: 6px;
          font-weight: 300;
          font-size: 45px;
        }

        .login-intro-quote {
          display: flex;
          margin: 0 0 0 45%;
          position: relative;
          flex-direction: column;
          flex: 1;
          justify-content: center;

          &::before {
            content: url('/svg/comment-symbol.svg');
            position: relative;
            font-weight: 500;
            opacity: 0.3;
            line-height: 0;
          }

          &::after {
            content: url('/svg/gradient-balls.svg');
            position: absolute;
            font-weight: 500;
            opacity: 0.3;
            line-height: 0;
            right: 110%;
            top: 50%;
            animation: fade-in 0.8s linear infinite alternate;
          }

          p {
            span {
              font-weight: 500;
            }
          }
        }

        a {
          text-decoration: underline;
          color: #ffffff;
          text-align: end;
          position: relative;
          font-size: 13px;
          font-weight: 500;
        }
      }
    }

    .login-copyright {
      display: flex;
      font-size: 11px;
      font-weight: 500;
      padding: 24px 0;
      justify-content: space-between;

      .login-links {
        & > * {
          margin-left: 6px;
          text-decoration: inherit;
          outline: none;
          cursor: pointer;
          transition: all 0.5s ease;
          color: #7d9bc3;

          &:hover {
            color: #445576;
          }
        }
      }
    }
  }
}

@keyframes size {
  0% {
    background-size: 150%;
  }
  100% {
    background-size: 180%;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>

<style lang="scss">
.button {
  .icon {
    margin-right: 6px;
  }
}
</style>
