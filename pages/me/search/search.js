// pages/me/search/search.js

//获取应用实例
const app = getApp()
const config = require('../../../config')

Page({

  /**
   * Page initial data
   */
  data: {
    storyIds: [],
    storyList: [],
    page: 0, // 当前页码
    limit: 10, // 每页文章数量
    isLastPage: false, // 是否没有更多内容
    focus: true, // 聚焦
    inputValue: '', // 搜索内容
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    var that = this;
    if (options.input_value) {
      that.setData({
        focus: false, // 失去焦点
      });
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      that.setData({
        storyIds: [],
        storyList: [],
        page: 0, // 当前页码
        limit: 10, // 每页文章数量
        isLastPage: false, // 是否没有更多内容
      });
      that.data.inputValue = options.input_value;
      that.getStory(true);
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {
    var that = this;
    that.getStory();
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {
    var that = this;
    if (that.data.inputValue) {
      return {
        title: '分享作品集 - [' + that.data.inputValue + ']',
        path: '/pages/me/search/search?input_value=' + that.data.inputValue,
      }
    }
  },

  searchStory(e) {
    var that = this;
    that.setData({
      storyIds: [],
      storyList: [],
      page: 0, // 当前页码
      limit: 10, // 每页文章数量
      isLastPage: false, // 是否没有更多内容
      inputValue: e.detail.value
    });
    if (!that.data.inputValue) {
      return;
    }
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    that.getStory(true);
  },

  // isInit: true 清空 story list
  getStory: function(isInit) {
    const that = this
    if (true === isInit) {
      // 恢复初始值
      that.setData({
        page: 0,
        limit: 10,
      })
    }
    wx.request({
      url: config.getStoryApi,
      data: {
        page: that.data.page + 1,
        limit: that.data.limit,
        search: that.data.inputValue,
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
            let tempStoryIds = [];
            let tempStoryList = [];
            if (true !== isInit) {
              tempStoryIds = that.data.storyIds;
              tempStoryList = that.data.storyList;
            }
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
        console.log('request fail', result)
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
        wx.hideLoading()
      }
    })
  },
  detailPage: function(event) {
    // console.log(event)
    let storyId = event.currentTarget.dataset.storyid
    wx.navigateTo({
      url: '/pages/story/detail/detail?story_id=' + storyId
    })
  }
})