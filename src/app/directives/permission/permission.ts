import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { AuthProvider } from 'src/app/services/auth';
import { EventService } from 'src/app/services/event.service';
import { GROUP } from 'src/app/commons/const';

@Directive({
  selector: '[permission]' // Attribute selector
})
export class PermissionDirective {
  @Input() public groups: number[];
  @Input() public allowAppleId: boolean;

  constructor(
    private auth: AuthProvider,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private event: EventService,
  ) {
    this.event.subscribe('user:login', () => {
      this.updateView();
    });
    this.event.subscribe('user:logout', () => {
      this.updateView();
    })
  }

  get isLogin() {
    return (this.auth.getUserInfo() && this.auth.getUserInfo().id) ? true : false;
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

  @Input()
  set permission(val) {
    this.groups = val;
    this.updateView();
  }

  private async updateView() {
    if (this.isLogin && this.isAllowPermission && this.isAllowAppleId) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
