import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const Store = new Vuex.Store({
    state: {
        loaded: false,
        screenSize: {
            width: 0,
            height: 0
        },
        propsLoading: false,
        notification: ""
    },
    mutations: {
        setLoaded(state) {
            state.loaded = true;
        },
        updateScreenSize(state, size) {
            state.screenSize = size;
        },
        updatePropsLoadingStatus(state, status) {
            state.propsLoading = status;
        },
        notify(state, message) {
            state.notification = message
        },
    }
});

export default Store;
