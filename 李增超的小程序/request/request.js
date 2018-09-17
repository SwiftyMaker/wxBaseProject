// const host = 'http://101.201.144.134:7080' //自用测试
// const host = 'https://testsxy.mashanghudong.net' //演示用
const host = 'http://192.168.1.132:7080' //刘向鹏

const isShowLoading = true //是否展示 loading

// 回调
const handle = {
  isShowLoading: false,
  'content-type': 'application/json',
  loadingType: 'success',
  params: {},
  url: '',
  success: function(res) {},
  fail: function(res) {}
}

// post 请求
function postData(handle) {
  addUserAuthorized('POST', handle)
}

// get 请求
function getData(handle) {
  addUserAuthorized('GET', handle)
}

// 添加用户验证
function addUserAuthorized(method = 'POST', handle) {
  //  在 handle中处理用户验证
  if (getApp().getUserToken()) {
    console.log("已登录");
    handle.header = {
      'Cookie': 'SPRINGSESSION=' + getApp().getUserToken(),
      'fromId': '2',
      'Content-Type': handle['content-type'] || 'application/json'
    }
    request(method, handle)
  } else {
    loginUser()
    console.log("需登录");
  }
}

//登录
function loginUser() {
  wx.login({
    success: function(res) {
      console.log(res.code)
      // return
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wx.request({
        url: host + '/userPower/onLogin',
        data: {
          code: res.code
        },
        success: function(res) {
          if (res.data.status == 200) {
            getApp().saveUserToken(res.data.sessionId)
            getApp().saveUserInfo(res.data.userId)
            getCurrentPages()[getCurrentPages().length - 1].loadData()
          }
          setInterval(function() {
            getData({
              url: '/userPower/refreshSession',
              success: function (res) { },
              fail: function (res) { }
            })
          }, 15 * 60 * 1000)
        }
      })
    }
  })
}

// 网络请求
function request(method = 'POST', handle) {
  const params = handle.params
  const header = handle.header
  const url = handle.url
  console.log(host + url + '----start request')
  console.log(host + url , '---params---' , params)
  if (handle.isShowLoading && isShowLoading) {
    wx.showLoading({
      title: '正在加载',
    })
  }
  wx.request({
    url: host + url,
    data: params,
    header: header,
    method: method,
    success: function(res) {
      // 判断 httpStatus + res.data.code
      if (res.statusCode == 200) {
        if (res.data.returnCode && res.data.returnCode == "FAIL") {
          getApp().toast(res.data.returnMsg)
          handle.fail()
        } else if(res.data.resultCode && res.data.resultCode == "FAIL"){
          getApp().toast(res.data.errCodeDes)
          handle.fail()
        } else {
          handle.success(res)
        }
      } else {
        getApp().toast('网络错误')
        handle.fail()
      }
    },
    fail: function() {
      getApp().toast('网络错误')
      handle.fail()
    },
    complete: function() {
      console.log(host + url + 'end request')
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }
  })
}

module.exports = {
  postData,
  getData
}