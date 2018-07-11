var sha1 = require('../../utils/sha1.js');
var bmap = require('../../libs/bmap-wx.js');
const app = getApp();
var url = app.data.url;
Page({
  data: {
    markers: [],
    more: '',
    nearby_house: [],
    activity: [],
    payment: [],
    activityPart: "",
    nearest: '',
    shareName: '',
    phoneNumber: '',
    comCity: [],
    comPhone: [],
    public_id: '',
    rentTypeShare: '',
    scrollTop: 0,
    page_detail: 1,
    currentCityName: '',
    system: '',
    rentType: '',
    id: '',
    backApp: false,
    room_id:'',
    price:'',
    from_pc: false
  },

  onLoad: function (option) {
    var that = this;
    var scene = decodeURIComponent(option.scene)
    console.log(scene)
    // scene = '2115809051/2/pc'
    if (scene !== 'undefined'){
      var scene_arr = scene.split('/')
      console.log(scene_arr)
      var scene_arr_0 = scene_arr[0]
      var scene_arr_1 = scene_arr[1]
      var scene_arr_2 = scene_arr[2]
      console.log(scene_arr_0)
      console.log(scene_arr_1)
      console.log(scene_arr_2)
      if (scene_arr_2 == 'pc'){
        that.setData({
          public_id: scene_arr_0,
          rentType: scene_arr_1,
          from_pc: true
        })
      }
      app.appLoad(function (cityName, cityId) {
        console.log(cityName, cityId)
        that.initLoad(cityName, cityId);
        app.aldstat.sendEvent('从PC端进入到小程序详情页', {
          '房屋详情': this.data.shareName
        });
      })

    }else{
      console.log(option.id)
      console.log(option.rent_type)
      console.log(option.from_app)

      that.setData({
        public_id: option.id,
        rentType: option.rent_type,
        system: option.from_app
      })

      app.appLoad(function (cityName, cityId) {
        console.log(cityName, cityId)
        that.initLoad(cityName, cityId);
        if (option.from_app !== '') {
          app.aldstat.sendEvent('从APP端进入到小程序详情页', {
            '房屋详情': this.data.shareName
          });
          that.setData({
            backApp: true
          })
        }
      })

    }
  },

  initLoad: function (cityName, cityId) {
    this.setData({
      currentCityName: cityName
    })
    this.detail();
  },

  roomOk: function (e) {
    console.log(e)
    var data = e.currentTarget.dataset;
    if (data.title == "可出租") {
      wx.redirectTo({
        url: "../detail/detail?id=" + data.public_id + "&rent_type=" + data.rent_type + "&from_app=",
      })
    }
  },

  moreconfig: function (e) {
    var more = e.currentTarget.dataset.title;
    if (more == "更多") {
      wx.navigateTo({
        url: '../more/more'
      })
    }
  },
  phonenum: function () {
    var that = this;
    that.selectPhone();
  },
  online: function () {
    wx.navigateTo({
      url: '../yuyue/yuyue?room_id=' + this.data.room_id + '&price=' + this.data.price,
    })
  },
  payment: function () {
    wx.navigateTo({
      url: '../payment/payment',
    })
    wx.setStorage({
      key: 'payment',
      data: this.data.payment
    })
  },
  markerFn: function (latitude, longitude) {
    return [{
      iconPath: "//public.wutongwan.org/public-20180519-Fo8MAGd5qdaeWQDARGQlNR6B6jbS",
      id: 0,
      latitude: latitude,
      longitude: longitude,
      width: 25,
      height: 25,
      id: "",
      room_list: [],

    }]
  },
  selectPhone: function () {
    var that = this;
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: ""
    });
    wx.request({
      url: app.data.url + "/web-api/wechat-applets/city-phone",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: "",
        type: "before_sell",
        app_id: "wx024695259e1a68cb",
        sign: obj_token
      },
      success: function (res) {
        wx.makePhoneCall({
          phoneNumber: res.data[that.data.currentCityName],
          success: function () {
            console.log("拨打电话成功！")
          },
          fail: function () {
            console.log("拨打电话失败！")
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    if (res.from === 'menu') {
      console.log(res.target)
    }
    return {
      title: this.data.shareName,
      // path: '/page/detail/detail?id=' + this.data.public_id,
      path: "pages/detail/detail?id=" + this.data.public_id + "&rent_type=" + this.data.rentTypeShare + "&from_app=",
      // imageUrl:'',
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log(err)
      }
    }
  },

  reLoad: function (e) {
    console.log(e)
    console.log(e.currentTarget.dataset.public_id)
    this.setData({
      public_id: e.currentTarget.dataset.public_id
    })

    this.detail();
  },

  detail: function () {
    var that = this;
    console.log(that.data.public_id)
    wx.showLoading({
      title: '努力加载中...',
    })
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: ""
    });
    wx.request({
      url: url + '/web-api/wechat-applets/detail',
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: "",
        public_id: that.data.public_id,
        rent_type: that.data.rentType,
        app_id: "wx024695259e1a68cb",
        sign: obj_token
      },
      success: function (res) {
        console.log(res)
        var more_arr;
        more_arr = res.data.promotion_info[0];
        setTimeout(function () {
          that.setData({
            room_list: res.data,
            markers: that.markerFn(res.data.latitude, res.data.longitude),
            activityPart: more_arr,
            nearby_house: res.data.nearby_house.length,
            activity: res.data.promotion_info.length,
            payment: res.data.payment_type_detail,
            nearest: res.data.nearest_subway_title,
            shareName: res.data.name,
            // public_id: res.data.id,
            rentTypeShare: res.data.rent_type,
            page_detail: 0,
            room_id: res.data.id,
            price: res.data.price,
          })
          wx.hideLoading();
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
        }, 400)

      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  launchAppError: function (e) {
    console.log(this.data.id, this.data.rentType)
    console.log(e.detail.errMsg)
  },
  toIndex: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
})
