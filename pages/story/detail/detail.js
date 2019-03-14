//detail.js
//获取应用实例
const app = getApp()
const config = require('../../../config')

Page({
  data: {
    storyId: 0,
    storyDetail: {},
    isDomainShow: false,
    isShowAd: false,
    pullDownRefreshTimes: 0, // 下拉刷新次数
  },
  onLoad: function(params) {
    // console.log(params)
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.userLogin({
      success: function() {
        that.setData({
          storyId: params.story_id,
        }, function() {
          that.getStory();
        })
      },
      fail: function() {
        wx.hideLoading()
        app.toLogin()
      }
    })
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    that.setData({
      pullDownRefreshTimes: that.data.pullDownRefreshTimes + 1,
    })
    // 限制广告最大刷新次数，反正被反作弊不显示广告
    if (that.data.pullDownRefreshTimes < 3) {
      that.setData({
        isShowAd: false, // 隐藏广告，为了下面执行重新刷新
      })
    }
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    that.getStory();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  // 分享页面
  onShareAppMessage: function(res) {
    var that = this;
    return {
      title: that.data.storyDetail.title + ' -by' + that.data.storyDetail.author,
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
        'token': wx.getStorageSync('token'),
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      dataType: "json",
      success(result) {
        if (config.errorCode.notLogin == result.data.errno) {
          app.toLogin()
          return
        } else if (config.errorCode.success == result.data.errno && result.data.data[0]) {
          that.setData({
            storyDetail: result.data.data[0],
            isShowAd: true, // 显示广告
          })
        } else {
          wx.hideLoading();
          wx.showToast({
            title: result.data.errmsg,
            // icon: 'none',
            image: "/image/meh.png",
            duration: 2000,
            mask: true
          })
        }
        wx.hideLoading();
      },
      fail(result) {
        console.log('request fail', result)
        wx.hideLoading();
        wx.showToast({
          title: '网络繁忙',
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
      }
    })
  }
})