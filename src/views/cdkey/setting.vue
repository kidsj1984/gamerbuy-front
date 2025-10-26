<template>
  <div class="app-container">
    <div class="game-setting-detail-wrap">
      <div class="game-setting-detail">
        <div class="game-setting-detail-module">
          <div class="title">帐号激活</div>
          <div class="detail">
            <div v-if="
              streamLoginStatus === STREAM_STATUS.NOTLOGIN || 
              streamLoginStatus === STREAM_STATUS.FAIL || 
              streamLoginStatus === STREAM_STATUS.VERIFYCODETIMEOUT ||
              streamLoginStatus === STREAM_STATUS.WRONGVERIFYCODE ||
              streamLoginStatus === STREAM_STATUS.WRONGPASSWORD " class="game-setting-head">
              <div class="game-setting-title">输入要激活的STEAM账号</div>
              <el-form
                ref="streamLoginForm"
                :model="streamLoginForm"
                class="login-form lg:mt-2"
                label-position="left"
              >
                <el-form-item prop="account" class="form-input" :rules="streamLoginRules.account">
                  <span class="svg-container">
                    您的STEAM账号
                  </span>
                  <el-input
                    id="account"
                    ref="account"
                    v-model="streamLoginForm.account"
                    name="account"
                    type="text"
                    tabindex="1"
                    autocomplete="off"
                  >
                  </el-input>
                </el-form-item>

                <el-form-item prop="password" class="form-input" :rules="streamLoginRules.password">
                  <span class="svg-container">
                    STEAM账号密码
                  </span>
                  <el-input
                    ref="password"
                    show-password
                    v-model="streamLoginForm.password"
                    name="password"
                    type="text"
                    tabindex="3"
                    autocomplete="off"
                  />
                </el-form-item>

                <div class="game-setting-btn">
                  <el-button :loading="postLoading" type="primary" @click="handleStearmLogin">登录STEAM</el-button>
                </div>

              </el-form>

            </div>
            <div v-if="streamLoginStatus === STREAM_STATUS.NEEDVERIFY" class="game-setting-head">
              <div class="game-setting-title">输入STEAM令牌完成登录</div>
              <el-form
                ref="streamLoginForm2"
                :model="streamLoginForm2"
                class="login-form lg:mt-2"
                label-position="left"
              >
                <el-form-item prop="verifyCode" class="form-input" :rules="streamLoginRules2.verifyCode">
                  <span class="svg-container">
                    您的STEAM令牌
                  </span>
                  <el-input
                    id="verifyCode"
                    ref="verifyCode"
                    v-model="streamLoginForm2.verifyCode"
                    name="verifyCode"
                    type="text"
                    tabindex="1"
                    autocomplete="off"
                  >
                  </el-input>
                </el-form-item>

                <div class="game-setting-btn">
                  <el-button :loading="postLoading" type="primary" @click="handleStearmVerify">登录STEAM</el-button>
                </div>

              </el-form>

            </div>
            <div v-if="streamLoginStatus === STREAM_STATUS.DOING || streamLoginStatus === STREAM_STATUS.HASUPDATE|| streamLoginStatus === STREAM_STATUS.SUCCESS" class="game-setting-head">
              <div class="game-setting-title2">
                <p><i class="el-icon-loading" /></p>
                <p>登录加载中，请耐心等待</p>
              </div>
            </div>
          </div>
        </div>


      </div>
      <div class="game-setting-detail-info">
        <div class="game-setting-detail-module2">
          <div class="title">注意事项</div>
          <div class="detail">
            <pre>
              请确认您需要的激活的Steam账户中没有此游戏 (重复购买导致的无法激活，平台概不负责)
              激活前请确保steam客户端“家庭监护”模式处于禁用状态
            </pre>
          </div>
        </div>
        <div class="game-setting-detail-module2">
          <div class="title">登录说明</div>
          <div class="detail">
            <pre>
              1.请确保CD-KEY激活所处账号为中国大陆地区；非中国大陆地区账号将无法激活国区CD-KEY并会导致退款
              2. 若遇到网络波动问题导致无法登录STEAM请等待片刻后继续登录
              3. 请确保登录时可查看自己的令牌或验证码
              4. 多次登录失败可能导致限制登录，请等待1个小时后继续尝试
            </pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import openWindow from '@/utils/openWindow'
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { Message, Form as ElForm } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { postSteamAccountLogin, postSteamAccountVerify, getSteamOrderStatus } from '@/api/steamorder'
import { ISellOrderDetailData } from '@/api/types'
import { ORDER_STATUS_FLAG, ORDER_STATUS_KEY, STREAM_STATUS } from '@/enum/common'
import { parseOrderStatus2 } from '@/utils/common'

@Component({
  name: 'CDKeySetting',
})
export default class extends Vue {
  get identity() {
    return UserModule.identity;
  }

  // 售卖者对应游戏的售卖id
  get steamOrderId() {
    return this.$route.params.orderId
  }

  private sellOrderDetail: ISellOrderDetailData | null = null

  private detailLoading = false;
  private postLoading = false;
  private streamLoginTimer:any = null;

  private streamLoginStatus = STREAM_STATUS.NOTLOGIN;
  private STREAM_STATUS = STREAM_STATUS;

  private streamLoginForm = {
    account: '',
    password: '',
  }

  private streamLoginForm2 = {
    verifyCode: '',
  }

  private streamLoginRules = {
    account: [{ required: true, message: '请输入stream账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入stream密码', trigger: 'blur' }],
  }

  private streamLoginRules2 = {
    verifyCode: [{ required: true, message: '请输入stream令牌', trigger: 'blur' }],
  }

  mounted() {
    // this.getDetailBySellOrderId();
    this.checkStatus();
  }

  private async handleStearmLogin() {
    (this.$refs.streamLoginForm as ElForm).validate(async(valid: boolean) => {
      console.log('valid', valid)
      if (valid) {
        this.postLoading = true;
        const params:any = {
          steamorderId: this.steamOrderId,
          userName: this.streamLoginForm.account,
          passWord: this.streamLoginForm.password,
        }
        try {
          const { code, message, data }:any = await postSteamAccountLogin(params);

          if (code === 0) {
            this.checkStatus();
          }
          
        } catch (e) {
          console.log('e', e);
        }

        this.postLoading = false

      } else {
        this.postLoading = false
      }
    });
    
  }


  private async handleStearmVerify() {
    (this.$refs.streamLoginForm2 as ElForm).validate(async(valid: boolean) => {
      console.log('valid', valid)
      if (valid) {
        this.postLoading = true;
        const params:any = {
          steamorderId: this.steamOrderId,
          verifyCode: this.streamLoginForm2.verifyCode,
        }
        try {
          const { code, message, data }:any = await postSteamAccountVerify(params);

          if (code === 0) {
            this.checkStatus();
          }
          
        } catch (e) {
          console.log('e', e);
        }

        this.postLoading = false

      } else {
        this.postLoading = false
      }
    });
    
  }

  private async checkStatus() {
    clearTimeout(this.streamLoginTimer);
    const params:any = {
      steamorderId: this.steamOrderId,
    }
    try {
      const result:any = await getSteamOrderStatus(params);
      const status = result?.status || 'invalidorder';
      const statusData = ORDER_STATUS_KEY[status];

      const { hasJump, jumpPath } = parseOrderStatus2(statusData, ORDER_STATUS_FLAG.SETTING, this.steamOrderId);
      console.log(6666, hasJump)
      if (hasJump) {
        this.$router.push(jumpPath)
      } else {
        this.streamLoginStatus = status;
        switch (status) {
          case STREAM_STATUS.SUCCESS:
            this.$message({
              message: 'stream账号验证成功',
              type: 'success',
              onClose: () => {
                this.$router.push({ name: 'gameStatus', params: { orderId: this.steamOrderId } });
              }
            })
            clearTimeout(this.streamLoginTimer);
            break;
          case STREAM_STATUS.FAIL:
            this.$message({
              message: 'stream账号验证失败，请重新输入',
              type: 'error'
            })
            clearTimeout(this.streamLoginTimer);
            break;
          case STREAM_STATUS.WRONGPASSWORD:
            this.$message({
              message: 'stream账号密码错误，请重新输入',
              type: 'error'
            })
            clearTimeout(this.streamLoginTimer);
            break;
          case STREAM_STATUS.VERIFYCODETIMEOUT:
            this.$message({
              message: '获取verifyCode超时，请重新输入',
              type: 'error'
            })
            clearTimeout(this.streamLoginTimer);
            break;
          case STREAM_STATUS.WRONGVERIFYCODE:
            this.$message({
              message: 'verifyCode错误，请重新输入',
              type: 'error'
            })
            clearTimeout(this.streamLoginTimer);
            break;
          case STREAM_STATUS.NEEDVERIFY:
            clearTimeout(this.streamLoginTimer);
            break;
          case STREAM_STATUS.NOTLOGIN:
            clearTimeout(this.streamLoginTimer);
            break;
          default:
            this.streamLoginTimer = setTimeout(() => {
              this.checkStatus();
            }, 3000);
            break;
        }
      }
      
    } catch (e) {
      console.log('e', e);
      // todo 测试
      this.streamLoginStatus = STREAM_STATUS.NOTLOGIN;
      this.streamLoginTimer = setTimeout(() => {
        this.checkStatus();
      }, 3000);
    }
  }

}
</script>

<style lang="scss">
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
<style lang="scss" scoped>
  .game-setting-detail-wrap {
    padding:10px;
    background: #fff;
    display: flex;


    .game-setting-head {
      padding: 40px 0;
      width: 80%;
      margin: 0 auto;
      .game-setting-title {
        padding-bottom: 20px;
      }
      .game-setting-btn {
        text-align: center;
      }

      .game-setting-title2 {
        text-align: center;
        i {
          font-size: 20px;
        }
      }
    }

    .game-setting-detail-module {
      padding: 10px;
      .title {
        padding: 10px;
        font-size: 20px;
        font-weight: bold;
      }

      .detail {
        padding: 10px;
        border:1px #000 solid;
      }
      .detail-pre {
        font-size: 14px;
        display: flex;
        pre {
          padding: 0 10px;
          width: 50%;
          flex: 1;
          white-space: pre-line;
          line-height: 24px;
        }
      }

      .game-seller-info {
        padding: 10px 0;
        border-right: 1px #000 solid;
        .t {
          border-bottom: 1px #000 solid;
          font-size: 14px;
          padding-bottom: 10px;
          .i {
            display: inline-block;
            padding: 0 10px;
            img {
              width: 64px;
              height: 64px;
            }
          }
          .i2 {
            display: inline-block;
            padding: 0 10px;

          }
          * {
            vertical-align: middle;
          }
        }

        .b {
          padding: 10px;
          span {
            margin-right: 5px;
          }
        }
      }

      .game-price-2 {
        text-align: center;
        .t {
          font-size: 80px;
          line-height: 110px;
          height: 110px;
        }
        .b {
          font-size: 18px;
        }
      }

      .preview {
        width: 460px;
        height: 218px;
      }

      .preview-list {
        width: 460px;
        display: flex;
        align-items: center;
        .preview-list-item {
          flex: 1;
          overflow: hidden;
          padding-left: 3px;
          img {
            width: 100%;
          }
        }
        .preview-list-item:first-child {
          padding-left: 0;
        }
      }
    }

    .game-setting-detail-module2 {
      margin: 10px;
      border: 1px #000 solid;
      .title {
        padding: 10px;
        border-bottom: 1px #000 solid;
      }
      .detail {
        padding: 10px;
        pre {
          padding: 0 20px;
          white-space: pre-line;
          line-height: 24px;
        }
      }
    }

    .game-setting-detail-module3 {
      padding: 10px;

      .cdkey-payment-channel {
        padding: 0 10px 10px;
        margin-top: 10px;
        border: 1px #000 solid;
        .cdkey-payment-channel-radio {
          label {
            padding: 20px 0 10px;
            width: 100%;
          }
        }
      }
    }

    .game-setting-detail {
      flex: 1;
    }
    .game-setting-detail-info {
      flex: 0 0 500px;
    }
    
  }


</style>
