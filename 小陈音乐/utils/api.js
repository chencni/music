const fly = require('../utils/index')

export default {
  //获取歌曲详情 支持多个id
  songDetail(ids) {
    return fly.get(`/song/detail?ids=${ids}`);
  },
  //获取音乐url 支持多个id
  songUrl(ids) {
    return fly.get(`/song/url?id=${ids}`);
  },
  //获取歌词
  lyric(id) {
    return fly.get(`/lyric?id=${id}`);

  },
  //检测手机号码是否已注册
  cellphoneCheck(phone) {
    return fly.get(`/cellphone/existence/check?phone=${phone}`);
  },
  //注册(修改密码)
  register(phone,password,captcha,nickname) {
    return fly.get(`/register/cellphone?phone=${phone}&password=${password}&captcha=${captcha}&nickname=${nickname}`);
  },
  //发送验证码
  captchaSent(phone) {
    return fly.get(`/captcha/sent?phone=${phone}`);
  },
  //手机登录 
  loginCellphone(phone,password) {
    return fly.get(`/login/cellphone?phone=${phone}&password=${password}`);
  },
  //邮箱登录
  loginEmail(email,password) {
    return fly.get(`/login?email=${email}&password=${password}`);
  },
  //获取用户详情
  userDetail(uid) {
    return fly.get(`/user/detail?uid=${uid}`);
  },
}