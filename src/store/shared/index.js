export default {
    state: {
        loading: false,
        error: null
    },
    mutations:{
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
        clearError ({commit}) {
            commit('clearError')
        }
    },
    getters:{
        loading (state){
            return state.loading
        },
        // Control Alerts
        error (state) {
            return state.error
        }
    }
}