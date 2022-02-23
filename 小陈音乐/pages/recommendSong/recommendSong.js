// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ids:'',//歌手热门歌曲
    isPlay: false, //音乐是否播放
    day:'',
    month:'',
    recommendList:[],//推荐列表数据
    index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //判断用户是否登录
    let userInfo=wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请些登录',
        icon:'none',
        success:()=>{
          //跳转至登录界面
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    //更新日期的状态数据
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    //获取每日推荐的数据
    this.getRecommendList();
},
   //获取每日推荐的数据
  async getRecommendList(){
    let recommendListData= await request('/recommend/songs');
    this.setData({
      recommendList:recommendListData.data.dailySongs
    }) 
    // console.log(recommendListData)
  },

   // 跳转至点击歌曲的详情页面
  
  toSongDetail(e){
    let index=e.currentTarget.dataset.index;
    //console.log(index,e);
    let ids=[];
    this.data.recommendList.map(item=>{
      ids.push(item.id);
    });
    console.log(ids);
    wx.navigateTo({
      url: `/pages/play/play?index=${index}&ids=${ids}`,
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})