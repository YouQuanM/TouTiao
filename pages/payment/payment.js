Page({
  data: {
    paymentList:[]
  },

  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'payment',
      success: function (res) {
        console.log(res.data)
        that.setData({
          paymentList: res.data
        })
      }
    })

  },
  onUnload:function(){
    wx.removeStorage({
      key: 'payment',
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '租得省心,住得舒心',
      imageUrl: '../../images/share_img.png',
      path: 'pages/payment/payment'
    }
  }


})