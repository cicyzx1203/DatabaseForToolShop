<template>
  <div>
    <h1>Tool Inventory Report</h1>
    <h5>The list of tools where their total profit and costs are shown for all time.</h5>
    <b-container>
      <b-alert variant="danger"
               dismissible
               :show="showDismissibleAlert"
               @dismissed="showDismissibleAlert=false">
        {{stateOfThings}}
      </b-alert>
    </b-container>
    <b-container>
      <b-form inline>
        <b-col>
          <b-form-radio-group v-model="category">
            <span style="font-weight:bold">Type:</span>
            <b-form-radio value="All Tools">All Tools</b-form-radio>
            <b-form-radio value="Hand">Hand Tool</b-form-radio>
            <b-form-radio value="Garden">Garden Tool</b-form-radio>
            <b-form-radio value="Ladder">Ladder</b-form-radio>
            <b-form-radio value="Power">Power Tool</b-form-radio>
          </b-form-radio-group>
        </b-col>
        <b-col>
          <b-input id="searchBar" v-model="search_keyword" placeholder="Search"/>
          <b-button @click="getToolsInventoryReport">Search</b-button>
        </b-col>
      </b-form>
    </b-container>
    <b-container>
      <b-table
        :items="items"
        :fields="fields">
        <template slot="current_status" slot-scope="data">
          <a v-if="data.value==='Available'"
             v-bind:style="{ backgroundColor:'green', fontWeight:'bold', fontSize: '24px'}">{{data.value}}</a>
          <a v-if="data.value==='Rented'"
             v-bind:style="{ backgroundColor:'yellow', fontWeight:'bold', fontSize: '24px'}">{{data.value}}</a>
          <a v-if="data.value==='In-Repair'"
             v-bind:style="{ backgroundColor:'red', fontWeight:'bold', fontSize: '24px'}"></a>
          <a v-if="data.value==='For-Sale'"
             v-bind:style="{ backgroundColor:'gray', fontWeight:'bold', fontSize: '24px'}"></a>
          <a v-if="data.value==='Sold'"
             v-bind:style="{ backgroundColor:'black', fontWeight:'bold', fontSize: '24px', fontColor:'white'}"></a>
        </template>

        <template slot="description" slot-scope="row">
          <b-link v-b-modal.modal1 @click="getToolDetails(row.item.tool_id)">{{row.item.description}}</b-link>
        </template>

      </b-table>
    </b-container>
    <b-button type="submit" variant="primary" href="#/generatereports">Back to Report Menu</b-button>
    <b-link v-on:click="getToolsInventoryReport">Reload Results</b-link>
    <!-- Modal Component -->
      <b-modal id="modal1" size= "lg" title="Tool Details">
        <b-container style="text-align:left">
        <a style="font-weight:bold">Tool ID: </a>
          <a>{{tool_details.tool_id}}</a>
          <br>
        <a style="font-weight:bold">Tool Type: </a>
          <a>{{tool_details.tool_type}}</a>
          <br>
        <a style="font-weight:bold">Short Description: </a>
          <a>{{tool_details.short_description}}</a>
          <br>
        <a style="font-weight:bold">Full Description: </a>
          <a>{{tool_details.full_description}}</a>
          <br>
        <a style="font-weight:bold">Deposit Price: </a>
          <a>{{tool_details.deposit_price}}</a>
          <br>
        <a style="font-weight:bold">Rental Price: </a>
          <a>{{tool_details.rental_price}}</a>
          <br>
        <a style="font-weight:bold">Accessories: </a>
          <a>{{tool_details.accessories}}</a>
        </b-container>
    </b-modal>
  </div>

</template>

<script>
  export default {
    name: 'tool-inventory-report',
    data() {
      return {
        category: 'All Tools',
        search_keyword: '',
        fields: {
          tool_id: {label: "Tool Id", sortable: false},
          current_status: {label: "Current Status", sortable: false},
          date: {label: "Date", sortable: false},
          description: {label: "Description", sortable: false},
          rental_profit: {label: "Rental Profit", sortable: false},
          total_cost: {label: "Total Cost", sortable: false},
          total_profit: {label: "Total Profit", sortable: false}
        },
        items: [],
        tool_details: {
          tool_id: '',
          tool_type: '',
          short_description: '',
          full_description: '',
          deposit_price: '',
          rental_price: '',
          accessories: ''
        },
        stateOfThings: '',
        showDismissibleAlert: false
      }
    },
    methods: {
      getToolsInventoryReport() {
        this.$http.post('http://localhost:3000/get_tool_inventory_report', {
          category: this.category,
          search_keyword: this.search_keyword
        }).then(response => {

          this.items = response.body;

        }, response => {
          // error callback
        });
      },
      refreshPage() {
        location.reload()
      },
      getToolDetails(tool_id) {
        this.$http.post('http://localhost:3000/tool_details', {tool_id: tool_id}).then(response => {
          let myData = response.body;

          this.tool_details.tool_id = myData.tool_id;
          this.tool_details.tool_type = myData.tool_type;
          this.tool_details.short_description = myData.short_description;
          this.tool_details.full_description = myData.full_description;
          this.tool_details.deposit_price = myData.deposit_price;
          this.tool_details.rental_price = myData.rental_price;
          this.tool_details.accessories = myData.accessories;
          this.$root.$emit('bv::show::modal', 'modal1')
        }, response => {
          // If the password is incorrect show a dismissable alert
          this.stateOfThings = "No tool Description available for this tool";
          this.showDismissibleAlert = true
        })

      }
    }
  }
</script>


