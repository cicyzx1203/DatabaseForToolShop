<template>
  <div>
    <h1>Add Tool</h1>
    <b-container>
      <b-container fluid>
        <b-row>
          <b-col>
            <b-form-radio-group v-model="form.category">
              <span style="font-weight:bold">Type:</span>
              <b-form-radio value="Hand">Hand Tool</b-form-radio>
              <b-form-radio value="Garden">Garden Tool</b-form-radio>
              <b-form-radio value="Ladder">Ladder</b-form-radio>
              <b-form-radio value="Power">Power Tool</b-form-radio>
            </b-form-radio-group>
          </b-col>
        </b-row>
        <h1>Main Options</h1>
        <b-row>
          <b-col sm="6" l>
            <label>Sub Type </label>
            <b-form-select v-model="form.sub_type">
              <option value="Screwdriver" v-if="form.category==='Hand'">Screwdriver</option>
              <option value="Socket" v-if="form.category==='Hand'">Socket</option>
              <option value="Ratchet" v-if="form.category==='Hand'">Ratchet</option>
              <option value="Wrench" v-if="form.category==='Hand'">Wrench</option>
              <option value="Pliers" v-if="form.category==='Hand'">Pliers</option>
              <option value="Gun" v-if="form.category==='Hand'">Gun</option>
              <option value="Hammer" v-if="form.category==='Hand'">Hammer</option>
              <option value="Straight" v-if="form.category==='Ladder'">Straight</option>
              <option value="Step" v-if="form.category==='Ladder'">Step</option>
              <option value="Digger" v-if="form.category==='Garden'">Digger</option>
              <option value="Pruner" v-if="form.category==='Garden'">Pruner</option>
              <option value="Rakes" v-if="form.category==='Garden'">Rakes</option>
              <option value="Wheelbarrows" v-if="form.category==='Garden'">Wheelbarrows</option>
              <option value="Striking" v-if="form.category==='Garden'">Striking</option>
              <option value="Drill" v-if="form.category==='Power'">Drill</option>
              <option value="Saw" v-if="form.category==='Power'">Saw</option>
              <option value="Sander" v-if="form.category==='Power'">Sander</option>
              <option value="Air-Compressor" v-if="form.category==='Power'">Air Compressor</option>
              <option value="Mixer" v-if="form.category==='Power'">Mixer</option>
              <option value="Generator" v-if="form.category==='Power'">Generator</option>
            </b-form-select>
          </b-col>
          <b-col sm="6">
            <label>Sub-Option </label>
            <b-form-select v-model="form.sub_option" :options="sub_option">
            </b-form-select>
          </b-col>
        </b-row>
        <br>
        <b-row>
          <b-col sm="6" l>
            <label>Purchase Price </label>
            <b-form-input type="number" v-model="form.purchase_price"></b-form-input>
          </b-col>
          <b-col sm="3">
            <label>Manufacturer </label>
            <b-form-input v-model="form.manufacturer"></b-form-input>
          </b-col>
          <b-col sm="3" l>
            <label>Power Source </label>
            <b-form-select v-model="form.power_source" :options="power_source"></b-form-select>
          </b-col>
        </b-row>
        <br>
        <b-row>
          <b-col sm="3" l>
            <label>Width or Diameter </label>
            <b-form-input v-model="form.width_or_diameter" type="number"></b-form-input>
          </b-col>
          <b-col sm="3">
            <label>Material </label>
            <b-form-input v-model="form.material" type="text"></b-form-input>
          </b-col>
          <b-col sm="3">
            <label>Length </label>
            <b-form-input v-model="form.length" type="number"></b-form-input>
          </b-col>
          <b-col sm="3">
            <label>Weight (lbs) </label>
            <b-form-input v-model="form.weight" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Power Tool Accessories</h1>
        <b-row>
          <b-col sm="6" l>
            <label>Description </label>
            <b-form-input type="text"></b-form-input>
          </b-col>
          <b-col sm="6">
            <label>Quantity </label>
            <b-form-input type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Power Sander</h1>
        <b-row>
          <b-col sm="2" l>
            <label>Volt Rating </label>
            <b-form-input v-model="form.volt_rating" type="number"></b-form-input>
          </b-col>
          <b-col sm="2">
            <label>Amp Rating: </label>
            <b-form-input v-model="form.amp_rating"></b-form-input>
          </b-col>
          <b-col sm="3">
            <label>Minimum RPM Rating: </label>
            <b-form-input v-model="form.min_rpm_rating"></b-form-input>
          </b-col>
          <b-col sm="3">
            <label>Maximum RPM Rating: </label>
            <b-form-input v-model="form.max_rpm_rating"></b-form-input>
          </b-col>
          <b-col sm="2">
            <label>Dust Bag: </label>
            <b-form-select v-model="form.dust_bag" :options="dust_bag"></b-form-select>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Power Drill</h1>
        <b-row>
          <b-col sm="4">
            <label>Minimum Torque Rating </label>
            <b-form-input v-model="form.min_torque_rating" type="number"></b-form-input>
          </b-col>
          <b-col sm="4">
            <label>Maximum Torque Rating </label>
            <b-form-input v-model="form.max_torque_rating"></b-form-input>
          </b-col>
          <b-col sm="4">
            <label>Adjustable Clutch </label>
            <b-form-select v-model="form.adjustable_clutch" :options="adjustable_clutch"></b-form-select>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Power Air Compressor</h1>
        <b-row>
          <b-col sm="6">
            <label>Pressure Rating </label>
            <b-form-input v-model="form.pressure_rating" type="number"></b-form-input>
          </b-col>
          <b-col sm="6">
            <label>Tank Size: </label>
            <b-form-input v-model="form.tank_size"t></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Power Saw</h1>
        <b-row>
          <b-col sm="12">
            <label>Blade Size </label>
            <b-form-input v-model="form.blade_size" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Power Generator</h1>
        <b-row>
          <b-col sm="12">
            <label>Power Rating </label>
            <b-form-input v-model="form.power_rating" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Power Mixer</h1>
        <b-row>
          <b-col sm="6">
            <label>Motor Rating </label>
            <b-form-input v-model="form.motor_rating" type="number"></b-form-input>
          </b-col>
          <b-col sm="6">
            <label>Drum Size </label>
            <b-form-input v-model="form.drum_size" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Cordless Power Tool</h1>
        <b-row>
          <b-col sm="12">
            <label>Battery Type </label>
            <b-form-select v-model="form.battery_type" :options="battery_type"></b-form-select>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Hand Plier</h1>
        <b-row>
          <b-col sm="12">
            <label>Adjustable </label>
            <b-form-select v-model="form.adjustable" :options="adjustable"></b-form-select>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Hand Wrench</h1>
        <b-row>
          <b-col sm="6">
            <label>Drive Size </label>
            <b-form-input v-model="form.drive_size" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Hand Hammer</h1>
        <b-row>
          <b-col sm="6">
            <label>Anti Vibration </label>
            <b-form-input v-model="form.anti_vibration" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Hand Screwdriver</h1>
        <b-row>
          <b-col sm="6">
            <label>Screw Size </label>
            <b-form-input v-model="form.screw_size" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Hand Gun</h1>
        <b-row>
          <b-col sm="6">
            <label>Gauge Rating </label>
            <b-form-input v-model="form.gauge_rating" type="number"></b-form-input>
          </b-col>
          <b-col sm="6">
            <label>Capacity </label>
            <b-form-input v-model="form.capacity" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Hand Socket</h1>
        <b-row>
          <b-col sm="6">
            <label>SAE Size </label>
            <b-form-input v-model="form.sae_size" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Step Ladder</h1>
        <b-row>
          <b-col sm="4">
            <label>Step Count </label>
            <b-form-input v-model="form.step_count" type="number"></b-form-input>
          </b-col>
          <b-col sm="4">
            <label>Weight Capacity </label>
            <b-form-input v-model="form.weight_capacity" type="number"></b-form-input>
          </b-col>
          <b-col sm="4">
            <label>Pail Shelf </label>
            <b-form-select v-model="form.pail_shelf" :options="pail_shelf"></b-form-select>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Straight Ladder</h1>
        <b-row>
          <b-col sm="6">
            <label>Rubber Feat </label>
            <b-form-select v-model="form.rubber_feet" :options="rubber_feet"></b-form-select>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Striking Tool</h1>
        <b-row>
          <b-col sm="6">
            <label>Handle Material </label>
            <b-form-input v-model="form.handle_material" type="text"></b-form-input>
          </b-col>
          <b-col sm="6">
            <label>Head Weight </label>
            <b-form-input v-model="form.head_weight" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Digger</h1>
        <b-row>
          <b-col sm="6">
            <label>Blade Length </label>
            <b-form-input v-model="form.blade_length" type="number"></b-form-input>
          </b-col>
          <b-col sm="6">
            <label>Blade Width </label>
            <b-form-input v-model="form.blade_width" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Pruner</h1>
        <b-row>
          <b-col sm="6">
            <label>Blade Material </label>
            <b-form-input v-model="form.blade_material" type="text"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Wheelbarrow</h1>
        <b-row>
          <b-col sm="4">
            <label>Bin Volume </label>
            <b-form-input v-model="form.bin_volume" type="number"></b-form-input>
          </b-col>
          <b-col sm="4">
            <label>Bin Material </label>
            <b-form-input v-model="form.bin_material" type="text"></b-form-input>
          </b-col>
          <b-col sm="4">
            <label>Wheel Count </label>
            <b-form-input v-model="form.wheel_count" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
      <b-container fluid>
        <h1>Rake</h1>
        <b-row>
          <b-col sm="12">
            <label>Tine Count </label>
            <b-form-input v-model="form.tine_count" type="number"></b-form-input>
          </b-col>
        </b-row>
        <br>
      </b-container>
    </b-container>
    <b-container>
      <b-alert variant="danger"
               dismissible
               :show="showDismissibleAlert"
               @dismissed="showDismissibleAlert=false">
        {{stateOfThings}}
      </b-alert>
    </b-container>
    <b-button type="submit" variant="primary" href="#/clerkmainmenu">Back to Main Menu</b-button>
    <b-btn @click="addTool" variant="primary">Confirm</b-btn>
    <b-modal id="modal1" size= "lg" title="Tool Details">
      <b-container style="text-align:left">
        <h1>Tool Successfully Added</h1>
      </b-container>
    </b-modal>
    <br>
  </div>

</template>

<script>
  export default {
    name: "add-tool",
    data() {
      return {
        form: {
          category: 'Hand',
          sub_type: 'Screwdriver',
          sub_option: 'Phillips',
          power_source: 'Manual',
          manufacturer: '',
          material: '',
          width_or_diameter: 0,
          length: 0,
          weight: 0,
          purchase_price: 0,
          clerk_id: 0,
          accessories: [],
          volt_rating: 0,
          amp_rating: 0,
          min_rpm_rating: 0,
          max_rpm_rating: 0,
          dust_bag: false,
          min_torque_rating: 0,
          max_torque_rating: 0,
          adjustable_clutch: false,
          pressure_rating: 0,
          tank_size: 0,
          blade_size: 0,
          power_rating: 0,
          motor_rating: 0,
          drum_size: 0,
          battery_type: 'Li-ion',
          adjustable: false,
          drive_size: 0,
          anti_vibration: false,
          screw_size: 0,
          gauge_rating: 0,
          capacity: 0,
          sae_size: 0,
          step_count: 0,
          weight_capacity: 0,
          pail_shelf: false,
          rubber_feet: false,
          handle_material: '',
          head_weight: 0,
          blade_length: 0,
          blade_width: 0,
          blade_material: '',
          bin_volume: 0,
          bin_material: '',
          wheel_count: 0,
          tine_count: 0

        },
        sub_option: [
          {value: 'Phillips', text: 'Phillips', type: 'Hand', sub_type:'Screwdriver'},
          {value: 'Hex', text: 'Hex', type: 'Hand', sub_type:'Screwdriver'},
          {value: 'Torx', text: 'Torx', type: 'Hand', sub_type:'Screwdriver'},
          {value: 'Slotted', text: 'Slotted', type: 'Hand', sub_type:'Screwdriver'},
          {value: 'Deep', text: 'Deep', type: 'Hand', sub_type:'Socket'},
          {value: 'Standard', text: 'Standard', type: 'Hand', sub_type:'Socket'},
          {value: 'Adjustable', text: 'Adjustable', type: 'Hand', sub_type:'Ratchet'},
          {value: 'Fixed', text: 'Fixed', type: 'Hand', sub_type:'Ratchet'},
          {value: 'Crescent', text: 'Crescent', type: 'Hand', sub_type:'Wrench'},
          {value: 'Torque', text: 'Torque', type: 'Hand', sub_type:'Wrench'},
          {value: 'Pipe', text: 'Pipe', type: 'Hand', sub_type:'Wrench'},
          {value: 'Needle Nose', text: 'Needle Nose', type: 'Hand', sub_type:'Pliers'},
          {value: 'Cutting', text: 'Cutting', type: 'Hand', sub_type:'Pliers'},
          {value: 'Crimper', text: 'Crimper', type: 'Hand', sub_type:'Pliers'},
          {value: 'Nail', text: 'Nail', type: 'Hand', sub_type:'Gun'},
          {value: 'Staple', text: 'Staple', type: 'Hand', sub_type:'Gun'},
          {value: 'Claw', text: 'Claw', type: 'Hand', sub_type:'Hammer'},
          {value: 'Sledge', text: 'Sledge', type: 'Hand', sub_type:'Hammer'},
          {value: 'Framing', text: 'Framing', type: 'Hand', sub_type:'Hammer'},
          {value: 'Pointed Shovel', text: 'Pointed Shovel', type: 'Garden', sub_type:'Digger'},
          {value: 'Flat Shovel', text: 'Flat Shovel', type: 'Garden', sub_type:'Digger'},
          {value: 'Scoop Shovel', text: 'Scoop Shovel', type: 'Garden', sub_type:'Digger'},
          {value: 'Edger', text: 'Edger', type: 'Garden', sub_type:'Digger'},
          {value: 'Sheer', text: 'Sheer', type: 'Garden', sub_type:'Pruner'},
          {value: 'Loppers', text: 'Loppers', type: 'Garden', sub_type:'Pruner'},
          {value: 'Hedge', text: 'Hedge', type: 'Garden', sub_type:'Pruner'},
          {value: 'Leaf', text: 'Leaf', type: 'Garden', sub_type:'Rakes'},
          {value: 'Landscaping', text: 'Landscaping', type: 'Garden', sub_type:'Rakes'},
          {value: 'Rock', text: 'Rock', type: 'Garden', sub_type:'Rakes'},
          {value: '1-Wheel', text: '1-Wheel', type: 'Garden', sub_type:'Wheelbarrows'},
          {value: '2-Wheel', text: '2-Wheel', type: 'Garden', sub_type:'Wheelbarrows'},
          {value: 'Bar Pry', text: 'Bar Pry', type: 'Garden', sub_type:'Striking'},
          {value: 'Rubber Mallet', text: 'Rubber Mallet', type: 'Garden', sub_type:'Striking'},
          {value: 'Tamper', text: 'Tamper', type: 'Garden', sub_type:'Striking'},
          {value: 'Pick Axe', text: 'Pick Axe', type: 'Garden', sub_type:'Striking'},
          {value: 'Single Bit Axe', text: 'Single Bit Axe', type: 'Garden', sub_type:'Striking'},
          {value: 'Rigid', text: 'Rigid', type: 'Ladder', sub_type:'Straight'},
          {value: 'Telescoping', text: 'Telescoping', type: 'Ladder', sub_type:'Straight'},
          {value: 'Folding', text: 'Folding', type: 'Ladder', sub_type:'Step'},
          {value: 'Multi-Position', text: 'Multi-Position', type: 'Ladder', sub_type:'Step'},
          {value: 'Driver', text: 'Driver', type: 'Power', sub_type:'Drill'},
          {value: 'Hammer', text: 'Hammer', type: 'Power', sub_type:'Drill'},
          {value: 'Circular', text: 'Circular', type: 'Power', sub_type:'Saw'},
          {value: 'Reciprocating', text: 'Reciprocating', type: 'Power', sub_type:'Saw'},
          {value: 'Jig', text: 'Jig', type: 'Power', sub_type:'Saw'},
          {value: 'Finish', text: 'Finish', type: 'Power', sub_type:'Sander'},
          {value: 'Sheet', text: 'Sheet', type: 'Power', sub_type:'Sander'},
          {value: 'Belt', text: 'Belt', type: 'Power', sub_type:'Sander'},
          {value: 'Random Orbital', text: 'Random Orbital', type: 'Power', sub_type:'Sander'},
          {value: 'Reciprocating', text: 'Reciprocating', type: 'Power', sub_type:'Air-Compressor'},
          {value: 'Concrete', text: 'Concrete', type: 'Power', sub_type:'Mixer'},
          {value: 'Electric', text: 'Electric', type: 'Power', sub_type:'Generator'},
          // {value: 'Drill Bits', text: 'Drill Bits', type: 'Accessories'},
          // {value: 'Saw Blade', text: 'Saw Blade', type: 'Accessories'},
          // {value: 'Soft Case', text: 'Soft Case', type: 'Accessories'},
          // {value: 'Hard Case', text: 'Hard Case', type: 'Accessories'},
          // {value: 'D/C Batteries', text: 'D/C Batteries', type: 'Accessories'},
          // {value: 'D/C Battery Charger', text: 'D/C Battery Charger', type: 'Accessories'},
          // {value: 'Safety Hat', text: 'Safety Hat', type: 'Accessories'},
          // {value: 'Safety Pants', text: 'Safety Pants', type: 'Accessories'},
          // {value: 'Safety Goggles', text: 'Safety Goggles', type: 'Accessories'},
          // {value: 'Safety Vest', text: 'Safety Vest', type: 'Accessories'},
          // {value: 'Hose', text: 'Hose', type: 'Accessories'},
          // {value: 'Gas Tank', text: 'Gas Tank', type: 'Accessories'},
        ],
        power_source: [
          {value: 'Electric', text: 'Electric A/C'},
          {value: 'Cordless', text: 'Cordless D/C'},
          {value: 'Gas', text: 'Gas'},
          {value: 'Manual', text: 'Manual'}
        ],
        battery_type: [
          {value: 'Li-Ion', text: 'Li-Ion'},
          {value: 'NiCd', text: 'NiCd'},
          {value: 'NiMH', text: 'NiMH'}
        ],
        adjustable:[
          {value: true, text: 'True'},
          {value: false, text: 'False'}
        ],
        rubber_feet: [
          {value: true, text: 'True'},
          {value: false, text: 'False'}
        ],
        pail_shelf: [
          {value: true, text: 'True'},
          {value: false, text: 'False'}
        ],
        adjustable_clutch:[
          {value: true, text: 'True'},
          {value: false, text: 'False'}
        ],
        dust_bag: [
          {value: true, text: 'True'},
          {value: false, text: 'False'}
        ],
        showDismissibleAlert: false,
        stateOfThings: '',
        computedSubOption: []
      }
    },
    methods: {
      addTool(){
        this.setClerkId();
        this.$http.post('http://localhost:3000/add_tool', this.form).then(response=>{

          this.$root.$emit('bv::show::modal', 'modal1')
        }, response=>{
            console.log(response);
            this.showDismissibleAlert = true;
            this.stateOfThings = "Unable to process your request"
        })
      },
      setClerkId(){
        this.form.clerk_id = Number.parseInt(sessionStorage.getItem("clerk_id"))
      },
      dynamicUpdate(){
          this.sub_option.forEach((a)=>{
            if(a.sub_type === this.form.sub_type){
              this.computedSubOption.push(a)
            }
          })
      }

    }
  }
</script>

