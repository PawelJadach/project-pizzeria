import {settings, select, classNames, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element){
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.initActions();
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    //console.log('new Cart', thisCart);
  }

  getElements(element){
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);

    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
  }

  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    //console.log(thisCart.dom.productList)
    thisCart.dom.productList.addEventListener('updated', function(){
      //console.log('działa')
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function(e){
      //console.log('działa')
      thisCart.remove(e.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(e){
      e.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder(){
    const url = settings.db.url + '/' + settings.db.order;
    const thisCart = this;
    const payload = {
      address: thisCart.dom.address.value,
      phone: thisCart.dom.phone.value,
      totalPrice: thisCart.totalPrice,
      totalnumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    for(let product of thisCart.products){
      payload.products.push(product.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(res => {
        return res.json();
      })
      .then(parsedRes => console.log(parsedRes));
  }

  add(menuProduct){
    const thisCart = this; 
      
    //console.log('adding product', menuProduct);
    const generatedHTML = templates.cartProduct(menuProduct);
    // console.log(this);
    thisCart.element = utils.createDOMFromHTML(generatedHTML);
    thisCart.products.push(new CartProduct(menuProduct, thisCart.element));
    //console.log(thisCart.dom.productList)
    const cartContainer = document.querySelector(select.cart.productList);
      
    cartContainer.appendChild(thisCart.element);
    this.update();
  }

  update(){
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for(let product of thisCart.products){
       
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }
    if(!thisCart.totalNumber) thisCart.totalPrice = 0;
    else thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
      
    for(let key of thisCart.renderTotalsKeys){
      for(let elem of thisCart.dom[key]){
        //console.log(thisCart);
        elem.innerHTML = thisCart[key];
      }
    }
  }

  remove(cartProduct){
    const thisCart = this;
    // console.log(cartProduct)
    const index = thisCart.products.indexOf(cartProduct);
    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove();
      
    thisCart.update();
  }
}


export default Cart;