// pages/personal/personal.js
import request from '../../utils/request'
let startY=0; //手指起始坐标
let moveY=0;  //手指移动坐标
let moveDistance=0;  //手指移动距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',
    coverTransition:'',
    userInfo:{},//用户信息
    recentPlayList:[],//用户播放记录
    list: [], //排行榜
    playingMusicList: [],// 保存用户的歌单
    myFavoriteList: [],// '我喜欢的音乐'歌单

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户基本信息
    let userInfo=wx.getStorageSync('userInfo');
    if(userInfo){
      //更新userInfo的状态
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
      //获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.userId);
      this.getUserPlayList(this.data.userInfo.userId);

    }
  },
  //获取用户播放记录的功能函数
  async getUserRecentPlayList(userId){
    let recentPlayListData=await request('/user/record',{uid:userId,type:1});
    let index=0;
    //console.log(recentPlayListData);
    let recentPlayList=recentPlayListData.weekData.splice(0,10).map(item=>{
      item.id=index++;
      return item;
    })
    
    this.setData({
      recentPlayList
    })
     //console.log(recentPlayList);
  },
  handleTouchStart(event){
    this.setData({
      coverTransition:''
    })
    startY=event.touches[0].clientY;
  },
  handleTouchMove(event){
    moveY=event.touches[0].clientY;
    moveDistance=moveY-startY;
    if(moveDistance<=0){
      return;
    }
    if(moveDistance>=80){
      moveDistance=80;
    }
    //动态更新coverTransform的状态值
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(){
//动态更新coverTransform的状态值
this.setData({
  coverTransform:'translateY(0rpx)',
  coverTransition:'transform 1s linear'
})
  },
  //跳转到登录login页面的回调
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
   // 获取并处理 用户歌单
   async getUserPlayList() {
    let userPlayList = await request('/user/playlist', { uid: this.data.userInfo.userId })
    userPlayList = userPlayList.playlist
    //console.log(myFavoriteList)
    // 对获取到的数据进行分类处理
    let myFavoriteList = [];
    
    //console.log(myFavoriteList)
    myFavoriteList.push(userPlayList[0])
    userPlayList = userPlayList.splice(1);
   

    this.setData({
      myFavoriteList,
    })
    wx.setStorageSync('myFavoriteList', myFavoriteList);
    wx.setStorageSync('lastUserId', this.data.userInfo.userId)
  },

  toSongDetail(e){
    let index=e.currentTarget.dataset.index;
     //console.log(index,e);
    let ids=[];
    this.data.recentPlayList.map(item=>{
      ids.push(item.song.id);
    });
     //console.log(ids);

    wx.navigateTo({
      url: `/pages/play/play?index=${index}&ids=${ids}`,
    })
  },
  tolikeList() {
    wx.navigateTo({
      url: '/pages/likelist/likelist',
    })
  },
    // 跳转至音乐列表页面
    toMusicList(e) {
      wx.navigateTo({
        url: '/pages/musicList/musicList?musiclistid=' + e.currentTarget.dataset.musiclistid
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