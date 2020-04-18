<template>
  <div v-if="notConfirmed">
    <b-container>
    <h2>Pickup Reservation</h2>
    <b-table
      :items="items"
      :fields="fields">
      <template slot="reservation_id" slot-scope="data">
        <b-link v-b-modal.modal2 @click="getReservationDetails(data.value)">
          {{data.value}}
        </b-link>
      </template>
    </b-table>
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
            <b-button type="submit" variant="primary">Pick Up</b-button>
          </b-col>


      </b-container>
    </b-form>
    </b-container>
    <div>
      <b-modal id="modal1" size="lg" hide-footer title="Pickup Reservation">
        <b-container style="text-align: left">
        <h4>Reservation ID: {{this.form.reservation_id}}</h4>
        <br>
        <a style="font-weight: bold">Customer Name: </a>
        <a>{{this.reservation_details.customer_name}}</a>
        <br>
        <a style="font-weight: bold">Total Deposit: </a>
        <a>{{'$'+this.reservation_details.total_deposit_price}}</a>
        <br>
        <a style="font-weight: bold">Total Rental: </a>
        <a>{{'$'+this.reservation_details.total_rental_price}}</a>
        </b-container>
        <p>Credit Card: </p>
        <b-container>
          <b-col>
            <b-form-radio-group v-model="form.cc_type">
              <b-form-radio value="New">New</b-form-radio>
              <b-form-radio value="Existing">Existing</b-form-radio>
            </b-form-radio-group>
          </b-col>
        </b-container>
        <br>
        <h3 v-if="form.cc_type==='New'">Enter Updated Credit Card Information</h3>
        <h5 v-if="form.cc_type==='New'">THIS WILL OVERWRITE THE PRIOR CUSTOMERS CREDIT CARD INFORMATION</h5>
        <br>
        <b-container v-if="form.cc_type==='New'">
          <b-form-row>
            <b-col>
              <b-input id="nameOnCreditCard" v-model="form.name_on_card" placeholder="Name on Credit Card"/>
            </b-col>
            <b-col>
              <b-input id="middleName" v-model="form.cc_num" placeholder="Credit Card #"/>
            </b-col>
          </b-form-row>
        </b-container>
        <br>
        <b-container v-if="form.cc_type==='New'">
          <b-form-row>
            <b-col>
              <b-form-select v-model="form.expiration_month" class="mb-3">
                <option :value=null>Expiration Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </b-form-select>
            </b-col>
            <b-col>
              <b-form-select v-model="form.expiration_year" class="mb-3">
                <option :value="null">Expiration Year</option>
                <option value="2017">2017</option>
                <option value="2018">2018</option>
                <option value="2019">2019</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </b-form-select>
            </b-col>
            <b-col>
              <b-input id="middleName" v-model="form.cvc" placeholder="CVC"/>
            </b-col>
          </b-form-row>
        </b-container>
        <b-btn variant="primary" @click="pickupReservation">Confirm Pickup</b-btn>
      </b-modal>
    </div>
    <div>
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
    <div>
      <b-modal id="modal3" title="Pickup Reservation">
        <h3>Rental Contract</h3>
        <h5>Customer Name: {{this.reservation_details.customer_name}}</h5>
        <h5>Credit Card#: {{this.reservation_details.customer_name}}</h5>
        <h5>Start Date: </h5>
        <h5>End Date: </h5>
        <b-table
                 :items="reservation_items"
                 :fields="reservation_fields">
          <template slot="reservation_id" slot-scope="data">
            <b-link v-b-modal.modal2>
              {{data.value}}
            </b-link>
          </template>
        </b-table>
      </b-modal>
    </div>
  </div>
  <div v-else>
    <b-container>
      <div style="text-align: left">
        <h1>Pickup Reservation</h1>
        <br>
        <h3>Rental Contract</h3>
        <br>
        <a>Pick-up Clerk: </a>
        <a>{{reservation_details.clerk_name}}</a>
        <br>
        <a>Credit Card #:</a>
        <a>{{reservation_details.cc_num_end}}</a>
        <br>
        <a>Start Date: </a>
        <a>{{reservation_details.start_date}}</a>
        <br>
        <a>End Date: </a>
        <a>{{reservation_details.end_date}}</a>
        <br>
        <a>Total Deposit Price: </a>
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
            <a style="font-weight:bold">Pickup Clerk - {{reservation_details.clerk_name}}</a>
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
</template>


<script>
  export default {
    data() {
      return {
        sortBy: 'reservation_id',
        form: {
          clerk_id: null,
          reservation_id: null,
          cc_type: "Existing",
          name_on_card: '',
          cc_num: '',
          expiration_month: '',
          expiration_year: '',
          cvc: ''
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
          clerk_name: '',
          cc_num_end: '',
          customer_name: '',
          start_date: '',
          end_date: '',
          total_deposit_price: '',
          total_rental_price: ''
        },
        notConfirmed: true,
        receipt_items: [],
        receipt_fields: {tool_id: {label: "Tool Id", sortable: false},
          tool_name: {label: "Tool Name", sortable: false},
          deposit_price:{label: "Deposit Price", sortable: false},
          rental_price:{label: "Rental Price", sortable: false}
        }
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
      printContract(){
        window.print()
      },
      pickupReservation(){
        this.setClerkId();
        this.$http.post('http://localhost:3000/pick_up_reservation', this.form).then(response =>{
          let myData = response.body;

          this.receipt_items = myData.tools;
          this.reservation_details.clerk_name = myData.clerk_name;
          this.reservation_details.cc_num_end = myData.cc_num_end;
          this.reservation_details.customer_name = myData.customer_name;
          this.reservation_details.start_date = myData.start_date;
          this.reservation_details.end_date = myData.end_date;
          this.reservation_details.total_deposit_price = myData.total_deposit_price;
          this.reservation_details.total_rental_price = myData.total_rental_price;
          this.notConfirmed = false;

        }, response=>{
          console.log(response)
        })
      },
      setClerkId(){
         this.form.clerk_id = Number.parseInt(sessionStorage.getItem("clerk_id"));
      },
      startNewReservation(){
        this.notConfirmed = true;
        location.reload();
      }
    },
    beforeMount(){
      this.$http.get('http://localhost:3000/reservations_to_pick_up').then(response=>{
          this.items=response.body
      })
    }

  };
</script>
