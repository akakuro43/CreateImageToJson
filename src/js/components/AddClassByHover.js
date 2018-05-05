export default class AddClassByHover {
  constructor() {
    this.TARGET_CLASS_NAME = 'js-hover'
    this.ENTER_CLASS_NAME = 'is-enter'
    this.OVER_CLASS_NAME = 'is-over'
    this.LEAVE_CLASS_NAME = 'is-leave'

    this.on()
    this.onTach()
  }

  on() {
    Array.from(document.getElementsByClassName(this.TARGET_CLASS_NAME), elm => {
      let _this = this

      elm.addEventListener('mouseenter', function() {
        this.classList.add(_this.ENTER_CLASS_NAME)
        setTimeout(() => {
          this.classList.add(_this.OVER_CLASS_NAME)
        }, 250);
        // setTimeout(() => {
        //   this.classList.remove(_this.ENTER_CLASS_NAME)
        // }, 500)
      });

      elm.addEventListener('mouseleave', function() {
        if(this.classList.contains(_this.OVER_CLASS_NAME)) {
          this.classList.remove(_this.OVER_CLASS_NAME)
          this.classList.remove(_this.ENTER_CLASS_NAME)
          this.classList.add(_this.LEAVE_CLASS_NAME)
          setTimeout(() => {
            this.classList.remove(_this.LEAVE_CLASS_NAME)
          }, 500)
        } else {
          setTimeout(()=> {
            this.classList.remove(_this.OVER_CLASS_NAME)
            this.classList.remove(_this.ENTER_CLASS_NAME)
            this.classList.add(_this.LEAVE_CLASS_NAME)
            setTimeout(() => {
              this.classList.remove(_this.LEAVE_CLASS_NAME)
            }, 200)
          },200)
        }
      })
    })
  }

  onTach() {
    Array.from(document.getElementsByClassName(this.TARGET_CLASS_NAME), elm => {
      let _this = this

      elm.addEventListener('touchstart', function() {
        this.classList.add(_this.ENTER_CLASS_NAME)
        setTimeout(() => {
          this.classList.add(_this.OVER_CLASS_NAME)
        }, 250);
        // setTimeout(() => {
        //   this.classList.remove(_this.ENTER_CLASS_NAME)
        // }, 500)
      });

      elm.addEventListener('touchend', function() {
        if(this.classList.contains(_this.OVER_CLASS_NAME)) {
          this.classList.remove(_this.OVER_CLASS_NAME)
          this.classList.remove(_this.ENTER_CLASS_NAME)
          this.classList.add(_this.LEAVE_CLASS_NAME)
          setTimeout(() => {
            this.classList.remove(_this.LEAVE_CLASS_NAME)
          }, 500)
        } else {
          setTimeout(()=> {
            this.classList.remove(_this.OVER_CLASS_NAME)
            this.classList.remove(_this.ENTER_CLASS_NAME)
            this.classList.add(_this.LEAVE_CLASS_NAME)
            setTimeout(() => {
              this.classList.remove(_this.LEAVE_CLASS_NAME)
            }, 200)
          },200)
        }
      })
    })
  }
}
