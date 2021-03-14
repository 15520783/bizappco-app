import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PermissionComponent } from '../components/permission/permission';

@NgModule({
  declarations: [
    PermissionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PermissionComponent
  ]
})
export class ShareModule { }
