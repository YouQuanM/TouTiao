var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;
// var url = "http://172.16.41.145:8088";
Page({
  data: {
    isShow: '',
    currentTab: 0,
    userId:'',
    type:1,
    page:1,
    useStatus:[],
    amount:[],
    CASH:false,
    VOUCHER: false,
    DISCOUNT: false,
    CASH_amount: '',
    VOUCHER_amount: '',
    DISCOUNT_amount: '',
    endDate:'',
    startDate:'',
    list:[],
    topNum:0,
    disable_con: false,
    coupon_code:'',
    onoff: false,
    noCoupon: false
  },

  onLoad: function (option) {
    var that = this;
    that.couponList();
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userId: res.data,
        })
        console.log(that.data.userId)
        that.couponList();
      }
    })
  },
  explain:function(){
    this.setData({
      onoff: true,
    })
  },
  swichNav: function (e) {
    this.setData({
      isShow: e.target.dataset.current,
      list: []
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var showMode = e.target.dataset.current == 0;
      this.setData({
        currentTab: e.target.dataset.current,
        isShow: e.target.dataset.current,
        topNum: 0
      })
      if (this.data.isShow == 1){
        this.setData({
          type:2
        })
        this.couponList();
      } else if (this.data.isShow == 2){
        this.setData({
          type: 3
        })
        this.couponList();
      } else if (this.data.isShow == 0) {
        this.setData({
          type: 1
        })
        this.couponList();
      }
    }
  },
  coupon: function (e) {
    var val = e.detail.value;
    if (val.toString().length >1) {
      this.setData({
        bg_con: '#3DBCC6',
        disable_con: true
      })
    } else {
      this.setData({
        bg_con: '#cccccc',
        disable_con: false
      })
    }
    this.setData({
      coupon_code: e.detail.value
    })
  },
  exchange:function(){
    var that = this;
    if (that.data.disable_con){
      var obj_token = app.sha_token({
        city_id: "",
        app_id: "wx024695259e1a68cb",
        user_id: that.data.userId,
      });
      wx.request({
        url: url + "/web-api/wechat-applets/bind-coupon",
        // url: "http://172.16.40.150:8000/web-api/wechat-applets/bind-coupon",
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          coupon_code: that.data.coupon_code,
          user_id: that.data.userId,
          city_id: '',
          app_id: "wx024695259e1a68cb",
          sign: obj_token,
        },
        success: function (res) {
          console.log(res)
          if (res.data.success){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
            that.couponList();
          }else{
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } 
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  },
  couponList:function(){
    var that = this;
    var obj_token = app.sha_token({
      city_id: "",
      app_id: "wx024695259e1a68cb",
      user_id: that.data.userId,
    });
    wx.request({
      url: url + "/web-api/wechat-applets/coupon-list",
      // url: "http://172.16.40.150:8000/web-api/wechat-applets/coupon-list",
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      data: {
        type:that.data.type,
        page: that.data.page,
        user_id: that.data.userId,
        city_id: '',
        app_id: "wx024695259e1a68cb",
        sign: obj_token,
      },
      success: function (res) {
        console.log(res)
        that.setData({
          list: res.data.data.list
        })
        if (res.data.data.list == ''){
          that.setData({
            noCoupon: true
          })
        }else{
          that.setData({
            noCoupon: false,
            list: res.data.data.list
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
})