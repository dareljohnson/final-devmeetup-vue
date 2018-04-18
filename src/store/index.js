import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedMeetups: [],
        user: null,
        loading: false,
        error: null
    },
    mutations:{
        registerUserForMeetup(state, payload){
            const id = payload.id
            if(state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >=0) {
                return
            }
            state.user.registeredMeetups.push(id)
            state.user.fbKeys[id] = payload.fbKey
        },
        unRegisterUserFromMeetup(state, payload){
            const registeredMeetups = state.user.registeredMeetups
            registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
            Reflect.deleteProperty(state.user.fbKeys, payload)
        },
        // create and update new meetups from form
        createMeetup (state, payload) {
            state.loadedMeetups.push(payload)
        },
        updateMeetup (state, payload){
            // find the meetup to update
            const meetup = state.loadedMeetups.find(meetup => {
                return meetup.id === payload.id
            })
            
            if(payload.title){
                meetup.title = payload.title
            }
            if(payload.description){
                meetup.description = payload.description
            }
            if(payload.date){
                meetup.date = payload.date
            }
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
        registerUserForMeetup ({commit, getters}, payload){
            commit('setLoading', true)
            const user = getters.user

            //console.log("User " + user)
            firebase.database().ref('/users/' + user.id).child('/registrations/')
            .push(payload)
            .then(data => {
                commit('setLoading', false)
                commit('registerUserForMeetup', {
                    id: payload, 
                    fbKey: data.key
                })
            })
            .catch(error => {
                console.log(error)
                commit('setLoading', false)
            })
        },
        unRegisterUserFromMeetup ({commit, getters}, payload){
            commit('setLoading', true)
            const user = getters.user
            const fbKeys = getters.user.fbKeys

            //console.log("User " + user.id)
            if(!fbKeys){
                console.log("No fbKeys for user " + user.id)
                return
            }
            console.log("payload " + payload)
            console.log("fbKeys " + fbKeys)
            const fbKey = fbKeys[payload]
            console.log("fbKey " + fbKey)
            firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
            .remove()
            .then(() => {
                commit('setLoading', false)
                commit('unRegisterUserFromMeetup', payload)
            })
            .catch(error => {
                console.log(error)
                commit('setLoading', false)
            })
        },
        // load meetups
        loadMeetups ({commit}) {
            commit('setLoading', true)
            firebase.database().ref('meetups').once('value')  // use once instead of on to turn off realtime updates
                .then((data)=>{
                    const meetups = []
                    const obj = data.val() // obj: value pairs
                    for(let key in obj) {
                        if(key != null){
                            meetups.push({
                                id: key,
                                title: obj[key].title,
                                description: obj[key].description,
                                imageURL: obj[key].imageURL,
                                date: obj[key].date,
                                creatorId: obj[key].creatorId,
                                location: obj[key].location
                            })
                        }
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
            commit('setLoading', true)

            const meetup = {
                title: payload.title,
                location: payload.location,
                description: payload.description,
                date: payload.date.toISOString(),
                creatorId: getters.user.id
            }
            let imageUrl
            let key
            // Reach out to firebase and store it
            firebase.database().ref('meetups').push(meetup)
                .then((data) => {
                    //console.log(data)
                    key = data.key
                    return key
                })
                .then(key => {
                    commit('setLoading', false)
                    const filename = payload.image.name
                    const ext = filename.slice(filename.lastIndexOf('.'))
                    return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
                })
                .then(fileData => {
                    commit('setLoading', false)
                    imageUrl = fileData.metadata.downloadURLs[0]
                    return firebase.database().ref('meetups').child(key).update({imageURL: imageUrl})
                })
                .then(()=>{
                    commit('setLoading', false)
                    commit('createMeetup', {
                        ...meetup, //spread operator
                        imageURL: imageUrl,
                        id: key
                    }) 
                    
                })
                .catch((error)=>{
                    console.log(error)
                    commit('setLoading', false)
                })
                
            commit('createMeetup', meetup)
        },
        updateMeetupData ({commit}, payload){
            commit('setLoading', true)
            const updateObj = {}
            
            if(payload.date == null){
                if(payload.title){
                    updateObj.title = payload.title
                } 
               
                if(payload.description){
                    updateObj.description = payload.description
                }
            }else{
                if(payload.date){
                    updateObj.date = payload.date.toISOString()
                }
            }
            //console.log(updateObj)

            // update firebase
            firebase.database().ref('meetups').child(payload.id).update(updateObj)
                .then(()=>{
                    commit('setLoading', false)
                    commit('updateMeetup',payload)
                })
                .catch((error)=>{
                    console.log(error)
                    commit('setLoading', false)
                })
        },
        signUserUp ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            const email = payload.email
            const password = payload.password

            firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password)
            .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.uid,
                        registeredMeetups:[],
                        fbKeys: {}
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
        signUserIn ({commit, getters}, payload){
            commit('setLoading', true)
            commit('clearError')
            const email = payload.email
            const password = payload.password

            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.uid,
                        registeredMeetups: []
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
        autoSignIn ({commit, getters}, payload){
            commit('setUser', {
                id: payload.uid,
                registeredMeetups: []
            })
        },
        // load registrations
        fetchUserData({commit, getters}){
            commit('setLoading', true)
            const user = getters.user
            
            firebase.database().ref('/users/' + user.id + '/registrations/').once('value')
            .then(data => {
                const dataPairs = data.val()
                let registeredMeetups = []
                let swappedPairs = {}
                for(let key in dataPairs){
                    registeredMeetups.push(dataPairs[key])
                    swappedPairs[dataPairs] = key
                }
                //console.log(registeredMeetups)
                //console.log(swappedPairs)
                const updatedUser = {
                    id: getters.user.id,
                    registeredMeetups: registeredMeetups,
                    fbKeys: swappedPairs
                }
                commit('setLoading', false)
                commit('setUser', updatedUser)
            })
            .catch(
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error)
                }
            )
        },
        Logout ({commit, getters}){
            var user = getters.user
            if(user){
                firebase.auth().signOut()
                commit('setUser', null)
            } 
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