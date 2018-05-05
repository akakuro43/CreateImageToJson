import AddClassToBody from './AddClassToBody'
import AddClassOnClick from './AddClassOnClick'
import ReplaceImg from './ReplaceImg.js'
import AddClassByHover from './AddClassByHover.js'
import UserAgentChecker from './UserAgentChecker.js'

import CreateImateToJson from './CreateImateToJson.js'

export default class Controller {
  constructor() {
  }

  static init() {
    Controller.onetime()
  }

  static common() {
    new ReplaceImg()
    new AddClassOnClick()
    new AddClassByHover()
  }

  static onetime() {
    new UserAgentChecker()
    new CreateImateToJson()
  }

  static page() {
    const pageId = document.querySelector('.l-page').getAttribute('data-page-id');
    switch (pageId) {
      default: break;
    }
  }
}
