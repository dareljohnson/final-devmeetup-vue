import * as firebase from 'firebase'

export default {
    state: {
        loadedMeetups: []
    },
    mutations:{
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
                meetup.title = payload.title.trim()
            }
            if(payload.description){
                meetup.description = payload.description.trim()
            }
            if(payload.date){
                meetup.date = payload.date.trim()
            }
        },
        setLoadedMeetups (state, payload){
            state.loadedMeetups = payload 
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
                title: payload.title.trim(),
                location: payload.location.trim(),
                description: payload.description.trim(),
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
                    const filename = payload.image.name.trim()
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
                    updateObj.title = payload.title.trim()
                } 
               
                if(payload.description){
                    updateObj.description = payload.description.trim()
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
            return getters.loadedMeetups.slice(0,7)
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
}