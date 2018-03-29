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
      <v-layout row wrap class="mt-2">
          <v-flex xs12>
              <v-carousel style="cursor: pointer;" v-cloak>
                    <v-carousel-item
                        v-for="meetup in meetups"
                        :key="meetup.id"
                        :src="meetup.imageURL"
                        router
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
      data () {
        return {
            meetups: [
                // Make sure to copy the correct image url
                { imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/800px-New_york_times_square-terabass.jpg', 
                id: 'aekhiO2jdBHSis', 
                title: 'Meetup in New York'},
                { imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Paris_vue_d%27ensemble_tour_Eiffel.jpg/800px-Paris_vue_d%27ensemble_tour_Eiffel.jpg', 
                id: 'aekhirreww556e', 
                title: 'Meetup in Paris'}
            ]
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
