// pages/playlist/playlist.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listid:'',//歌单id
    playList:[],//歌曲对象
    listImg:'',//歌单图片
    discribe:'',//歌单描述
    playList:[],//歌曲对象
    index:0,//下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let listid = options.id;
    this.setData({
      listid: listid
    })

    //获取歌单的数据
    this.getPlayList(listid);
 // 订阅来自songDetail页面发布的消息
 PubSub.subscribe('switchMusic', (msg, type) => {
  let {playList, index} = this.data;
  if(type === 'pre'){ // 上一首
    (index === 0) && (index = recommendList.length);
    index -= 1;
  }else { // 下一首
    (index === recommendList.length) && (index = -1);
    index += 1;
  }
  
  // 更新下标
  this.setData({
    index:index
  })
  
  let musicId = playList[index].id;
  // 将musicId回传给songDetail页面
  PubSub.publish('musicId', musicId)
  
});
},
   //获取歌单歌曲的数据
   async getPlayList(listid){
    let playListData = await request("/playlist/detail",{id: listid});
    this.setData({
      playList: playListData.playlist.tracks,
      listImg: playListData.playlist.coverImgUrl,
      discribe: playListData.playlist.name
    })
  },
  //跳转toSongDetail页面
  toSongDetail(e){
    let index=e.currentTarget.dataset.index;
    //console.log(index,e);
    let ids=[];
    this.data.playList.map(item=>{
      ids.push(item.id);
    });
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