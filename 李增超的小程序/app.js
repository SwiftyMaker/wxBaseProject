//app.js
App({
  onLaunch: function() {
    const self = this 
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      if (res.hasUpdate) {
        self.toast('应用即将更新')
      }
      updateManager.onUpdateReady(function() {
        updateManager.applyUpdate()
      })
      updateManager.onUpdateFailed(function() {})
    })
    this.saveUserToken(false)
  },
  onShow: function() {},
  mainGoodId: 1,
  saveUserInfo: function(userInfo) {
    wx.setStorageSync('userInfo', userInfo)
  },
  saveUserToken: function(token) {
    wx.setStorageSync('token', token)
  },
  getUserInfo: function(userInfo) {
    return wx.getStorageSync('userInfo') || false
  },
  getUserToken: function(token) {
    return wx.getStorageSync('token') || false
  },
  toast: function(msg) {
    setTimeout(function() {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    }, 500)
  },
  log: function(msgObject) {
    console.log(getCurrentPages()[getCurrentPages().length - 1].route ,'----' ,msgObject)
  }

})