<template>
  <div>
    <h2>Check Tool Availability</h2>
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
          <span style="font-weight:bold">Start Date:</span>
          <datepicker v-model="form.start_date" placeholder="2017-01-20" format="yyyy/MM/dd"></datepicker>
        </b-col>
        <b-col>
          <span style="font-weight:bold">End Date:</span>
          <datepicker v-model="form.end_date" placeholder="2017-01-20" format="yyyy/MM/dd"></datepicker>
        </b-col>
        <b-col>
          <b-input id="lastName" v-model="form.sub_option" placeholder="Search"/>
          <b-button @click="checkToolAvailability">Search</b-button>
        </b-col>
      </b-form>
    </b-container>
    <br>
    <b-container>
      <b-col>
        <b-form-radio-group v-model="form.category">
          <span style="font-weight:bold">Type:</span>
          <b-form-radio value="All Tools">All Tools</b-form-radio>
          <b-form-radio value="Hand">Hand Tool</b-form-radio>
          <b-form-radio value="Garden">Garden Tool</b-form-radio>
          <b-form-radio value="Ladder">Ladder</b-form-radio>
          <b-form-radio value="Power">Power Tool</b-form-radio>
        </b-form-radio-group>
      </b-col>
    </b-container>
    <br>
    <b-container>
      <b-form-row>
        <b-col>
          <span style="font-weight:bold">Power Source:</span>
          <b-form-select v-model="form.power_source" class="mb-3">
            <option value="All" v-if="form.category==='All Tools'">All</option>
            <option value="Electric" v-if="form.category === 'Power' || form.category==='All Tools'">Electric</option>
            <option value="Cordless" v-if="form.category === 'Power' || form.category==='All Tools'">Cordless</option>
            <option value="Gas" v-if="form.category==='Power' || form.category==='All Tools'">Gas</option>
            <option value="Manual"
                    v-if="form.category==='Hand' || form.category==='All Tools' || form.category==='Garden' || form.category==='Ladder'">
              Manual
            </option>
          </b-form-select>
        </b-col>
        <b-col>
          <span style="font-weight:bold">Sub-Type:</span>
          <b-form-select v-model="form.sub_type" class="mb-3">
            <option value="All">All</option>
            <option value="Screwdriver" v-if="form.power_source==='All'">Screw Driver</option>
            <option value="Socket" v-if="form.power_source==='All'">Socket</option>
            <option value="Ratchet" v-if="form.power_source==='All'">Ratchet</option>
            <option value="Wrench" v-if="form.power_source==='All'">Wrench</option>
            <option value="Pliers" v-if="form.power_source==='All'">Pliers</option>
            <option value="Gun" v-if="form.power_source==='All'">Gun</option>
            <option value="Hammer" v-if="form.power_source==='All'">Hammer</option>
            <option value="Digger" v-if="form.power_source==='All'">Digger</option>
            <option value="Pruner" v-if="form.power_source==='All'">Pruner</option>
            <option value="Rakes" v-if="form.power_source==='All'">Rakes</option>
            <option value="Wheelbarrows" v-if="form.power_source==='All'">Wheelbarrows</option>
            <option value="Striking" v-if="form.power_source==='All'">Striking</option>
            <option value="Straight" v-if="form.power_source==='All'">Straight Ladder</option>
            <option value="Step" v-if="form.power_source==='All'">Step Ladder</option>
            <option value="Drill" v-if="form.power_source==='All'">Drill</option>
            <option value="Saw" v-if="form.power_source==='All'">Saw</option>
            <option value="Sander" v-if="form.power_source==='All'">Sander</option>
            <option value="Air-Compressor" v-if="form.power_source==='All'">Air Compressor</option>
            <option value="Mixer" v-if="form.power_source==='All'">Mixer</option>
            <option value="Generator" v-if="form.power_source==='All'">Generator</option>


            <option value="Screwdriver" v-if="form.power_source==='Manual' && form.category==='Hand'">Screw Driver
            </option>
            <option value="Socket" v-if="form.power_source==='Manual' && form.category==='Hand'">Socket</option>
            <option value="Ratchet" v-if="form.power_source==='Manual' && form.category==='Hand'">Ratchet</option>
            <option value="Wrench" v-if="form.power_source==='Manual' && form.category==='Hand'">Wrench</option>
            <option value="Pliers" v-if="form.power_source==='Manual' && form.category==='Hand'">Pliers</option>
            <option value="Gun" v-if="form.power_source==='Manual' && form.category==='Hand'">Gun</option>
            <option value="Hammer" v-if="form.power_source==='Manual' && form.category==='Hand'">Hammer</option>
            <option value="Digger" v-if="form.power_source==='Manual' && form.category==='Garden'">Digger</option>
            <option value="Pruner" v-if="form.power_source==='Manual' && form.category==='Garden'">Pruner</option>
            <option value="Rakes" v-if="form.power_source==='Manual' && form.category==='Garden'">Rakes</option>
            <option value="Wheelbarrows" v-if="form.power_source==='Manual' && form.category==='Garden'">Wheelbarrows
            </option>
            <option value="Striking" v-if="form.power_source==='Manual' && form.category==='Garden'">Striking</option>
            <option value="Straight" v-if="form.power_source==='Manual' && form.category==='ladder'">Straight Ladder
            </option>
            <option value="Step" v-if="form.power_source==='Manual' && form.category==='ladder'">Step Ladder</option>
            <option value="Drill" v-if="form.power_source==='Electric' && form.category==='Power'">Drill</option>
            <option value="Drill" v-if="form.power_source==='Cordless' && form.category==='Power'">Drill</option>
            <option value="Saw" v-if="form.power_source==='Electric' && form.category==='Power'">Saw</option>
            <option value="Saw" v-if="form.power_source==='Cordless' && form.category==='Power'">Saw</option>
            <option value="Sander" v-if="form.power_source==='Electric' && form.category==='Power'">Sander</option>
            <option value="Sander" v-if="form.power_source==='Cordless' && form.category==='Power'">Sander</option>
            <option value="Air-Compressor" v-if="form.power_source==='Electric' && form.category==='Power'">Air
              Compressor
            </option>
            <option value="Air-Compressor" v-if="form.power_source==='Gas' && form.category==='Power'">Air Compressor
            </option>
            <option value="Mixer" v-if="form.power_source==='Electric' && form.category==='Power'">Mixer</option>
            <option value="Mixer" v-if="form.power_source==='Gas' && form.category==='Power'">Mixer</option>
            <option value="Generator" v-if="form.power_source==='Gas' && form.category==='Power'">Generator</option>

            <option value="Screwdriver" v-if="form.power_source==='Manual' && form.category==='All Tools'">Screw
              Driver
            </option>
            <option value="Socket" v-if="form.power_source==='Manual' && form.category==='All Tools'">Socket</option>
            <option value="Ratchet" v-if="form.power_source==='Manual' && form.category==='All Tools'">Ratchet</option>
            <option value="Wrench" v-if="form.power_source==='Manual' && form.category==='All Tools'">Wrench</option>
            <option value="Pliers" v-if="form.power_source==='Manual' && form.category==='All Tools'">Pliers</option>
            <option value="Gun" v-if="form.power_source==='Manual' && form.category==='All Tools'">Gun</option>
            <option value="Hammer" v-if="form.power_source==='Manual' && form.category==='All Tools'">Hammer</option>
            <option value="Digger" v-if="form.power_source==='Manual' && form.category==='All Tools'">Digger</option>
            <option value="Pruner" v-if="form.power_source==='Manual' && form.category==='All Tools'">Pruner</option>
            <option value="Rakes" v-if="form.power_source==='Manual' && form.category==='All Tools'">Rakes</option>
            <option value="Wheelbarrows" v-if="form.power_source==='Manual' && form.category==='All Tools'">
              Wheelbarrows
            </option>
            <option value="Striking" v-if="form.power_source==='Manual' && form.category==='All Tools'">Striking
            </option>
            <option value="Straight" v-if="form.power_source==='Manual' && form.category==='All Tools'">Straight
              Ladder
            </option>
            <option value="Step" v-if="form.power_source==='Manual' && form.category==='All Tools'">Step Ladder</option>
            <option value="Drill" v-if="form.power_source==='Electric' && form.category==='All Tools'">Drill</option>
            <option value="Drill" v-if="form.power_source==='Cordless' && form.category==='All Tools'">Drill</option>
            <option value="Saw" v-if="form.power_source==='Electric' && form.category==='All Tools'">Saw</option>
            <option value="Saw" v-if="form.power_source==='Cordless' && form.category==='All Tools'">Saw</option>
            <option value="Sander" v-if="form.power_source==='Electric' && form.category==='All Tools'">Sander</option>
            <option value="Sander" v-if="form.power_source==='Cordless' && form.category==='All Tools'">Sander</option>
            <option value="Air-Compressor" v-if="form.power_source==='Electric' && form.category==='All Tools'">Air
              Compressor
            </option>
            <option value="Air-Compressor" v-if="form.power_source==='Gas' && form.category==='All Tools'">Air
              Compressor
            </option>
            <option value="Mixer" v-if="form.power_source==='Electric' && form.category==='All Tools'">Mixer</option>
            <option value="Mixer" v-if="form.power_source==='Gas' && form.category==='All Tools'">Mixer</option>
            <option value="Generator" v-if="form.power_source==='Gas' && form.category==='All Tools'">Generator</option>
          </b-form-select>
        </b-col>
      </b-form-row>
    </b-container>
    <br>
    <b-container>
      <b-table
        :items="items"
        :fields="fields">
        <template slot="description" slot-scope="row">
          <b-link v-b-modal.modal1 @click="getToolDetails(row.item.tool_id)">{{row.item.description}}</b-link>
        </template>
      </b-table>
    </b-container>
    <br>
    <b-button type="submit" variant="primary" href="#/mainmenu">Back to Main Menu</b-button>
    <div>
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
  </div>

</template>

<script>
  import Datepicker from 'vuejs-datepicker'

  export default {
    name: 'CustomerRegistrationForm',
    components: {
      Datepicker
    },
    data() {
      return {
        form: {
          category: 'All Tools',
          power_source: 'All',
          sub_type: 'All',
          sub_option: '',
          start_date: new Date(),
          end_date: new Date()
        },
        tool_details: {
          tool_id: '',
          tool_type: '',
          short_description: '',
          full_description: '',
          deposit_price: '',
          rental_price: '',
          accessories: ''

        },
        fields: {
          tool_id: {label: "Tool Id", sortable: false},
          description: {label: "Description", sortable: false},
          rental_price: {label: "Rental Price", sortable: false},
          deposit_price: {label: "Deposit Price", sortable: false}

        },
        items: [],
        disabled: {
          to: new Date()
        },
        showDismissibleAlert: false,
        stateOfThings: ''
      }
    },
    methods: {
      checkToolAvailability() {
        this.$http.post('http://localhost:3000/get_available_tools', this.form).then(response => {
          this.items = response.body;
          if(this.items.length===0){
            this.stateOfThings = "No Results For This Search";
            this.showDismissibleAlert = true
          }

        }, response => {
          console.log(response);
        });
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
