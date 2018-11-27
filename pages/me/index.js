//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
  },
  onShow: function() {
    wx.showModal({
      title: '开发ing',
      content: '咪催我啦',
      cancelText: '好的',
      confirmText: '辛苦了',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      complete() {
        wx.switchTab({
          url: '/pages/story/recommend/recommend'
        })
      }
    })
  },
})