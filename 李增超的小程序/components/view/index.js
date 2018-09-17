// components/lzc-view/lzc-view.js
const request = require('../../request/request.js');
const urls = require("../../request/urls.js").urls;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openType: {
      type: Boolean,
      value: false
    },
    cmd: {
      type: String,
      value: ''
    },
    value: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  ready: function () {
    //查看是否授权
    this.switchBtnStatus()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindgetuserinfo: function (event) {
      this.switchBtnStatus()
      const self = this;
      if (event.detail.userInfo) {
        self.setData({
          openType: true
        })
        // 绑定用户
        request.postData({
          isShowLoading: false,
          loadingType: 'success',
          params: event.detail.userInfo,
          url: urls.saveUser,
          success: function (res) { },
          fail: function (res) { }
        })
      }
    },

    /**
     * 判断是否需要授权
     */
    switchBtnStatus: function () {
      const self = this
      console.log('开始判断是否需要授权')
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            console.log('不需要授权')
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            self.setData({
              openType: false
            })
          } else {
            console.log('需要授权')
            self.setData({
              openType: true
            })
          }
        }
      })
    },

    /**
     * 点击方法
     */
    formSubmit: function (event) {
      console.log(event)
      switch (event.currentTarget.dataset.cmd) {
        case 'navigateTo':
          wx.navigateTo({
            url: event.currentTarget.dataset.value,
          })
          break
        case 'switchTab':
          wx.switchTab({
            url: event.currentTarget.dataset.value,
          })
          break
        case 'redirectTo':
          wx.redirectTo({
            url: event.currentTarget.dataset.value,
          })
          break
        default:
          /**
           * 外抛组件事件
           */
          this.triggerEvent('click', event.currentTarget.dataset)
          break
      }
      if (event.detail.formId) {
        //给后台
      }
    }
  }
})