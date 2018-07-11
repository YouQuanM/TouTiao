var sha1 = require('../../utils/sha1.js');
const app = getApp();
var interval = null //倒计时函数
var url = app.data.url;
// var url = "http://172.16.41.145:8088";
Page({
  data: {
    time: '获取验证码',
    currentTime: 61,
    areaIndex: 0,
    areaList: [],
    areaNum: [],
    userName: "",
    phoneNum: "",
    yzmInput: "",
    xqInput: "",
    yzmimgValue: "",
    yzmimgInput: '',
    errInfo: [],
    errImg: ['请输入图片所示内容'],
    dxyzm: "",
    cityNum: [],
    yzmNum: true,
    flag: true,
    clickNum: 1,
    bg_con:'',
    disable_con:false,
    mobileNum:'',
    userPrivacy:false,
    active: '',
    active_cb: '',
    qa_active: '',
    qa_active_cb: ''
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

  phoneNumInput: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  yzmimgInput: function (e) {
    var val = e.detail.value;
    if (val.toString().length > 1){
      this.setData({
        confirm_bg: '#3DBCC6',
        disable_con: true
      })
    }else{
      this.setData({
        confirm_bg: '#3DBCC6',
        disable_con: true
      })
    }

    if (val.toString().length == 0) {
      this.setData({
        confirm_bg: '#D8DBDF'
      })
    }
    this.setData({
      yzmimgInput: e.detail.value
    })
  },
  yzmInput: function (e) {
    var val = e.detail.value;
    if (val.toString().length == 4){
      this.setData({
        bg_con: '#3DBCC6',
        disable_con:true
      })
    }else{
      this.setData({
        bg_con: '#9EDDE2',
        disable_con: false
      })
    }
    this.setData({
      yzmInput: e.detail.value
    })
  },

  getVerificationCode: function (e) {
    var that = this;
    this.setData({
      yzmimgValue: '',
      errImg: []
    })
    that.data.yzmNum = false;
    var phone_num = that.data.phoneNum
    console.log(phone_num)
    if (that.data.phoneNum == '') {
      that.data.errInfo = [];
      that.data.errInfo.push("手机号码不能为空")
      that.setData({
        errInfo: that.data.errInfo
      })
    } else if (!(/^1[345678]\d{9}$/.test(phone_num))) {
      that.data.errInfo = [];
      that.data.errInfo.push("手机号码格式不正确")
      that.setData({
        errInfo: that.data.errInfo
      })
    } else {
      that.data.errInfo = [];
      that.data.errInfo.push()
      that.setData({
        errInfo: that.data.errInfo
      })
      that.getCode();
      that.setData({
        disabled: true
      })
      that.sendText();
    }
  },   
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: '重新发送('+currentTime + ')'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  sendText: function () {
    var that = this;
    var obj_token = app.sha_token({
      city_id: "",
      app_id: "wx024695259e1a68cb"
    });
    wx.request({
      url: url + "/web-api/wechat-applets/send-text-verify-code", 
      // url: "http://172.16.40.150:8000/web-api/wechat-applets/send-text-verify-code",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: "",
        mobile: that.data.phoneNum,
        app_id: "wx024695259e1a68cb",
        sign: obj_token,
      },
      success: function (res) {
        console.log(res)
        if (res.data.msg == "验证码发送频繁") {
          that.setData({
            flag: false
          })
          that.yzmImage();
        }
        // that.data.errInfo = [];
        // that.data.errInfo.push(res.data.msg)
        // that.setData({
        //   errInfo: that.data.errInfo
        // })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  yzmqd: function (e) {
    var that = this;
    that.data.errImg = [];
    var obj_token = app.sha_token({
      city_id: "",
      app_id: "wx024695259e1a68cb",
    });
    wx.request({
      url: url + "/web-api/wechat-applets/img-code",
      // url: "http://172.16.40.150:8000/web-api/wechat-applets/img-code",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: "",
        mobile: that.data.phoneNum,
        // mobile: "16601128170",
        verify_code: that.data.yzmimgInput,
        // verify_code: "5555555",
        app_id: "wx024695259e1a68cb",
        sign: obj_token
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          that.setData({
            flag: true
          })
          that.sendText();
        } else {
          that.data.errImg = [];
          that.data.errImg.push(res.data.msg)
          that.setData({
            errImg: that.data.errImg
          })
          that.yzmImage();
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  yzmImage: function () {
    var that = this;
    that.setData({
      yzmPhone: url + "/get-img-code/345/125?mobile=" + that.data.phoneNum + "&time=" + new Date().getTime()
      // yzmPhone: "http://172.16.40.150:8000/get-img-code/75/30?mobile=" + that.data.phoneNum + "&time=" + new Date().getTime()
    })
  },
  changeImg: function () {
    var that = this;
    this.yzmImage();
  },
  confirm: function () {
    var that = this;
    var phone = that.data.phoneNum;
    var yzm = that.data.yzmInput;
    if (phone == '') {
      that.data.errInfo = [];
      that.data.errInfo.push("手机号不能为空")
      that.setData({
        errInfo: that.data.errInfo
      })
    } else if (yzm == '') {
      that.data.errInfo = [];
      that.data.errInfo.push("验证码不能为空")
      that.setData({
        errInfo: that.data.errInfo
      })
    } else if (!(/^1[345678]\d{9}$/.test(phone))) {
      that.data.errInfo = [];
      that.data.errInfo.push("手机号码格式不正确")
      that.setData({
        errInfo: that.data.errInfo
      })
    } else {
      that.data.errInfo = [];
      that.data.errInfo.push()
      that.setData({
        errInfo: that.data.errInfo
      })
      var obj_token = app.sha_token({
        city_id: "",
        app_id: "wx024695259e1a68cb",
      });
      wx.request({
        url: url + "/web-api/wechat-applets/phone-login",
        // url: "http://172.16.40.150:8000/web-api/wechat-applets/phone-login",
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          city_id: "",
          mobile: that.data.phoneNum,
          verify_code: that.data.yzmInput,
          app_id: "wx024695259e1a68cb",
          sign: obj_token
        },
        success: function (res) {
          wx.showLoading({
            title: '努力加载中...',
          })
          console.log(res)
          console.log(res.data.success)
          if (res.data.success) {
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
            wx.setStorage({
              key: 'comePhone',
              data: true
            })
            console.log(that.data.active)
            if (that.data.active == 1) {
              wx.reLaunch({
                url: '../active/active'
              })
            } else if (that.data.active_cb == 1) {
              wx.navigateBack({
                delta: -1
              })
            } else if (that.data.qa_active == 1) {
              wx.reLaunch({
                url: '../qa_active/qa_active'
              })
            }else {
              wx.reLaunch({
                url: '../user/user'
              })
            }
          } else if (res.data.success == false) {
            that.data.errInfo = [];
            that.data.yzmNum = false;
            that.data.errInfo.push(res.data.msg)
            that.setData({
              errInfo: that.data.errInfo
            })
          }
          wx.hideLoading()
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  },
  toSecrecy:function(){
    this.setData({
      userPrivacy: true
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