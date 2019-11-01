import { select } from '../settings.js';
import ArtsWidget from './ArtsWidget.js';

class CartProduct {
  constructor(menuProduct, element) {
    const thisCartProduct = this;
    //console.log(menuProduct);
    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.params = JSON.parse(JSON.stringify(menuProduct.params));
    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
    //console.log(thisCartProduct);
  }

  getElements(element) {
    const thisCartProduct = this;
    //console.log(element);
    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element;
    //console.log(thisCartProduct.dom.wrapper);
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(
      select.cartProduct.amountWidget
    );
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(
      select.cartProduct.price
    );
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(
      select.cartProduct.edit
    );
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(
      select.cartProduct.remove
    );
  }

  initAmountWidget() {
    const thisCartProduct = this;
    //console.log(thisCartProduct.dom.amountWidget);

    thisCartProduct.amountWidget = new ArtsWidget(
      thisCartProduct.dom.amountWidget
    );
    //console.log(thisCartProduct.amountWidget.dom.wrapper);
    thisCartProduct.amountWidget.dom.wrapper.addEventListener(
      'updated',
      function() {
        //console.log(thisCartProduct.dom.price.innerT);
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price =
          thisCartProduct.priceSingle * thisCartProduct.amount;
        thisCartProduct.dom.price.innerText = thisCartProduct.price;
      }
    );
  }

  remove() {
    const thisCartProduct = this;
    //console.log('usuwam')
    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct
      }
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  initActions() {
    const thisCartProduct = this;

    thisCartProduct.dom.edit.addEventListener('click', function(e) {
      e.preventDefault();
    });

    thisCartProduct.dom.remove.addEventListener('click', function(e) {
      e.preventDefault();
      thisCartProduct.remove();
    });
  }

  getData() {
    // console.log('działa')
    const thisCartProduct = this;
    const data = {
      id: thisCartProduct.id,
      amount: thisCartProduct.amount,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      params: thisCartProduct.params
    };

    return data;
  }
}

export default CartProduct;
