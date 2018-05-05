/*
 * リサイズイベント等で実施する処理を間引く
 */
module.exports = function(callback, duration) {
  var timer;
  return function(event) {
    clearTimeout(timer);
    timer = setTimeout(function(){
      callback(event);
    }, duration);
  };
}

// サンプル
// const debounce = require('./debounce');
// window.addEventListener('resize', debounce(() => {
//  間引く処理内容
// }, 400), false);
