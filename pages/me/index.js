//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '敬请期待',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.switchTab({
      url: '/pages/story/recommend/recommend'
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // onShow: function() {
  //   wx.showModal({
  //     title: '开发ing',
  //     content: '咪催我啦',
  //     cancelText: '好的',
  //     confirmText: '辛苦了',
  //     success(res) {
  //       if (res.confirm) {
  //         console.log('用户点击确定')
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     },
  //     complete() {
  //       wx.switchTab({
  //         url: '/pages/story/recommend/recommend'
  //       })
  //     }
  //   })
  // },
  toSearchPage: function() {
    wx.navigateTo({
      url: './search/search'
    })
  },
  toCopyrightPage: function() {
    wx.navigateTo({
      url: './copyright/copyright'
    })
  },
})