<template>
  <v-container>
      <v-layout row wrap v-if="loading">
          <v-flex xs12 class="text-xs-center">
              <v-progress-circular 
                    indeterminate 
                    class="primary--text" 
                    :width="7" 
                    :size="70" 
                    ></v-progress-circular>
          </v-flex>
      </v-layout>
      <v-layout row wrap v-else>
          <v-flex xs12>
              <v-card>
                <v-card-title>
                    <h2 class="primary--text">{{ meetup.title }}</h2>
                    <template  v-if="userIsCreator">
                        <v-spacer></v-spacer>
                        <app-edit-meetup-details-dialog :meetup="meetup"></app-edit-meetup-details-dialog>  
                    </template>
                </v-card-title>
                 <v-card-media
                   v-cloak
                   :src="meetup.imageURL"
                   height="400px"
                ></v-card-media>
                <v-card-text>
                    <div class="info--text">
                        {{ meetup.date | date }} - {{ meetup.location }}
                    </div>
                    <div v-if="userIsCreator">
                        <app-edit-meetup-date-dialog :meetup="meetup"></app-edit-meetup-date-dialog>
                        <app-edit-meetup-time-dialog :meetup="meetup"></app-edit-meetup-time-dialog>
                    </div>
                    <div v-cloak>
                        {{ meetup.description }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- <v-btn class="primary">Register</v-btn> -->
                    <app-meetup-register-dialog :meetupId="meetup.id" v-if="userIsAuthenticated && !userIsCreator"></app-meetup-register-dialog>
                </v-card-actions> 
              </v-card>
          </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
    export default {
        // accept property from the router
        props: ['id'],
        computed:{
            // get single meetup
            meetup (){
                return this.$store.getters.loadedMeetup(this.id)
            },
            userIsAuthenticated (){
                return this.$store.getters.user !== null && this.$store.getters.user !== undefined
            },
            userIsCreator (){
                if(!this.userIsAuthenticated){
                    return false
                }
                return this.$store.getters.user.id === this.meetup.creatorId
            },
            loading () {
                return this.$store.getters.loading
        }

        }
    }
</script>

<style>
    [v-cloak] { 
        display: none; 
    }
</style>
