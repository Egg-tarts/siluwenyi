Page({
  data: {
    content: {}
  },
  onLoad(options) {
    const page = options.page;
    const pageData = this.getPageData(page);
    this.setData({
      content: pageData
    });
  },
  getPageData(page) {
    const pagesInfo = {
      page1: {
        title: "页面1的标题",
        body: "页面1的内容"
      },
      page2: {
        title: "页面2的标题",
        body: "页面2的内容"
      },
      page3: {
        title: "页面3的标题",
        body: "页面3的内容"
      }
    };
    return pagesInfo[page];
  }
});
