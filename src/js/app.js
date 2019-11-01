import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function() {
    const thisApp = this;
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    //console.log(thisApp.pages);
    thisApp.navLinks = document.querySelectorAll('.nav-links');
    //console.log(thisApp.navLinks);
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages) {
      if (page.id === idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);
    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        //const clickedElement = this;

        const id = link.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    //console.log(thisApp.navLinks);
    for (let link of thisApp.navLinks) {
      //console.log(link);
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function() {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
    }
  },
  initData: function() {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(rawResponse => rawResponse.json())
      .then(parsedResponse => {
        thisApp.data.products = parsedResponse;
        this.initMenu();
      });
  },
  init: function() {
    const thisApp = this;
    thisApp.initData();
    thisApp.initCart();
    thisApp.initPages();
    thisApp.initBooking();
    thisApp.carousel();
  },
  initCart: function() {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(e) {
      app.cart.add(e.detail.product);
    });
  },
  initBooking: function() {
    const thisApp = this;
    const containerBooking = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(containerBooking);
  },

  carousel: function() {
    //const thisApp = this;
    const quotations = [
      {
        title: 'Quotations 1',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam egestas viverra tortor, eu ullamcorper dui imperdiet nec. Nuncsed dolor at elit lobortis sodales.',
        signature: '- Lorem ipsum 1'
      },
      {
        title: 'Quotations 2',
        content:
          'Lorem ipsura tortor, eu ullamcorper dui imperdiet nec. Nuncsed dolor at elit lobortis sodales.',
        signature: '- Lorem ipsum 2'
      },
      {
        title: 'Quotations 3',
        content:
          'Loremsectetur adipiscing elit. Aliquam egestas viverra tortor, eu ullamcorper dui imperdiet nec. Nuncsed dolor at elit lobortis sodales.',
        signature: '- Lorem ipsum 3'
      }
    ];
    const imgContainer = document.querySelector('.carousel div.img');
    const wheels = document.querySelectorAll('.carousel i');

    const title = document.querySelector('.carousel .title');
    const content = document.querySelector('.carousel p.content');
    const signature = document.querySelector('.carousel p.signature');

    //console.log(title);
    //console.log(wheels[0]);
    let index = 3;
    imgContainer.style.backgroundImage = 'url("../../assets/pizza-3.jpg")';
    wheels[0].classList.add('active');

    title.innerText = quotations[0].title;
    content.innerText = quotations[0].content;
    signature.innerText = quotations[0].signature;

    setInterval(() => {
      imgContainer.style.backgroundImage = `url("../../assets/pizza-${index}.jpg")`;
      title.innerText = quotations[index - 3].title;
      content.innerText = quotations[index - 3].content;
      signature.innerText = quotations[index - 3].signature;
      for (let wheel of wheels) {
        wheel.classList.remove('active');
      }
      wheels[index - 3].classList.add('active');
      if (index === 5) index = 3;
      else index++;
    }, 3000);
  }
};

app.init();
