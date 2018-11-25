const host = 'app.beishanwen.com'

const config = {
  errorCode: {
    success: 0
  },

  // 获取故事列表
  getStoryApi: `https://${host}/ws/getStory`,
}

module.exports = config