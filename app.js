//app.js

const config = require('./config')

App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.removeStorageSync('token')

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  // 自定义登录
  userLogin: function(object) {
    var that = this
    if (wx.getStorageSync('token')) {
      if (typeof object == "object") {
        let func = object.success
        typeof func == "function" && func()
      }
    } else {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            // 发起网络请求
            wx.request({
              url: config.wxLoginApi,
              data: {
                code: res.code
              },
              dataType: "json",
              success(result) {
                // console.log('request success', result)
                if (config.errorCode.success == result.data.errno) {
                  let token = result.data.data['token']
                  wx.setStorageSync('token', token)

                  if (typeof object == "object") {
                    let func = object.success
                    typeof func == "function" && func()
                  }
                } else {
                  // console.log('wxLoginApi failed', result)
                  if (typeof object == "object") {
                    let func = object.fail
                    typeof func == "function" && func()
                  }
                }
              },
              fail(result) {
                // console.log('request fail', result)
                if (typeof object == "object") {
                  let func = object.fail
                  typeof func == "function" && func()
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
            if (typeof object == "object") {
              let func = object.fail
              typeof func == "function" && func()
            }
          }
        }
      })
    }
    if (typeof object == "object") {
      let func = object.complete
      typeof func == "function" && func()
    }
  },
  toLogin: function() {
    wx.navigateTo({
      url: '/pages/me/login/login'
    })
  },
})