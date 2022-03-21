
import {templates} from './../settings.js';
import utils from './../utils.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
  }


  render(element) {
    const thisHome = this;

    const generatedHTML = templates.homePage();
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    thisHome.dom = {};
    console.log(thisHome.dom);

    thisHome.dom.wrapper = element;

    thisHome.dom.wrapper.innerHTML = generatedDOM.innerHTML;

  }
}

export default Home;