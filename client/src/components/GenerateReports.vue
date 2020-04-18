<template>
  <div>
    <h1>Select a Report</h1>
    <b-container>
      <b-list-group>
        <b-list-group-item href="#/clerkreport">
          Clerk Report
        </b-list-group-item>
        <b-list-group-item href="#/customerreport">
          Customer Report
        </b-list-group-item>
        <b-list-group-item href="#/toolinventoryreport">
          Tools Inventory Report
        </b-list-group-item>
      </b-list-group>
    </b-container>
    <br>
    <b-button type="submit" variant="primary" href="#/clerkmainmenu">Back to Main Menu</b-button>
  </div>
</template>

<script>
  export default {
    name: 'GenerateReports'
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
