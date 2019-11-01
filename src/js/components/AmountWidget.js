import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;
    //console.log(this);
    thisWidget.getElements(element);
    thisWidget.initActions();
    //console.log('AmountWidget', thisWidget);
    //console.log('constructor arguments:', element);
  }

  getElements() {
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.input
    );
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.linkDecrease
    );
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(
      select.widgets.amount.linkIncrease
    );
  }

  isValid(value) {
    //console.log(this.dom.wrapper.children[1].getAttribute('max'));
    return (
      !isNaN(value) &&
      value >= settings.amountWidget.defaultMin &&
      value <= this.dom.wrapper.children[1].getAttribute('max')
    );
  }

  renderValue() {
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  }

  initActions() {
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function() {
      //thisWidget.setValue(thisWidget.dom.input.value);
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function(e) {
      e.preventDefault();
      //console.log('odejmuje');
      thisWidget.setValue(thisWidget.value - 0.5);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(e) {
      e.preventDefault();
      //console.log('dodaje');

      thisWidget.setValue(thisWidget.value + 0.5);
      // console.log(thisWidget.value);
    });
  }
}

export default AmountWidget;
