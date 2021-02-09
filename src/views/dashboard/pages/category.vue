<template>
  <v-container
    id="regular-tables"
    fluid
    tag="section"
  >

    <base-material-card
      color="primary"
      dark
      icon="mdi-clipboard-plus"
      title="Categories"
      class="px-5 py-3"
    >
      <v-btn
        class="mx-2"

        dark
        small
        color="primary"
        @click="dialogForm = true, cat={}, editMode=false"
      ><v-icon
            class="mx-1"
          >
            mdi-plus
          </v-icon>
          new categoty
      </v-btn>
      <v-simple-table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Created Date</th>
            <th class="text-right">
              Option
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
          v-for='(category,index) in categories'
          :key='index'
          >
            <td>{{index +1}}</td>
            <td>{{category.name}}</td>
            <td>{{category.slug}}</td>
            <td>{{category.description}}</td>
            <td>{{category.created_at | changeDate}}</td>
            <td class="text-right">
              <v-icon
              class="mx-1"
              @click="dialogForm = true,cat=category,editMode=true"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                @click="cat=category , dialog=true, cat.index=index"
                color="error"
                class="mx-1"
              >
                mdi-close
              </v-icon>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </base-material-card>
    <v-dialog
      class="d-none"
      v-model="dialog"
      max-width="300"
    >
      <v-card>
        <v-card-title>
          Are you sure?

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dialog = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>

        <v-card-text class="pb-6 pt-12 text-center">
          <p>you want to delete {{cat.name}}?</p>
          <v-btn
            class="mr-3"
            text
            @click="dialog = false"
          >
            Nevermind
          </v-btn>

          <v-btn
            color="success"
            text
            @click="deleteCat()"
          >
            Yes
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogForm"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{editMode?'Edit Category':'Add New Category'}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>

                <v-form
                v-model="valid"
                ref="form"
                >
                  <v-row>
                    <v-col cols="12">
                        <v-text-field
                          :rules="[required]"
                          label="Name of Category*"
                          v-model="cat.name"
                        >

                        </v-text-field>
                      <div
                        class="input-group mb-2 mt-1  text-danger text-center"
                        v-if="err"
                        >
                            <label class=" font-weight-bold w-100 error-msg">{{err['name'][0]}} </label>
                      </div>
                    </v-col>
                    <v-col
                      cols="12"
                    >
                      <v-textarea
                        filled
                        :rules="[required]"
                        name="input-7-4"
                        label="Description"
                        v-model="cat.description"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>

          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!editMode"
            color="blue darken-1"
            text
            @click="dialogForm = false,editMode=false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="!valid"
            @click="editMode ? editCat() : addCat()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <base-material-snackbar
      v-model="snackbar"
      type='success'
      top
      right
    >
      {{snackText}}
    </base-material-snackbar>
  </v-container>
</template>
<script>
  import Service from '../../../Service'
  var moment = require('moment')
  export default {
    name: 'Category',
    data () {
      return {
        editMode: false,
        categories: [],
        dialog: false,
        snackbar: false,
        err: false,
        snackText: '',
        cat: {},
        valid: false,
        dialogForm: false,
        required: v => !!v || 'this field is required',
      }
    },
    mounted () {
      Service.get('admin/categories').then((data) => { this.categories = data.data.data })
    },
    filters: {
      changeDate (value) {
        return moment(value).format('lll')
      },
    },
    watch: {
      dialogForm () {
        this.$refs.form.resetValidation()
        this.err = false
      },
    },
    methods: {
      deleteCat () {
        console.log(this.cat.name)
        Service.delete('admin/categories/' + this.cat.id).then(() => {
          this.snackText = this.cat.name + 'has been deleted'
          this.snackbar = true
          this.dialog = false
          this.categories.splice(this.cat.index, 1)
          this.cat = {}
          setTimeout(() => {
            this.snackbar = false
          }, 5000)
        }).catch(() => {

        })
      },
      addCat () {
        Service.post('admin/categories', this.cat).then((data) => {
          console.log(data.data)
          this.categories.unshift(data.data)
          this.snackText = this.cat.name + 'has been added'
          this.snackbar = true
          this.dialogForm = false
          this.cat = {}
          setTimeout(() => {
            this.snackbar = false
          }, 5000)
        }).catch(err => {
          this.err = err.response.data.errors
        })
      },
      editCat () {
        Service.put('admin/categories/' + this.cat.id, this.cat).then((data) => {
          console.log(data.data)
          this.cat.slug = data.data.slug
          this.snackText = this.cat.name + 'has been edited'
          this.snackbar = true
          this.dialogForm = false
          setTimeout(() => {
            this.snackbar = false
          }, 5000)
        }).catch(err => {
          this.err = err.response.data.errors
        })
      },
    },
  }
</script>
<style scoped>
  i{
    cursor: pointer;
  }
  .error-msg{
    color: red;
    font-size: 12px;
  }
</style>
