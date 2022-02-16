import {settings, select} from './../settings.js';

class AmountWidget {
  constructor(element) {
    const thisWidget = this;

    thisWidget.value = settings.amountWidget.defaultValue;
    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value);
  }

  getElements(element) {
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);

    if (thisWidget.value !== newValue && !isNaN(newValue)) {
      if (newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax) {
        thisWidget.value = newValue;
      }
    }
    thisWidget.input.value = thisWidget.value;

    thisWidget.announce();
  }

  initActions() {
    const thisWidget = this;

    thisWidget.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.input.value);
    });

    thisWidget.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      let val = thisWidget.value - 1;
      thisWidget.setValue(val);
    });

    thisWidget.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      let val = thisWidget.value + 1;
      thisWidget.setValue(val);
    });
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('update', {
      bubbles: true
    });
    
    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;
