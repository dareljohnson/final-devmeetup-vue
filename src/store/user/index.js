import * as firebase from 'firebase'

export default {
    state: {
        user: null
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
        setUser (state, payload){
            state.user  = payload
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
                    id: payload.trim(), 
                    fbKey: data.key.trim()
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
            let fbKeys = getters.user.fbKeys
            let meetupId = payload

            //console.log("User " + user.id)
            if(!fbKeys || fbKeys == undefined || fbKeys == null){
                console.log("No fbKeys for user " + user.id)
                return
            }
            //console.log("payload " + payload)
            //console.log("meetupId " + meetupId)
            //console.log("fbKey " + fbKeys[meetupId])
            let fbKey = fbKeys[payload]
            if(!fbKey){
                commit('setLoading', false)
                return
            }
            //console.log("fbKey " + fbKey)
            //console.log('/users/' + user.id + '/registrations/'+ fbKey)
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
            .then(() => {
                return 'This code will never execute, because there is an error above it';
             })
        },
        signUserUp ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            const email = payload.email.trim()
            const password = payload.password.trim()

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
            const email = payload.email.trim()
            const password = payload.password.trim()

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
                .then(()=>{
                    commit('setUser', null)
                }).catch(error => {
                        commit('setLoading', false)
                        commit('setError', error)
                        console.log(error)
                    }
                )
            } 
        }
    },
    getters:{
       // Get user
        user (state) {
            return state.user
        }
    }
}