import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedMeetups:[
            // Make sure to copy the correct image url
            { imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/800px-New_york_times_square-terabass.jpg', 
            id: 'aekhiO2jdBHSis', 
            title: 'Meetup in New York', 
            location: 'New York',
            description: 'An awesome meetup!',
            date: new Date()},
            { imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Paris_vue_d%27ensemble_tour_Eiffel.jpg/800px-Paris_vue_d%27ensemble_tour_Eiffel.jpg', 
            id: 'aekhirreww556e', 
            title: 'Meetup in Paris', 
            location: 'Paris, France',
            description: 'It\'s Paris!',
            date: new Date()}
        ],
        // users
        /* user:{
            id: 'ejqjjjdjsosape32',
            registeredMeetups: ['aekhirreww556e']
        } */
        user: null,
        loading: false,
        error: null
    },
    mutations:{
        // create and update new meetups from form
        createMeetup (state, payload) {
            state.loadedMeetups.push(payload)
        },
        setUser (state, payload){
            state.user  = payload
        },
        setLoading (state, payload) {
            state.loading = payload
        },
        setError (state, payload) {
            state.error = payload
        },
        clearError (state, payload)  {
            state.error = null
        }
    },
    actions:{
        // create meetup and save to store
        createMeetup ({ commit}, payload) {
            const meetup = {
                title: payload.title,
                location: payload.location,
                imageURL: payload.imageURL,
                description: payload.description,
                date: payload.date,
                id:'p02oopa9djbh'
            }
            // Reach out to firebase and store it
            commit('createMeetup', meetup)
        },
        signUserUp ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.uid,
                        registeredMeetups:[]
                    }
                    commit('setUser', newUser)
                }
            )
            .catch(
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error)
                }
            )
        },
        signUserIn ({commit}, payload){
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.uid,
                        registeredMeetups:[]
                    }
                    commit('setUser', newUser)
                }
            )
            .catch(
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error)
                }
            )
        },
        clearError ({commit}) {
            commit('clearError')
        }

    },
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
        },
        // Get user
        user (state) {
            return state.user
        },
        loading (state){
            return state.loading
        },
        // Control Alerts
        error (state) {
            return state.error
        }
    }
})