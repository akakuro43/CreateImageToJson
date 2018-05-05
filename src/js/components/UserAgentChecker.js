const isSmartphone = require('./utils/isSmartphone');
export default class UserAgentChecker {
  constructor() {
    this.setAppInfo()
    this.options = {
      userAgent: true,
      displayWidth: true,
      displayWidthSP: 768
    }

    this.changeDeviceInfo();
    this.addClass();
    window.isPc = this.isPC()
    window.isSp = this.isSP()

    window.addEventListener('resize', () => {
      this.changeDeviceInfo();
      this.addClass();
      window.isPc = this.isPC()
      window.isSp = this.isSP()
    });



  }

  setAppInfo() {
    this.APP = {}
    this.APP.sp = isSmartphone()
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


  addClass() {
    let html = document.getElementsByTagName('html')[0];
    html.setAttribute('class', this.device);
  }

  isPC() {
    return (this.device == "pc");
  }
  isSP() {
    return (this.device == "sp");
  }
}
