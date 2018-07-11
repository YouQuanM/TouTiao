var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;
// var url = "http://172.16.41.145:8088";
Page({
  data: {
    disable: true,
    mobile: ''
  },

  onLoad: function (option) {
    var that = this
    try {
      var value = wx.getStorageSync('userMobile')
        if (value == null || value == '') {
          console.log(value)
          that.setData({
            disable: false,
            mobile: value
          })
        }
      } catch (e) {
        // Do something when catch error
      }
  },
  toChange:function(){
    wx.navigateTo({
      url: '../changePhone/changePhone'
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