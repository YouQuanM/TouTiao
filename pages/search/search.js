var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;
Page({
  data: {
    navbar: ['合租', '整租', '业主加盟'],
    currentTab: 0,
    id: 0,
    tagName: [],
    catalogSelect: 0,//判断是否选中
    hotWord: [],
    hot_word_list: [],
    confirm: [],
    search_text: '',
    hotCityName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.hot_word();

    wx.getStorage({
      key: 'historySearch',
      success: function (res) {

        that.setData({
          tagName: res.data
        })
      }
    })
  },

  listPage: function (e) {
    var that = this;
    that.setData({//把选中值放入判断值
      catalogSelect: e.currentTarget.dataset.select
    })
    wx.navigateTo({
      url: '../list/list?pagetype=index&search_text=' + this.data.catalogSelect
    })
    this.searchHistory(e.currentTarget.dataset.select)
  },

  hot_word: function () {
    var that = this;
    wx.getStorage({
      key: 'cityStorageName',
      success: function (res) {
        console.log(res)
        var obj_token = app.sha_token({
          city_id: "",
          app_id: "wx024695259e1a68cb"
        });
        wx.request({
          url: url + "/web-api/wechat-applets/hot-search-words",
          method: "GET",
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: {
            city_id: "",
            city_name: res.data,
            app_id: "wx024695259e1a68cb",
            sign: obj_token
          },
          success: function (res) {
            console.log(res.data)
            var a = res.data.length;
            for (var i = 0; i < a; i++) {
              that.data.hotWord.push(res.data[i]);
            }
            that.setData({
              hotWord: that.data.hotWord
            })
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    })

  },
  confirm: function (e) {
    this.setData({
      search_text: e.detail.value
    })
    wx.navigateTo({
      url: '../list/list?pagetype=index&search_text=' + this.data.search_text
    })
    if (e.detail.value == "") {
      return false;
    }
    this.searchHistory(e.detail.value)
  },


  goBack: function () {
    wx.navigateBack();
  },

  searchHistory: function (val) {
    var history = this.data.tagName;

    history.unshift({
      "catalogName": val,
      "select": val
    })

    for (var i = 0; i < history.length; i++) {
      if (i != 0 && history[i].catalogName == val) {
        history.splice(i, 1)
      }
    }
    if (history.length > 10) {
      history.pop(1)
    }

    console.log(this.data.tagName)
    this.setData({
      tagName: this.data.tagName
    })
    wx.setStorage({
      key: "historySearch",
      data: this.data.tagName
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