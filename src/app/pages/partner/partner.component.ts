/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-contact',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {

  contact = {
    name: '',
    email: '',
    message: '',
    status: '0',
    date: moment().format('YYYY-MM-DD')
  };
  constructor(
    public util: UtilService,
    public api: ApiService,
    public appComponent: AppComponent,
  ) {
  }

  ngOnInit(): void {
  }
  submit() {
    if (this.contact.name == '' || this.contact.email == '' || this.contact.message == '') {
      this.util.errorMessage(this.util.translate('all fields are required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.contact.email)) {
      this.util.errorMessage(this.util.translate('Please enter valid email'));
      return false;
    }
    this.util.start();
    this.api.post('v1/contacts/create', this.contact).then((data: any) => {
      this.util.stop();
      if (data && data.status && data.status == 200 && data.data) {
        const param = {
          id: data.data.id,
          mediaURL: this.api.mediaURL,
          subject: this.util.translate('New Mail Request Received'),
          thank_you_text: this.util.translate('You have received new mail'),
          header_text: this.util.translate('New Contact Details'),
          email: this.util.general.email,
          from_mail: this.contact.email,
          from_username: this.contact.name,
          from_message: this.contact.message,
          to_respond: this.util.translate('We have received your request, we will respond on your issue soon')
        };
        this.api.post('v1/sendMailToAdmin', param).then((data: any) => {
        }, error => {
        });
        this.contact.email = '';
        this.contact.name = '';
        this.contact.message = '';
        if (data && data.status == 200) {
          this.success();
        } else {
          this.util.errorMessage(this.util.translate('Something went wrong'));
        }
      }
    }, error => {
      this.util.stop();
      this.util.errorMessage(this.util.translate('Something went wrong'));
    });
  }

  success() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'success',
      title: this.util.translate('message sent successfully')
    });
  }


}
