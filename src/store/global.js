export default {
  state: {
    layerC1Data: [],
    layerC2Data: [],
    layerC3Data: [],
    layerC4Data: [],
    addLineFrom: null,
    windowAddLineVisible: false //添加光缆信息窗口
  },
  mutations: {
    layerC1DataChange(state, val) {
      state.layerC1Data = val
    },
    layerC2DataChange(state, val) {
      state.layerC2Data = val
    },
    layerC3DataChange(state, val) {
      state.layerC3Data = val
    },
    layerC4DataChange(state, val) {
      state.layerC4Data = val
    },
    addLineVisibleChange(state, val) {
      state.windowAddLineVisible = val
    },
    addLineFromChange(state, val) {
      state.addLineFrom = val
    }
  },
  actions: {
    layerC1DataHandle({ commit }, val) {
      commit('layerC1DataChange', val)
    },
    layerC2DataHandle({ commit }, val) {
      commit('layerC2DataChange', val)
    },
    layerC3DataHandle({ commit }, val) {
      commit('layerC3DataChange', val)
    },
    layerC4DataHandle({ commit }, val) {
      commit('layerC4DataChange', val)
    },
    addLineVisibleHandle({ commit }, val) {
      commit('addLineVisibleChange', val)
    },
    addLineFromHandle({ commit }, val) {
      commit('addLineFromChange', val)
    }
  }
}
