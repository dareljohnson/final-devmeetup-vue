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
              </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>      
                <v-text-field
                  label="Location"
                  name="location"
                  id="location"
                  v-model="location"
                  required
                ></v-text-field>
            </v-flex>
          </v-layout>      
          <v-layout row class="mb-3">
            <v-flex xs12 sm6 offset-sm3>      
                <!-- <v-text-field
                  label="Image URL"
                  name="imageURL"
                  id="imageURL"
                  v-model="imageURL"
                  required
                ></v-text-field> -->
                <v-btn raised class="primary" @click="onPickFile">Upload Image</v-btn>
                <input 
                  type="file" 
                  style="display:none" 
                  ref="fileInput" 
                  accept="image/*"
                  @change="onFilePicked">
           </v-flex>
          </v-layout>     
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>      
                <img :src="imageURL" alt="No Image" height="200">
                <v-text-field
                  label="Description"
                  name="description"
                  id="description"
                  v-model="description"
                  :counter="250"
                  multi-line
                  required
                ></v-text-field>
           </v-flex>
          </v-layout>     
          <v-layout row class="mb-4">
            <v-flex xs12 sm6 offset-sm3>      
                <h3>Choose a Date and Time</h3>
           </v-flex>
          </v-layout>
          <v-layout row class="mb-2">
            <v-flex xs12 sm6 offset-sm3>      
                <v-date-picker v-model="date"></v-date-picker>
                <!-- <p>{{ date }}</p> -->
           </v-flex>
          </v-layout>
          <v-layout row class="mb-2">
            <v-flex xs12 sm6 offset-sm3>      
                <v-time-picker v-model="time"  format="ampm"></v-time-picker>
                <!-- <p>{{ time }}</p> -->
           </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>      
                <v-btn class="primary" 
                    :disabled="!formIsValid"
                    type="submit">Create Meetup</v-btn>

                    <!-- {{ submittableDateTime }} -->
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
        ],
        date: '',
        time: new Date(),
        image: null
      }
    },
    computed:{
      formIsValid () {
        return this.title !== '' && 
               this.location !== '' && 
               this.imageURL !== '' && 
               this.description !== ''
      },
      submittableDateTime () {
        const date = new Date(this.date)
        if(typeof this.time === 'string'){
          let hours = this.time.match(/^(\d+)/)[1]
          let minutes = this.time.match(/:(\d+)/)[1]
          date.setHours(hours)
          date.setMinutes(minutes)
        }else{
            date.setHours(this.time.getHours())
            date.setMinutes(this.time.getMinutes())
            //console.log(date)
        }
        
        return date
      }
    },
    methods:{
      onCreateMeetup (){
        if(!this.formIsValid){
          return
        }
        if(!this.image){
          return
        }
        const meetupData = {
          title: this.title,
          location: this.location,
          //imageURL: this.imageURL,
          image: this.image,
          description: this.description,
          date: this.submittableDateTime
        }
        this.$store.dispatch('createMeetup', meetupData)
        this.$router.push('/meetups')
      },
      onPickFile (){
        this.$refs.fileInput.click()
      },
      onFilePicked (event){
        const files = event.target.files
        let filename = files[0].name
        if(filename.lastIndexOf('.') <= 0){
          return alert('Please add a valid file!')
        }
        // convert binary to string
        const fileReader = new FileReader()
        fileReader.addEventListener('load', ()=>{
          this.imageURL = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]
      }
    }
  }
</script>