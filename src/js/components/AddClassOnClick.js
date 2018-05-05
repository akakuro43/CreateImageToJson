export default class AddClassOnClick {
  constructor() {
    this.TARGET_CLASS_NAME = 'js-click';
    this.CLICK_CLASS_NAME = 'is-click-on';
    this.CLICK_PARENT_CLASS_NAME = 'is-click-on--parent';

    this.on();
  }

  on() {
    Array.from(document.getElementsByClassName(this.TARGET_CLASS_NAME), elm => {
      let _this = this;
      elm.addEventListener('click', function() {
        this.classList.toggle(_this.CLICK_CLASS_NAME);
        this.parentNode.classList.toggle(_this.CLICK_PARENT_CLASS_NAME);
      });
    })
  }
}
