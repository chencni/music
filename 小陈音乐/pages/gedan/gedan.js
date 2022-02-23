// pages/list/list.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendList:[],//推荐歌单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
//跳转到歌单歌曲列表页面
toPlayList(event){
  wx.navigateTo({
    url: '/pages/playlist/playlist?id=' + event.currentTarget.id
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: async function (options) {
   //获取推荐歌单数据
   let recommendListData= await request('/personalized',{limit:50});
   this.setData({
    recommendList:recommendListData.result
  })
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