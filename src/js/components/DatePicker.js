/* global flatpickr */
import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';
import { settings, select } from '../settings.js';
// import flatpickr from 'flatpickr';

class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    utils.dateToStr(new Date());
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(
      select.widgets.datePicker.input
    );
    thisWidget.initPlugin();
    thisWidget.dom.input.addEventListener('input', function() {
      thisWidget.value = thisWidget.dom.input.value;
    });
    //console.log(thisWidget.value);
  }

  initPlugin() {
    const thisWidget = this;
    thisWidget.minDate = new Date();
    thisWidget.maxDate = utils.addDays(
      this.minDate,
      settings.datePicker.maxDaysInFuture
    );

    //console.log(thisWidget.minDate, thisWidget.maxDate);
    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      locale: {
        firstDayOfWeek: 1 // start week on Monday
      },
      disable: [
        function(date) {
          // return true to disable
          return date.getDay() === 1;
        }
      ],
      onChange: function(selectedDates, dateStr) {
        //console.log(dateStr);
        this.value = dateStr;
        //console.log('this.value', this.value);
      }
    });
  }
  parseValue(value) {
    return value;
  }

  isValid() {
    return true;
  }

  renderValue() {}
}

export default DatePicker;
