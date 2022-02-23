// pages/index/index.js
import request from '../../utils/request'
// 存放所有排行榜完整数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], //轮播图数据
    recommendList: [], //推荐歌单
    topList: [], //排行榜数据
    list: [], //排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerLsitData = await request('/banner', {
      type: 2
    });
    // console.log('结果数据：',bannerLsitData);
    this.setData({
      bannerList: bannerLsitData.banners
    })

    //获取推荐歌单数据
    let recommendListData = await request('/personalized', {
      limit: 10
    });
    this.setData({
      recommendList: recommendListData.result
    })

    // 获取排行榜列表
    let toplist = await request('/toplist')
    //splice(会修改原数组，可以对指定的数组进行增删改)slice（不会修改原数组）
     toplist.list.splice(5)
     toplist = toplist.list
     let index=0;
     let resultArr=[];
     while(index<5){
      let topListData = await request('/playlist/detail', { id: toplist[index].id })
      //splice(会修改原数组，可以对指定的数组进行增删改)slice（不会修改原数组）
        let topListItem={name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)};
      ++index;  
      resultArr.push(topListItem);
    // console.log(topListItem);
      //不需要等待五次请求全部结束才更新，用户体验较好，但是渲染次数会多一些
      this.setData({
       topList:resultArr,
       list:topListItem.tracks
     })
     }

  },
  //跳转至RecommendSong的页面回调
  toRecommendSong() {
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
  },
  //跳转搜索界面
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  togedan(event) {
    wx.navigateTo({
      url: '/pages/gedan/gedan?id=' + event.currentTarget.id
    })
  },
  //跳转到歌单歌曲列表页面
  toPlayList(event) {
    wx.navigateTo({
      url: '/pages/playlist/playlist?id=' + event.currentTarget.id
    })
  },
  //跳转到排行榜页面
  toChart(event) {
    wx.navigateTo({
      url: '/pages/chart/chart'
    })
  },
  //跳转toSongDetail页面
  toSongDetail(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index,e);
    let ids = [];
    this.data.list.map(item => {
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