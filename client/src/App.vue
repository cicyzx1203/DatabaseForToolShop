<template>
  <div id="app">
    <b-container v-if="isCustomer">
      <b-navbar toggleable="md" type="light" variant="info">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand>Tools-4-Rent!</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

          <b-navbar-nav>
            <b-nav-item href="#/viewprofile">View Profile</b-nav-item>
            <b-nav-item href="#/checktoolavailability">Check Tool Availability</b-nav-item>
            <b-nav-item href="#/makereservation">Make Reservation</b-nav-item>
            <b-nav-item href="#/purchasetool">Purchase Tool</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">

            <b-navbar-nav right>
              <b-nav-item>Welcome {{customer_name}}!</b-nav-item>
              <b-nav-item @click="logOut">Logout</b-nav-item>
            </b-navbar-nav>
          </b-navbar-nav>

        </b-collapse>
      </b-navbar>
    </b-container>
    <b-container v-if="isClerk">
      <b-navbar toggleable="md" type="light" variant="info">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand>Tools-4-Rent!</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

          <b-navbar-nav>
            <b-nav-item href="#/pickupreservation">Pick-up</b-nav-item>
            <b-nav-item href="#/dropoffreservation">Drop-Off</b-nav-item>
            <b-nav-item href="#/addtool">Add New Tool</b-nav-item>
            <b-nav-item>Service Tool</b-nav-item>
            <b-nav-item>Service Status</b-nav-item>
            <b-nav-item>Sell Tool</b-nav-item>
            <b-nav-item>Sale Status</b-nav-item>
            <b-nav-item href="#/generateReports">Reports</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">

            <b-navbar-nav right>
              <b-nav-item>Welcome {{clerk_name}}!</b-nav-item>
              <b-nav-item @click="logOut">Logout</b-nav-item>
            </b-navbar-nav>
          </b-navbar-nav>

        </b-collapse>
      </b-navbar>
    </b-container>
    <img src="./assets/hardware.png">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return{
      isCustomer: false,
      isClerk: false,
      customer_name: sessionStorage.getItem("customer_first_name"),
      clerk_name: sessionStorage.getItem("clerk_first_name")
    }
  },
  methods: {
    checkCustomer(){
      if(sessionStorage.getItem("isCustomer") != null){
        this.isCustomer=true;
      }
    },
    checkClerk(){

      if(sessionStorage.getItem("isClerk") != null){
        this.isClerk=true;
      }
    },
    logOut(){
      // Clear the session storage and route to main menu
      sessionStorage.clear();
      this.$router.push({name: 'HomePage'})
      location.reload()
    }
  },
  mounted(){
    this.checkCustomer();
    this.checkClerk()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin-bottom: 50px;
}
</style>
