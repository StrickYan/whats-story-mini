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
    isShowAd: false,
    pullDownRefreshTimes: 0, // 下拉刷新次数
  },
  onLoad: function() {
    var that = this;

    // 在页面中定义插屏广告
    let interstitialAd = null
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-a0682acf87901024'
      })
    }
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }

    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    app.userLogin({
      success: function() {
        that.getStory();
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
    that.getStory(true);
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
      },
      header: {
        'token': wx.getStorageSync('token'),
        // 'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      dataType: "json",
      success(result) {
        if (config.errorCode.notLogin == result.data.errno) {
          app.toLogin()
          return
        } else if (config.errorCode.success == result.data.errno) {
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
              // isShowAd: true, // 显示广告
              isShowAd: false, // 隐藏广告
            })
          }
        } else {
          wx.hideLoading()
          wx.showToast({
            title: result.data.errmsg,
            // icon: 'none',
            image: "/image/meh.png",
            duration: 2000,
            mask: true
          })
        }
        wx.hideLoading()
      },
      fail(result) {
        console.log('request fail', result)
        wx.hideLoading()
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
      }
    })
  },
  detailPage: function(event) {
    // console.log(event)
    let storyId = event.currentTarget.dataset.storyid
    wx.navigateTo({
      url: '../detail/detail?story_id=' + storyId
    })
  },
  like: function(event) {
    console.log(event)
    var that = this
    let storyId = parseInt(event.currentTarget.dataset.storyid)
    let isLike = parseInt(event.currentTarget.dataset.islike)
    let operate = 0
    if (isLike == 1) {
      operate = 2
    } else if (isLike == 2) {
      operate = 1
    }

    // 即时更新显示的点赞数
    let index = parseInt(event.currentTarget.dataset.index)
    let tempStoryList = that.data.storyList;
    tempStoryList[index].is_like = isLike == 1 ? 2 : 1
    let oriLikes = parseInt(tempStoryList[index].likes)
    if (operate == 1) {
      tempStoryList[index].likes = oriLikes + 1
    } else if (operate == 2) {
      if (tempStoryList[index].likes > 0) {
        tempStoryList[index].likes = oriLikes - 1
      }
    } else {
      console.log("operate not in (1,2)")
      return
    }
    that.setData({
      storyList: tempStoryList,
    })

    // 实际发送点赞请求
    wx.request({
      url: config.likeApi,
      data: {
        story_id: storyId,
        operate: operate,
      },
      header: {
        'token': wx.getStorageSync('token'),
        // 'content-type': 'application/json' // 默认值
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      dataType: "json",
      success(result) {
        if (config.errorCode.notLogin == result.data.errno) {
          app.toLogin()
          return
        }
      },
      fail(result) {
        console.log('request fail', result)
      },
      complete(result) {
        // console.log('request complete', result)
      }
    })
  }
})