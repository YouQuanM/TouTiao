var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;
Page({
  data: {
    btn_img:{},
    left_img:{},
    right_img:{},
    middle_bg:{},
    danbao:{},

    qa_1head:{},
    qa_1head1: {},
    opacitys:0,
    opacitys2:0,
    opacitys3: 0,
    opacitys4:0,
    opacitys5: 0,
    opacitys6: 0,
    qa2_img:{},
    blow:{},
    mouth: {},
    qa4_img: {},
    qa5_img: {},
    qa6_img: {},

    toView:'',
    isScroll: true,
    user_num:'',
    result:[],
    one_more:'',
    anwser_tag:1,
    hide_tag:false,
    guodu:true,

  },
  onHide: function () {
    this.setData({
      hide_tag: true
    })
  },
  onShow: function () {
    if (this.data.hide_tag) {
      wx.reLaunch({
        url: '../index/index'
      })
    }
  },
  onLoad: function (options) {
   var that = this;

    setTimeout(function(){
      that.setData({
        guodu: false
      })
    },1500)

    let isIphoneX = app.data.isIphoneX;
    that.setData({
      isIphoneX: isIphoneX
    })

   try {
     var value3 = wx.getStorageSync('userId')
     that.setData({
       userId: value3,
     })
   } catch (e) {
     console.log(e)
   }

   that.setData({
     anwser_tag: options.anwser_tag
   })

   that.user_num();
   that.user_info();

   that.setData({
     toView: 'page',
     isScroll: false,
     one_more: options.one_more
   })



   setTimeout(function(){
     that.btn_img(); 
   },2000)

   setInterval(function(){
     that.btn_img(); 
   },5000)

    setTimeout(function(){
      that.left_img();
      that.right_img();
      that.middle_bg();
      that.qa_op();
      that.danbao();
    },1500)
  },

  btn_img:function(){
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.scale(1.3, 1.3).step()
    animation.scale(1, 1).step()
    animation.scale(1.3, 1.3).step()
    animation.scale(1, 1).step()

    this.setData({
      btn_img: animation.export()
    })
  },

  left_img: function () {
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.left('-68rpx').step()
    this.setData({
      left_img: animation.export()
    })
  },

  right_img: function () {
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.right('-180rpx').step()
    this.setData({
      right_img: animation.export()
    })
  },

  middle_bg: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.bottom('-228rpx').step()
    this.setData({
      middle_bg: animation.export()
    })
  },

  danbao: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.bottom('230rpx').step()
    this.setData({
      danbao: animation.export()
    })
  },


  start: function (e) {
    var that = this
    if (that.data.userId == '') {
      app.aldstat.sendEvent('活动用户登录', {
        '活动': '用户登录'
      });
      wx.navigateTo({
        url: '../login/login?qa_active=1'
      })
    }else{
      that.qa1_op();
      // that.qa_1head();
      setInterval(function(){
        that.qa_1head();
      },1000)

      // setInterval(function () {
      //   that.qa_1head1();
      // }, 2500)
      setTimeout(function () {
        that.setData({
          isScroll: true,
          toView: 'first'
        })
      }, 100)
      setTimeout(function () {
        that.setData({
          isScroll: false,
          toView: 'first'
        })
      }, 200)
    }
  },


  qa_1head: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.right('0rpx').step()
    animation.right('-48rpx').step()
    this.setData({
      qa_1head: animation.export()
    })
  }, 

  qa_1head1: function () {
    var animation = wx.createAnimation({
      duration: 1500,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.right('-48rpx').step()
    animation.right('0rpx').step()
    this.setData({
      qa_1head: animation.export()
    })
  }, 

  qa2_img: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      transformOrigin: "100% 100%",
    })
    this.animation = animation
    animation.rotate(-5).step()
    animation.rotate(5).step()
    this.setData({
      qa2_img: animation.export()
    })
  },

  blow: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.right('98rpx').step()
    animation.right('90rpx').step()
    animation.right('98rpx').step()
    animation.right('90rpx').step()
    animation.right('98rpx').step()
    this.setData({
      blow: animation.export()
    })
  },

  mouth: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.right('24rpx').step()
    animation.right('21rpx').step()
    animation.right('24rpx').step()
    animation.right('21rpx').step()
    animation.right('24rpx').step()
    animation.right('21rpx').step()
    animation.right('24rpx').step()
    this.setData({
      mouth: animation.export()
    })
  },

  qa4_img: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.left('240rpx').rotate(-20).step()
    animation.left('320rpx').rotate(0).step()
    animation.left('400rpx').rotate(20).step()
    animation.left('500rpx').rotate(0).step()
    animation.left('400rpx').rotate(-20).step()
    animation.left('320rpx').rotate(0).step()
    animation.left('240rpx').rotate(20).step()
    animation.left('180rpx').rotate(0).step()
    this.setData({
      qa4_img: animation.export()
    })
  },

  qa5_img: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear',
      transformOrigin: "100% 100%",
    })
    this.animation = animation
    animation.rotate(-5).step()
    animation.rotate(0).step()
    this.setData({
      qa5_img: animation.export()
    })
  },


  qa6_img: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation
    animation.rotate(-10).step()
    animation.rotate(0).step()
    this.setData({
      qa6_img: animation.export()
    })
  },



  qa_op: function () {
    var that = this
    var opacitys = that.data.opacitys
    setTimeout(function () {
      var interval = setInterval(function () {
        if (((opacitys++) / 10) >= 1) {
          clearInterval(interval)
          that.setData({
            opacitys: 1,
          })
        } else {
          that.setData({
            opacitys: ((opacitys++) / 10)
          })
        }
      }, 100)
    }, 800)
  },



  qa1_op:function(){
    var that = this
    var opacitys = that.data.opacitys
    setTimeout(function () {
      var interval = setInterval(function () {
        if (((opacitys++) / 10) >= 1) {
          clearInterval(interval)
          that.setData({
            opacitys: 1,
          })
        } else {
          that.setData({
            opacitys: ((opacitys++) / 10)
          })
        }
      }, 100)
    }, 500)
  }, 

  opacitys2:function() {
    var that = this
    var opacitys2 = that.data.opacitys2
    setTimeout(function () {
      var interval = setInterval(function () {
        if (((opacitys2++) / 10) >= 1) {
          clearInterval(interval)
          that.setData({
            opacitys2: 1,
          })
        } else {
          that.setData({
            opacitys2: ((opacitys2++) / 10)
          })
        }
      }, 100)
    }, 500)
  }, 

  opacitys3: function () {
    var that = this
    var opacitys3 = that.data.opacitys3
    setTimeout(function () {
      var interval = setInterval(function () {
        if (((opacitys3++) / 10) >= 1) {
          clearInterval(interval)
          that.setData({
            opacitys3: 1,
          })
        } else {
          that.setData({
            opacitys3: ((opacitys3++) / 10)
          })
        }
      }, 100)
    }, 500)
  }, 


  opacitys4: function () {
    var that = this
    var opacitys4 = that.data.opacitys4
    setTimeout(function () {
      var interval = setInterval(function () {
        if (((opacitys4++) / 10) >= 1) {
          clearInterval(interval)
          that.setData({
            opacitys4: 1,
          })
        } else {
          that.setData({
            opacitys4: ((opacitys4++) / 10)
          })
        }
      }, 100)
    }, 500)
  }, 

  opacitys5: function () {
    var that = this
    var opacitys5 = that.data.opacitys5
    setTimeout(function () {
      var interval = setInterval(function () {
        if (((opacitys5++) / 10) >= 1) {
          clearInterval(interval)
          that.setData({
            opacitys5: 1,
          })
        } else {
          that.setData({
            opacitys5: ((opacitys5++) / 10)
          })
        }
      }, 100)
    }, 500)
  }, 


  opacitys6: function () {
    var that = this
    var opacitys6 = that.data.opacitys6
    setTimeout(function () {
      var interval = setInterval(function () {
        if (((opacitys6++) / 10) >= 1) {
          clearInterval(interval)
          that.setData({
            opacitys6: 1,
          })
        } else {
          that.setData({
            opacitys6: ((opacitys6++) / 10)
          })
        }
      }, 100)
    }, 500)
  }, 


  first_A:function(){
    var that = this
    var result = that.data.result
    result.push('A')
    
    that.opacitys2();
    setInterval(function () {
      that.qa2_img();
    }, 1000)

    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'second'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'second'
      })
    }, 200)
  },


  first_B: function () {
    var that = this
    var result = that.data.result
    result.push('B')
    that.opacitys2();
    setInterval(function () {
      that.qa2_img();
    }, 1000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'second'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'second'
      })
    }, 200)
  },


  first_C: function () {
    var that = this
    var result = that.data.result
    result.push('C')
    that.opacitys2();
    setInterval(function () {
      that.qa2_img();
    }, 1000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'second'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'second'
      })
    }, 200)
  },

  first_D: function () {
    var that = this
    var result = that.data.result
    result.push('D')
    that.opacitys2();
    setInterval(function () {
      that.qa2_img();
    }, 1000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'second'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'second'
      })
    }, 200)
  },

  second_A:function(){
    var that = this
    var result = that.data.result
    result.push('A')
    that.opacitys3();
    setInterval(function(){
      that.blow();
    },200)
    setInterval(function () {
      that.mouth();
    }, 400)

    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'third'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'third'
      })
    }, 200)
  },

  second_B: function () {
    var that = this
    var result = that.data.result
    result.push('B')
    that.opacitys3();
    setInterval(function () {
      that.blow();
    }, 200)
    setInterval(function () {
      that.mouth();
    }, 400)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'third'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'third'
      })
    }, 200)
  },

  second_C: function () {
    var that = this
    var result = that.data.result
    result.push('C')
    that.opacitys3();
    setInterval(function () {
      that.blow();
    }, 200)
    setInterval(function () {
      that.mouth();
    }, 400)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'third'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'third'
      })
    }, 200)
  },


  second_D: function () {
    var that = this
    var result = that.data.result
    result.push('D')
    that.opacitys3();
    setInterval(function () {
      that.blow();
    }, 200)
    setInterval(function () {
      that.mouth();
    }, 400)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'third'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'third'
      })
    }, 200)
  },

  second_E: function () {
    var that = this
    var result = that.data.result
    result.push('E')
    that.opacitys3();
    setInterval(function () {
      that.blow();
    }, 200)
    setInterval(function () {
      that.mouth();
    }, 400)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'third'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'third'
      })
    }, 200)
  },

  third_A: function () {
    var that = this
    var result = that.data.result
    result.push('A')
    that.opacitys4();
    that.qa4_img();
    setInterval(function () {
      that.qa4_img();
    }, 7000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'fourth'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'fourth'
      })
    }, 200)
  },

  third_B: function () {
    var that = this
    var result = that.data.result
    result.push('B')
    that.opacitys4();
    that.qa4_img();
    setInterval(function () {
      that.qa4_img();
    }, 7000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'fourth'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'fourth'
      })
    }, 200)
  },

  third_C: function () {
    var that = this
    var result = that.data.result
    result.push('C')
    that.opacitys4()
    that.qa4_img();
    setInterval(function () {
      that.qa4_img();
    }, 7000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'fourth'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'fourth'
      })
    }, 200)
  },

  
  fourth_A: function() {
    var that = this
    var result = that.data.result
    result.push('A')
    that.opacitys5()
    setInterval(function () {
      that.qa5_img();
    }, 1000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'fifth'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'fifth'
      })
    }, 200)
  },

  fourth_B: function () {
    var that = this
    var result = that.data.result
    result.push('B')
    that.opacitys5()
    setInterval(function () {
      that.qa5_img();
    }, 1000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'fifth'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'fifth'
      })
    }, 200)
  },

  fourth_C: function () {
    var that = this
    var result = that.data.result
    result.push('C')
    that.opacitys5()
    setInterval(function () {
      that.qa5_img();
    }, 1000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'fifth'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'fifth'
      })
    }, 200)
  },

  fourth_D: function () {
    var that = this
    var result = that.data.result
    result.push('D')
    that.opacitys5()
    setInterval(function () {
      that.qa5_img();
    }, 1000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'fifth'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'fifth'
      })
    }, 200)
  },

  fifth_A: function() {
    var that = this
    var result = that.data.result
    result.push('A')
    that.opacitys6()
    setInterval(function () {
      that.qa6_img();
    }, 1000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'sixth'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'sixth'
      })
    }, 200)
  },

  fifth_B: function () {
    var that = this
    var result = that.data.result
    result.push('B')
    that.opacitys6()
    setInterval(function () {
      that.qa6_img();
    }, 1000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'sixth'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'sixth'
      })
    }, 200)
  },

  fifth_C: function () {
    var that = this
    var result = that.data.result
    result.push('C')
    that.opacitys6()
    setInterval(function () {
      that.qa6_img();
    }, 1000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'sixth'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'sixth'
      })
    }, 200)
  },

  fifth_D: function () {
    var that = this
    var result = that.data.result
    result.push('D')
    that.opacitys6()
    setInterval(function () {
      that.qa6_img();
    }, 1000)
    setTimeout(function () {
      that.setData({
        isScroll: true,
        toView: 'sixth'
      })
    }, 100)
    setTimeout(function () {
      that.setData({
        isScroll: false,
        toView: 'sixth'
      })
    }, 200)
  },


  sixth_A: function () {
    var that = this
    var result = that.data.result
    result.push('A')
    
    wx.reLaunch({
      url: '../qa_active_fin/qa_active_fin?result=' + JSON.stringify(result) + '&tag=1' + '&anwser_tag=1' 
    })
  },

  sixth_B: function () {
    var that = this
    var result = that.data.result
    result.push('B')

    wx.reLaunch({
      url: '../qa_active_fin/qa_active_fin?result=' + JSON.stringify(result) + '&tag=1' + '&anwser_tag=1'
    })
  },

  sixth_C: function () {
    var that = this
    var result = that.data.result
    result.push('C')

    wx.reLaunch({
      url: '../qa_active_fin/qa_active_fin?result=' + JSON.stringify(result) + '&tag=1' + '&anwser_tag=1'
    })
  },

  sixth_D: function () {
    var that = this
    var result = that.data.result
    result.push('D')

    wx.reLaunch({
      url: '../qa_active_fin/qa_active_fin?result=' + JSON.stringify(result) + '&tag=1' + '&anwser_tag=1'
    })
  },


  user_num:function(){
    var that = this;
    var obj_token = app.sha_token({
      city_id: "",
      app_id: "wx024695259e1a68cb"
    });
    wx.request({
      url: url + "/web-api/wechat-applets/answer-user-num",
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
        if (res.data.success){
          that.setData({
            user_num:res.data.data.num
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },



  user_info: function () {
    var that = this;
    var obj_token = app.sha_token({
      city_id: "",
      app_id: "wx024695259e1a68cb",
      user_id: that.data.userId
    });
    wx.request({
      url: url + "/web-api/wechat-applets/answer-user-info",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: "",
        app_id: "wx024695259e1a68cb",
        user_id: that.data.userId,
        sign: obj_token
      },
      success: function (res) {
        console.log(res)
        console.log(res.data.data.status)
        if (res.data.success) {
          if (that.data.anwser_tag == 2){
            console.log(res)
          }else{
            if (res.data.data.status == 1) {
              console.log(res)
            } 
            else {
              wx.reLaunch({
                url: '../qa_active_fin/qa_active_fin?tag=2'
              })
            }
          }
        }
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
      path: 'pages/search/search'
    }
  }
})