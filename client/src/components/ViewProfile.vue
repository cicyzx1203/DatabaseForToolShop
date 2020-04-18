<template>
  <div>
    <b-container style="text-align:left">
    <h2>Customer Info</h2>
    <span style="font-weight:bold">E-mail: </span>
      <span>{{email}}</span>
    <br>
    <span style="font-weight:bold">Full Name: </span>
      <span>{{full_name}} </span>
    <br>
    <span style="font-weight:bold">Home Phone: </span>
      <span>{{home_phone}}</span>
    <br>
    <span style="font-weight:bold">Work Phone: </span>
      <span>{{work_phone}}</span>
    <br>
    <span style="font-weight:bold">Cell Phone: </span>
      <span>{{cell_phone}}</span>
    <br>
    <span style="font-weight:bold">Address: </span>
      <span>{{address}}</span>
    <br>
    <br>
    <h2>Reservations</h2>
    </b-container>
    <b-container>
    <b-table
             :items="items"
             :fields="fields">
    </b-table>
    </b-container>
    <b-button type="submit" variant="primary" href="#/mainmenu">Back to Main Menu</b-button>
  </div>
</template>

<script>
  export default {
    name: 'view-profile',
    data() {
      return {
        email: null,
        full_name: null,
        home_phone: null,
        work_phone: null,
        cell_phone: null,
        address: null,
        fields: [
          { key: 'reservation_id', sortable: false },
          { key: 'tools', sortable: false },
          { key: 'start_date', sortable: false },
          { key: 'end_date', sortable: false },
          { key: 'pick_up_clerk', sortable: false },
          { key: 'drop_off_clerk', sortable: false },
          { key: 'number_of_days', sortable: false },
          { key: 'total_deposit_price', sortable: false },
          { key: 'total_rental_price', sortable: false }
        ],
        items: []
      }
    },
    beforeMount(){
      this.$http.post('http://localhost:3000/view_profile', {customer_id: sessionStorage.getItem("customer_id")}).then(response => {

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
        this.items=res;

      }, response => {
        console.log(response)
      });
    }
  }
</script>

<style scoped>

</style>
