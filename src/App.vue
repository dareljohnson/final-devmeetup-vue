<template>
  <v-app>
    <v-navigation-drawer
      temporary
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="sideNav"
      enable-resize-watcher
      fixed
      app
    >
      <v-list class="pa-1" v-if="loggedIn" v-cloak>
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://media.licdn.com/mpr/mpr/shrinknp_100_100/p/3/000/0e1/058/3a56394.jpg" >
          </v-list-tile-avatar>
          <v-list-tile-content @click.stop="sideNav = !sideNav">
            <!-- <v-list-tile-title>Darel Johnson</v-list-tile-title> -->
            <router-link to="/" tag="span" style="cursor: pointer">{{ currentUser }}</router-link>
          </v-list-tile-content>
        </v-list-tile>
        </v-list> 
        <v-list v-else>   
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>home</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <router-link to="/" tag="span" style="cursor: pointer">{{ title }}</router-link>
              </v-list-tile-content>
            </v-list-tile>
      </v-list>      
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in menuItems"
          :key="i"
          router
          :to="item.link"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="userIsAuthenticated" @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
      class="primary"
      dark
    >
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer"  v-text="title"></router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn 
          flat 
          value="true"
          v-for="(item, i) in menuItems"
          :key="i"
          router
          :to="item.link">
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn 
          flat 
          v-if="userIsAuthenticated" @click="onLogout">
          <v-icon left>exit_to_app</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      sideNav: false,
      fixed: false,
      miniVariant: false,
      loggedIn: true,
      currentUser: 'Darel',
      title: 'DevMeetup'
    }
  },
  computed:{
    menuItems () {
      let menuItems = [
            { icon: 'face', title: 'Sign up', link: '/signup'},
            { icon: 'lock_open', title: 'Sign in', link: '/signin'}
           ]
          if(this.userIsAuthenticated){
            menuItems = [
            { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups'},
            { icon: 'room', title: 'Organize Meetup', link: '/meetup/new'},
            { icon: 'person', title: 'Profile', link: '/profile'}
            ]
          }
          return menuItems
    },
    userIsAuthenticated () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  },
  methods:{
    onLogout (){
      this.$store.dispatch('Logout')
      this.$router.push('/')
      this.sideNav = false
    }
  },
  name: 'App'
}
</script>
