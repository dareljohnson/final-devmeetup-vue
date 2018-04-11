<template>
  <v-dialog  width="350px" persistent v-model.lazy="editDialog">
      <v-btn fab dark accent slot="activator">
          <v-icon>edit</v-icon>
      </v-btn>
      <v-card>
          <v-container>
              <v-layout  row wrap>
                  <v-flex xs12>
                    <v-card-title>Edit Meetup</v-card-title>
                  </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout  row wrap>
                  <v-flex xs12>
                     <v-card-text v-cloak>
                         <v-text-field
                            label="Title"
                            name="title"
                            id="title"
                            v-model.lazy="editedTitle"
                            :counter="50"
                            required
                            ></v-text-field>
                        <v-text-field
                            label="Description"
                            name="description"
                            id="description"
                            v-model.lazy="editedDescription"
                            :counter="250"
                            multi-line
                            required
                            ></v-text-field>
                     </v-card-text>
                  </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <v-layout row wrap>
                  <v-flex  xs12>
                      <v-card-actions>
                        <v-btn flat class="blue--text darken-1" @click.native="editDialog = false">Close</v-btn>
                        <v-btn flat class="blue--text darken-1" @click.native="onSaveChanges">Save</v-btn>
                      </v-card-actions> 
                  </v-flex>
              </v-layout>
          </v-container>
      </v-card>
  </v-dialog>
</template>

<script>
    export default {
        props: ['meetup'],
        data () {
            return {
                editedTitle: this.meetup.title,
                editedDescription: this.meetup.description,
                editDialog: false
            }
        },
        methods:{
            onSaveChanges (){
                if(this.editedTitle.trim() === '' || this.editedDescription.trim() === ''){
                    return 
                }
                this.editDialog = false
                this.$store.dispatch('updateMeetupData', {
                    id: this.meetup.id,
                    title: this.editedTitle,
                    description: this.editedDescription
                })
            }
        }
    }
</script>

<style>
    [v-cloak] { 
        display: none; 
    }
</style>