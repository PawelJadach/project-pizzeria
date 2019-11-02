import { templates, select, settings, classNames } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import ArtsWidget from './ArtsWidget.js';
import utils from '../utils.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.element = utils.createDOMFromHTML(generatedHTML);
    const bookingContainer = document.querySelector(select.containerOf.booking);
    bookingContainer.appendChild(thisBooking.element);
    // console.log('element', element);
    // console.log('generatedHTML', generatedHTML);
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(
      select.booking.tables
    );
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(
      select.cart.phone
    );
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(
      select.cart.address
    );
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new ArtsWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    console.log();
    thisBooking.hourPicker.dom.wrapper.addEventListener('click', function() {
      thisBooking.dom.hoursAmount.children[1].value = 0.5;
    });
    thisBooking.form = document.querySelector('.booking-form');
    thisBooking.starters = [];
    thisBooking.changeTable;
    thisBooking.dom.phone.addEventListener('keyup', function(e) {
      thisBooking.phone = e.target.value;
      //console.log('phone', thisBooking.phone);
    });

    thisBooking.dom.address.addEventListener('keyup', function(e) {
      thisBooking.address = e.target.value;
      //console.log('address', thisBooking.address);
    });

    const starters = document.querySelectorAll('.checkbox input');
    for (let starter of starters) {
      //console.log(starter);
      starter.addEventListener('click', function(e) {
        if (thisBooking.starters.includes(e.target.value)) {
          const index = thisBooking.starters.indexOf(e.target.value);
          thisBooking.starters.splice(index, 1);
        } else {
          thisBooking.starters.push(e.target.value);
        }
        //console.log(thisBooking.starters);
      });
    }

    thisBooking.dom.wrapper.addEventListener('updated', function() {
      //console.log('update');
      thisBooking.updateDOM();
    });

    for (let table of thisBooking.dom.tables) {
      //console.log();
      table.addEventListener('click', function() {
        const isBooking = table.classList.contains('booked');

        if (!isBooking) {
          for (let table of thisBooking.dom.tables) {
            table.classList.remove('table-change');
          }
          table.classList.add('table-change');
          thisBooking.changeTable = parseInt(table.getAttribute('data-table'));

          let tableReserved = [];
          Object.keys(thisBooking.booked[thisBooking.date]).map(hour => {
            //console.log(hour, thisBooking.booked[thisBooking.date][hour]);
            if (
              thisBooking.booked[thisBooking.date][hour].includes(
                thisBooking.changeTable
              )
            ) {
              tableReserved.push(hour);
            }
          });
          //console.log(tableReserved);
          let closeHour = 24;
          let flag = false;
          console.log(thisBooking.hour);
          tableReserved.map(hour => {
            if (
              parseFloat(hour) > parseFloat(thisBooking.hour) &&
              flag == false
            ) {
              closeHour = hour;
              flag = true;
            }
          });

          closeHour -= thisBooking.hour;
          console.log(thisBooking.hoursAmount.dom.wrapper.children[1]);

          thisBooking.hoursAmount.dom.wrapper.children[1].setAttribute(
            'max',
            closeHour
          );

          // for (const key in thisBooking.booked[thisBooking.date]) {
          //   //console.log(key);
          // }
        } else alert('Stolik zarezerwowany! Wybierz inny bądź zmień datę!');
      });
    }

    thisBooking.form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (
        thisBooking.changeTable !== undefined &&
        thisBooking.date !== undefined &&
        thisBooking.hour !== undefined &&
        thisBooking.hoursAmount.value !== undefined &&
        thisBooking.peopleAmount.value !== undefined
      ) {
        console.log('wysyłam formularz');
        thisBooking.bookingTable(
          thisBooking.changeTable,
          thisBooking.date,
          thisBooking.hourForPush,
          thisBooking.hoursAmount.value,
          thisBooking.peopleAmount.value,
          thisBooking.starters
        );
      } else alert('Zaznacz wszystkie opcje!');
    });
  }

  bookingTable(table, date, hour, duration, ppl, starters) {
    const thisBooking = this;
    let id = 0;
    fetch(settings.db.url + '/' + settings.db.booking).then(res =>
      res.json().then(res => {
        id = res.length + 1;
      })
    );
    const url = settings.db.url + '/' + settings.db.booking;
    // const id =
    const payload = {
      id,
      date,
      hour,
      table,
      duration,
      ppl,
      starters
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    fetch(url, options)
      .then(res => {
        return res.json();
      })
      .then(parsedRes => console.log(parsedRes));
    thisBooking.getData();
  }
  getData() {
    const thisBooking = this;
    const startDayParam =
      settings.db.dateStartParamKey +
      '=' +
      utils.dateToStr(this.datePicker.minDate);
    const endDateParam =
      settings.db.dateEndParamKey +
      '=' +
      utils.dateToStr(this.datePicker.maxDate);

    const params = {
      booking: [startDayParam, endDateParam],
      eventsCurrent: [settings.db.notRepeatParam, startDayParam, endDateParam],
      eventsRepeat: [settings.db.repeatParam, endDateParam]
    };
    //console.log(params);
    const urls = {
      booking:
        settings.db.url +
        '/' +
        settings.db.booking +
        '?' +
        params.booking.join('&'),
      eventsCurrent:
        settings.db.url +
        '/' +
        settings.db.event +
        '?' +
        params.eventsCurrent.join('&'),
      eventsRepeat:
        settings.db.url +
        '/' +
        settings.db.event +
        '?' +
        params.eventsRepeat.join('&')
    };
    // console.log(urls);
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat)
    ])
      .then(function(res) {
        const bookingRes = res[0];
        const eventsCurrentRes = res[1];
        const eventsRepeatRes = res[2];
        return Promise.all([
          bookingRes.json(),
          eventsCurrentRes.json(),
          eventsRepeatRes.json()
        ]);
      })
      .then(function([bookingRes, eventsCurrentRes, eventsRepeatRes]) {
        //console.log('bookingRes', bookingRes);
        // console.log(eventsCurrentRes);
        // console.log(eventsRepeatRes);

        thisBooking.parseData(bookingRes, eventsCurrentRes, eventsRepeatRes);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    // console.log(bookings);
    // console.log(eventsCurrent);
    // console.log(eventsRepeat);
    thisBooking.booked = {};
    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    //console.log(thisBooking.booked);
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        //console.log('git');
        for (
          let loopDate = minDate;
          loopDate <= maxDate;
          loopDate = utils.addDays(loopDate, 1)
        ) {
          thisBooking.makeBooked(
            utils.dateToStr(loopDate),
            item.hour,
            item.duration,
            item.table
          );
        }
      }
    }

    //console.log(thisBooking.booked);
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;
    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (
      let hourBlock = startHour;
      hourBlock < startHour + duration;
      hourBlock += 0.5
    ) {
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    // if (utils.hourToNumber(thisBooking.hourPicker.value) != thisBooking.hour) {
    //   thisBooking.dom.hoursAmount.children[1].setAttribute('value', 0.5);
    // }
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    thisBooking.hourForPush = thisBooking.hourPicker.value;
    //console.log('thisBooking.hour', thisBooking.hour);
    //console.log('działa', thisBooking.date);
    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] ==
        'undefined'
    ) {
      //console.log('zmieniam');
      allAvailable = true;
    }
    //console.log(thisBooking.dom.tables);
    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }
      //console.log(allAvailable);
      if (
        !allAvailable &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        //console.log('daje');
        table.classList.add(classNames.booking.tableBooked);
      } else {
        //console.log('zabieram');
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }
}

export default Booking;
