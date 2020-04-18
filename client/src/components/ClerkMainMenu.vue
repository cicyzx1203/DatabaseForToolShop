<template>
  <div>
    <h1>Clerk Main Menu</h1>
    <b-container>
      <b-list-group>
        <b-list-group-item href="#/pickupreservation">
          Pick-Up Reservation
        </b-list-group-item>
        <b-list-group-item href="#/dropoffreservation">
          Drop-off Reservation
        </b-list-group-item>
        <b-list-group-item href="#/addtool">
          Add New Tool
        </b-list-group-item>
        <b-list-group-item>
          Service Order
        </b-list-group-item>
        <b-list-group-item>
          Service Status
        </b-list-group-item>
        <b-list-group-item>
          Sell Tool
        </b-list-group-item>
        <b-list-group-item>
          Sale Status
        </b-list-group-item>
        <b-list-group-item href="#/generatereports">
          Generate Reports
        </b-list-group-item>
        <b-list-group-item href="#/" @click="logOut">
          Logout
        </b-list-group-item>
      </b-list-group>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: 'ClerkMainMenu',
    methods:{
      logOut(){
        // Clear the session storage and route to main menu
        sessionStorage.clear();
        this.$router.push({name: 'HomePage'})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  button {
    background-color: #b23b08;
    font-size: 16px;
  }
</style>
