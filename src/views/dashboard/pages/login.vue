<template>
<div class="login">
    <div class="  row h-100  m-0 p-0">
      <div class="d-none col-8 h-100 m-0 p-0 img-ba d-md-flex flex-wrap align-items-center justify-content-center flex-column  ">
          <div class="logo text-white  ">
              <img
                class="h-100"
                alt="hii"
                src="@/assets/logo.png"
              >
          </div>
          <div class="title text-center text-white mb-3 color-cu">
            <span>نظام ادارة كامل خاص بالمتجر</span><br>
          </div>

      </div>
      <div class="col-12 col-md-4 m-0 p-0 h-100 d-flex flex-column  justify-content-center">
            <div class="title text-center mb-3 color-cu">
                <span>نظام ادارة </span><br>
                <span>متجر طماطة الالكتروني</span>
            </div>
            <div class="form-login text-center  d-flex justify-content-center">
                  <form  @submit.prevent="login()">
                    <label  class="color-cu mb-3">تسجيل الدخول</label>
                    <div class="input-group mb-2  ">
                        <input
                          type="email"
                          class="form-control form-control-sm "
                          placeholder="البريد الالكتروني"
                          v-model="email"
                          required
                        >
                        <div class="input-group-append">
                          <span class="input-group-text icon">
                            <font-awesome-icon
                              :icon="['fas', 'user']"
                              class="text-white"
                              fixed-width
                            />
                          </span>
                        </div>
                    </div>
                    <div class="input-group mb-3 ">
                        <input
                          type="password"
                          class="form-control form-control-sm"
                          placeholder="كلمة المرور"
                          v-model="password"
                          min="8"
                          required
                        >
                        <div class="input-group-append">
                            <span class="input-group-text icon">
                              <font-awesome-icon
                                :icon="['fas', 'key']"
                                class="text-white"
                                fixed-width
                              /></span>
                        </div>
                    </div>
                    <div
                      class="input-group mb-3 text-center text-danger bold"
                      v-if="err"
                    >
                          <label class=" font-weight-bold w-100 text-center">{{err}}</label>
                    </div>

                    <button
                    v-if="!isLoading"
                    class="btn btn-sm text-white "
                    >
                      <span>تسجيل الدخول</span>
                    </button>
                    <v-progress-circular
                        indeterminate
                        class="ml-2"
                        v-if="isLoading"
                      ></v-progress-circular>
                  </form>
            </div>
      </div>
    </div>
    <v-snackbar
      :timeout='2000'
      :value="true"
      absolute
      left
      shaped
      top
      color="blue-grey"
      v-model="snackbar"
    >
      login successfuly
    </v-snackbar>
</div>
</template>
<script>
  //  import router from "../router/index"
  import 'bootstrap'
  import 'bootstrap/dist/css/bootstrap.min.css'
  export default {
    name: 'login',
    data () {
      return {
        email: '',
        password: '',
        err: null,
        isLoading: false,
        snackbar: false,
      }
    },
    methods: {
      login () {
        this.isLoading = true
        this.$store
          .dispatch('login', {
            email: this.email,
            password: this.password,
          }).then((res) => {
            if (res.data.user.user_type !== 0) {
              this.err = 'لاتمتلك صلاحيات الدخول للنظام'
              this.password = ''
            } else {
              this.snackbar = true
            }
            this.isLoading = false
          })
          .catch(() => {
            this.err = ' خطأ في البريد الالكتروني او كلمة السر'
            this.password = ''
            this.isLoading = false
          })
      },
    },
  }
</script>

<style scoped>
*{
  font-family: cairo;
}
.color-cu{
    color: #303658
}
.input-group-text
{
  background-color: #303658;

}
.form-control
{
    direction: rtl;
}
.title
{
    font-size: 23px;
}

label
{
    font-size: 10px;
}
form
{
    width: 60%;
}
::placeholder {
  color: #303658;
  font-size: 10px;
  text-align: right;
}

.btn
{
    background-color: #F0567C;
    border: 0;
    font-size: 10px;
    padding: 6px 16px;
}
.img-ba
{
    background:linear-gradient(0deg, rgba(0, 0, 0, 0.8)), url('../../../assets/backgrond.jpg');
    position: relative;
    background-size: cover;
}
.logo
{
    height: 30%;
}

.icon{
  border: 1px solid #303658;;
}

.login{
  height: 100vh;
}
</style>
