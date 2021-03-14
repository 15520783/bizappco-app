import { RouterModule, Routes } from '@angular/router';

import { HomePage } from './home-page.page';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePagePageRoutingModule {}
