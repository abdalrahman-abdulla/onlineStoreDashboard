<template>
  <v-container
    id="user-profile"
    fluid
    tag="section"
  >
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Edit Profile
            </div>

            <div class="subtitle-1 font-weight-light">
              Complete your profile
            </div>
          </template>

          <v-form
            v-model="valid"
            ref="form"
          >
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    class="purple-input"
                    label="Full Name"
                    v-model="user.name"
                    :rules="[rules.required]"
                  />
                </v-col>

                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    label="Email Address"
                    class="purple-input"
                    v-model="user.email"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    label="Phone Number"
                    class="purple-input"
                    v-model.Number="user.phone"
                    :rules="[rules.required,rules.phone]"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    :append-icon="showpass ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showpass ? 'text' : 'password'"
                    name="input-10-2"
                    label="password"
                    hint="At least 8 characters"
                    class="input-group--focused"
                    @click:append="showpass = !showpass"
                    v-model="user.password"
                    :rules="user.password?[rules.password]:[]"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  class="text-right"
                >
                  <v-btn
                    color="success"
                    class="mr-0"
                    @click="update()"
                    :disabled='!valid'
                  >
                    Update Profile
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        md="4"
      >
        <base-material-card
          class="v-card-profile"
          avatar="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg"
        >
          <v-card-text class="text-center">
            <h6 class="display-1 mb-1 grey--text">
              Admin
            </h6>

            <h4 class="display-2 font-weight-light mb-3 black--text">
              {{$store.getters.get_user.name}}
            </h4>

            <p class="font-weight-light grey--text">
              Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...
            </p>
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Service from '../../../Service'
  export default {
    data () {
      return {
        user: {},
        showpass: false,
        rules: {
          required: v => !!v || 'this field is required',
          phone: v => (v && v.length === 11 && Number.isInteger(Number(v))) || 'يجب ان يتكون رقم الهاتف من 11 رقم',
          password: v => (v && v.length > 8) || 'يجب ان تكون كلمة السر اكبر من 8 حروف/ارقام',
        },
        valid: false,
      }
    },
    mounted () {
      this.user = this.$store.getters.get_user
      //  this.$store.dispatch('logout')
      console.log(this.user)
    },
    methods: {
      update () {
        if (!this.user.password) {
          delete this.user.password
        }
        Service.put('admin/users/me', this.user).then(data => { console.log(data) })
          .catch(err => {
            console.log(err.response.data.errors)
            console.log(this.$refs.form)
          })
      },
    },
  }
</script>
