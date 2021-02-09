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
      title="Items"
      class="px-5 py-3"
    >
      <v-btn
        class="mx-2"

        dark
        small
        color="primary"
        @click="dialogForm = true, item={}, editMode=false"
      ><v-icon
            class="mx-1"
          >
            mdi-plus
          </v-icon>
          new Item
      </v-btn>
      <v-simple-table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Main Category</th>
            <th>Sub Category</th>
            <th>Price</th>
            <th>Description</th>
            <th>Created Date</th>
            <th class="text-right">
              Option
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
          v-for='(item1,index) in items'
          :key='index'
          >
            <td>{{index +1}}</td>
            <td>{{item1.name.length > 20 ? item1.name.slice(0, 20) + '...' : item1.name}}</td>
            <td>{{item1.category.name}}</td>
            <td>{{item1.subcategory.name}}</td>
            <td>{{formatToCurrency(item1.price)}}</td>
            <td>{{item1.description}}</td>
            <td>{{item1.created_at | changeDate}}</td>
            <td class="text-right">
              <v-icon
                @click="dialog2=true, item=item1"
                class="mx-1"
              >
                mdi-eye
              </v-icon>
              <v-icon
              class="mx-1"
              @click="dialogForm = true,item=item1,item.subcategory=item1.subcategory.id,editMode=true,item.index=index"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                @click="item=item1 , dialog=true, item.index=index"
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
          <p>you want to delete {{item.name}}?</p>
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
          <span class="headline">{{editMode?'Edit Item':'Add New Item'}}</span>
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
                          label="Name of Item*"
                          v-model="item.name"
                        >

                        </v-text-field>
                      <div
                        class="input-group mb-2 mt-1  text-danger text-center"
                        v-if="err"
                        >
                            <label class=" font-weight-bold w-100 error-msg">{{err['name'][0]}} </label>
                      </div>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                          :rules="[required]"
                          label="price of item*"
                          v-model="item.price"
                          type="number"
                        >

                        </v-text-field>

                    </v-col>
                    <v-col cols="12">
                        <v-text-field
                          :rules="[required]"
                          label="quantity of item*"
                          v-model="item.quantity"
                          type="number"
                        >

                        </v-text-field>

                    </v-col>
                    <v-col
                      cols="12"
                    >
                      <v-textarea
                        filled
                        :rules="[required]"
                        name="input-7-4"
                        label="Description"
                        v-model="item.description"
                      ></v-textarea>
                    </v-col>
                    <v-col
                      cols="12"
                    >
                      <v-select
                        :items="subcategories"
                        :rules="[required]"
                        item-text="name"
                        item-value="id"
                        v-model="item.subcategory"
                        label="SubCategory"
                      ></v-select>
                    </v-col>
                    <v-col
                      cols="12"
                    >
                      <v-file-input
                        show-size
                        label="File input"
                        prepend-icon="mdi-camera"
                        :rules="editMode ? []:[required]"
                        @change="uploadPhoto($event)"
                        ref="file"
                      >
                        <template v-slot:selection="{ text }">
                          <v-chip
                            small
                            label
                            color="primary"
                          >
                            {{ text }}
                          </v-chip>
                        </template>
                      </v-file-input>
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
            @click="editMode ? editItem() : addItem()"
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
    <v-dialog
      v-if="dialog2"
      v-model="dialog2"
      max-width="500"
      content-class="visible"
    >
      <base-material-card
        class="v-card-profile"
        v-model="dialog2"
        :avatar='item.image'
      >
        <v-card-text class="text-center">
          <h6 class="display-1 mb-1 grey--text">
            {{item.subcategory.name}}
          </h6>

          <h4 class="display-2 font-weight-light mb-3 black--text">
            {{item.name}}
          </h4>

          <p class="font-weight-light grey--text">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Price : {{formatToCurrency(item.price)}}</v-list-item-title>
                <v-list-item-title>Sub Category : {{item.subcategory.name}}</v-list-item-title>
                <v-list-item-title>main Category : {{item.category.name}}</v-list-item-title>
                <v-list-item-title>Slug : {{item.slug}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Description</v-list-item-title>
              <v-list-item-subtitle>{{item.description}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          </p>

          <v-btn
            color="success"
            rounded
            class="mr-0"
            @click="dialog2=false"
          >
            close
          </v-btn>
        </v-card-text>
      </base-material-card>
    </v-dialog>
  </v-container>
</template>
<script>
//  https://drive.google.com/thumbnail?id=1NLp3O3XixOVXIGynM0B86oAGCl5RCd2h
  import Service from '../../../Service'
  var moment = require('moment')
  export default {
    name: 'items',
    data () {
      return {
        editMode: false,
        items: [],
        subcategories: [],
        dialog: false,
        snackbar: false,
        snackText: '',
        dialog2: false,
        item: {},
        valid: false,
        dialogForm: false,
        required: v => !!v || 'this field is required',
        err: false,
      }
    },
    mounted () {
      Service.get('admin/items')
        .then((data) => {
          this.items = data.data.data
          console.log(this.items)
        })
      Service.get('admin/subcategory').then((data) => { this.subcategories = data.data.data })
    },
    filters: {
      changeDate (value) {
        return moment(value).format('lll')
      },
    },
    watch: {
      dialogForm () {
        if (this.dialogForm === true) {
          this.$refs.form.resetValidation()
          this.$refs.file.reset()
          this.err = false
        }
      },
    },
    methods: {
      deleteCat () {
        console.log(this.item.name)
        Service.delete('admin/items/' + this.item.id).then(() => {
          this.snackText = this.item.name + ' has been deleted /n sdsd'
          this.snackbar = true
          this.dialog = false
          this.items.splice(this.item.index, 1)
          this.item = {}
          setTimeout(() => {
            this.snackbar = false
          }, 5000)
        }).catch(() => {

        })
      },
      addItem () {
        Service.post('admin/items', this.item).then((data) => {
          this.item = data.data
          console.log(data.data)
          this.items.unshift(data.data)
          this.snackText = this.item.name + ' has been added'
          this.snackbar = true
          this.dialogForm = false
          this.item = {}
          setTimeout(() => {
            this.snackbar = false
          }, 5000)
        }).catch(err => {
          this.err = err.response.data.errors
        })
      },
      editItem () {
        console.log(this.item)
        Service.put('admin/items/' + this.item.id, this.item).then((data) => {
          this.items[this.item.index] = data.data
          this.snackText = this.item.name + ' has been edited'
          this.snackbar = true
          this.dialogForm = false
          setTimeout(() => {
            this.snackbar = false
          }, 5000)
        }).catch(err => {
          this.err = err.response.data.errors
        })
      },
      formatToCurrency (amount) {
        return parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, -3) + ' IQD '
      },
      uploadPhoto () { //  cryphto image into 64 base to secure transfer
        var file = event.target.files[0]
        var reader = new FileReader()
        reader.onloadend = (file) => {
          this.item.photo = reader.result
          console.log(this.item.photo)
        }
        reader.readAsDataURL(file)
      },
    },
  }
</script>
<style >
  i{
    cursor: pointer;
  }
  .error-msg{
    color: red;
    font-size: 12px;
  }
  .visible
  {
    overflow: visible !important;
  }
  .error-msg{
        font-size: 10px;
        color: #e10000;
    }
</style>
