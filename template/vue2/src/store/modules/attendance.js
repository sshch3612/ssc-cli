import { announceList, announceAdd, announceUpdate, announceDelete, announceDetail, announceAttachDown } from "@/api/announce";


const state = () => ({
    view: {},
    isRefresh: false,
    total: 0,
    list: [],
    mode: false
});

const actions = {
    openModel({ dispatch }, { modeltype, id }) {
        console.log(6666);
        dispatch("view", { modeltype, id });
    },
    closeModel({ commit }) {
        commit("redModel", false);
    },
    async add({ commit }, { payload, formData }) {
        //
        try {
            await announceAdd(payload);
            commit("notice/list", { formData });
        } catch (error) {

        }
    },
    async view({ commit }, { modeltype, id }) {
        //
        let response = {};
        if (id) {
            response = await announceDetail(id);
        }
        await commit("redView", response);
        await commit("redModel", modeltype);
    },
    async update({ dispatch }, { payload, formData }) {
        //
        try {
            await announceUpdate(payload.id, payload);
            dispatch("list", { formData });
        } catch (error) {

        }
    },
    async delete({ dispatch }, { id, formData }) {
        // 删除
        try {
            await announceDelete(id);
            dispatch("list", { formData });
        } catch (error) {
            console.log(error);
        }
    },
    async list({ commit }, { formData }) {
        //
        try {
            commit("refresh", true);
            const response = await announceList(formData);
            // list 请求
            commit("redList", { payload: response.data || [], total: response.total });
        } catch (error) {

        }
    },
    down(_, { id }) {
        //
        try {
            const response = announceAttachDown(id);
            console.log(response);
        } catch (error) {

        }
    },
    // -> dispatch('test/change')
    change({ state, commit, rootState }, { params }) {
        /**/
    },

};

const mutations = {
    // -> commit('test/change')
    change(state, data) {
        /** */
    },
    redModel(state, data) {
        state.mode = data;
    },
    redView(state, data) {
        state.view = data;
    },
    redList(state, { payload, total }) {
        state.list = payload;
        state.total = total;
        state.isRefresh = false;
    },
    refresh(state, data) {
        /** */
        state.isRefresh = data;
    }
};

const getters = { // 可以认为是 store 的计算属性
    //  doneCount: state => {
    //   return state.count + 2
    // }
};



export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};