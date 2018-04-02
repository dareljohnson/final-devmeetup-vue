import Vue from 'vue'
import App from './App'
import router from './router'
import { store } from './store'
import DateFilter from './filters/date'
import * as firebase from 'firebase'
import AlertComponent from './components/Shared/Alert'
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VCarousel,
  VCard,
  VTextField,
  VDatePicker,
  VTimePicker,
  VAlert
} from 'vuetify'
import '../node_modules/vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VCarousel,
    VCard,
    VTextField,
    VDatePicker,
    VTimePicker,
    VAlert
  },
  theme: {
    primary: '#f44336',
    secondary: '#e57373',
    accent: '#9c27b0',
    error: '#f44336',
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ffeb3b'
  }
})

Vue.config.productionTip = false

// register compoenents
Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertComponent)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: "AIzaSyBwbYxWcmbSrqQv2bZy22gMVINYSD_X_zE",
      authDomain: "devmeetup-c685d.firebaseapp.com",
      databaseURL: "https://devmeetup-c685d.firebaseio.com",
      projectId: "devmeetup-c685d",
      storageBucket: "devmeetup-c685d.appspot.com"
    })
  }
})
