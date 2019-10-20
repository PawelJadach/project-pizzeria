import BaseWidget from './BaseWidget.js';
import utils from '../utils.js';
import { settings, select } from '../settings.js';

class DatePicker extends BaseWidget {
  constructor(wrapper){
    
    super(wrapper);
    const thisWidget = this;
    utils.dateToStr(new Date());
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }

  initPlugin(){
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = thisWidget.minDate;
    thisWidget.maxDate.setDate(thisWidget.maxDate.getDate() + settings.datePicker.maxDaysInFuture);
    // flatpickr(thisWidget.dom.input, {
    //   defaultDate: thisWidget.minDate,
    //   minDate: thisWidget.minDate,
    //   maxDate: thisWidget.maxDate,
    //   locale: {
    //     'firstDayOfWeek': 1 // start week on Monday
    //   } ,
    //   disable: [
    //     function(date) {
    //       // return true to disable
    //       return (date.getDay() === 1);
    //     }
    //   ],
    // });
  }
  parseValue(value){
    return value;
  }

  isValid(){
    return true;
  }

  renderValue(){
      
  }
}

export default DatePicker;