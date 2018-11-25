//index.js
//获取应用实例
const app = getApp()
const config = require('../../../config')

Page({
  data: {
    storyList: []
  },
  onLoad: function() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.getStory();
  },
  getStory: function() {
    const that = this
    wx.request({
      url: config.getStoryApi,
      data: {
        noncestr: Date.now()
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      dataType: "json",
      success(result) {
        if (config.errorCode.success != result.data.errno) {
          wx.showToast({
            title: result.data.errmsg,
            // icon: 'none',
            image: "/image/meh.png",
            duration: 2000,
            mask: true
          })
          return
        }
        that.setData({
          storyList: result.data.data
        })
      },
      fail(result) {
        console.log('request fail', result)
      },
      complete(result) {
        wx.hideLoading()
        console.log('request complete', result)
      }
    })
  }
})