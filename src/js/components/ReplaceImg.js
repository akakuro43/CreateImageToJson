/*
 * PC/SPでイメージを切り替える
 */
const debounce = require('./utils/debounce')
const isSmartphone = require('./utils/isSmartphone')
export default class ReplaceImg {
  constructor() {
    this.setAppInfo()
    this.options = {
      userAgent: false,
      displayWidth: true,
      displayWidthSP: 768
    }

    this.changeDeviceInfo();
    this.set();
    window.addEventListener('resize', debounce(() => {
      this.changeDeviceInfo();
      this.set();
    },400));
  }

  changeDeviceInfo() {
    this.APP.ww = window.innerWidth;
    if(this.options.userAgent && this.options.displayWidth) {
      if (!this.APP.sp && this.options.displayWidthSP < this.APP.ww) {
        this.device = "pc";
      } else {
        this.device = "sp";
      }
    } else if (this.options.userAgent) {
      if (!this.APP.sp) {
        this.device = "pc";
      } else {
        this.device = "sp";
      }
    } else if (this.options.displayWidth) {
      if (this.options.displayWidthSP < this.APP.ww) {
        this.device = "pc";
      } else {
        this.device = "sp";
      }
    }
  }

  setAppInfo() {
    this.APP = {}
    let ua = navigator.userAgent;
    this.APP.sp = isSmartphone()
  }

  replace(src) {
    src = src.replace('device', this.device)
    return src
  }

  set() {
    let _this = this;
    Array.from(document.querySelectorAll('[data-src]'), elm => {
      let src = elm.getAttribute('data-src');
      let alt = elm.getAttribute('data-alt')
      elm.setAttribute('src', _this.replace(src))
      elm.setAttribute('alt', (alt != null) ? alt:'')
    })
  }
}
