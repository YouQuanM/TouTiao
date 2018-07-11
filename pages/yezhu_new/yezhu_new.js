var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;

Page({
  onLoad:function(){

  },
  onShareAppMessage: function () {
    return {
      title: '租的省心,住得舒心',
      imageUrl: '../../images/share_img.png',
      path: 'pages/yezhu_new/yezhu_new'
    }
  }
})