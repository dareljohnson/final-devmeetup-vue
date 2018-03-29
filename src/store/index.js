import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedMeetups:[
            // Make sure to copy the correct image url
            { imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/800px-New_york_times_square-terabass.jpg', 
            id: 'aekhiO2jdBHSis', 
            title: 'Meetup in New York', 
            date: '2017-07-17'},
            { imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Paris_vue_d%27ensemble_tour_Eiffel.jpg/800px-Paris_vue_d%27ensemble_tour_Eiffel.jpg', 
            id: 'aekhirreww556e', 
            title: 'Meetup in Paris', 
            date: '2017-07-20'}
        ],
        // users
        user:{
            id: 'ejqjjjdjsosape32',
            registeredMeetups: ['aekhirreww556e']
        }
    },
    mutations:{},
    actions:{},
    getters:{
        // load all meetups sorted by date asc
        loadedMeetups (state) {
            return state.loadedMeetups.sort((meetupA, meetupB)=>{
                return meetupA.date > meetupB.date
            })
        },
        // load carousel wth most recent meetups by date asc
        featuredMeetups (state, getters) {
            return getters.loadedMeetups.slice(0,5)
        },
        // load meetup
        loadedMeetup (state) {
            return (meetupId) => {
                return state.loadedMeetups.find((meetup)=>{
                    return meetup.id === meetupId
                })
            }
        }
    }
})