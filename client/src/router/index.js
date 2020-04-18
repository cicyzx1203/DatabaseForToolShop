import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import CustomerMainMenu from '@/components/CustomerMainMenu'
import CustomerRegistrationForm from '@/components/CustomerRegistrationForm'
import GenerateReports from '@/components/GenerateReports'
import CheckToolAvailability from '@/components/CheckToolAvailability'
import ClerkReport from '@/components/ClerkReport'
import CustomerReport from '@/components/CustomerReport'
import PickupReservation from '@/components/PickupReservation'
import ViewProfile from '@/components/ViewProfile'
import MakeReservation from '@/components/MakeReservation'
import ClerkMainMenu from '@/components/ClerkMainMenu'
import ClerkPasswordUpdate from '@/components/ClerkPasswordUpdate'
import DropoffReservation from '@/components/DropoffReservation'
import ToolInventoryReport from '@/components/ToolInventoryReport'
import AddTool from '@/components/AddTool'
import Receipt from '@/components/Receipt'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/', // Complete
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/mainmenu', // Complete
      name: 'MainMenu',
      component: CustomerMainMenu
    },
    {
      path: '/customerreg', // Still needs form validation
      name: 'Registration',
      component: CustomerRegistrationForm
    },
    {
      path: '/generatereports', // Complete
      name: 'Reports',
      component: GenerateReports
    },
    {
      path: '/checktoolavailability', //TODO: Integrate Tool List
      name: 'ToolAvailability',       // TODO: Integrate Tool Details View Backend
      component: CheckToolAvailability
    },
    {
      path: '/clerkreport', // Complete
      name: 'ClerkReport',
      component: ClerkReport
    },
    {
      path: '/customerreport', //TODO: Needs Testing with Test Data
      name: 'CustomerReport',
      component: CustomerReport
    },
    {
      path: '/pickupreservation', // Needs Integration
      name: 'PickupReservation',
      component: PickupReservation
    },
    {
      path: '/viewprofile', //TODO: Update to use UserID
      name: 'ViewProfile',
      component: ViewProfile
    },
    {
      path: '/makereservation', //Needs Integration
      name: 'MakeReservation',
      component: MakeReservation
    },
    {
      path: '/clerkmainmenu', // Complete
      name: 'ClerkMainMenu',
      component: ClerkMainMenu
    },
    {
      path: '/clerkpasswordupdate', // Complete
      name: 'ClerkPasswordUpdate',
      component: ClerkPasswordUpdate
    },
    {
      path: '/dropoffreservation', // Needs integration
      name: 'DropoffReservation',
      component: DropoffReservation
    },
    {
      path: '/toolinventoryreport', // Needs integration
      name: 'ToolInventoryReport',
      component: ToolInventoryReport
    },
    {
      path: '/addtool', // Needs integration
      name: 'AddTool',
      component: AddTool
    },
    {
      path: '/receipt', // Needs integration
      name: 'Receipt',
      component: Receipt
    }
  ]
})
