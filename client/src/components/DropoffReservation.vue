<template>
  <div>
    <div v-if="notConfirmed">
      <b-container>
    <h2>Dropoff Reservation</h2>
    <b-table
      :items="items"
      :fields="fields">
      <template slot="reservation_id" slot-scope="data">
        <b-link v-b-modal.modal2 @click="getReservationDetails(data.value)">
          {{data.value}}
        </b-link>
      </template>
    </b-table>
      </b-container>
    <b-form @submit="onSubmit">
      <b-container>
        <b-col>
          <b-form-group id="exampleInputGroup1"
                        label="" label-for="exampleInput1">
            <b-form-input id="exampleInput1"
                          type="number" v-model="form.reservation_id" required
                          placeholder="Enter Reservation ID"
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col>
          <b-button type="submit" variant="primary" href="#/clerkmainmenu">Back to Main Menu</b-button>
          <b-button type="submit" variant="primary">Drop Off</b-button>
        </b-col>
      </b-container>
    </b-form>
    <div>
      <b-modal id="modal1" size="lg" hide-footer title="Dropoff Reservation">
        <b-container style="text-align:left">
        <h4>Reservation ID: {{this.form.reservation_id}}</h4>
        <a style="font-weight:bold">Customer Name: </a>
          <a>{{this.reservation_details.customer_name}}</a>
        <br>
        <a style="font-weight:bold">Total Deposit: </a>
          <a>{{'$'+this.reservation_details.total_deposit_price}}</a>
        <br>
        <a style="font-weight:bold">Total Rental: </a>
          <a>{{'$'+this.reservation_details.total_rental_price}}</a>
        </b-container>
        <b-container style="align-content: left">
        <b-btn variant="primary" @click="dropoffReservation()">Drop Off</b-btn>
        </b-container>
      </b-modal>
    </div>
      <b-modal id="modal2" title="Reservation Details">
        <h5>Reservation ID: #{{this.reservation_details.reservation_id}}</h5>
        <h5>Total Deposit: ${{this.reservation_details.total_deposit_price}}</h5>
        <h5>Total Rental Price: ${{this.reservation_details.total_rental_price}}</h5>
        <b-table
          :items="reservation_items"
          :fields="reservation_fields">
        </b-table>
      </b-modal>
    </div>
    <div v-else>
      <b-container>
        <div style="text-align: left">
          <h1>Dropoff Reservation</h1>
          <br>
          <h3>Rental Contract</h3>
          <br>
          <a>Clerk Name: </a>
          <a>{{reservation_details.clerk_name}}</a>
          <br>
          <a>Customer Name: </a>
          <a>{{reservation_details.customer_name}}</a>
          <br>
          <a>Total Deposit: </a>
          <a>{{'$'+reservation_details.total_deposit_price}}</a>
          <br>
          <a>Total Rental Price: </a>
          <a>{{'$'+reservation_details.total_rental_price}}</a>
          <br>
        </div>
      </b-container>
      <b-container>
        <div>
          <br>
          <b-table
            :items="receipt_items"
            :fields="receipt_fields">
          </b-table>
        </div>
      </b-container >
      <div>
        <b-container>
          <h1>Signatures</h1>
        </b-container>
        <b-container>
          <b-row>
            <b-col style="text-align: left">
              <a style="font-weight:bold">x</a>
              <a>____________________________________</a>
              <br>
              <a style="font-weight:bold">Pickup Clerk - {{reservation_details.clerk_name}} </a>
              <br>
              <a style="font-weight:bold">x</a>
              <a>____________________________________</a>
              <br>
              <a style="font-weight:bold">Customer - {{reservation_details.customer_name}}</a>
              <br>
            </b-col>
            <b-col style="text-align: left">
              <a style="font-weight:bold">Date</a>
              <a>____________________________________</a>
              <br>
              <br>
              <a style="font-weight:bold">Date</a>
              <a>____________________________________</a>
            </b-col>
          </b-row>
          <b-row>
          </b-row>
        </b-container>
        <br>
        <b-button variant="success" @click="printContract">Print Contract</b-button>
        <b-button variant="success" @click="startNewReservation">Start New Reservation</b-button>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sortBy: 'reservation_id',
        sortDesc: false,
        form: {
          clerk_id: sessionStorage.getItem("clerk_id"),
          reservation_id: null,
        },
        fields:{
          reservation_id: {label: "Reservation ID", sortable: false},
          username:  {label: "Customer", sortable: false},
          customer_id: {label: "Customer ID", sortable: false},
          start_date: {label: "Start Date", sortable: false},
          end_date: {label: "End Date", sortable: false}
        },
        items: [],
        reservation_fields: ['tools'],
        reservation_items: [],
        reservation_details: {
          reservation_id: '',
          clerk_name: '',
          customer_name: '',
          total_rental_price: '',
          total_deposit_price: ''
        },
        notConfirmed: true,
        receipt_items: [],
        receipt_fields: {tool_id: {label: "Tool Id", sortable: false},
          tool_name: {label: "Tool Name", sortable: false},
          deposit_price:{label: "Deposit Price", sortable: false},
          rental_price:{label: "Rental Price", sortable: false}
        },
      }
    },
    methods: {
      onSubmit(evt) {
        // Prevent bad form entries
        evt.preventDefault();
        // If successful show the modal
        this.$root.$emit('bv::show::modal', 'modal1');
        //
        this.getReservationDetails(this.form.reservation_id)
      },
      getReservationDetails(res_id) {
        // Clear out the array
        this.reservation_items = [];
        // Make a request to get reservation info based on ID
        this.$http.post('http://localhost:3000/get_reservation_info', {reservation_id: res_id}).then(response => {
          let myData = response.body.tools;

          myData.forEach((a) => {
            this.reservation_items.push({tools: a})
          });

          this.reservation_details = response.body;


        }, response => {
          console.log(response)
        });

      },
      dropoffReservation(){
        this.$http.post('http://localhost:3000/drop_off_reservation', {reservation_id: this.form.reservation_id, clerk_id: Number.parseInt(this.form.clerk_id) }).then(response => {
          let myData = response.body;
          this.receipt_items=response.body.tools;
          this.reservation_details.customer_name = myData.customer_name;
          this.reservation_details.clerk_name = myData.clerk_name;
          this.reservation_details.reservation_id = myData.reservation_id;
          this.reservation_details.total_deposit_price = myData.total_deposit_price;
          this.reservation_details.total_rental_price= myData.total_rental_price;
          this.notConfirmed = false;
        }, response =>{
            console.log(response);
        })
      },
      printContract(){
        window.print()
      },
      startNewReservation(){
        this.notConfirmed = true;
        location.reload();
      }
    },
    beforeMount(){
      this.$http.get('http://localhost:3000/reservations_to_drop_off').then(response=>{
        this.items=response.body
      })
    }

  };
</script>
