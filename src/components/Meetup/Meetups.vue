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
    <v-layout row wrap v-for="meetup in meetups" :key="meetup.id"  v-if="meetup.id != undefined" class="mb-2">
      <v-flex xs12 sm10 md8 offset-sm1 offset-md2>
        <v-card class="info">
          <v-container fluid>
            <v-layout row>
              <v-flex xs5 sm4 md3>
                <v-card-media
                   :src="meetup.imageURL"
                   height="130px"
                ></v-card-media>
              </v-flex>
              <v-flex xs7 sm8 md9>
                <v-card-title primary-title>
                  <div>
                      <h2 class="white--text mb-0">{{ meetup.title }}</h2>
                      <div>{{ meetup.date  | date }}</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat :to="/meetups/ + meetup.id">
                    <v-icon left>arrow_forward</v-icon>
                    View Meetup
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    computed:{
      // get all meetups
      meetups () {
        return this.$store.getters.loadedMeetups
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