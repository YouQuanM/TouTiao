//index.js
//获取应用实例
var sha1 = require('../../utils/sha1.js');
const app = getApp();
var cityNum_val;
Page({
  data: {
    currentTab: 0,
    id: 0,
    tagName: [{
      "catalogName": "独立卫生间",
      "select": 1
    }, {
      "catalogName": "独立阳台",
      "select": 2
    }, {
      "catalogName": "独立淋浴",
      "select": 3
    }, {
      "catalogName": "近地铁",
      "select": 4
    }, {
      "catalogName": "品质公寓",
      "select": 5
    }, {
      "catalogName": "集中供暖",
      "select": 6
    }, {
      "catalogName": "可月租",
      "select": 7
    }],
    catalogSelect: 0,//判断是否选中
    // userInfo: {},
    // hasUserInfo: false,
    // name_focus:false,
    areaIndex: 0,
    areaList: ["北京市"],
    list_arr: [],
    cityNum: [],
    rent: 2,
    pageNum: 1,
    cityStorageName: '',
    cityStorageNum: '',
    pos: "",
    no_room: 0,
    nearby: "",
    zzData: 0,
    pre_load: true,
    scrollTop: 0,
    backtop_flag: true,
    isLastPage: false,
    lastPage: "",
    currentPage: '',
    currentSwiper: 0,
    tabcolor: 1,
    index_img: '../../images/index_act.png',
    list_img: '../../images/list_nev.png',
    user_img: '../../images/user_nev.png',
    index_tit: '首页',
    list_tit: '找房',
    user_tit: '我的',
    imgUrls: [
      // 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      // 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    bannerURL:'',
    onoff:false,
    swiperIndex:0,
    bannerIndex:'',
    bannerUrl:[],
    close_act:true,
    toActive_animtion: {},
    // city_ID:''
    // longitude: "250.4536295",
    // latitude:"50.9937276"
  },

  onLoad: function () {
    var that = this;
    that.toActive_animtion();
    setInterval(function () {
      that.toActive_animtion();
    }, 30000)

    app.appLoad(function (cityName, cityId) {
      console.log(cityName, cityId)
      that.initLoad(cityName, cityId);
    })
    that.bannerList();
  },
  initLoad: function (cityName, cityId) {
    var that = this;
    //检查版本是否为最新
    if (wx.canIUse) {
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          if (res.hasUpdate) {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          }
        })
      }
    }
    that.setData({
      areaList: app.data.cityName,
      cityNum: app.data.cityNum,
      areaIndex: app.data.cityName.indexOf(cityName)
    })
    // that.city_load(2, 1, 1)

    app.getPos(function (a) {
      that.city_load(2, 1, a)
      // that.city_load(1, 1, a, "init")
      that.setData({
        list_arr: [],
        pos: a
      })
    })
    that.bannerList()
    //获取设备信息
    wx.getSystemInfo({
      success: function (res) {
        if (res.SDKVersion < '1.2.0') {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，请升级到最新微信版本后重试。',
            showCancel: false
          })
          // return false;
        } else {
          wx.showLoading({
            title: '努力加载中...',
          })
        }
      },
    })
  },

  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  //选项卡
  // navbarTap: function (e) {
  //   var idx = e.target.dataset.idx;
  //   this.setData({
  //     currentTab: idx,
  //     rent: idx == 0 ? 2 : 1
  //   })
  //   this.setData({
  //     pageNum: 1,
  //     list_arr: []
  //   })
  //   this.city_load(this.data.rent, this.data.pageNum, this.data.pos)
  // },
  listPage: function (e) {
    var that = this,
      data = e.currentTarget.dataset,
      code = ["hasToilet_有", "hasBalcony_有", "hasShower_有", "isNearSubway_是", "brand_蛋壳公寓", "heating_集中供暖", "isMonth_是"];
    that.setData({//把选中值放入判断值
      catalogSelect: data.select
    })
    wx.navigateTo({
      url: '../list/list?feature=' + code[data.index] + '&index=' + data.index + '&pagetype=index'
    })
  },
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
      list_arr: [],
      pageNum: 1
    })
    app.appLoad(function (cityName, cityId) {
      console.log(cityName, cityId)
      that.initLoad(cityName, cityId);
      that.city_load(1, that.data.pageNum, that.data.pos, "init")
      that.city_load(2, that.data.pageNum, that.data.pos)
      that.city_load(2, 1, that.data.pos)
    })
  },
  city_load: function (rent, pageNum, pos, init) {
    var that = this;
    that.showLoading();
    var latlng_val = '';
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: app.data.cityId,
    });
    wx.request({
      url: app.data.url + "/web-api/wechat-applets/home-page",
      // url: "http://172.16.40.150:8000/web-api/wechat-applets/home-page",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: app.data.cityId,
        position: pos == "" ? "" : "nearby-50000000",
        rent_type: '',
        latlng: pos,
        page: pageNum,
        app_id: "wx024695259e1a68cb",
        sign: obj_token
      },
      success: function (res) {
        console.log(res)
        if (init === "init") {
          that.setData({
            currentTab: res.data.total ? that.data.currentTab : 0,
            zzData: res.data.total
          })
          return;
        }

        var lastPage = !!res.data && res.data.last_page;
        var currentPage = !!res.data && res.data.current_page;
        that.setData({
          lastPage: !!res.data && res.data.last_page,
          currentPage: !!res.data && res.data.current_page
        })
        var l = res.data.data.length;
        for (var i = 0; i < l; i++) {
          that.data.list_arr.push(res.data.data[i]);
        }
        that.setData({
          home_list: that.data.list_arr,
          pre_load: false
        })

        that.setData({
          no_room: !l && !that.data.home_list.length ? 1 : 0
        })

        wx.hideLoading();
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //滚动加载 
  // scrollLoading: function (e) {
  //   if (this.data.currentPage >= this.data.lastPage) {
  //     this.data.isLastPage = true;
  //     wx.showToast({
  //       title: '没有更多房源了~',
  //       icon: 'none',
  //       duration: 700
  //     })
  //     return;
  //   }
  //   // this.showLoading();
  //   this.city_load(this.data.rent, ++this.data.pageNum, this.data.pos);
  // },

  list_hz: function () {
    wx.navigateTo({
      url: '../list/list?rent_type=2&listInd=2&text=合租&pagetype=index&bar=has',
    })
  },
  list_zz: function () {
    wx.navigateTo({
      url: '../list/list?rent_type=1&listInd=2&text=整租&pagetype=index&bar=has',
    })
  },
  yezhu: function () {
    wx.navigateTo({
      url: '../yezhu_new/yezhu_new',
    })
  },
  inputclick: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },

  backTop: function () {
    var that = this;
    if (this.data.backtop_flag) {
      this.setData({
        scrollTop: 0,
        duration: 500
      })
      this.data.backtop_flag = false;
      setTimeout(function () {
        that.data.backtop_flag = true;
      }, 1500)
    }
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.detail.scrollTop > 10) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  showLoading: function () {
    wx.showLoading({
      title: '努力加载中...',
    })
  },
  onShareAppMessage: function () {
    return {
      title: '租得省心,住得舒心',
      imageUrl: '../../images/share_img.png',
      path: 'pages/index/index'
    }
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  moreToList: function () {
    wx.navigateTo({
      url: '../list/list?pagetype=index'
    })
  },

  toList: function () {
    wx.reLaunch({
      url: '../list/list?pagetype=index'
    })
  },

  toUser: function () {
    wx.reLaunch({
      url: '../user/user'
    })
  },

  bannerList: function () {
    var that = this;
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: app.data.cityId
    });
    wx.request({
      // url: "http://172.16.40.150:8000/web-api/wechat-applets/banner-list",
      url: app.data.url + "/web-api/wechat-applets/banner-list",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        app_id: "wx024695259e1a68cb",
        city_id: app.data.cityId,
        sign: obj_token
      },
      success: function (res) {
        var bannerArr = res.data.data;
        var bannerImg = [];
        var bannerUrl = [];
        for (let i = 0; i < bannerArr.length; i++) {
          bannerImg.push(bannerArr[i].images)
          bannerUrl.push(bannerArr[i].resource_data)
        }
        console.log(res.data.data)
        that.setData({
          imgUrls: bannerImg,
          bannerUrl: bannerUrl
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  clickbanner:function(e){
    console.log(e.currentTarget.dataset.index)
    console.log(this.data.bannerUrl)
    var url = this.data.bannerUrl
    var index = e.currentTarget.dataset.index
    console.log(url[index])
    this.setData({
      bannerURL: url[index],
      onoff: true,
    })
    wx.navigateTo({
      url: '../bannerPage/bannerPage?bannerURL=' + this.data.bannerURL
    })
  },
  
  toActive:function(){
    app.aldstat.sendEvent('点击进入毕业生租房活动', {
      '点击进入': '毕业生租房活动'
    });
    wx.navigateTo({
      url: '../qa_active/qa_active'
    })
  },
  close_act:function(){
    this.setData({
      close_act:false
    })
  },
  toActive_animtion: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.scale(1.2, 1.2).step()
    animation.scale(1, 1).step()
    animation.scale(1.2, 1.2).step()
    animation.scale(1, 1).step()

    this.setData({
      toActive_animtion: animation.export()
    })
  },
})
