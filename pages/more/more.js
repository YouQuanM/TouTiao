var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;
// var url = "http://172.16.41.145:8088";
Page({
  data: {
    more_list:''
  },
  onLoad: function (option) {
    var that = this;
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id:""
    });
    wx.request({
      url: url + '/web-api/wechat-applets/more-facility-config',
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: "",
        app_id: "wx024695259e1a68cb",
        sign: obj_token
      },
      success: function (res) {
        console.log(res)
        that.setData({
          more_list: res.data,
        })
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
      path: 'pages/more/more'
    }
  }
})