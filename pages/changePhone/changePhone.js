var sha1 = require('../../utils/sha1.js');
const app = getApp();
var interval1 = null //倒计时函数
var interval2 = null //倒计时函数
var url = app.data.url;
// var url = "http://172.16.41.145:8088";
Page({
  data: {
    time1: '获取验证码',
    time2: '获取验证码',
    currentTime1: 61,
    currentTime2: 61,
    areaIndex: 0,
    areaList: [],
    areaNum: [],
    userName: "",
    phoneNum: "",
    yzmInput1: "",
    yzmInput2: "",
    xqInput: "",
    yzmimgValue: "",
    yzmimgInput1: '',
    yzmimgInput2: '',
    errInfo: [],
    errImg: [],
    dxyzm: "",
    cityNum: [],
    yzmNum: true,
    flag: true,
    clickNum: 1,
    bg_con: '',
    disable_con: false,
    mobileNum: '',
    present_phoneNum:'',
    user_id:'',
    token:'',
    newPhone:false,
    oldPhone:true,
    inputVal:'',
    indetify1:true,
    indetify2:false,
    indetify3: true,
    indetify4: false,
    phoneNumInput:''
  },

  onLoad: function (option) {
    var that = this;
    wx.getStorage({
      key: 'userMobile',
      success: function (res) {
        console.log(res.data)
        that.setData({
          present_phoneNum: res.data
        })
      }
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        console.log(res.data)
        that.setData({
          user_id: res.data
        })
      }
    })
  },
  phoneNumInput: function (e) {
    this.setData({
      phoneNumInput: e.detail.value
    })
  },
  yzmimgInput1: function (e) {
    this.setData({
      yzmimgInput1: e.detail.value
    })
  },
  yzmimgInput2: function (e) {
    this.setData({
      yzmimgInput2: e.detail.value
    })
  },
  yzmInput1: function (e) {
    var val = e.detail.value;
    if (val.toString().length == 4) {
      this.setData({
        bg_con: '#3DBCC6',
        disable_con: true
      })
    } else {
      this.setData({
        bg_con: '#9EDDE2',
        disable_con: false
      })
    }
    this.setData({
      yzmInput1: e.detail.value
    })
  },
  yzmInput2: function (e) {
    var val = e.detail.value;
    if (val.toString().length == 4) {
      this.setData({
        bg_con: '#3DBCC6',
        disable_con: true
      })
    } else {
      this.setData({
        bg_con: '#9EDDE2',
        disable_con: false
      })
    }
    this.setData({
      yzmInput2: e.detail.value
    })
  },
  getVerificationCode1: function (e) {
    var that = this;
    this.setData({
      yzmimgValue: '',
      errImg: []
    })
    that.data.yzmNum = false;
    var phone_num = that.data.present_phoneNum
    if (that.data.present_phoneNum == '') {
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
      that.getCode1();
      that.setData({
        disabled1: true
      })
      that.sendText1();
    }
  }, 
  getVerificationCode2: function (e) {
    var that = this;
    this.setData({
      yzmimgValue: '',
      errImg: []
    })
    that.data.yzmNum = false;
    var phone_num = that.data.phoneNumInput
    if (that.data.phoneNumInput == '') {
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
      that.getCode2();
      that.setData({
        disabled2: true
      })
      that.sendText2();
    }
  },
  getCode1: function (options) {
    var that = this;
    var currentTime1 = that.data.currentTime1
    interval1 = setInterval(function () {
      currentTime1--;
      that.setData({
        time1: '重新发送(' + currentTime1 + ')'
      })
      if (currentTime1 <= 0) {
        clearInterval(interval1)
        that.setData({
          time1: '重新发送',
          currentTime1: 61,
          disabled1: false
        })
      }
    }, 1000)
  },
  getCode2: function (options) {
    var that = this;
    var currentTime2 = that.data.currentTime2
    interval2 = setInterval(function () {
      currentTime2--;
      that.setData({
        time2: '重新发送(' + currentTime2 + ')'
      })
      if (currentTime2 <= 0) {
        clearInterval(interval2)
        that.setData({
          time2: '重新发送',
          currentTime2: 61,
          disabled2: false
        })
      }
    }, 1000)
  },
  sendText1: function () {
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
        mobile: that.data.present_phoneNum,
        app_id: "wx024695259e1a68cb",
        sign: obj_token,
      },
      success: function (res) {
        console.log(res)
        if (res.data.msg == "验证码发送频繁") {
          that.setData({
            flag: false
          })
          that.yzmImage1();
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
  sendText2: function () {
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
        mobile: that.data.phoneNumInput,
        app_id: "wx024695259e1a68cb",
        sign: obj_token,
      },
      success: function (res) {
        console.log(res)
        if (res.data.msg == "验证码发送频繁") {
          that.setData({
            flag: false
          })
          that.yzmImage2();
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
  yzmqd1: function (e) {
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
        mobile: that.data.present_phoneNum,
        verify_code: that.data.yzmimgInput1,
        app_id: "wx024695259e1a68cb",
        sign: obj_token
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          that.setData({
            flag: true
          })
          that.sendText1();
        } else {
          that.data.errImg = [];
          that.data.errImg.push(res.data.msg)
          that.setData({
            errImg: that.data.errImg
          })
          that.yzmImage1();
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  yzmqd2: function (e) {
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
        mobile: that.data.phoneNumInput,
        verify_code: that.data.yzmimgInput2,
        app_id: "wx024695259e1a68cb",
        sign: obj_token
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          that.setData({
            flag: true
          })
          that.sendText1();
        } else {
          that.data.errImg = [];
          that.data.errImg.push(res.data.msg)
          that.setData({
            errImg: that.data.errImg
          })
          that.yzmImage2();
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  yzmImage1: function () {
    var that = this;
    that.setData({
      // yzmPhone: url + "/get-img-code/75/30?mobile=" + that.data.phoneNum + "&time=" + new Date().getTime()
      yzmPhone1: url + "/get-img-code/75/30?mobile=" + that.data.present_phoneNum + "&time=" + new Date().getTime()
    })
  },
  yzmImage2: function () {
    var that = this;
    that.setData({
      // yzmPhone: url + "/get-img-code/75/30?mobile=" + that.data.phoneNum + "&time=" + new Date().getTime()
      yzmPhone2: url + "/get-img-code/75/30?mobile=" + that.data.phoneNumInput + "&time=" + new Date().getTime()
    })
  },
  changeImg1: function () {
    var that = this;
    this.yzmImage1();
  },
  changeImg2: function () {
    var that = this;
    this.yzmImage2();
  },
  confirm1: function () {
    var that = this;
    var phone = that.data.present_phoneNum;
    var yzm = that.data.yzmInput1;
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
        user_id: that.data.user_id,
      });
      wx.request({
        url: url + "/web-api/wechat-applets/verify-change-code",
        // url: "http://172.16.40.150:8000/web-api/wechat-applets/verify-change-code",
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          mobile: that.data.present_phoneNum,
          code: that.data.yzmInput1,
          user_id: that.data.user_id,
          type: 1,
          city_id: "",
          app_id: "wx024695259e1a68cb",
          sign: obj_token,
        },
        success: function (res) {
          wx.showLoading({
            title: '努力加载中...',
          })
          console.log(res)
          console.log(res.data.data.token)
          // clearInterval(interval)
          that.setData({
            token: res.data.data.token,
            newPhone: true,
            oldPhone: false,
            inputVal: '',
            indetify1: false,
            indetify2: true
          })
          wx.hideLoading()
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  },

  confirm2: function () {
    var that = this;
    var phone = that.data.phoneNumInput;
    var yzm = that.data.yzmInput2;
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
        user_id: that.data.user_id,
      });
      wx.request({
        url: url + "/web-api/wechat-applets/verify-change-code",
        // url: "http://172.16.40.150:8000/web-api/wechat-applets/verify-change-code",
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          mobile: that.data.phoneNumInput,
          code: that.data.yzmInput2,
          user_id: that.data.user_id,
          type: 2,
          city_id: "",
          token: that.data.token,
          mobile_old: that.data.present_phoneNum,
          app_id: "wx024695259e1a68cb",
          sign: obj_token,
        },
        success: function (res) {
          console.log(res)
          that.setData({
            indetify3: false,
            indetify4: true,
          })
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration: 2000
          })
          wx.setStorage({
            key: 'userMobile',
            data: that.data.phoneNumInput
          })
          wx.setStorage({
            key: 'userNickname',
            data: res.data.data.mobile
          })
          setTimeout(function(){
            wx.reLaunch({
              url: '../user/user'
            })
          },2000)
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  },

  phonenum: function () {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: '4001-551-551',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
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