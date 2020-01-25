export const actions = {
    nuxtServerInit({ commit }, { req }) {
        const user = req.session.user;
        if (user) {
            commit('setUser', req.session.user)
        }
    }
}