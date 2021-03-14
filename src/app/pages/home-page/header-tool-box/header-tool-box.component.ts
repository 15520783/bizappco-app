import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header-tool-box',
  templateUrl: './header-tool-box.component.html',
  styleUrls: ['./header-tool-box.component.scss'],
})
export class HeaderToolBoxComponent implements OnInit {

  constructor(
    navCtrl: NavController
  ) { }

  ngOnInit() { }

  public items: { imgUrl: string, title: string, handle(): void }[] = [
    {
      imgUrl: "../../assets/imgs/home-icon/barcode.png",
      title: "Tích điểm",
      handle: () => {
        // this.navCtrl.push("NewsDetailPage", { page: { id: 168 } });
      }
    },
    {
      imgUrl: "../../assets/imgs/home-icon/bar-code.png",
      title: "Ưu đãi",
      handle: () => {
        // this.navCtrl.push("NewsPage", { id: 105, title: "Ưu đãi" });
      }
    },
    {
      imgUrl: "../../assets/imgs/home-icon/email.png",
      title: "Liên hệ",
      handle: () => {
        // this.navCtrl.push("NewsDetailPage", { page: { id: 169 } });
      }
    }
  ];

  goToCategoryPage() {
    // this.pageAnimation('curl', 'left');
    // this.navCtrl.push(CategoriesPage);
  }
}
