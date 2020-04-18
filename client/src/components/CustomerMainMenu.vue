<template>
  <div>
    <h1>Main Menu</h1>
    <b-container>
    <b-list-group>
      <b-list-group-item href="#/viewprofile">
        View Profile
      </b-list-group-item>
      <b-list-group-item href="#/checktoolavailability">
        Check Tool Availability
      </b-list-group-item>
      <b-list-group-item href="#/makereservation">
        Make Reservation
      </b-list-group-item>
      <b-list-group-item>
        Purchase Tool
      </b-list-group-item>
      <b-list-group-item href="/" @click="logOut">
        Exit
      </b-list-group-item>
    </b-list-group>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: 'CustomerMainMenu',
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
