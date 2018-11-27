//recommend.js
//获取应用实例
const app = getApp()
const config = require('../../../config')

Page({
  data: {
    storyIds: [],
    storyList: []
  },
  onLoad: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.getStory();
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    that.setData({
      storyIds: [],
      storyList: []
    })
    that.getStory();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function() {
    var that = this;
    that.getStory();
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
        if (config.errorCode.success == result.data.errno) {
          let tempStoryIds = that.data.storyIds;
          let tempStoryList = that.data.storyList;
          for (let index in result.data.data) {
            let item = result.data.data[index];
            let theStoryId = item.story_id;
            if (-1 == tempStoryIds.indexOf(theStoryId)) {
              tempStoryIds.push(theStoryId);
              tempStoryList.push(item);
            }
          }
          that.setData({
            storyIds: tempStoryIds,
            storyList: tempStoryList
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
        // console.log('request fail', result)
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
        wx.hideLoading()
      }
    })
  },
  detailPage: function(event) {
    // console.log(event)
    let storyId = event.currentTarget.dataset.storyid
    wx.navigateTo({
      url: '../detail/detail?story_id=' + storyId
    })
  }
})