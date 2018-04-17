<template>
  <v-dialog width="350px" persistent v-model="registerDialog">
      <v-btn accent slot="activator" class="primary" v-if="userIsAuthenticated">
          {{ userIsRegistered ? 'Unregister' : 'Register' }}
      </v-btn>
      <v-card>
          <v-container>
              <v-layout  row wrap>
                  <v-flex xs12>
                    <v-card-title v-if="userIsRegistered">Unregister from Meetup?</v-card-title>
                    <v-card-title v-else>Register for Meetup?</v-card-title>
                  </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout  row wrap>
                  <v-flex xs12>
                    <v-card-actions>
                        <v-btn 
                         class="red--text darken-1"
                         flat
                         @click.native="registerDialog = false">Cancel</v-btn>
                        <v-btn
                         class="green--text darken-1"
                         flat
                         @click.native="onAgree">Confirm</v-btn>
                    </v-card-actions>
                  </v-flex>
              </v-layout>
          </v-container>
      </v-card>
  </v-dialog>
</template>

<script>
    export default {
        props: ['meetupId'],
        data () {
            return {
                registerDialog: false
            }
        },
        computed: {
            userIsRegistered () {
                //console.log("meetup Id " + this.meetupId)
                //console.log("User Id " + this.$store.getters.user.id)
                return this.$store.getters.user.registeredMeetups.findIndex(meetupId => {
                        return meetupId === this.meetupId }) >= 0
            },
            userIsAuthenticated (){
                return this.$store.getters.user !== null && this.$store.getters.user !== undefined
            }
        },
        methods: {
            onAgree () {
                if(this.userIsRegistered){
                    console.log("unregister from meetup Id " + this.meetupId)
                    this.$store.dispatch('unRegisterUserFromMeetup', this.meetupId)
                }else{
                    //console.log("register for meetup Id " + this.meetupId)
                    this.$store.dispatch('registerUserForMeetup', this.meetupId)
                }
               }
           }    
    }
</script>

<style>
    [v-cloak] { 
        display: none; 
    }
</style>