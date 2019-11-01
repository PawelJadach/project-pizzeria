import utils from '../utils.js';
import { select, classNames, templates } from '../settings.js';
import AmountWidget from '../components/ArtsWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    this.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    //console.log('new Product: ', this);
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
    thisProduct.accordionTrigger = thisProduct.element.querySelector(
      select.menuProduct.clickable
    );
    thisProduct.form = thisProduct.element.querySelector(
      select.menuProduct.form
    );
    thisProduct.formInputs = thisProduct.form.querySelectorAll(
      select.all.formInputs
    );
    thisProduct.cardButton = thisProduct.element.querySelector(
      select.menuProduct.cartButton
    );
    thisProduct.priceElem = thisProduct.element.querySelector(
      select.menuProduct.priceElem
    );
    thisProduct.imageWrapper = thisProduct.element.querySelector(
      select.menuProduct.imageWrapper
    );
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(
      select.menuProduct.amountWidget
    );
  }

  initAccordion() {
    const thisProduct = this;
    const button = thisProduct.accordionTrigger;
    button.addEventListener('click', function(e) {
      e.preventDefault();
      // console.log('accordionTrigger ', thisProduct.accordionTrigger);
      // console.log('form ', thisProduct.form);
      // console.log('formInputs', thisProduct.formInputs);
      // console.log('carButton', thisProduct.cardButton);
      // console.log('priceElem', thisProduct.priceElem);
      thisProduct.element.classList.toggle('active');
      const allActiveProducts = document.querySelectorAll(
        select.all.menuProductsActive
      );
      //console.log(allActiveProducts);
      for (let activeProduct of allActiveProducts) {
        if (!(thisProduct.element == activeProduct)) {
          activeProduct.classList.remove('active');
        }
      }
    });
  }

  initOrderForm() {
    const thisProduct = this;
    //console.log('initOrderForm');
    thisProduct.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function() {
        thisProduct.processOrder();
      });
    }

    thisProduct.cardButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;
    thisProduct.params = {};
    let price = thisProduct.data.price;
    const formData = utils.serializeFormToObject(thisProduct.form);

    const params = thisProduct.data.params;

    for (let paramId in params) {
      const param = params[paramId];

      for (let optionId in param.options) {
        const option = param.options[optionId];
        /* eslint-disable */
        const optionSelected =
          formData.hasOwnProperty(paramId) &&
          formData[paramId].indexOf(optionId) > -1;
        //console.log(option);
        if (optionSelected && !option.default) {
          price += option.price;
        } else if (!optionSelected && option.default) {
          price -= option.price;
        }

        const images = thisProduct.imageWrapper.querySelectorAll(
          '.' + paramId + '-' + optionId
        );

        for (let image of images) {
          if (optionSelected) {
            if (!thisProduct.params[paramId]) {
              thisProduct.params[paramId] = {
                label: param.label,
                options: {}
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label;
            image.classList.add(classNames.menuProduct.imageVisible);
          } else {
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }

    /* multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price =
      thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
  }

  initAmountWidget() {
    const thisProduct = this;
    //console.log(thisProduct)
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
    });
  }

  addToCart() {
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct
      }
    });

    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;
