<template>
  <v-container>
      <v-layout row wrap class="mb-2">
          <v-flex xs12 sm6 class="text-xs-center text-sm-right">
              <v-btn large router to="/meetups" class="info">Explore Meetups</v-btn>
          </v-flex>
          <v-flex xs12 sm6 class="text-xs-center text-sm-left">
              <v-btn large router to="/meetup/new" class="info">Organize Meetup</v-btn>
          </v-flex>
      </v-layout>
      <v-layout v-if="loading">
          <v-flex xs12 class="text-xs-center">
              <v-progress-circular 
                    indeterminate 
                    class="primary--text" 
                    :width="7" 
                    :size="70" 
                    ></v-progress-circular>
          </v-flex>
      </v-layout>
      <v-layout row wrap class="mt-2" v-else>
          <v-flex xs12>
              <v-carousel style="cursor: pointer;" v-if="!loading">
                    <v-carousel-item
                        v-for="meetup in meetups"
                        :key="meetup.id"
                        v-if="meetup.id != undefined"
                        :src="meetup.imageURL"
                        :to="{
                            name:'Meetup', 
                            params:{
                                id: meetup.id}
                            }"    
                        >
                        <div class="title text-xs-center">
                            {{ meetup.title }}
                        </div>
                    </v-carousel-item>
              </v-carousel>
          </v-flex>
      </v-layout>
      <v-layout row wrap class="mt-2">
          <v-flex xs12>
              <p class="text-xs-center">Join our awesome meetups!</p>
          </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
export default {
      computed:{
        // get featured meetups for Carousel
        meetups (){
            return this.$store.getters.featuredMeetups
        },
        loading (){
            return this.$store.getters.loading
        }
      },
      methods: {
         }
}
</script>

<style scoped>
.title {
    position: absolute;
    bottom: 50px;
    background-color:rgb(0,0,0, 0.5);
    color:white;
    font-size: 2em;
    padding: 20px;
}


[v-cloak] { 
  display: none; 
}
</style>
