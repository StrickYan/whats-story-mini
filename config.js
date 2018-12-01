const host = 'https://app.beishanwen.com'
// const host = 'http://centos-linux-dev.baidu.com:8080'

const config = {
  errorCode: {
    success: 0
  },

  // 获取故事列表
  getStoryApi: `${host}/ws/getStory`,
}

module.exports = config