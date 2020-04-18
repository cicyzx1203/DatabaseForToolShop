<template>
  <div>
    <h1>Clerk Password Update</h1>
    <h3>Please enter a new password</h3>
    <b-alert variant="danger"
             dismissible
             :show="showDismissibleAlert"
             @dismissed="showDismissibleAlert=false">
      {{stateOfThings}}
    </b-alert>

    <b-container sm="auto">
      <b-form @submit="onSubmit">
        <b-form-group id="exampleInputGroup1"
                      label="Password" label-for="exampleInput1">
          <b-form-input id="exampleInput1"
                        type="text" v-model="form.password" required
                        placeholder="Password"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="exampleInputGroup2"
                      label="Re-Enter Password" label-for="exampleInput2">
          <b-form-input id="exampleInput2"
                        type="text" v-model="retype_password" required
                        placeholder="Re-Enter Password"
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Update Password</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          password: '',
          clerk_id: ''
        },
        retype_password: '',
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
        this.setClerkId();
        // If password and username are correct, go ahead and let them in
        this.$http.post('http://localhost:3000/update_clerk_password', this.form).then(response => {
          this.$router.push({name: 'ClerkMainMenu'})

        }, response => {
          // If the password is incorrect show a dismissable alert
          this.stateOfThings = response.body.message;
          this.showDismissibleAlert = true
        })
      },
      setClerkId(){
        this.form.clerk_id = Number.parseInt(localStorage.getItem("clerk_id"));
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
