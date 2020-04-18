<template>
  <div>
    <h2>Customer Registration Form</h2>
    <b-alert variant="danger"
             dismissible
             :show="showDismissibleAlert"
             @dismissed="showDismissibleAlert=false">
      {{stateOfThings}}
    </b-alert>
    <b-form @submit="onSubmit">
    <b-container>
      <b-form-row>
        <b-col><b-input v-model="form.first_name" id="firstName" placeholder="First Name" required/></b-col>
        <b-col><b-input v-model="form.middle_name" id="middleName" placeholder="Middle Name"/></b-col>
        <b-col><b-input v-model="form.last_name" id="lastName" placeholder="Last Name" required/></b-col>
      </b-form-row>
    </b-container>
    <br>
    <b-container>
      <b-form-row>
        <b-col><b-input v-model="form.home_phone" id="home" placeholder="Home Phone" /></b-col>
        <b-col><b-input v-model="form.work_phone" id="work" placeholder="Work Phone" /></b-col>
        <b-col><b-input v-model="form.cell_phone" id="cell" placeholder="Cell Phone" /></b-col>
      </b-form-row>
    </b-container>
    <br>
    <b-container>
      <b-col>
      <b-form-radio-group v-model="form.primary_phone">
        <span style="font-weight:bold">Primary Phone:</span>
        <b-form-radio value="home_phone">Home Phone</b-form-radio>
        <b-form-radio value="work_phone">Work Phone</b-form-radio>
        <b-form-radio value="cell_phone">Cell Phone</b-form-radio>
      </b-form-radio-group>
      </b-col>
    </b-container>
    <b-container>
      <b-form-row>
        <b-col><b-input v-model="form.username" id="firstName" placeholder="Username" required/></b-col>
        <b-col><b-input id="middleName" v-model="form.email_address" placeholder="Email Address" required/></b-col>
      </b-form-row>
    </b-container>
    <br>
    <b-container>
      <b-form-row>
        <b-col><b-input v-model="form.password" id="password" placeholder="Password" required/></b-col>
        <b-col><b-input v-model="retype" id="re-type" placeholder="Re-type Password" required/></b-col>
      </b-form-row>
    </b-container>
    <br>
    <b-container>
      <b-form-row>
        <b-col><b-input v-model="form.street_address" id="street" placeholder="Street Address" required/></b-col>
      </b-form-row>
    </b-container>
    <br>
    <b-container>
      <b-form-row>
        <b-col><b-input v-model="form.city" id="firstName" placeholder="City" required/></b-col>
        <b-col><b-form-select v-model="form.state" class="mb-3">
          <option :value="null">State</option>
          <option value="Alabama">Alabama</option>
          <option value="Alaska">Alaska</option>
          <option value="Arizona">Arizona</option>
          <option value="Arkansas">Arkansas</option>
          <option value="California">California</option>
          <option value="Colorado">Colorado</option>
          <option value="Connecticut">Connecticut</option>
          <option value="Delaware">Delaware</option>
          <option value="Florida">Florida</option>
          <option value="Georgia">Georgia</option>
          <option value="Hawaii">Hawaii</option>
          <option value="Idaho">Idaho</option>
          <option value="Illinois">Illinois</option>
          <option value="Indiana">Indiana</option>
          <option value="Iowa">Iowa</option>
          <option value="Kansas">Kansas</option>
          <option value="Kentucky">Kentucky</option>
          <option value="Louisiana">Louisiana</option>
          <option value="Maine">Maine</option>
          <option value="Maryland">Maryland</option>
          <option value="Massachusetts">Massachusetts</option>
          <option value="Michigan">Michigan</option>
          <option value="Minnesota">Minnesota</option>
          <option value="Mississippi">Mississippi</option>
          <option value="Missouri">Missouri</option>
          <option value="Montana">Montana</option>
          <option value="Nebraska">Nebraska</option>
          <option value="Nevada">Nevada</option>
          <option value="New Hampshire">New Hampshire</option>
          <option value="New Jersey">New Jersey</option>
          <option value="New Mexico">New Mexico</option>
          <option value="New York">New York</option>
          <option value="North Dakota">North Dakota</option>
          <option value="Ohio">Ohio</option>
          <option value="Oklahoma">Oklahoma</option>
          <option value="Oregon">Oregon</option>
          <option value="Pennsylvania">Pennsylvania</option>
          <option value="Rhode Island">Rhode Island</option>
          <option value="South Carolina">South Carolina</option>
          <option value="South Dakota">South Dakota</option>
          <option value="Tennessee">Tennessee</option>
          <option value="Texas">Texas</option>
          <option value="Utah">Utah</option>
          <option value="Vermont">Vermont</option>
          <option value="Virginia">Virginia</option>
          <option value="Washington">Washington</option>
          <option value="West Virginia">West Virginia</option>
          <option value="Wisconsin">Wisconsin</option>
          <option value="Wyoming">Wyoming</option>
        </b-form-select>
        </b-col>
        <b-col><b-input v-model="form.zip_code" id="middleName" placeholder="Zip Code" required/></b-col>
      </b-form-row>
    </b-container>
    <br>
    <h2>Credit Card</h2>
    <br>
    <b-container>
      <b-form-row>
        <b-col><b-input v-model="form.name_on_card" id="firstName" placeholder="Name on Credit Card" required/></b-col>
        <b-col><b-input v-model="form.cc_num" id="middleName" placeholder="Credit Card #" required/></b-col>
      </b-form-row>
    </b-container>
    <br>
    <b-container>
      <b-form-row>
        <b-col>
          <b-form-select v-model="form.expiration_month" class="mb-3" required>
            <option :value="null">Expiration Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </b-form-select>
        </b-col>
        <b-col><b-form-select v-model="form.expiration_year" class="mb-3" required>
          <option :value="null">Expiration Year</option>
          <option value="2017">2017</option>
          <option value="2018">2018</option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2024">2025</option>
          <option value="2026">2026</option>
        </b-form-select>
        </b-col>
        <b-col><b-input v-model="form.cvc" id="middleName" placeholder="CVC" required/></b-col>
      </b-form-row>
    </b-container>
    <b-container>
      <b-button type="submit" variant="primary">Submit</b-button>
    </b-container>
    </b-form>
    <br>
  </div>
</template>

<script>
  export default {
    name: 'CustomerRegistrationForm',
    data () {
      return {
        form : {
          first_name: null,
          middle_name: '',
          last_name: null,
          home_phone: '',
          work_phone: '',
          cell_phone: '',
          primary_phone: 'home_phone',
          username: null,
          email_address: null,
          password: null,
          street_address: null,
          city: null,
          state: null,
          zip_code: null,
          name_on_card: null,
          cc_num: null,
          expiration_month: null,
          expiration_year: null,
          cvc: null
        },
        retype: null,
        stateOfThings: null,
        showDismissibleAlert: false,
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault();
        if(this.form.password === this.retype){
          this.$http.post('http://localhost:3000/register', this.form).then(response => {
            sessionStorage.setItem("customer_id", response.body.customer_id);
            sessionStorage.setItem("isCustomer", "true");
            this.$router.push({name: 'MainMenu'});
          }, response => {
            console.log(response);
            this.stateOfThings = "We are unable to process your request at this time please edit the information" +
              "and try again";
            this.showDismissibleAlert=true
          });
        } else {
          this.stateOfThings = "passwords must match";
          this.showDismissibleAlert=true
        }
      },
      validatePhoneNumberFormat(){

      }
    }
  }
</script>


