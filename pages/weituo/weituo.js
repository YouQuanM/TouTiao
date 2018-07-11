var sha1 = require('../../utils/sha1.js');
const app = getApp();
var interval = null //倒计时函数
var cityNum_val;
var url = app.data.url;
// var url = 'https://wechattest.dankegongyu.com';
Page({
  data: {
    date: '请选择日期',
    fun_id: 2,
    time: '获取验证码', //倒计时 
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
    errImg: [],
    dxyzm: "",
    cityNum: [],
    yzmNum: true,
    flag: true,
    clickNum: 1
  },
  onLoad: function () {
    var that = this;
    app.city_info((cityNum, cityName) => {
      console.log(cityName, cityNum)
      that.setData({
        areaList: cityName,
        areaNum: cityNum
      })
      wx.getStorage({
        key: 'cityStorageNum',
        success: function (res) {
          that.setData({
            areaIndex: that.data.areaNum.indexOf(String(res.data)),
          })
        }
      })
    });
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  phoneNumInput: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  yzmInput: function (e) {
    this.setData({
      yzmInput: e.detail.value
    })
  },
  xqInput: function (e) {
    this.setData({
      xqInput: e.detail.value
    })
  },
  yzmimgInput: function (e) {
    this.setData({
      yzmimgInput: e.detail.value
    })
  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
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
  getVerificationCode: function (e) {
    var that = this;
    this.setData({
      yzmimgValue: '',
      errImg: []
    })
      that.data.yzmNum = false;
      var phone_num = that.data.phoneNum
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


  confirm: function () {
    var that = this;
    var Name = that.data.userName;
    var phone = that.data.phoneNum;
    var yzm = that.data.yzmInput;
    var xq = that.data.xqInput;
    if (Name == '') {
      that.data.errInfo = [];
      that.data.errInfo.push("姓名不能为空")
      that.setData({
        errInfo: that.data.errInfo
      })
    } else if (/[+=/￥()!^-_@#\$%\^&\* ]+/g.test(Name)) {
      that.data.errInfo = [];
      that.data.errInfo.push("姓名有非法字符")
      that.setData({
        errInfo: that.data.errInfo
      })
    } else if (phone == '') {
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
    } else if (xq == '') {
      that.data.errInfo = [];
      that.data.errInfo.push("小区名称不能为空")
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
        url: url+"/web-api/wechat-applets/ajax-info",
        // url: "http://172.16.40.150:8000/web-api/wechat-applets/ajax-info",
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          city_id: "",
          mobile: that.data.phoneNum,
          sms_code: that.data.yzmInput,
          from_type: "index",
          area_name: that.data.xqInput,
          name: that.data.userName,
          city: that.data.areaList[that.data.areaIndex],
          app_id: "wx024695259e1a68cb",
          sign: obj_token
        },
        success: function (res) {
          console.log(res)
          if (res.data.success) {
            wx.redirectTo({
              url: '../wtSuccess/wtSuccess?msg=' + res.data.msg,
            })
          } else if (res.data.success == false) {
            that.data.errInfo = [];
            that.data.yzmNum = false;
            that.data.errInfo.push(res.data.msg)
            that.setData({
              errInfo: that.data.errInfo
            })
          }
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  },
  bindPickerChange: function (e) {
    var areaNum = this.data.areaNum;
    cityNum_val = e.detail.value;
    this.setData({
      areaIndex: e.detail.value
    })
    app.data.city_Name = this.data.areaList[cityNum_val];

  },
  yzmqd: function (e) {
    var that = this;
    that.data.errImg = [];
    var obj_token = app.sha_token({
      city_id:"",
      app_id: "wx024695259e1a68cb",
    });
    wx.request({
      url: url+"/web-api/wechat-applets/img-code",
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
      yzmPhone: url+"/get-img-code/75/30?mobile=" + that.data.phoneNum + "&time=" + new Date().getTime()
    })
  },
  changeImg: function () {
    var that = this;
    this.yzmImage();
  },
  sendText: function () {
    var that = this;
    var obj_token = app.sha_token({
      city_id:"",
      app_id: "wx024695259e1a68cb"
    });
    wx.request({
      url: url+"/web-api/wechat-applets/send-text-verify-code",
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
  onShareAppMessage: function () {
    return {
      title: '租得省心,住得舒心',
      imageUrl: '../../images/share_img.png',
      path: 'pages/weituo/weituo'
    }
  }
})