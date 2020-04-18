<template>
  <div>
    <h1>Login Form</h1>
    <b-container>
    <b-alert variant="danger"
             dismissible
             :show="showDismissibleAlert"
             @dismissed="showDismissibleAlert=false">
      {{stateOfThings}}
    </b-alert>
    </b-container>
    <b-container sm="auto">
      <b-form @submit="onSubmit">
        <b-form-group id="exampleInputGroup1"
                      label="Username" label-for="exampleInput1">
          <b-form-input id="exampleInput1"
                        type="text" v-model="form.username" required
                        placeholder="Username"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="exampleInputGroup2"
                      label="Password" label-for="exampleInput2">
          <b-form-input id="exampleInput2"
                        type="text" v-model="form.password" required
                        placeholder="Password"
          ></b-form-input>
        </b-form-group>
        <b-form-radio-group v-model="form.type"
                            :options="options"
                            size="lg"
                            name="radiosLg">
        </b-form-radio-group>
        <b-button type="submit" variant="primary">Login</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          type: 'customer',
          username: '',
          password: ''
        },
        options: [
          {text: 'Customer', value: 'customer'},
          {text: 'Clerk', value: 'clerk'}
        ],
        showDismissibleAlert: false,
        stateOfThings: null
      }
    },
    methods: {
      onSubmit (evt) {
        // Prevent required fields from being overlooked
        evt.preventDefault();
        // If password and username are correct, go ahead and let them in
        this.$http.post('http://localhost:3000/login', this.form).then(response => {
          if (response.status === 200) {
            // Set customer_id for future use
            sessionStorage.setItem("customer_id", response.body.customer_id);
            // Set that the user is a customer
            sessionStorage.setItem("isCustomer", "true");
            sessionStorage.setItem("customer_first_name", response.body.first_name);
            this.$router.push({name: 'MainMenu'})
          }
          else if (response.status === 202){
            sessionStorage.setItem("clerk_id", response.body.clerk_id);
            sessionStorage.setItem("isClerk", "true");
            sessionStorage.setItem("customer_first_name", response.body.first_name);
            this.$router.push({name: 'ClerkPasswordUpdate'});
          } else if (response.status === 201){
            sessionStorage.setItem("clerk_id", response.body.clerk_id);
            sessionStorage.setItem("isClerk", "true");
            sessionStorage.setItem("clerk_first_name", response.body.first_name);
            this.$router.push({name: 'ClerkMainMenu'})
          }

        }, response => {
          // If the user doesn't exist in the system route them to the sign up page
          console.log(response)
          if (response.body.statusCode === 401) {
            this.$router.push({name: 'Registration'})
          }
          // If the password is incorrect show a dismissable alert
          this.stateOfThings = response.body.message;
          this.showDismissibleAlert = true
        })
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
</style>
