import { Component, Input } from '@angular/core';

import { AuthProvider } from 'src/app/services/auth';
import { GROUP } from 'src/app/commons/const';

@Component({
  selector: 'permission',
  templateUrl: 'permission.html'
})
export class PermissionComponent {

  public visible: boolean;
  @Input() public groups: number[];
  @Input() public allowAppleId: boolean;

  constructor(
    private auth: AuthProvider
  ) {

  }

  get isLogin() {
    return this.auth.getUserInfo() && this.auth.getUserInfo().id;
  }

  get getGroup() {
    try {
      let group = this.auth.getUserInfo().group;
      return group;
    } catch (err) {
      return null;
    }
  }

  get isAppleUser() {
    try {
      let isApple = this.auth.getUserInfo().is_apple;
      return isApple;
    } catch (err) {
      return false;
    }
  }

  get isAllowPermission() {
    if (this.groups && this.groups.length) {
      return this.groups.includes(this.getGroup);
    } else
      return this.auth.getUserInfo() && this.auth.getUserInfo().group == GROUP.AGENCY;
  }

  get isAllowAppleId() {
    if (this.allowAppleId) {
      return true;
    } else {
      if (this.isAppleUser) {
        return false;
      } else {
        return true;
      }
    }
  }
}
