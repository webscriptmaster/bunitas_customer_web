/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceCartService {

  public serviceCart: any[] = [];
  public serviceItemId: any[] = [];
  public packagesCart: any[] = [];
  public packageItemId: any[] = [];
  public totalItemInCart = 0;
  public totalPrice: any = 0;
  public grandTotal: any = 0;
  public coupon: any;
  public serviceTax: any = 0;
  public discount: any = 0;
  public orderTax: any = 0;
  public orderPrice: any;
  public minOrderPrice: any = 0;
  public freeShipping: any = 0;
  public datetime: any;
  public deliveredAddress: any;

  public shippingMethod: 0;
  public shippingPrice: 0;
  public deliveryCharge: any = 0.0;

  public deliveryPrice: any = 0;
  public stores: any[] = [];
  public totalItem: any;
  public bulkOrder: any[] = [];
  public flatTax: any;
  public cartStoreInfo: any;

  public havePayment: boolean;
  public haveStripe: boolean;
  public haveRazor: boolean;
  public haveCOD: boolean;
  public havePayPal: boolean;
  public havePayTM: boolean;
  public havePayStack: boolean;
  public haveFlutterwave: boolean;

  public walletDiscount: any = 0.0;
  fromService: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.util.getKeys('userCart').then((data: any) => {
      if (data && data !== null && data !== 'null') {
        const cart = JSON.parse(data);
        if (cart && cart.services.length > 0) {
          this.serviceCart = cart.services;
          this.serviceItemId = [...new Set(this.serviceCart.map(item => item.id))];

          this.calcuate();
        } else {
          this.calcuate();
        }

        if (cart && cart.packages.length > 0) {
          this.packagesCart = cart.packages;
          this.packageItemId = [...new Set(this.packagesCart.map(item => item.id))];

          this.calcuate();
        } else {
          this.calcuate();
        }
      } else {
        this.calcuate();
      }
    });
    this.fromService = localStorage.getItem('fromService');
  }


  calcuate() {
    let total = 0;
    this.serviceCart.forEach(element => {
      if (element.discount > 0) {
        total = total + element.off;
      } else {
        total = total + element.price;
      }
    });
    this.packagesCart.forEach((element) => {
      if (element.discount > 0) {
        total = total + element.off;
      } else {
        total = total + element.price;
      }
    });
    this.totalItemInCart = this.serviceCart.length + this.packagesCart.length;
    this.totalPrice = total;
    // AKHAND
    localStorage.removeItem('userCart');
    const items = {
      "services": this.serviceCart,
      "packages": this.packagesCart
    };
    localStorage.setItem('userCart', JSON.stringify(items));
    this.util.clearKeys('userCart');
    this.util.setKeys('userCart', JSON.stringify(items));
    localStorage.setItem('fromService', this.fromService);
    // AKHAND
    this.totalPrice = parseFloat(this.totalPrice).toFixed(1);
    this.orderTax = parseFloat(this.orderTax).toFixed(1);
    this.discount = parseFloat(this.discount).toFixed(1);

    this.calculateAllCharges();
  }

  addItem(item: any, from: any) {
    this.serviceCart.push(item);
    this.serviceItemId.push(item.id);
    this.fromService = from;
    this.calcuate();
  }

  getPackageFreelancerId() {
    if (this.packagesCart.length > 0) {
      return this.packagesCart[0].uid
    }
    return 0;
  }

  getServiceFreelancerId() {
    if (this.serviceCart.length > 0) {
      return this.serviceCart[0].uid;
    }
    return 0;
  }

  removeItem(id: any) {
    this.serviceCart = this.serviceCart.filter(x => x.id !== id);
    this.serviceItemId = this.serviceItemId.filter(x => x !== id);

    this.calcuate();
  }

  addPackage(item: any, from: any) {
    this.packagesCart.push(item);
    this.packageItemId.push(item.id);
    this.fromService = from;
    this.calcuate();
  }

  removePackage(id: any) {
    this.packagesCart = this.packagesCart.filter(x => x.id != id);
    this.packageItemId = this.packageItemId.filter(x => x != id);
    this.calcuate();
  }

  calculateAllCharges() {

    let total = parseFloat(this.totalPrice) + parseFloat(this.orderTax.toString()) + parseFloat(this.deliveryCharge);

    if (this.coupon && this.coupon.discount && this.coupon.discount > 0) {
      function percentage(numFirst: any, per: any) {
        return (numFirst / 100) * per;
      }
      this.discount = percentage(this.totalPrice, this.coupon.discount);
      this.discount = parseFloat(this.discount).toFixed(1);
      if (total <= this.discount) {
        this.discount = this.totalPrice;
        total = total - this.discount;
      } else {
        total = total - this.discount;
      }
    }


    this.grandTotal = total;
    let totalPrice = parseFloat(this.totalPrice) + parseFloat(this.orderTax) + parseFloat(this.deliveryCharge);
    this.grandTotal = totalPrice;
    this.grandTotal = totalPrice - this.discount;
    this.grandTotal = parseFloat(this.grandTotal).toFixed(2);
    if (this.grandTotal <= this.walletDiscount) {
      this.walletDiscount = this.grandTotal;
      this.grandTotal = this.grandTotal - this.walletDiscount;
    } else {
      this.grandTotal = this.grandTotal - this.walletDiscount;
    }
    this.grandTotal = parseFloat(this.grandTotal).toFixed(2);
  }

  clearCart() {
    this.serviceCart = [];
    this.serviceItemId = [];
    this.packagesCart = [];
    this.packageItemId = [];
    this.totalItemInCart = 0;
    this.totalPrice = 0;
    this.grandTotal = 0;
    this.coupon = undefined;
    this.discount = 0;
    this.orderPrice = 0;
    this.datetime = undefined;
    this.stores = [];
    this.util.clearKeys('userCart');
    this.totalItem = 0;
    this.deliveryCharge = 0;
    this.deliveredAddress = null;
  }
}
