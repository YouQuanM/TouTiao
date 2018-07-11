var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;
// var url = "http://172.16.41.145:8088";
Page({
  data: {
    currentCityName: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    session_key: '',
    nickname: '',
    sex: '',
    headimgurl: '',
    province: '',
    wxcity: '',
    user_data:'',
    user_iv:'',
    phone_data: '',
    phone_iv: '',
    loginNum:false,
    loginUser:true,
    phoneLogin:true,
    active:'',
    active_cb:'',
    qa_active:'',
    qa_active_cb:''
  },

  onLoad: function (option) {
    console.log(option)
    this.setData({
      active: option.active,
      active_cb: option.active_cb,
      qa_active: option.qa_active,
      qa_active_cb: option.qa_active_cb
    })
  },
  getphonenumber:function(e){
    var that = this;
    console.log(333333)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    wx.showLoading({
      title: '努力加载中...',
    })
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      console.log(11111)
      wx.hideLoading();
    }else{
      that.setData({
        phone_iv: e.detail.iv,
        phone_data: e.detail.encryptedData,
      })
      that.toUser();
    }
  },

  getuserinfo: function (e) {
    var that = this;
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: '',
    });
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        wx.showLoading({
          title: '努力加载中...',
        })
        console.log(123)
        console.log(e)
        wx.login({
          success: res => {
            var code = res.code
            console.log(code)
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: app.data.url + "/web-api/wechat-applets/open-id",
              data: {
                code: code,
                app_id: "wx024695259e1a68cb",
                city_id: "",
                sign: obj_token
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res)
                console.log(res.data.data.session_3rd)
                if (res.data.success){
                  that.setData({
                    session_key: res.data.data.session_3rd
                  })
                wx.getUserInfo({
                  success: function (res) {
                    console.log(res)
                    that.setData({
                      user_data: res.encryptedData,
                      user_iv: res.iv,
                      // loginNum: true,
                      // loginUser: false,
                      // phoneLogin: false
                    })

                    var obj_token1 = app.sha_token({
                      app_id: "wx024695259e1a68cb",
                      city_id: '',
                    });

                    wx.request({
                      url: url + "/web-api/wechat-applets/check-wechat-login",
                      method: "POST",
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      data: {
                        city_id: "",
                        user_data: that.data.user_data,
                        user_iv: that.data.user_iv,
                        app_id: "wx024695259e1a68cb",
                        session_3rd: that.data.session_key,
                        sign: obj_token,
                      },
                      success: function (res) {
                        console.log(res)
                        if (res.data.success){
                          wx.setStorage({
                            key: 'userMobile',
                            data: res.data.data.mobile
                          })
                          wx.setStorage({
                            key: 'userNickname',
                            data: res.data.data.nickname
                          })
                          wx.setStorage({
                            key: 'userAvatar',
                            data: res.data.data.avatar
                          })
                          wx.setStorage({
                            key: 'userId',
                            data: res.data.data.user_id
                          })
                          if (that.data.active == 1) {
                            wx.reLaunch({
                              url: '../active/active'
                            })
                          } else if (that.data.active_cb == 1) {
                            wx.navigateBack({
                              delta: -1
                            })
                          } else if (that.data.qa_active == 1){
                            wx.reLaunch({
                              url: '../qa_active/qa_active'
                            })
                          } else if (that.data.qa_active_cb == 1) {
                            wx.navigateBack({
                              delta: -1
                            })
                          }else {
                            wx.reLaunch({
                              url: '../user/user'
                            })
                          }
                        }else{
                          that.setData({
                            loginNum: true,
                            loginUser: false,
                            phoneLogin: false
                          })
                        }
                      },
                      fail: function (err) {
                        console.log(err)
                      }
                    })
                  }
                })
                }else{
                  wx.showToast({
                    title: '登录失败，请重新登录！',
                    icon: 'none',
                    duration: 2000
                  })
                }
                wx.hideLoading();
              }
            })
          },
          fail: function () {
            console.log(12312)
          },
          timeout: function () {
            console.log(6666666)
          },
        })

        
        // wx.login({
        //   success: res => {
        //     var code = res.code
        //     console.log(code)
        //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //     wx.request({
        //       url: app.data.url + "/web-api/wechat-applets/open-id",
        //       data: {
        //         code: code,
        //         app_id: "wx024695259e1a68cb",
        //         city_id: "",
        //         sign: obj_token
        //       },
        //       header: {
        //         'content-type': 'application/json'
        //       },
        //       success: function (res) {
        //         console.log(res)
        //         console.log(res.data.data.session_3rd)
        //         that.setData({
        //           session_key: res.data.data.session_3rd
        //         })
        //         wx.getUserInfo({
        //           success: function (res) {
        //             console.log(res)
        //             that.setData({
        //               user_data: res.encryptedData,
        //               user_iv: res.iv,
        //               loginNum: true,
        //               loginUser: false,
        //               phoneLogin: false
        //             })
        //           }
        //         })
        //         wx.hideLoading();
        //       }
        //     })
        //   },
        //   fail: function () {
        //     console.log(12312)
        //   },
        //   timeout: function () {
        //     console.log(6666666)
        //   },
        // })
      },
      fail(){
        wx.showToast({
          title: "为了您更好的体验,请先同意授权",
          icon: 'none',
          duration: 2000
        });
      }
    })
  },
  globalData: {
    userInfo: null
  },

  phone_login:function(){
    if (this.data.active ==1){
      wx.navigateTo({
        url: '../loginPhone/loginPhone?active=1'
      })
    } else if (this.data.active_cb == 1){
      wx.navigateTo({
        url: '../loginPhone/loginPhone?active_cb=1'
      })
    } else if (this.data.qa_active == 1) {
      wx.navigateTo({
        url: '../loginPhone/loginPhone?qa_active=1'
      })
    }else{
      wx.navigateTo({
        url: '../loginPhone/loginPhone'
      })
    }

  },

  toUser: function () {
    var that = this;
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: '',
    });
    console.log(that.data.session_key)
    console.log(that.data.user_data)
    console.log(that.data.user_iv)
    console.log(that.data.phone_data, that.data.phone_iv)
    console.log(that.data.phone_iv)
    wx.request({
      // url: 'http://172.16.40.150:8000/web-api/wechat-applets/wechat-login',
      url: app.data.url + "/web-api/wechat-applets/wechat-login",
      method:'POST',
      data: {
        app_id: "wx024695259e1a68cb",
        city_id: "",
        sign: obj_token,

        session_3rd: that.data.session_key,
        user_data: that.data.user_data,
        user_iv: that.data.user_iv,
        phone_data: that.data.phone_data,
        phone_iv: that.data.phone_iv,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.success == false){
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.setStorage({
            key: 'userMobile',
            data: res.data.data.mobile
          })
          wx.setStorage({
            key: 'userNickname',
            data: res.data.data.nickname
          })
          wx.setStorage({
            key: 'userAvatar',
            data: res.data.data.avatar
          })
          wx.setStorage({
            key: 'userId',
            data: res.data.data.user_id
          })
          // wx.navigateTo({
          //   url: '../user/user?mobile=' + res.data.data.mobile + '&nickname=' + res.data.data.nickname + '&avatar=' + res.data.data.avatar,
          // })
          if (that.data.active == 1){
            wx.reLaunch({
              url: '../active/active'
            })
          } else if (that.data.active_cb == 1){
            wx.navigateBack({
              delta : -1
            })
          }else{
            wx.reLaunch({
              url: '../user/user'
            })
          }

          wx.hideLoading();
        }
        
      },
      fail: function () {
        console.log(12312)
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




