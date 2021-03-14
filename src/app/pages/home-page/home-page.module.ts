import { BannerComponent } from './banner/banner.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderToolBoxComponent } from './header-tool-box/header-tool-box.component';
import { HomePage } from './home-page.page';
import { HomePagePageRoutingModule } from './home-page-routing.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePagePageRoutingModule,
    ShareModule
  ],
  declarations: [HomePage, HeaderToolBoxComponent, BannerComponent]
})
export class HomePageModule { }
