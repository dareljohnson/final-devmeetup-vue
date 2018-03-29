<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="secondary--text">Create a new Meetup</h1>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateMeetup">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                  label="Title"
                  name="title"
                  id="title"
                  v-model="title"
                  :rules="nameRules"
                  :counter="50"
                  required
                ></v-text-field>
                <v-text-field
                  label="Location"
                  name="location"
                  id="location"
                  v-model="location"
                  required
                ></v-text-field>
                <v-text-field
                  label="Image URL"
                  name="imageURL"
                  id="imageURL"
                  v-model="imageURL"
                  required
                ></v-text-field>
                <img :src="imageURL" alt="Empty Image" height="200">
                <v-text-field
                  label="Description"
                  name="description"
                  id="description"
                  v-model="description"
                  :counter="250"
                  multi-line
                  required
                ></v-text-field>
                <v-btn class="primary" 
                    :disabled="!formIsValid"
                    type="submit">Create Meetup</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        title:'',
        location:'',
        imageURL:'',
        description:'',
        nameRules: [
          v => !!v || 'Title is required',
          v => v.length <= 50 || 'Name must be less than 50 characters'
        ]
      }
    },
    computed:{
      formIsValid () {
        return this.title !== '' && 
               this.location !== '' && 
               this.imageURL !== '' && 
               this.description !== ''
      }
    },
    methods:{
      onCreateMeetup (){
        if(!this.formIsValid){
          return
        }
        const meetupData = {
          title: this.title,
          location: this.location,
          imageURL: this.imageURL,
          description: this.description,
          date: new Date()
        }
        this.$store.dispatch('createMeetup', meetupData)
        this.$router.push('/meetups')
      }
    }
  }
</script>