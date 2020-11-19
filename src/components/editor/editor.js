import { uodataPic } from '@/api/login';
import { IMG_HOST } from '@/config';

Component({
  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {
    myProperty: {
      // 属性名
      type: String,
      value: ''
    },
    myProperty2: String, // 简化的定义方式
    content: String // 简化的定义方式
  },

  data: {
    systemInfo: {},
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },
  lifetimes: {
    created: function () {
      console.log('created');
    },
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.log('attached');
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log('detached');
    }
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () {
      console.log('show');
      this.updatePosition(0);
      this.setData({
        keyboardHeight: 0
      });
    },
    hide: function () { },
    resize: function () { }
  },

  // observers: {
  //   content: function(val) {
  //     // 在 numberA 或者 numberB 被设置时，执行这个函数
  //     console.log(val)
  //     this.setContents(val)
  //   }
  // },

  ready() {
    console.log('ready');
    this.onLoad();
  },

  methods: {
    readOnlyChange() {
      this.setData({
        readOnly: !this.data.readOnly
      });
    },
    onLoad() {
      const systemInfo = wx.getSystemInfoSync();
      const platform = systemInfo.platform;
      const isIOS = platform === 'ios';
      this.setData({
        isIOS,
        systemInfo
      });
      const that = this;
      this.updatePosition(0);
      let keyboardHeight = 100;
      wx.onKeyboardHeightChange(res => {
        if (res.height === keyboardHeight) return;
        const duration = res.height > 0 ? res.duration * 1000 : 0;
        keyboardHeight = res.height;
        setTimeout(() => {
          wx.pageScrollTo({
            scrollTop: 0,
            success() {
              that.updatePosition(keyboardHeight);
              that.editorCtx.scrollIntoView();
            }
          });
        }, duration);
      });
    },
    updatePosition(keyboardHeight) {
      const toolbarHeight = 50;
      const { windowHeight, platform } = this.data.systemInfo;
      let editorHeight = keyboardHeight > 0 ? windowHeight - keyboardHeight - toolbarHeight : windowHeight;
      // 再减去底部按钮高度
      editorHeight = editorHeight - 90;
      this.setData({
        editorHeight,
        keyboardHeight
      });
      console.log('updatePosition==>', keyboardHeight);
    },
    calNavigationBarAndStatusBar() {
      const systemInfo = this.data.systemInfo;
      const { statusBarHeight, platform } = systemInfo;
      const isIOS = platform === 'ios';
      const navigationBarHeight = isIOS ? 44 : 48;
      return statusBarHeight + navigationBarHeight;
    },
    onEditorReady() {
      const that = this;
      that
        .createSelectorQuery()
        .select('#myeditor')
        .context(function (res) {
          console.log('onEditorReady==>', res);
          that.editorCtx = res.context;
          if (that.data.content) {
            that.editorCtx.setContents({
              html: that.data.content
            });
          }
        })
        .exec();
    },
    format(e) {
      let { name, value } = e.target.dataset;
      if (!name) return;
      // console.log('format', name, value)
      this.editorCtx.format(name, value);
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success');
        }
      });
    },
    onBlur() {
      console.log('失去焦点');
      this.editorCtx.blur();
    },
    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log('clear success');
        }
      });
    },
    removeFormat() {
      this.editorCtx.removeFormat();
    },
    insertDate() {
      const date = new Date();
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      this.editorCtx.insertText({
        text: formatDate
      });
    },
    insertImage() {
      this.onBlur();
      const that = this;
      wx.chooseImage({
        count: 9,
        sizeType: ['compressed'],
        success: function (res) {
          const { windowHWidth } = that.data.systemInfo;
          const imgSrc = res.tempFilePaths;
          const promiseArray = [];
          wx.showLoading({ title: '上传中' });
          res.tempFiles.forEach(item => {
            if (item.size <= 2000000) {
              //图片小于或者等于2M时 可以执行获取图片
              var promise = uodataPic(item.path, {
                imageType: 'goodsDetail'
              });
              promiseArray.push(promise);
            } else {
              wx.showToast({ title: '图片最大支持2M，请重新上传', icon: 'none' });
            }
          });
          Promise.all(promiseArray)
            .then(result => {
              console.log(result);
              for (let res of result) {
                that.editorCtx.insertImage({
                  src: IMG_HOST + res.data.data.imageUrl,
                  width: windowHWidth ? windowHWidth + 'px' : '375px'
                });
              }
              wx.hideLoading();
            })
            .catch(err => {
              wx.hideLoading();
            });
        }
      });
    },
    onStatusChange(e) {
      const formats = e.detail;
      this.setData({
        formats
      });
      this.triggerEvent('mychange', e);
    },
    onInput(detail) {
      this.triggerEvent('myinput', detail);
    }
  }
});
