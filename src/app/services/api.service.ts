/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Bunitas Salon Full App Flutter
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2022-present initappz.
*/
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl: any = '';
  mediaURL: any = '';
  default_country_code: any = '91';
  confirmationResult: firebase.default.auth.ConfirmationResult;
  constructor(
    private http: HttpClient,
  ) {
    this.baseUrl = environment.baseURL;
    this.mediaURL = environment.mediaURL;
    this.default_country_code = environment.default_country_code;
  }

  public signInWithPhoneNumber(recaptchaVerifier, phoneNumber) {
    return new Promise<any>((resolve, reject) => {

      firebase.default.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          this.confirmationResult = confirmationResult;
          resolve(confirmationResult);
        }).catch((error) => {
          reject('SMS not sent');
        });
    });
  }

  public async enterVerificationCode(code) {
    return new Promise<any>((resolve, reject) => {
      this.confirmationResult.confirm(code).then(async (result) => {
        const user = result.user;
        resolve(user);
      }).catch((error) => {
        reject(error.message);
      });

    });
  }

  alerts(title, message, type) {
    Swal.fire(
      title,
      message,
      type
    );
  }

  uploadFile(files: File[]) {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('image', f));
    return this.http.post(this.baseUrl + 'v1/' + 'uploadImage', formData)
  }



  sendNotification(msg, title, id) {
    const body = {
      // app_id: environment.onesignal.appId,
      include_player_ids: [id],
      headings: { en: title },
      contents: { en: msg },
      data: { task: msg }
    };
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
      // .set('Authorization', `Basic ${environment.onesignal.restKey}`)
    };
    return this.http.post('https://onesignal.com/api/v1/notifications', body, header);
  }

  JSON_to_URLEncoded(element, key?, list?) {
    let new_list = list || [];
    if (typeof element == 'object') {
      for (let idx in element) {
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + '[' + idx + ']' : idx,
          new_list
        );
      }
    } else {
      new_list.push(key + '=' + encodeURIComponent(element));
    }
    return new_list.join('&');
  }

  public post(url, body): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      const param = this.JSON_to_URLEncoded(body);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
    });
  }

  public post_temp(url, body, temp): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${temp}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
    });
  }

  public get(url): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
    });
  }

  public externalGet(url): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get(url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
    });
  }

  public getExternal(url: any) {
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(res => {
        resolve(res);
      }, error => {
        reject(error);
      });
    });
  }

  public postExternal(url, body): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      const param = this.JSON_to_URLEncoded(body);
      this.http.post(url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        resolve(error);
      });
    });
  }

  public post_private(url, body): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
      // return this.http.post(this.baseUrl + url, param, header);
    });
  }

  public post_token(url, body, token): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${token}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public get_private(url): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  httpGet(url, key) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${key}`)
    };

    return this.http.get(url, header);
  }

  externalPost(url, body, key) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${key}`)
    };
    const order = this.JSON_to_URLEncoded(body);
    return this.http.post(url, order, header);
  }

  public getLocalAssets(name: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get('assets/json/' + name, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public getLatLngFromPostcode(postcode: string): Observable<any> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=${environment.googleMapsKeys}`;

    return this.http.get(url);
  }

  getImageFromLatLng(lat: number, lng: number) {
    const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${environment.googleMapsKeys}`;

    let res = this.http.get(staticMapUrl, { responseType: 'blob' });
    let blob = new Blob([res['_body']], {type: 'image/png'});
    return blob;
  }
}
