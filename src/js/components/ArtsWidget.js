import { settings, select } from '../settings.js';
import BaseWidget from './BaseWidget.js';

class ArtsWidget extends BaseWidget {
  constructor(element) {
    super(element, 1);
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
    return (
      !isNaN(value) &&
      value >= settings.amountWidget.defaultMin &&
      value <= settings.amountWidget.defaultMax
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
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(e) {
      e.preventDefault();
      //console.log('dodaje');

      thisWidget.setValue(thisWidget.value + 1);
      // console.log(thisWidget.value);
    });
  }
}

export default ArtsWidget;
