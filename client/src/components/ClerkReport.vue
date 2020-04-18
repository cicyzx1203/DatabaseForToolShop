<template>
  <div>
    <h1>Clerk Report</h1>
    <span>The list of clerks where their total picks and dropoffs are shown for the past month</span>
    <br>
    <br>
    <b-container>
    <b-table
             :items="items"
             :fields="fields">
    </b-table>
    </b-container>
    <b-button type="submit" variant="primary" href="#/generatereports">Back to Report Menu</b-button>
    <b-link v-on:click="refreshPage">Reload Results</b-link>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sortBy: 'age',
        sortDesc: false,
        fields: {
          clerk_id: {label: 'Clerk ID', sortable: false},
          first_name: {label: "First Name", sortable: false},
          middle_name: {label: "Middle Name", sortable: false},
          last_name: {label: "Last Name", sortable: false},
          email: {label: "Email", sortable: false},
          date_of_hire: {label: "Hire Date", sortable: false},
          pick_ups_handled: {label: "Number of Pickups", sortable: false},
          drop_offs_handled: {label: "Number Of Dropoffs", sortable: false},
          total_number: {label: "Combined Total", sortable: false}
        },
        items: []
      }
    },
    beforeMount(){
      this.$http.get('http://localhost:3000/clerk_report').then(response => {

        this.items=response.body

      }, response => {
        // error callback
      });
    },
    methods: {
      refreshPage(){
        location.reload()
      }
    }

  };
</script>
