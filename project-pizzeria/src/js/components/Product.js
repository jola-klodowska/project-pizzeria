import {select, classNames, templates} from './../settings.js';
import utils from './../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu() {
    const thisProduct = this;

    const generatedHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.dom = {};

    thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs);
    thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    thisProduct.dom.accordionTrigger.addEventListener('click', function (event) {
      event.preventDefault();

      const activeProduct = document.querySelector(select.all.menuProductsActive);

      if (activeProduct) {

        if (activeProduct != thisProduct.element) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
      }

      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });
  }

  initOrderForm() {
    const thisProduct = this;

    thisProduct.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.dom.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.dom.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;
    const formData = utils.serializeFormToObject(thisProduct.dom.form);

    let price = thisProduct.data.price;

    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];

      for (let optionId in param.options) {
        const option = param.options[optionId];

        if (formData[paramId] && formData[paramId].includes(optionId)) {
          const optionPrice = option.price;
          if (option.hasOwnProperty('default') == false) {
            price = price + optionPrice;
          }
        } else if (option.hasOwnProperty('default') && formData[paramId].includes(optionId) == false) {
          const optionPrice = option.price;
          price = price - optionPrice;
        }

        const optionImage = thisProduct.dom.imageWrapper.querySelector('.' + paramId + '-' + optionId);

        if (optionImage) {
          if (formData[paramId] && formData[paramId].includes(optionId)) {
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          } else if (formData[paramId].includes(optionId) == false) {
            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }

    thisProduct.priceSingle = price;
    price *= thisProduct.amountWidget.value;
    thisProduct.dom.priceElem.innerHTML = price;
  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.dom.amountWidgetElem);
    thisProduct.amountWidget.initActions();
    thisProduct.dom.amountWidgetElem.addEventListener('update', function () {
      thisProduct.processOrder();
    });
  }

  addToCart() {
    const thisProduct = this;

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProduct() {
    const thisProduct = this;

    const productSummary = {};

    productSummary.id = thisProduct.id;
    productSummary.name = thisProduct.data.name;
    productSummary.amount = thisProduct.amountWidget.value;
    productSummary.priceSingle = thisProduct.priceSingle;

    const price = thisProduct.amountWidget.value * productSummary.priceSingle;
    productSummary.price = price;

    productSummary.params = thisProduct.prepareCartProductParams();

    return productSummary;

  }

  prepareCartProductParams() {
    const thisProduct = this;

    const formData = utils.serializeFormToObject(thisProduct.dom.form);

    const productParamsSummary = {};

    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];

      productParamsSummary[paramId] = {
        label: param.label,
        options: {}
      };

      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if (optionSelected) {

          productParamsSummary[paramId].options[optionId] = option.label;
        }
      }
    }
    return productParamsSummary;
  }
}

export default Product;