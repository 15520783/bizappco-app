import { LoadingController, Platform } from '@ionic/angular';
import { catchError, tap } from 'rxjs/operators';

import { BehaviorSubject } from 'rxjs';
import { ConfigService } from './config.service';
import { EventService } from './event.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { apiUrl } from '../commons/api';
import { of } from 'rxjs/internal/observable/of';

const TOKEN_KEY = ConfigService.access_token;
const FORGOT_PASSWORD_KEY = ConfigService.forgot_key;

export interface User {
    username?: string;
    approved?: string;
    avatar?: string;
    email?: string;
    group?: number;
    id?: string;
    is_logined?: boolean;
    m_id?: string;
    name?: string;
    phone?: string;
    role?: string;
    token?: string;
    level?: string;
    is_apple?: boolean;
}

@Injectable()
export class AuthProvider {
    user: User = null;
    authenticationState = new BehaviorSubject(false);
    loader: any;
    token: string = '';
    deviceID = '';

    constructor(
        private http: HttpClient,
        private helper: JwtHelperService,
        private storage: Storage,
        private plt: Platform,
        public loadingController: LoadingController,
        private oneSignal: OneSignal,
        public events: EventService,
        private configService: ConfigService
    ) {
        this.storage.get('DEVICE_ID').then(device_id => {
            this.deviceID = device_id;
            console.log('Device id', device_id);
        })
        this.events.subscribe('device_id', (device_id) => {
            this.deviceID = device_id;
        });
    }

    checkToken() {
        return this.storage.get(TOKEN_KEY).then(token => {
            let result: string = '';
            if (token) {
                this.token = token;
                let decoded = this.helper.decodeToken(token);
                let isExpired = this.helper.isTokenExpired(token);
                result = 'invalid';
                if (!isExpired) {
                    this.user = decoded.info;
                    this.authenticationState.next(true);
                    console.log('Token valid', decoded.info);
                    result = 'valid';
                }
            } else {
                result = 'not_found';
            }
            return result;
        });
    }

    getResetToken() {
        return this.storage.get(FORGOT_PASSWORD_KEY).then(token => {
            return token;
        });
    }

    async register(credentials) {
        credentials['device'] = await this.storage.get('DEVICE_ID');
        return this.http.post(apiUrl.register, credentials).pipe(
            tap(res => {
                if (res['err_code'] === '') {
                    this.storage.set(TOKEN_KEY, res['data']);
                    this.user = this.helper.decodeToken(res['data'].toString()).info;
                    this.authenticationState.next(true);
                    this.sendOnesignalData();
                }
                return res;
            }),
            catchError(e => {
                this.showAlert(e);
                return of(e);
            })
        ).toPromise();
    }

    forgotPassword(credentials) {
        this._setLoader();
        return this.http.post(apiUrl.forgotPassword, credentials).pipe(
            tap(res => {
                this._closeLoader();
                if (res['err_code'] === '') {
                    this.storage.set(FORGOT_PASSWORD_KEY, res['data']);
                }
                return res;
            }),
            catchError(e => {
                this.showAlert(e);
                throw e;
            })
        );
    }

    resetPassword(credentials) {
        this._setLoader();
        return this.http.post(apiUrl.resetPassword, credentials).pipe(
            tap(res => {
                this._closeLoader();
                if (res['err_code'] === '') {
                    this.storage.remove(FORGOT_PASSWORD_KEY);
                }
                return res;
            }),
            catchError(e => {
                this.showAlert(e);
                throw e;
            })
        );
    }

    async login(credentials) {
        credentials['device'] = this.deviceID;
        await this.configService.bizNetShowLoading();
        let res = await this.configService.postHttp(apiUrl.login, credentials, false);
        await this.configService.bizNetDissmissLoading();
        if (res['err_code'] === '') {
            if (res['data'] && res['data']['isOldUser']) {
                return res;
            } else {
                this.setUserInfo(res['data']);
                this.sendOnesignalData();
            }
        }
        return res;
    }

    checkUpdateGroup(token: string) {
        const user = this.helper.decodeToken(token).info;
        if (this.user && user['role'] != this.user['role']) {
            this.storage.set(TOKEN_KEY, token);
            this.user = user;
            this.events.publish('user:role', this.user);
        }
    }

    setUserInfo(token: string) {
        this.storage.set(TOKEN_KEY, token);
        this.user = this.helper.decodeToken(token).info;
        this.authenticationState.next(true);
        this.events.publish('user:login', this.user);
    }

    logout() {
        this.user = null;
        this.storage.remove(TOKEN_KEY).then(() => {
            this.authenticationState.next(false);
            this.events.publish('user:logout', Date.now());
        });
        this.events.publish('user:logout', Date.now());
    }

    getSpecialData() {
        return this.http.get(`${ConfigService.domain}/api/special`).pipe(
            catchError(e => {
                let status = e.status;
                if (status === 401) {
                    this.showAlert('You are not authorized for this!');
                    this.logout();
                }
                throw new Error(e);
            })
        )
    }

    isAuthenticated() {
        return this.authenticationState.value;
    }

    showAlert(msg) {
        console.log('Log message:', msg);
    }

    changePassword(credentials) {
        this._setLoader();
        return this.http.post(apiUrl.changePassword, credentials)
            .pipe(
                tap(res => {
                    this._closeLoader();
                    return res;
                }),
                catchError(e => {
                    this.showAlert(e);
                    throw e;
                })
            );
    }

    getUserInfo() {
        return this.user;
    }

    private _setLoader() {
        this.configService.bizNetShowLoading();
    }

    private _closeLoader() {
        this.configService.bizNetDissmissLoading();
    }

    renewToken() {
        return this.http.post(apiUrl.renewToken, { token: this.token }).pipe(
            tap(res => {
                if (res['err_code'] === '') {
                    this.setUserInfo(res['data']);
                } else {
                    this.storage.remove(TOKEN_KEY);
                }
                return res;
            }),
            catchError(e => {
                this.showAlert(e);
                throw e;
            })
        );
    }

    sendOnesignalData() {
        this.oneSignal.sendTags({
            user_id: this.user.id,
            user_type: this.user.role
        })
    }

    async getLoginToken() {
        return this.storage.get(TOKEN_KEY);
    }

}
