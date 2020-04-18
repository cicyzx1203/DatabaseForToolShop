<template>
  <div>
    <b-container>
    <h1>Customer Report</h1>
    <span>The list of customers and reservations with tools for the last month.</span>
    <br>
    <br>
    <b-table
             :items="items"
             :fields="fields">
      <template slot="view_profile" slot-scope="row">
        <b-link @click="getProfileData(row.item.customer_id)">
          {{row.item.view_profile}}
        </b-link>
      </template>
    </b-table>
    <b-button type = "submit" variant="primary" href="#/generatereports">Back to Report Menu</b-button>
    <b-link v-on:click="refreshPage">Reload Results</b-link>
    </b-container>
    <div>
      <b-modal id="modal1" size="lg" title="View Profile">
        <b-container style="text-align: left">
        <h2>Customer Info</h2>
        <span style="font-weight:bold">E-mail: {{this.email}}</span>
        <br>
        <span style="font-weight:bold">Full Name: {{this.full_name}} </span>
        <br>
        <span style="font-weight:bold">Home Phone: {{this.home_phone}}</span>
        <br>
        <span style="font-weight:bold">Work Phone: {{this.work_phone}}</span>
        <br>
        <span style="font-weight:bold">Cell Phone: {{this.cell_phone}}</span>
        <br>
        <span style="font-weight:bold">Address: {{address}}</span>
        </b-container>
        <br>
        <br>
        <b-container>
        <h2>Reservations</h2>
        <b-table
                 :items="items2"
                 :fields="fields2">
        </b-table>
        </b-container>
      </b-modal>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        email: null,
        full_name: null,
        home_phone: null,
        work_phone: null,
        cell_phone: null,
        address: null,
        fields: {
          customer_id: {label: "Customer ID", sortable: false},
          view_profile: {label: "View Profile", sortable: false},
          first_name: {label: "First Name", sortable: false},
          middle_name: {label: "Middle Name", sortable: false},
          last_name: {label: "Last Name", sortable: false},
          email: {label: "Email", sortable: false},
          phone: {label: "Phone", sortable: false},
          total_reservations: {label: "Total # Reservations", sortable: false},
          total_tools_rented: {label: "Total # Tools Rented", sorted: false}
      },
        items: [],
        items2: [],
        fields2: [
          { key: 'reservation_id', sortable: false },
          { key: 'tools', sortable: false },
          { key: 'start_date', sortable: false },
          { key: 'end_date', sortable: false },
          { key: 'pick_up_clerk', sortable: false },
          { key: 'drop_off_clerk', sortable: false },
          { key: 'number_of_days', sortable: false },
          { key: 'total_deposit_price', sortable: false },
          { key: 'total_rental_price', sortable: false }
        ]
      }
    },
    beforeMount(){
      this.$http.get('http://localhost:3000/customer_report').then(response => {
        let myData = response.body;
        myData.forEach((a)=>{
          a.view_profile="View Profile"
        });
        this.items= myData;


      }, response => {
        console.log(response);
      });
    },
    methods: {
      refreshPage(){
        location.reload()
      },
      getProfileData(data){
        this.$http.post('http://localhost:3000/view_profile', {customer_id: data}).then(response => {

          // get body data
          this.email=response.body.email;
          this.full_name=response.body.full_name;
          this.address=response.body.address;
          this.home_phone=response.body.home_phone;
          this.work_phone=response.body.work_phone;
          this.cell_phone=response.body.cell_phone;
          let res = response.body.reservations;

          res.forEach((a)=>{
            let myVal = a.tools.toString().split(",").join("<br />")
            a.tools = myVal
          });
          this.items2=res;
          this.$root.$emit('bv::show::modal','modal1')

        }, response => {
          console.log(response)
        });
      }
    }

  };
</script>
