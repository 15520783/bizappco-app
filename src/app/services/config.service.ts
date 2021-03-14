import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoadingController, NavController, Platform } from '@ionic/angular';

import { HTTP } from '@ionic-native/http/ngx';
import { Injectable } from '@angular/core';
import { Siteinfo } from '../models/siteinfo';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { apiUrl } from '../commons/api';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public siteName: string = "Bizappco-app";
  static domain: string = 'https://biznet.com.vn';
  public appTheme = "default-theme";
  public darkMode = false;

  static access_token: 'biznet_access_token';
  static forgot_key: 'biznet_forgot_key'
  public onesignalId: 'c3f2fc0b-bc7a-4910-b061-5d75c796d91e';
  public firebaseId: '74496092437';
  public defaultLanguage: "vi"

  private loading: HTMLIonLoadingElement;

  static DEFAULT_TIMEOUT = 2000; //10 minutes
  static SITE_INFO = "site_info";
  private siteInfo: Siteinfo;

  constructor(
    private platform: Platform,
    private httpNative: HTTP,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private navCtrl: NavController,
    private translate: TranslateService,
  ) { }

  /**
   * Navigation forward to page
   * @author thaint
   * @param url 
   */
  public navigationForwardTo(url: string) {
    this.navCtrl.navigateForward(url);
  }

  /**
   * Get http request
   * @author thaint
   * 
   * @param endpoint 
   * @param params 
   */
  public getHttp(endpoint: string, params: any, showLoading?: boolean) {
    if (showLoading) {
      this.bizNetShowLoading();
    }
    return new Promise(resolve => {
      if (this.platform.is('cordova')) {
        const nativeHeaders = {
          // 'consumer-key': this.consumerKey,
          // 'consumer-secret': this.consumerSecret,
          // 'consumer-nonce': d.getTime().toString(),
          // 'consumer-device-id': '',
          // 'consumer-ip': '192.168.1.2',
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': '*',
        };
        this.httpNative.get(ConfigService.domain + endpoint, params, nativeHeaders)
          .then(data => {
            let d = JSON.parse(data.data);
            //this.storeHttpData(request, d);
            resolve(d);
            //console.log(data.data); // data received by server
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {
            if (showLoading) {
              this.bizNetDissmissLoading();
            }
          });
      }
      else {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(function (key) {
          httpParams = httpParams.append(key, params[key]);
        });
        const httpOptions = {
          headers: new HttpHeaders({
            // 'consumer-key': this.consumerKey,
            // 'consumer-secret': this.consumerSecret,
            // 'consumer-nonce': d.getTime().toString(),
            // 'consumer-device-id': '',
            // 'consumer-ip': '192.168.1.2',
            // 'Access-Control-Allow-Origin': '*',
          }),
          params: httpParams
        };
        this.http.get(ConfigService.domain + endpoint, httpOptions).subscribe((data: any) => {
          resolve(data);
        }, (err) => {
          console.log(err);
        }, () => {
          if (showLoading) {
            this.bizNetDissmissLoading();
          }
        });
      }
    });
  }

  /**
   * Post http request
   * 
   * @author thaint
   * @param req 
   * @param data 
   */
  public postHttp(endpoint: string, data: any, showLoading?: boolean) {
    if (showLoading) {
      this.bizNetShowLoading();
    }
    return new Promise(resolve => {
      if (this.platform.is('cordova')) {
        const nativeHeaders = {
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': '*',
          // 'consumer-key': this.consumerKey,
          // 'consumer-secret': this.consumerSecret,
          // 'consumer-nonce': d.getTime().toString(),
          // 'consumer-device-id': '',
          // 'consumer-ip': '192.168.1.2',
        };
        this.httpNative.setDataSerializer("json");
        this.httpNative.post(ConfigService.domain + endpoint, data, nativeHeaders)
          .then(data => {
            //console.log(data.data);
            let d = JSON.parse(data.data);
            //this.storeHttpData(request, d);
            resolve(d);
            //console.log(data.data); // data received by server
          })
          .catch(error => {
            // console.log(error);
          })
          .finally(() => {
            this.bizNetDissmissLoading();
          });
      }
      else {
        const httpOptions = {
          headers: new HttpHeaders({
            // 'consumer-key': this.consumerKey,
            // 'consumer-secret': this.consumerSecret,
            // 'consumer-nonce': d.getTime().toString(),
            // 'consumer-device-id': '',
            // 'consumer-ip': '192.168.1.2',
            // 'Access-Control-Allow-Origin': '*',
          })
        };
        this.http.post(ConfigService.domain + endpoint, data, httpOptions).subscribe((data: any) => {
          resolve(data);
        }, (err) => {
          console.log(err);
        }, () => {
          this.bizNetDissmissLoading();
        });
      }
    });
  }

  /**
   * Show loading
   * 
   */
  public async bizNetShowLoading(id?: string) {
    let elements = document.getElementsByClassName('bizNetShowLoading');
    if (elements.length === 0 && !this.loading) {
      this.loading = await this.loadingCtrl.create({
        spinner: "circles",
        keyboardClose: true,
        cssClass: 'bizNet-spinner',
        id: id,
        duration: ConfigService.DEFAULT_TIMEOUT,
      });
      await this.loading.present();
    }
  }

  /**
   * Dismiss loading
   * 
   */
  public async bizNetDissmissLoading(id?: string) {
    if (id) {
      await this.loadingCtrl.dismiss(null, null, id);
    } else {
      let elements = document.getElementsByClassName('bizNet-spinner');
      elements.length && this.loading
      await this.loading.dismiss();
    }
    this.loading = null;
  }

  /**
   * Init setting
   * 
   * @author thaint
   */
  public async initSetting() {
    await this.bizNetShowLoading();
    let data = await this.getSiteinfo();
    this.bizNetDissmissLoading();
    if (data && data['err_code'] === '') {
      this.storage.set('SITE_INFO', data['data']);
      this.siteInfo = new Siteinfo(data['data']);
      this.siteName = this.siteInfo.sitename;
    }
  }

  private getSiteinfo() {
    return this.getHttp(apiUrl.config, { type: ConfigService.SITE_INFO });
  }

  /**
 * Init translate i18n with default language
 */
  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang(this.defaultLanguage ? this.defaultLanguage : "vi");
    this.translate.use(this.defaultLanguage ? this.defaultLanguage : "vi"); // Set your language here
  }
}
