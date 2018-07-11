import util from './../../utils/util.js';

var sha1 = require('../../utils/sha1.js');
var bmap = require('../../libs/bmap-wx.js');
const app = getApp();
var cityNum_val;
Page({
  data: {
    layerBox:0,
    showLayer:[0,0,0,0],
    layerRent:[],
    colorRent:0,
    textRent:0,
    layerPos:[],
    secondBox:0,
    threeBox:0,
    showPos:0,
    textPos:[],
    layerSubway:[],
    textSubway:"",
    showStation:0,
    layerArea:[],
    showTrade:0,
    textTrade:"",
    resultPosText:"位置",
    resultPriceText:"价格",
    layerPrice:[],
    colorPrice:0,
    layerTags:[],
    sliderBoxWidth: 0,
    sliderBoxLeft: 0,
    block1: 0,
    block2: 0,
    maxPrice: 29900,
    startPrice: 0,
    endPrice: 29900,//以下是更多模块下的变量
    moreRoomFt: [],
    moreRoomFtArr:[],
    moreRoomSta: [],
    moreRoomStaArr:[],
    moreHt: [],
    moreHtArr:[],
    moreOtn: [],
    moreOtnArr:[],
    moreSort:[],
    moreSortArr:[],//以下是筛选模块存储的搜索参数
    moreSelect:0,
    dataRent:{},
    dataPos:{},
    dataPrice:{},
    dataMore:{}, //以下是页面中变量
    areaIndex:0,
    search_text:"",
    areaList:["北京市"],
    cityNum: [],
    no_room:0,
    roomList:[],
    latlng:"",
    feature:{},
    pageNum:1,
    pagetype:'',
    tj_title:'',
    recommend_title:'',
    isLastPage : false,
    options:{},
    tabcolor: 2,
    index_img: '../../images/index_nev.png',
    list_img: '../../images/list_act.png',
    user_img: '../../images/user_nev.png',
    index_tit: '首页',
    list_tit: '找房',
    user_tit: '我的',
    tabBarHas:true,
    placeholder:'输入您想住的区域，商圈或小区名称'
  },

  //加载数据渲染页面
  onLoad: function (options) {
    var that = this;
    that.allListInfo()
    that.setData({
      options: JSON.parse(JSON.stringify(options))
    })

    var city_name = options.city_name;
    console.log(city_name)
    var city_id = options.city_id;
    console.log(city_id)
    if (options.city_name !== undefined && options.city_id !== undefined){
      wx.setStorage({
        key: 'cityStorageName',
        data: options.city_name
      })
      wx.setStorage({
        key: 'cityStorageNum',
        data: options.city_id
      })
    }

    if (options.position !== undefined){
      var arr_pos = options.position.split('-')
      var district = arr_pos[0].split('d')
      var block = arr_pos[1].split('b')
      console.log(district[1])
      console.log(block[1])

      if (block == '') {
        that.setData({
          resultPosText: district[1]
        })
      } else {
        that.setData({
          resultPosText: block[1]
        })
      }

      var mergeData = {
        position: options.position,
        search_text: ""
      }
      that.getRoomList(mergeData)
    }
    // var options = {position:"d昌平区-b回龙观"}
    



    var options = that.data.options;
    that.data.moreRoomFt[options.index] = options.feature
    that.data.moreRoomFtArr[options.index] = 1
    that.setData({
      search_text: { search_text: options.search_text },
      dataMore: { feature: options.feature },
      moreRoomFt: that.data.moreRoomFt,
      moreRoomFtArr: that.data.moreRoomFtArr,
      pagetype: options.pagetype || "",
      moreSelect: options.feature ? 1 : 0,
      rent_type: options.rent_type 
    })
    //默认合租
    if (options.rent_type == 2){
      that.setData({
        colorRent: 1,
        textRent: '合租',
        dataRent: { rent_type: 2 },
      })
    }
    //默认整租
    if (options.rent_type == 1) {
      that.setData({
        colorRent: 2,
        textRent: '整租',
        dataRent: { rent_type: 1 },
      })
    }
    //默认有无tabBar
    if (options.bar == 'has'){
      that.setData({
        tabBarHas:false
      })
    }

    app.appLoad(function (cityName, cityId) {
      console.log(cityName, cityId)
      console.log(that.data.options)
      that.initLoad(cityName, cityId);
    })
  },

  initLoad: function (cityName, cityId) {
    var that = this;
    that.setData({
      areaList: app.data.cityName,
      cityNum: app.data.cityNum,
      areaIndex: app.data.cityName.indexOf(cityName)
    })

    // 加载列表
    app.getPos(function (latlng) {
      that.setData({
        latlng: latlng
      })
    })
    that.loadData(1)
  },
  //切换城市
  changeArea: function (e) {
    var that = this;
    cityNum_val = e.detail.value;
    wx.setStorage({
      key: 'cityStorageName',
      data: app.data.cityName[cityNum_val]
    })

    wx.setStorage({
      key: 'cityStorageNum',
      data: app.data.cityNum[cityNum_val]
    })
    this.setData({
      areaIndex: e.detail.value,
      resultPosText: "位置",
      resultPriceText: "价格",
      showPos: 0,

    })
    this.allListInfo();
    this.clearAllData();
    this.clearRoomList();

    app.appLoad(function (cityName, cityId) {
      that.initLoad(cityName, cityId);
    })

    
    
  },
  //应用于自定义价格
  queryMultipleNodes: function () {
      //创建节点选择器
      var query = wx.createSelectorQuery(),
          self = this;
      //选择id
      query.select('.slider-box').boundingClientRect();
      query.exec(function (res) {
        self.setData({
          sliderBoxWidth: res[0].width,
          sliderBoxLeft: res[0].left,
          block2: self.data.block2 || res[0].width
        })
      })
  },
  //自定义价格左侧按钮
  sliderMoveLeft: function (e) {
    var maxPrice = this.data.maxPrice,
      boxWidth = this.data.sliderBoxWidth,
      boxLeft = this.data.sliderBoxLeft,
      x = e.changedTouches[0].pageX - boxLeft,
      block2 = this.data.block2 == boxWidth ? 0 : this.data.block2,
      maxLeft = boxWidth - boxWidth * (parseFloat(block2) / 100),
      price = this.data.startPrice;
      x = x < 0 ? 0 : x;
      x = x > maxLeft - 20 ? maxLeft - 20 : x;
      x = (x / boxWidth) * 100;
      price = parseInt((x * 2.98 / (boxWidth - boxLeft / boxWidth -3)) * maxPrice / 100) * 100
    this.setData({
        block1: x + "%",
        startPrice: price
    })
  },
  // 自定义价格右侧按钮
  sliderMoveRight: function (e) {
    var maxPrice = this.data.maxPrice,
      boxWidth = this.data.sliderBoxWidth,
      boxLeft = this.data.sliderBoxLeft,
      x = e.changedTouches[0].pageX - boxLeft,
      maxRight = boxWidth - boxWidth * (parseFloat(this.data.block1) / 100),
      price = this.data.endPrice;
      x = x > boxWidth ? 0 : boxWidth - x;
      x = x > maxRight - 20 ? maxRight - 20 : x;
      x = (x / boxWidth) * 100;
      price = parseInt((x * 2.98 / (boxWidth - boxLeft / boxWidth -3)) * maxPrice / 100) * 100
      this.setData({
        block2: x + "%",
        endPrice: maxPrice - price
      })
  },
  //获取页面所有标签的数据
  allListInfo:function(){
    var that = this ,
        token = app.sha_token({
          app_id: "wx024695259e1a68cb",
          city_id: app.data.cityId,
        });
    wx.request({
      url: app.data.url + "/web-api/wechat-applets/conds-list",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: app.data.cityId,
        app_id: "wx024695259e1a68cb",
        sign: token
      },
      success: function (res) {
        var data = res.data;
        that.setData({
          layerRent: data.rent_types.data,
          layerPos: data.near_by.data,
          layerSubway: data.subways,
          layerArea: data.areas,
          layerPrice: data.prices.data,
          layerTags: data.quick_tags
        })
 
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
   //获取列表信息
  getRoomList: function (data) {
    var that = this,data = data || {};
    //token
    var token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: app.data.cityId
    })
    //请求参数
    var obj = app.merge({
      city_id: app.data.cityId,
      app_id: "wx024695259e1a68cb",
      sign: token,
      page: that.data.pageNum
    },data)
    console.log("请求数据",obj)
    //请求地址
    wx.request({
      url: app.data.url + "/web-api/wechat-applets/list",
      method: "GET",
      header: {
        'X-App-ID':4,
        'content-type': 'application/json' // 默认值
      },
      data:obj,
      success: function (res) {
        console.log(!!res.data[1] && res.data[1].title)
        console.log(res)
        var listData_0 = !!res.data[0] && res.data[0].data
        var listData_1 = !!res.data[1] && res.data[1].data
        var recommend_title = !!res.data[1] && res.data[1].title
        var lastPage = !!res.data[1] && res.data[1].last_page;
        var currentPage = !!res.data[1] && res.data[1].current_page;
        if (currentPage > lastPage){
          that.data.isLastPage = true;
          wx.showToast({
            title: '没有更多房源了~',
            icon: 'none',
            duration: 1200
          })
          return;
        }
        //懒加载拼接
        for (var i = 0; i < listData_0.length; i++) {
          that.data.roomList.push(listData_0[i]);
        }

        if (listData_1){
          for (var i = 0; i < (20 - listData_0.length); i++) {
            if (!listData_1[i] ){
              break;
            }
            that.data.roomList.push(listData_1[i]);
          }
        }
        //列表数据
        that.setData({
          roomList: that.data.roomList,
          recommend_title: recommend_title
        })
        //关闭加载中
        wx.hideLoading()
        //关闭筛选框
        that.closeLayer();
        that.setData({
          no_room: !listData_1.length && !that.data.roomList.length ? 1 : 0
        })

        
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //取消冒泡作用
  default:function(){},
  // 加载loading
  showLoading: function () {
    wx.showLoading({
      title: '加载中',
    })
  },
  // 筛选层-展开
  showLayer: function (n) {
    var typeArr = this.data.showLayer,val,
     self=this;
    //显示当前点击模块
    for (var i = 0; i < typeArr.length; i++) {
      val = (i == n ? 1 : 0);
      typeArr[i] = val;
    }
    console.log(typeArr)
    this.setData({
      showLayer: typeArr,
      layerBox: 1
    })
    if(n==2){
      setTimeout(function(){
        self.queryMultipleNodes()
      },150)
    }
  },
  //筛选层-关闭
  closeLayer: function (n) {
    this.setData({
      layerBox: 0
    })
  },
  //筛选-选择
  rentEvt: function (e) {
    var nav = e.currentTarget.dataset.nav;
    console.log(nav,this.data.showLayer[nav])
    if (this.data.showLayer[nav] === 0){
      this.showLayer(nav)
    }else{
      this.closeLayer();
      this.setData({
         showLayer:[0,0,0,0]
      })
    }
  },

  
  // 筛选-位置-选择
  posEvt:function(e){
    var index = e.currentTarget.dataset.index
    this.setData({
      showPos:+index,
      secondBox:+index,
      showTrade:0,
      showStation:0,
      textSubway:"",
      textTrade:"",
      threeBox:0,
      resultPosText:!+index?"位置":this.data.resultPosText
    })
    // 不限
    if(!+index){
      this.setData({
        dataPos: {}
      })
      this.getRoomList(this.mergeData(1))
    }
  },
  // 筛选-位置-地铁-选择线路
  subwayEvt:function(e){
    var data = e.currentTarget.dataset;
    this.setData({
       showSubwayList:data.index,
       textSubway:data.name,
       showStation:1,
       threeBox:1
    })
  },
  // 筛选-位置-区域-选择地区
  areaEvt:function(e){
    console.log(e)
    var data = e.currentTarget.dataset;
    this.setData({
       showTradeList:data.index,
       textTrade:data.name,
       showTrade:1,
       threeBox:1
    })
  },
  // 筛选-合/整租-执行
  selectRentType: function (e) {
    var data = e.currentTarget.dataset;
    console.log(e)
    this.setData({
      colorRent: data.index,
      textRent: data.text,
      dataRent: { rent_type: data.code },
      showLayer:[0,0,0,0]
    })
    this.clearRoomList()
    this.getRoomList(this.mergeData(1))
  },
  // 筛选-位置-附近-执行
  selectNear:function(e){
      var data = e.currentTarget.dataset,
          self = this;
      console.log(data)
      this.closeLayer();
      this.setData({
        resultPosText: data.code+"米以内",
        dataPos: { position: "nearby-" + data.code, latlng: self.data.latlng}
      })
      this.clearRoomList()
      this.getRoomList(this.mergeData(1))
  },
  // 筛选-位置-地铁站-执行
  selectStation:function(e){
      var data = e.currentTarget.dataset;
      console.log(data);
      this.closeLayer();
      this.setData({
        resultPosText: data.index == 0 ? this.data.textSubway : data.station,
        dataPos: { position: "l" + this.data.textSubway + (data.station == "不限" ? "" : "-s" + data.station) },
        search_text: { search_text: "" },
        showLayer: [0, 0, 0, 0]
      })
    
      this.clearRoomList()
      this.getRoomList(this.mergeData(1))
  },
  // 筛选-位置-商圈-执行
  selectTrade:function(e){
      var data = e.currentTarget.dataset;
      console.log(data);
      this.closeLayer();
      this.setData({
        resultPosText: data.index == 0 ? this.data.textTrade : data.name,
        dataPos: { position: "d" + this.data.textTrade + (data.name == "不限" ? "" : "-b" + data.name) },
        search_text: { search_text: "" },
        showLayer: [0, 0, 0, 0]
      })

      console.log(this.mergeData(1));

      this.clearRoomList()
      this.getRoomList(this.mergeData(1))
  },
  // 筛选-价格-执行
  selectPrice:function(e){
    var data = e.currentTarget.dataset;
    this.closeLayer();
    this.setData({
      colorPrice:data.index,
      resultPriceText: data.code==""?"价格":data.title,
      dataPrice: { price: data.code },
      showLayer: [0, 0, 0, 0]
    })
    this.clearRoomList()
    this.getRoomList(this.mergeData(1))
  },
  // 筛选-价格-自定义执行
  selectCustomPrice:function(e){
    this.setData({
      colorPrice: 6,
      resultPriceText: this.data.startPrice + "-" + this.data.endPrice,
      dataPrice: { price: this.data.startPrice + "_" + this.data.endPrice },
      showLayer: [0, 0, 0, 0]
    })
    this.clearRoomList()
    this.getRoomList(this.mergeData(1))
    this.closeLayer();
  },
  // 筛选-价格-重置
  resetCustomPrice:function(){
      this.setData({
        colorPrice: 0,
        startPrice:0,
        endPrice:29900,
        block1: 0,
        block2: this.data.sliderBoxWidth
      })
  },
  // 筛选-选择
  selectMore:function(e){
    var data = e.currentTarget.dataset;
    
    switch(data.type){
      case "feature":
       var arr = this.data.moreRoomFtArr,
           o = this.data.moreRoomFt;
      
       if (!!arr[data.index]){
         arr[data.index] = 0;
         o[data.index]="";
       }else{
         arr[data.index] = 1;
         o[data.index] = data.code;
       }
       //存储参数
       console.log(this.data.moreRoomFt)
        this.setData({
          moreRoomFt: this.data.moreRoomFt,
          moreRoomFtArr: this.data.moreRoomFtArr
        })
      break;
      case "status":
        var arr = this.data.moreRoomStaArr,
           o = this.data.moreRoomSta;

        if (!!arr[data.index]) {
          arr[data.index] = 0;
          o[data.index] = "";
        } else {
          arr[data.index] = 1;
          o[data.index] = data.code;
        }
        //存储参数
        console.log(this.data.moreRoomSta)
        this.setData({
          moreRoomSta: this.data.moreRoomSta,
          moreRoomStaArr: this.data.moreRoomStaArr
        })
        break;
       case "room_type":
        var arr = this.data.moreHtArr,
          o = this.data.moreHt;
        if (!!arr[data.index]) {
          arr[data.index] = 0;
          o[data.index] = "";
        } else {
          arr[data.index] = 1;
          o[data.index] = data.code;
        }
        console.log(this.data.moreHt)
        this.setData({
          moreHt: this.data.moreHt,
          moreHtArr: this.data.moreHtArr
        })
        break;
       case "direction":
        var arr = this.data.moreOtnArr,
          o = this.data.moreOtn;
        if (!!arr[data.index]) {
          arr[data.index] = 0;
          o[data.index] = "";
        } else {
          arr[data.index] = 1;
          o[data.index] = data.code;
        }
        console.log(this.data.moreOtn)
         this.setData({
           moreOtn: this.data.moreOtn,
           moreOtnArr: this.data.moreOtnArr
         })
         break;
       case "orders":
        var arr = this.data.moreSortArr,
          o = this.data.moreSort;
         arr[data.index] = data.index;
          for (var i = 0; i < arr.length;i++){
            arr[i] = i == data.index ? 1 : 0;
            o[0] = i == data.index ? data.code : "";
          }
          console.log(this.data.moreSort)
         this.setData({
           moreSort: this.data.moreSort,
           moreSortArr: this.data.moreSortArr
         })
         break;
    }

  },
  // 筛选-更多-执行
   selectCustomMore:function(){
    var gsh = function(arr){
      return arr.join("-").replace(/\--*/g, "-").replace(/^-|-$/g, "")
    };
    var feature = gsh(this.data.moreRoomFt),
        status = gsh(this.data.moreRoomSta),
        room_type = gsh(this.data.moreHt),
        direction = gsh(this.data.moreOtn),
        orders = gsh(this.data.moreSort)

    this.setData({
      dataMore: {feature:feature,status:status,room_type:room_type,direction:direction,orders:orders},
      moreSelect: (feature == status == room_type == direction == orders == '')?0:1,
      showLayer: [0, 0, 0, 0]
    })
    this.clearRoomList()
    this.getRoomList(this.mergeData(1))
  },
  // 筛选-更多-重置
  resetCustomMore:function(){
    this.setData({
      moreRoomFt: [],
      moreRoomFtArr: [],
      moreRoomSta: [],
      moreRoomStaArr: [],
      moreHt: [],
      moreHtArr: [],
      moreOtn: [],
      moreOtnArr: [],
      moreSort: [],
      moreSortArr: []
    })
  },
  // 筛选-合并最终请求数据
  mergeData: function (resetPage){
    var data = this.data;
    this.showLoading();
    if (resetPage){
      this.setData({
        pageNum:1
      })
    }
    return app.merge(data.dataRent, data.dataPos, data.dataPrice, data.dataMore, data.search_text)
  },
  //加载数据-初始化加载&&懒加载使用
  loadData: function (resetPage){
      this.showLoading();
      this.getRoomList(this.mergeData(resetPage))
  },
  // 清空roomList参数数据
  clearRoomList:function(){
     this.setData({
       roomList:[]
     })
  },
  inputclick: function () {
    if(this.data.pagetype != ''){
      wx.navigateTo({
        url: '../search/search'
      })
    }else{
      wx.navigateBack()
    }
  },
  //列表上拉加载
  scrollLoading:function(){
    var page = this.data.pageNum+1
    this.setData({
      pageNum: page
    })
     this.loadData();
     
  },
  onShareAppMessage: function () {
    return {
      title: '租得省心,住得舒心',
      path: 'pages/list/list'
    }
  },
  toIndex: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  },

  toUser: function () {
    wx.reLaunch({
      url: '../user/user'
    })
  },
  
  clearAllData:function(){
    this.setData({
        layerBox: 0,
        showLayer: [0, 0, 0, 0],
        layerRent: [],
        colorRent: 0,
        textRent: 0,
        layerPos: [],
        secondBox: 0,
        threeBox: 0,
        showPos: 0,
        textPos: [],
        layerSubway: [],
        textSubway: "",
        showStation: 0,
        layerArea: [],
        showTrade: 0,
        textTrade: "",
        resultPosText: "位置",
        resultPriceText: "价格",
        layerPrice: [],
        colorPrice: 0,
        layerTags: [],
        sliderBoxWidth: 0,
        sliderBoxLeft: 0,
        block1: 0,
        block2: 0,
        maxPrice: 29900,
        startPrice: 0,
        endPrice: 29900,//以下是更多模块下的变量
        moreRoomFt: [],
        moreRoomFtArr: [],
        moreRoomSta: [],
        moreRoomStaArr: [],
        moreHt: [],
        moreHtArr: [],
        moreOtn: [],
        moreOtnArr: [],
        moreSort: [],
        moreSortArr: [],//以下是筛选模块存储的搜索参数
        dataRent: {},
        dataPos: {},
        dataPrice: {},
        dataMore: {}, //以下是页面中变量
        pageNum:0,
        search_text: { search_text:''},
        moreSelect:""
    })
  }
 
})

