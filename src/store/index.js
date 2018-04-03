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
        setLoadedMeetups (state, payload){
            state.loadedMeetups = payload
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
    // ASYNC code here
    actions:{
        // load meetups
        loadMeetups ({commit}) {
            commit('setLoading', true)
            firebase.database().ref('meetups').once('value')  // use once instead of on to turn off realtime updates
                .then((data)=>{
                    const meetups = []
                    const obj = data.val() // obj: value pairs
                    for(let key in obj) {
                        meetups.push({
                            id: key,
                            title: obj[key].title,
                            description: obj[key].description,
                            imageURL: obj[key].imageURL,
                            date: obj[key].date,
                            creatorId: obj[key].creatorId
                        })
                    }
                    commit('setLoadedMeetups', meetups)
                    commit('setLoading', false)
                })
                .catch((error)=>{
                    console.log(error)
                    commit('setLoading', true)
                })
        },
        // create meetup and save to store
        createMeetup ({ commit, getters}, payload) {
            const meetup = {
                title: payload.title,
                location: payload.location,
                imageURL: payload.imageURL,
                description: payload.description,
                date: payload.date.toISOString(), //,
                //id:'p02oopa9djbh'
                creatorId: getters.user.id
            }
            // Reach out to firebase and store it
            firebase.database().ref('meetups').push(meetup)
                .then((data) => {
                    const key = data.key
                    commit('createMeetup', {
                        ...meetup, //spread operator
                        id: key
                    })
                    console.log(data)
                })
                .catch((error)=>{
                    console.log(error)
                })
                
            //commit('createMeetup', meetup)
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
        autoSignIn ({commit}, payload){
            commit('setUser', {id: payload.uid})
        },
        Logout ({commit}){
            firebase.auth().signOut()
            commit('setUser', null)
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