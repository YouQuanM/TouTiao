//app.js
var sha1 = require('/utils/sha1.js');
var bmap = require('/libs/bmap-wx.js');
var aldstat = require("./utils/ald-stat.js");
var AppSecret = "d51e1ff1c80dd96efee72f009dd2f52d";
// var url = "https://wechattest.dankegongyu.com";
// var url ="http://172.16.40.150:8000"
// var url = "http://172.16.50.49:8000"
// var url = "http://172.16.31.148"
var url = "https://www.dankegongyu.com"
App({
  data: {
    url: url,
    areaIndex: 0,
    areaList: [],
    cityName: [],
    cityNum: [],
    currentCity: '',
    currentCityId: '',
    onLoadSwitch: false,
    cityId: 1,
    city_Name: "北京市",

    isIphoneX: false,
    userInfo: null

  },
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        // console.log('手机信息res'+res.model)
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          this.data.isIphoneX = true
        }
      }
    })

    this.city_info()
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null
  },
  
  changeArea: function (e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    this.setData({
      areaIndex: e.detail.value
    })
  },
  sha_token: function (obj) {
    var newObj = {};
    objKeySort(obj)
    function objKeySort(obj) {
      var newkey = Object.keys(obj).sort();
      for (var i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = obj[newkey[i]];
      }
      return newObj;
    }
    var jStr = JSON.stringify(newObj).replace(/[{|}|"]/g, "").replace(/:/g, "=").replace(/,/g, "&") + AppSecret;
    var sha_data = sha1.sha1(jStr)
    return sha_data;
  },
  merge: function () {
    var ret = "", num = 1;
    for (var i = 0; i < arguments.length; i++) {
      ret += JSON.stringify(arguments[i]).replace(/[{|}]/g, "") + ","
    }
    ret = "{" + ret.replace(/^,*|,*$/g, "").replace(/,,*/g, ",").replace(/\s*/g, "") + "}"
    return JSON.parse(ret)
  },
  isEmptyObject: function (obj) {
    var ret;
    for (ret in obj) {
      return false;
    }
    return true
  },
  getPos: function (callback) {
    wx.getLocation({
      success: function (res) {
        callback && callback(res.latitude + "_" + res.longitude)
      },
      fail: function (err) {
        callback && callback("")
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '租得省心,住得舒心',
      imageUrl: '../../images/share_img.png',
      path: 'pages/index/index'
    }
  },
  city_info: function (callback) {
    var that = this;
    var obj_token = this.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: ""
    });
    //请求城市
    wx.request({
      url: url + "/web-api/wechat-applets/city-id",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        app_id: "wx024695259e1a68cb",
        city_id: "",
        sign: obj_token
      },
      success: function (res) {
        console.log(res)
        var cityName = [],
          cityNum = [];
        for (var Key in res.data) {
          cityNum.push(Key)
          cityName.push(res.data[Key])
        }
        that.data.cityNum = cityNum;
        that.data.cityName = cityName;
        callback && callback(cityNum, cityName)
        that.BaiDuMap(cityName, cityNum);
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  BaiDuMap: function (cityList,cityIdList) {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: '4T0tgzZGwafKTSz4V9XbzkBd9KZnWKv0'
    });
    BMap.regeocoding({
      fail: function (data) {
        that.data.onLoadSwitch = true;
        that.data.currentCity = '北京市';
        that.data.currentCityId = '1';
        that.data.cityId = '1';

        wx.setStorage({
          key: "cityStorageName",
          data: '北京市'
        })

        wx.setStorage({
          key: "cityStorageNum",
          data: '1'
        })
      },
      success: function (data) {
        var currentcity = data.originalData.result.addressComponent.city
        var setCity = "北京市",
            setCityId = 1;
        if (cityList.indexOf(currentcity) != -1) {
          setCity = currentcity;
          setCityId = cityIdList[cityList.indexOf(currentcity)];
        }
        that.data.onLoadSwitch = true;
        that.data.currentCity = setCity;
        that.data.currentCityId = setCityId;
        that.data.cityId = setCityId;

        wx.setStorage({
          key: "cityStorageName",
          data: setCity
        })

        wx.setStorage({
          key: "cityStorageNum",
          data: setCityId
        })
        // console.log(data.originalData.result.location.lat)
        // console.log(data.originalData.result.location.lng)
      }
    });
  },
  appLoad: function (callback) {
    var that = this,
      name, id;
    var appTimer = setInterval(function () {
      if (that.data.onLoadSwitch) {
        clearInterval(appTimer)
        try {
          var name = wx.getStorageSync('cityStorageName'),
            id = wx.getStorageSync('cityStorageNum')

          name && (that.data.currentCity = name);
          id && (that.data.currentCityId = id);
          id && (that.data.cityId = id)
        } catch (e) {

        }
        callback && callback(that.data.currentCity, that.data.currentCityId);
      }
    }, 500)
  },
  changeArea: function (e) {
    console.log("a")
  },
})