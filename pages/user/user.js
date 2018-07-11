var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;
// var url = "http://172.16.41.145:8088";
Page({
  data: {
    tabcolor: 3,
    index_img: '../../images/index_nev.png',
    list_img: '../../images/list_nev.png',
    user_img: '../../images/user_act.png',
    index_tit: '首页',
    list_tit: '找房',
    user_tit: '我的',
    currentCityName: '',
    avatar:'//public.wutongwan.org/public-20180519-FncC43aOUe_hWLWVuvGZKbq3jq04',
    mobile:'欢迎来到蛋壳公寓 租的省心 住得舒心',
    nickname:'点击注册/登录',
    onoff:false,
    comePhone:'',
    comeLogin:'',
    isThis:true,
    userId:'',
    logout_onoff:false
  },

  onLoad: function (option) {
    var that = this;
    // console.log(option)
    //ES6判断是否为一个空对象
    // if (Object.keys(option).length !== 0){
    //   if (option.avatar == ''){
    //     that.setData({
    //       mobile: '',
    //       nickname: option.nickname,
    //     })
    //   }else{
    //     that.setData({
    //       avatar: option.avatar,
    //       mobile: '',
    //       nickname: option.nickname,
    //     })
    //   }
    // }
    app.appLoad(function (cityName, cityId) {
      console.log(cityName, cityId)
      that.initLoad(cityName, cityId);
    })
    try {
      var value = wx.getStorageSync('comePhone')
      if (value) {
        that.setData({
          comePhone: value,
        })
      }
    } catch (e) {
      console.log(e)
    }
    wx.getStorage({
      key: 'userMobile',
      success: function (res) {
        if (res.data == null || res.data == ''){
          that.setData({
            mobile: '',
          })
        }else{
          that.setData({
            mobile: res.data,
          })
        }
      }
    })
    wx.getStorage({
      key: 'userNickname',
      success: function (res) {
        console.log(res.data)
        that.setData({
          nickname: res.data,
        })
      }
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        console.log(res.data)
        that.setData({
          userId: res.data,
          logout_onoff: true
        })
      }
    })
    wx.getStorage({
      key: 'userAvatar',
      success: function (res) {
        console.log(res.data)
        if (res.data !== ''){
          that.setData({
            avatar: res.data,
          })
        }else{
          that.setData({
            avatar: '//public.wutongwan.org/public-20180519-FncC43aOUe_hWLWVuvGZKbq3jq04',
          })
        }
      }
    })
  },

  initLoad: function (cityName, cityId) {
    this.setData({
      currentCityName: cityName
    })
  },
  toList: function () {
    wx.reLaunch({
      url: '../list/list?pagetype=index'
    })
  },

  toIndex: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  config:function(){
    wx.navigateTo({
      url: '../config/config'
    })
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
        console.log(res.data[that.data.currentCityName])
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
  toLogin:function(){
    var that = this;
    if (!that.data.logout_onoff){
      wx.navigateTo({
        url: '../login/login'
      })
    }

  },

  download:function(){
    this.setData({
      onoff:true
    })
  },
  coupon: function () {
    var that = this;
    console.log(that.data.userId)
    if (that.data.userId == '') {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.navigateTo({
        url: '../coupon/coupon'
      })
    }
  },
  logout:function(){
    var that = this;
    wx.showModal({
      content: '确定要退出登录吗',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            logout_onoff: false,
            avatar: '//public.wutongwan.org/public-20180519-FncC43aOUe_hWLWVuvGZKbq3jq04',
            mobile: '欢迎来到蛋壳公寓 租的省心 住得舒心',
            nickname: '点击注册/登录',
          })

          wx.removeStorage({
            key: 'userMobile',
            success: function (res) {
              console.log(res.data)
            }
          })
          wx.removeStorage({
            key: 'userNickname',
            success: function (res) {
              console.log(res.data)
            }
          })
          wx.removeStorage({
            key: 'userAvatar',
            success: function (res) {
              console.log(res.data)
            }
          })
          wx.removeStorage({
            key: 'userId',
            success: function (res) {
              that.setData({
                userId: '',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '租的省心,住得舒心',
      imageUrl: '../../images/share_img.png',
      path: 'pages/index/index'
    }
  }
})