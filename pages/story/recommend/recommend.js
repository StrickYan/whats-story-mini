//recommend.js
//获取应用实例
const app = getApp()
const config = require('../../../config')

Page({
  data: {
    storyIds: [],
    storyList: [],
    page: 0, // 当前页码
    limit: 10, // 每页文章数量
    isLastPage: false, // 是否没有更多内容
    shareTitle: [
      "枕上诗书闲处好，门前风景雨来佳。 -李清照",
      "读书不觉已春深，一寸光阴一寸金。 -王贞白",
      "半亩方塘一鉴开，天光云影共徘徊。 -朱熹",
      "书当快意读易尽，客有可人期不来。 -陈师道",
      "昨日邻家乞新火，晓窗分与读书灯。 -王禹偁",
      "灯火纸窗修竹里，读书声。 -陈继儒",
      "我闭南楼看道书，幽帘清寂在仙居。 -李白",
      "闲门向山路，深柳读书堂。 -刘昚虚",
    ],
  },
  onLoad: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    that.getStory();
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    // 恢复初始值
    that.setData({
      storyIds: [],
      storyList: [],
      page: 0,
      limit: 10,
      isLastPage: false,
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
  // 分享页面
  onShareAppMessage: function(res) {
    var that = this;
    return {
      title: that.data.shareTitle[Math.floor(Math.random() * that.data.shareTitle.length)],
      path: '/pages/story/recommend/recommend',
    }
  },
  getStory: function() {
    const that = this
    wx.request({
      url: config.getStoryApi,
      data: {
        page: that.data.page + 1,
        limit: that.data.limit,
      },
      header: {
        // 'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      dataType: "json",
      success(result) {
        if (config.errorCode.success == result.data.errno) {
          if (result.data.data.length == 0) {
            that.setData({
              isLastPage: true,
            })
          } else {
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
              storyList: tempStoryList,
              page: that.data.page + 1, // 成功返回后当前页码加1
              isLastPage: false,
            })
          }
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