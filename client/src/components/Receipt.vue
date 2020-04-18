<template>
<div>
  <b-container>
<div style="text-align: left">
  <h1>Pickup Reservation</h1>
  <br>
  <h3>Rental Contract</h3>
  <br>
  <a>Pick-up Clerk: </a>
  <br>
  <a>Credit Card #:</a>
  <br>
  <a>Start Date: </a>
  <br>
  <a>End Date: </a>
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
          <a style="font-weight:bold">Pickup Clerk - </a>
          <br>
          <a style="font-weight:bold">x</a>
          <a>____________________________________</a>
          <br>
          <a style="font-weight:bold">Customer - </a>
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
    <br>
  </div>
</div>
</template>

<script>
  export default {
    name: "receipt",
    data(){
      return{
        receipt_items: [],
        receipt_fields: {tool_id: {label: "Tool Id", sortable: false},
        tool_name: {label: "Tool Name", sortable: false},
        deposit_price:{label: "Deposit Price", sortable: false},
        rental_price:{label: "Rental Price", sortable: false}
        }
      }
    },
    methods:{
      printContract(){
        window.print()
      }
    }
  }
</script>


