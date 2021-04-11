Component({
  data: {
    selInx: 0,
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selInx: data.index
      })
    }
  }
})