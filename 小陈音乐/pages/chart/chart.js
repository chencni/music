// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topList: [], //排行榜数据
    list: [], 
    currentIndex: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
   //获取排行榜数据
   let toplist = await request('/toplist')
    //splice(会修改原数组，可以对指定的数组进行增删改)slice（不会修改原数组）
     toplist.list.splice(20)
     toplist = toplist.list
         console.log(toplist);
     let index=0;
     let resultArr=[];
     while(index<=20){
      let topListData = await request('/playlist/detail', { id: toplist[index].id })
      //splice(会修改原数组，可以对指定的数组进行增删改)slice（不会修改原数组）
        let topListItem={name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,20)};
      ++index;  
      resultArr.push(topListItem);
     //console.log(topListItem); 
    //  wx.setStorageSync('chart', topListItem)
    //  let topListItem1= wx.getStorageSync('chart', topListItem)
    //  console.log(topListItem1);
      //不需要等待五次请求全部结束才更新，用户体验较好，但是渲染次数会多一些
      this.setData({
       topList:resultArr,
       list:topListItem.tracks
     })
    }
   
  },
 //跳转toSongDetail页面
 toSongDetail(e){
  let index=e.currentTarget.dataset.index;
  console.log(index,e);
  let ids=[];
  this.data.list.map(item=>{
    ids.push(item.id);
  });
  //console.log(ids);
  wx.navigateTo({
    url: `/pages/play/play?index=${index}&ids=${ids}`,
  })
},
changeSwiper(e) {
  this.setData({
    currentIndex: e.detail.current
  });
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