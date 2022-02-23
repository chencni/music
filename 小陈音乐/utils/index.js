const Fly = require("./wx")
const fly = new Fly()
fly.config.baseURL = 'https://www.codeman.ink/api'

fly.interceptors.response.use((response) => {
    //只将请求结果的data字段返回
    return response.data
  }
)

module.exports = fly