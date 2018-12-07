//detail.js
//获取应用实例
const app = getApp()
const config = require('../../../config')

Page({
  data: {
    storyId: 0,
    storyDetail: {},
    isDomainShow: false,
  },
  onLoad: function(params) {
    // console.log(params)
    this.setData({
      storyId: params.story_id,
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.getStory();
  },
  // 分享页面
  onShareAppMessage: function(res) {
    var that = this;
    return {
      title: that.data.storyDetail.title,
      path: '/pages/story/detail/detail?story_id=' + that.data.storyId,
    }
  },
  getStory: function() {
    const that = this
    wx.request({
      url: config.getStoryApi,
      data: {
        story_id: that.data.storyId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      dataType: "json",
      success(result) {
        if (config.errorCode.success == result.data.errno && result.data.data[0]) {
          that.setData({
            storyDetail: result.data.data[0]
          })
        } else {
          wx.showToast({
            title: result.data.errmsg,
            // icon: 'none',
            image: "/image/meh.png",
            duration: 2000,
            mask: true
          })
        }
      },
      fail(result) {
        console.log('request fail', result)
        wx.showToast({
          title: result.data.errmsg,
          // icon: 'none',
          image: "/image/meh.png",
          duration: 2000,
          mask: true
        })
      },
      complete(result) {
        // console.log('request complete', result)
        that.setData({
          isDomainShow: true
        })
        wx.hideLoading();
      }
    })
  }
})