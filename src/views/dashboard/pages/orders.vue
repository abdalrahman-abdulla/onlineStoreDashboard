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
      title="Orders"
      class="px-5 py-3"
    >
      <v-simple-table>
        <thead>
          <tr>
            <th>#</th>
            <th>Order_No.</th>
            <th>Customer Name</th>
            <th>location</th>
            <th>Total Price</th>
            <th>Created Date</th>
            <th class="text-right">
              Option
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
          v-for='(order1,index) in orders'
          :key='index'
          >
            <td>{{index +1}}</td>
            <td>{{order1.order_no }}</td>
            <td class="text-capitalize">{{order1.customer_name}}</td>
            <td>{{order1.location}}</td>
            <td>{{formatToCurrency(order1.total_price)}}</td>
            <td>{{order1.created_at | changeDate}}</td>
            <td class="text-right">
              <v-icon
                class="mx-1"
                @click="dilaog2=true, show(order1.order_no)"
              >
                mdi-eye
              </v-icon>
              <v-icon
                @click="order=order1 , dialog=true, order.index=index"
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
          <p>you want to delete {{order.order_no}}?</p>
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
      v-model="dilaog2"
      max-width="500"
    >
      <v-card class="text-center">
        <v-card-title class="font-weight-medium">
          Order {{order.order_no}}

          <v-spacer />

          <v-icon
            aria-label="Close"
            @click="dilaog2 = false"
          >
            mdi-close
          </v-icon>
        </v-card-title>
        <v-progress-circular
          indeterminate
          color="primary"
          v-if="loading"
        ></v-progress-circular>
        <v-card-text
          class="font-weight-medium subtitle-1 text-capitalize text-left"
          v-if="!loading"
        >
          <span class="text--secondary">Order_No</span>: {{order.order_no}}<br>
          <span class="text--secondary">Date:</span> {{order.created_at | changeDate}}<br>
          <span class="text--secondary">total price:</span> {{formatToCurrency(order.total_price)}}<br>
          <span class="text--secondary">customer name:</span> {{order.customer_name}}<br>
          <span class="text--secondary">customer phone:</span> {{order.phone}}<br>
          <span class="text--secondary">customer location:</span> {{order.location}}<br>
          Items :<br>
          <span
          v-for="(item,index) in order.items"
          :key="index"
          >{{index+1}} -  {{item.name}} - <span class="text--secondary">price:</span> {{formatToCurrency(item.price)}} -  {{item.quantity}} pieces<br></span>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="error"
            text
            @click="dilaog2 = false"
          >
            Close
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
    name: 'orders',
    data () {
      return {
        orders: [],
        order: {},
        dialog: false,
        snackbar: false,
        snackText: '',
        dilaog2: false,
        loading: false,
      }
    },
    mounted () {
      Service.get('admin/orders')
        .then((data) => {
          this.orders = data.data.data
          console.log(this.orders)
        })
    },
    filters: {
      changeDate (value) {
        return moment(value).format('lll')
      },
    },
    methods: {
      deleteCat () {
        console.log(this.order.order_no)
        Service.delete('admin/orders/' + this.order.order_no).then(() => {
          this.snackText = this.order.order_no + ' has been deleted /n sdsd'
          this.snackbar = true
          this.dialog = false
          this.orders.splice(this.order.index, 1)
          this.order = {}
          setTimeout(() => {
            this.snackbar = false
          }, 5000)
        }).catch(() => {

        })
      },
      formatToCurrency (amount) {
        return parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').slice(0, -3) + ' IQD '
      },
      show (id) {
        this.loading = true
        Service.get('admin/orders/' + id).then((data) => {
          this.order = data.data
          this.loading = false
        }).catch(() => {

        })
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
</style>
