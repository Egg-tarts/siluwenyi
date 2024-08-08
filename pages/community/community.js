
Page({
  data: {
    currentTab: 'scenic', // 默认激活的按钮
    buttonList_last:[],
    buttonList:[],
    buttonListleft: [],
    buttonListright: [],
    buttonList_recommend_last:[],
    buttonList_recommend:[],
    buttonListleft_recommend: [],
    buttonListright_recommend: [],
    popular:'热门',
    showIcon: true
  },
  onInput: function(event) {
    this.setData({
      showIcon: event.detail.value.length === 0
    });  
  },
  searchFunc: function(e) {
    const that = this;
    const searchValue = e.detail.value; // 获取输入框的值
    const { currentTab } = that.data; // 获取当前Tab的值
    if(searchValue.trim() !== ''&&currentTab==='scenic')
    {
      wx.request({
        url: `https://lzuer.mynatapp.cc/SRJC/attractions/${searchValue}/search/`,
        method: 'GET',
        success(res) {
          console.log(res)
          let buttonList = res.data.map(item => {
            return {
              ...item,
              images: [item.image1, item.image2, item.image3]
            };
          });
          that.setData({
              buttonList: buttonList // 假设返回数据中有一个list
            }, () => {
              console.log(that.data.buttonList)
              that.splitButtonList();
            });
        },
      });
    }else if(searchValue.trim() === ''&&currentTab==='scenic')
    {
      that.setData({buttonList:that.data.buttonList_last},
         () => {
        that.splitButtonList();
      });

    }else if(searchValue.trim() !== ''&&currentTab==='city')
    {
      wx.request({
        url: `https://lzuer.mynatapp.cc/SRJC/recommendations/${searchValue}/search/`,
        method: 'GET',
        success(res) {
          console.log(res)
          let buttonList_recommend = res.data.map(item => {
            return {
              ...item,
              images: [item.images1, item.images2, item.images3]
            };
          });
          that.setData({
              buttonList_recommend: buttonList_recommend // 假设返回数据中有一个list
            }, () => {
              that.splitButtonList_recommend();
            });
        },
      });
    }else if(searchValue.trim() === ''&&currentTab==='city')
    {
      that.setData({buttonList_recommend:that.data.buttonList_recommend_last},
         () => {
        that.splitButtonList_recommend();
      });

    }
   
  },
    openCustomerServiceChat: function() {
      wx.openCustomerServiceChat({
        extInfo: {},  // 可以留空，不需要自定义URL
        success(res) {
          console.log('客服对话启动成功', res);
        },
        fail(err) {
          console.error('启动客服对话失败', err);
        }
      });
    },
  navigateToMyRecommend: function() {
    wx.navigateTo({
      url: '/pages/myrecommend/myrecommend' // 替换为实际的路径
    });
  },
  onLoad: function() {
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/attractions/', 
      method: 'GET',
      success: (res) => {
        // 处理buttonlist数据
        let buttonList = res.data.map(item => {
          return {
            ...item,
            images: [item.image1, item.image2, item.image3]
          };
        });

        // 设置buttonlist到页面的data中
        this.setData({
          buttonList: buttonList,
          buttonList_last:buttonList
        }, () => {
          this.splitButtonList();
        });
      }
    });
  },

  splitButtonList: function() {
    const { buttonList } = this.data;
    const buttonListleft = [];
    const buttonListright = [];

    buttonList.forEach((item, index) => {
      if (index % 2 === 0) {
        // 索引为偶数的元素放入buttonListleft
        buttonListleft.push(item);
      } else {
        // 索引为奇数的元素放入buttonListright
        buttonListright.push(item);
      }
    });

    // 更新数据
    this.setData({
      buttonListleft,
      buttonListright
    });
  },
  handleButtonClickUrl(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },
  splitButtonList_recommend: function() {
    const { buttonList_recommend } = this.data;
    const buttonListleft_recommend = [];
    const buttonListright_recommend = [];

    buttonList_recommend.forEach((item, index) => {
      if (index % 2 === 0) {
        // 索引为偶数的元素放入buttonListleft
        buttonListleft_recommend.push(item);
      } else {
        // 索引为奇数的元素放入buttonListright
        buttonListright_recommend.push(item);
      }
    });

    // 更新数据
    this.setData({
      buttonListleft_recommend,
      buttonListright_recommend
    });
  },
  handleButtonClick: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentTab: type
        });
        if (type === 'scenic') {
          wx.request({
            url: 'https://lzuer.mynatapp.cc/SRJC/attractions/', 
            method: 'GET',
            success: (res) => {
              // 处理buttonlist数据
              let buttonList = res.data.map(item => {
                return {
                  ...item,
                  images: [item.image1, item.image2, item.image3]
                };
              });
      
              // 设置buttonlist到页面的data中
              this.setData({
                buttonList: buttonList,
                buttonList_last:buttonList
              }, () => {
                this.splitButtonList();

              });
            }
          });
        } else if (type === 'city') {
          wx.request({
            url: 'https://lzuer.mynatapp.cc/SRJC/recommendations/', 
            method: 'GET',
            success: (res) => {
              let buttonList_recommend = res.data.map(item => {
                return {
                  ...item,
                  images: [item.images1, item.images2, item.images3]
                };
              });
              this.setData({
                buttonList_recommend: buttonList_recommend,
                buttonList_recommend_last:buttonList_recommend
              },() => {
                this.splitButtonList_recommend();
              });
            }
          })
        }
  }
})
