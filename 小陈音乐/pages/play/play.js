import api from "../../utils/api"
import dayjs from "../../utils/dayjs.min.js"
const app = getApp();
let bg=wx.getBackgroundAudioManager();//背景音频管理器
let timeId='';//定时器
let lineTimeId='';//水平线定时器
let isDelete=false;//是否删除开启的定时器   
let likeList = []; // 用户喜欢的音乐的列表
Page({
  data: {

    recommendList:[],//推荐列表数据
    index:-1,//下标 歌曲信息
    ids:[],//歌曲id
    songs:{},//歌曲详情
    musics:{},//歌曲url
    lrc:{},//歌曲歌词
    //控件属性
    isSlider:false,//是否正在拖动进度条
    nowTime:"00:00",//目前进度时间
    totalTime:"00:00",//总长度时间
    min:0,//进度条开始
    max:0,//进度条结束
    value:0,//进度条
    category:[],//播放方式
    categoryActive:0,//当前播放方式 0:顺序播放 1：随机播放 2：单曲循环
    isPlay:true,//是否播放
    isCollect:true,//是否收藏
    //以下歌词
    isLrc:true,//是否显示歌词
    lrcArr:[],//歌词定位数组 时间
    location:0,//歌词滚动位置
    locationIndex:0,//
    locationValue:0,//歌词滚动具体位置
    locationTime:0,//歌词定位时间
    locationShowTime:'00:00',//歌词定位显示时间
    isScroll:false,//滚动显示水平线
    timeLen:-1,//文字过渡时间
  },
  //歌词触碰开始
  touchstart(e){
    //console.log("触摸开始",e);
    this.setData({
      isScroll:true
    });
    isDelete=false;
    if(lineTimeId){
      clearTimeout(lineTimeId);
      lineTimeId='';
    }
  },
  //歌词触碰结束
  touchend(e){
    isDelete=true;
    //console.log("触摸结束",e);
    if(lineTimeId!='')return;
    lineTimeId=setTimeout(()=>{
      if(isDelete===true){
        this.setData({
          isScroll:false
        });
        lineTimeId='';
      }
    },4000);
  },
  //歌词滚动
  scroll(e){
    if(this.data.isScroll){
      let i=parseInt(e.detail.scrollTop/27);
      if(!this.data.lrcArr[i])return;//空白区域，没有时间不执行
      //console.log("滚动",e.detail.scrollTop,this.data.lrcArr[i]);//歌词的间隔区间为27
      this.setData({
        locationTime:this.data.lrcArr[i],
        locationShowTime:dayjs(this.data.lrcArr[i]*1000).format("mm:ss")
      });
    }
  },
  //歌词拖动播放
  playScroll(e){
    //console.log("拖动播放",e);
    let value=this.data.locationTime;
    bg.seek(value);
    this.setData({
      isScroll:false,
      isPlay:true
    });
    this.update();
  },
  //切换是否显示歌词
  isLrc(e){
    this.setData({
      isLrc:!this.data.isLrc
    });
  },
  //进度条拖动
  sliderNow(e){
   // console.log(e);
    let nowTime=dayjs(e.detail.value*1000).format('mm:ss');
    this.setData({
      nowTime:nowTime,
      isSlider:true
    });
  },
  //进度条
  slider(e){
   // console.log(e);
    let value=Number(e.detail.value);
    let nowTime=dayjs(e.detail.value*1000).format('mm:ss');
    this.setData({
      value:value,
      nowTime:nowTime,
      isSlider:false
    });
    //console.log(typeof(value),value);
    bg.seek(value);
  },
  //上一首
  back(){
    let index;
    if(this.data.categoryActive===0){//顺序播放
      index=this.data.index-1;
      if(index<0){//第一首处理
        index=this.data.ids.length-1;
      }
    }else if(this.data.categoryActive===1){//随机播放
      index=parseInt(Math.random()*this.data.ids.length);
    }else{//单曲循环
      index=this.data.index;
      bg.stop();
    }
    //console.log(index);
    this.setData({
      index:index,
      isPlay:true
    });
    this.getData();//重新获取音乐
  },
  //下一首
  next(){
    let index;
    if(this.data.categoryActive===0){//顺序播放
      index=this.data.index+1;
      if(index===this.data.ids.length){//最后一首处理
        index=0;
      } 
    }else if(this.data.categoryActive===1){//随机播放
      index=parseInt(Math.random()*this.data.ids.length);
    }else{//单曲循环
      index=this.data.index;
      bg.stop();
    }
    //console.log(index);
    this.setData({
      index:index,
      isPlay:true
    });
    this.getData();//重新获取音乐
  },
  //播放音乐
  playMusic(){
    //console.log("播放",this.data.musics.url,this.data.songs.name);
    bg.src=this.data.musics.url;
    bg.title=this.data.songs.name;
    //设置进度条
    //console.log("进度条",bg.duration);
  },
  //切换播放方式
  toggleCategory(e){
    // console.log(e);
    let i=this.data.categoryActive+1;
    if(i>2)i=0;
    this.setData({
      categoryActive:i
    });
  },
  //切换播放
  togglePlay(e){
    //console.log(e);
    this.setData({
      isPlay:!this.data.isPlay
    });
    if(this.data.isPlay){
      bg.play();
    }else{
      bg.pause();
    }
  },

  //获取音乐数据
  getData(){
    let id=this.data.ids[this.data.index];
   // console.log(id);
    //获取歌曲详情
    api.songDetail(id).then(res=>{
     // console.log("歌曲详情：",res);
      this.setData({
        songs:res.songs[0]
      });
      //获取音乐url
      api.songUrl(id).then(res=>{
        //console.log("歌曲音乐url：",res);
        this.setData({
          musics:res.data[0]
        });
        this.playMusic();//播放音乐
        wx.hideLoading();
      }).catch(err=>{
       // console.log(err);
      });
    }).catch(err=>{
     // console.log(err);
    });
    //获取歌词 
    api.lyric(id).then(res=>{
      //console.log("歌曲歌词 ：",res);
      let str=res.lrc.lyric;
      let lrcArr=[];
      let arr=[];
      str=str.split(/\n/g);
      str.map(item=>{
        let i=item.match(new RegExp("\\[[0-9]*:[0-9]*.[0-9]*\\]","g"));
        if(i){
          i=i[0].replace('[','').replace(']','')
          let time=Number(i.split(':')[0]*60)+Number(i.split(':')[1].split('.')[0]);//毫秒：+Number(i.split(':')[1].split('.')[1]);         01:12.232  ['01','12.232'] ['12','232'] 
          // console.log(time,dayjs(time).format('mm:ss')); 
          lrcArr.push(time);
          arr.push(item.replace(new RegExp("\\[(.*)\\]","g"),""));
        }
      });
      //去空
      let a1=[],a2=[];
      for(let i=0;i<arr.length;i++){
        if(arr[i]&&lrcArr[i]){//当前是否有歌词
          a1.push(arr[i]);
          a2.push(lrcArr[i]);
        }
      }
      arr=a1,lrcArr=a2;
      //console.log(arr);
      //console.log(lrcArr);
      this.setData({
        lrc:arr,
        lrcArr:lrcArr
      });
      wx.hideLoading();
    }).catch(err=>{
      //console.log(err);
    });
  },
  //定时器更新
  update(){
    if(!this.data.isPlay||this.data.isSlider)return;
      let nowTime=bg.currentTime;
      let totalTime=bg.duration;
      let value=bg.currentTime;
      let max=bg.duration;
      if(nowTime&&totalTime){//都有数据
        //处理歌词当前位置
        // let len=0;//歌词排除为空的下标
          for(let i=0;i<this.data.lrcArr.length;i++){
            if(nowTime>this.data.lrcArr[this.data.lrcArr.length-1]){//最后的歌词
              this.setData({
                location:this.data.lrcArr.length
              });
              break;
            }
            //console.log(nowTime,this.data.lrcArr[i]);
            if(nowTime>=this.data.lrcArr[i]&&nowTime<this.data.lrcArr[i+1]){
             // console.log("歌词滚动");
              this.setData({
                location:i
              });
              break;
            }
          }

        //设置滚动
        if(this.data.isScroll===false){
          if(this.data.locationIndex!=this.data.location){
            this.setData({
              timeLen:this.data.lrcArr[this.data.location+1]-this.data.lrcArr[this.data.location]
            });
          }
          this.setData({
            locationIndex:this.data.location
          });
        }
        //处理显示
        totalTime=dayjs(totalTime*1000).format('mm:ss');
        nowTime=dayjs(nowTime*1000).format('mm:ss');
       // console.log("时间2：",totalTime,nowTime);
        this.setData({
          nowTime:nowTime,
          totalTime:totalTime,
          max:max,
          value:value
        });
      }
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // console.log(options.index,options.ids);
   
       let ids=options.ids.split(',');//字符串拆分
      // console.log(ids);
   
    this.setData({
      index:Number(options.index),
      ids:ids
    });
    this.getData();
    //背景音频
    bg.onEnded(()=>{
      //console.log("播放完毕。");
      this.next();
    });
    bg.onPause(()=>{
      //console.log("暂停播放");
      this.setData({
        isPlay:false
      });
    });
    bg.onPlay(()=>{
     // console.log("开始播放");
      this.setData({
        isPlay:true
      });
    });
    bg.onTimeUpdate(()=>{
      // console.log("播放进度更新");
      // this.update();
    });
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  async like() {
    this.setData({
      isLike: !this.data.isLike
    })
   let musicId=this.data.ids[this.data.index];
    // 喜欢该音乐
  wx.request('/like', { id: musicId, like: this.data.isLike });
     //console.log(musicId);
    // console.log(result);
    // 修改likeList 从喜欢列表中添加或删除当前id
    if (this.data.isLike) {
      likeList.push(musicId)
    } else {
      let index = likeList.findIndex(item => {
        return item == musicId
      })
      likeList.splice(index, 1)
    }
    console.log(likeList);
    // 存入全局变量
    app.globalData.likeList = likeList
  },


  // 获取用户喜欢的音乐的列表
  // 短时间多次请求会引起服务器缓存，请求后数据在本地操作以解决
  // 注意：手机如果喜欢功能不正常，可以试一下重新登录，可能是因为存在本地的userId丢了
  async getLikeList() {
    let userId = wx.getStorageSync('userId')
    console.log(userId);
    let result;
    if (app.globalData.likeList.length == 0) {
      result = await request('/likelist', { uid: userId })
      console.log(result);
      // likeList = result.ids;
      // 存入全局变量
      app.globalData.likeList = likeList
    } else {
      return;
    }
     console.log('执行了getlikelist');
  },

  // 判断登录用户是否喜欢该音乐
  async getIsLike() {

    if (wx.getStorageSync('userId')) {
      console.log(musicId);
      if (app.globalData.likeList.length == 0) {
        await this.getLikeList()
      }
      likeList = app.globalData.likeList;
       console.log(likeList);
      let flag = likeList.find(item => {
      console.log(item);
        return item == musicId
      })
      // 如果用相同的id，find返回该id值
      console.log(flag)
      if (flag == undefined) {
        this.setData({
          isLike: false,
        })
      } else {
        this.setData({
          isLike: true
        })
      }
    }
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
      //设置进度条
    timeId=setInterval(()=>{
      this.update();
    },500);
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
    //销毁定时器
    clearInterval(timeId);
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