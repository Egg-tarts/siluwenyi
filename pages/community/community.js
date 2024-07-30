Page({
  data: {
    currentTab: 'scenic', // 默认激活的按钮
    buttonlist:[],
    buttonListleft: [],
    buttonListright: [],
    buttonlist_recommend:[],
    buttonListleft_recommend: [],
    buttonListright_recommend: [],
    popular:'热门'
  },
  onLoad: function() {
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/attractions/', 
      method: 'GET',
      success: (res) => {
        // 处理buttonlist数据
        let buttonlist = res.data.map(item => {
          return {
            ...item,
            images: [item.image1, item.image2, item.image3]
          };
        });

        // 设置buttonlist到页面的data中
        this.setData({
          buttonlist: buttonlist
        }, () => {
          this.splitButtonList();
          console.log(this.data.buttonListleft);
          console.log(this.data.buttonListright);
        });
      }
    });
  },

  splitButtonList: function() {
    const { buttonlist } = this.data;
    const buttonListleft = [];
    const buttonListright = [];

    buttonlist.forEach((item, index) => {
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
    console.log(id)
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    });
  },
  splitButtonList_recommend: function() {
    const { buttonlist_recommend } = this.data;
    const buttonListleft_recommend = [];
    const buttonListright_recommend = [];

    buttonlist_recommend.forEach((item, index) => {
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
              let buttonlist = res.data.map(item => {
                return {
                  ...item,
                  images: [item.image1, item.image2, item.image3]
                };
              });
      
              // 设置buttonlist到页面的data中
              this.setData({
                buttonlist: buttonlist
              }, () => {
                this.splitButtonList();
                console.log(this.data.buttonListleft);
                console.log(this.data.buttonListright);
              });
            }
          });
        } else if (type === 'city') {
          wx.request({
            url: 'https://lzuer.mynatapp.cc/SRJC/recommendations/', 
            method: 'GET',
            success: (res) => {
              let buttonlist_recommend = res.data.map(item => {
                return {
                  ...item,
                  images: [item.images1, item.images2, item.images3]
                };
              });
              console.log(1),
              this.setData({
                buttonlist_recommend: buttonlist_recommend
              },() => {console.log(res.data)
                this.splitButtonList_recommend();
                console.log(this.data.buttonListleft_recommend);
                console.log(this.data.buttonListright_recommend);
              });
            }
          })
        }
  }
})
