var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;
// var url = "http://172.16.41.145:8088";
Page({
  weituo: function () {
    wx.navigateTo({
      url: '../weituo/weituo',
    })
  },
  onShareAppMessage: function () {
    return {
      title: '租的省心,住得舒心',
      imageUrl: '../../images/share_img.png',
      path: 'pages/yezhu/yezhu'
    }
  }
})