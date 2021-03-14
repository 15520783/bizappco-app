import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';

export interface Banners { imgUrl: string, title: string, subtitle: string, id: string };


@Component({
  selector: 'banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {

  @Input() title: string;
  @Input() isLoading: boolean = false;
  @Input() public banners: Banners[];
  @Input() id;
  @Input() catId;
  @ViewChild('slides') slides: IonSlides;

  slideOpts = {
    freeMode: true,
    slidesPerView: "auto",
    freeModeMinimumVelocity:0.08,
    freeModeSticky:true
  };

  constructor(
    public navCtrl: NavController
  ) {
  }
  ngOnInit(): void {
  }

  async ngAfterViewInit() {
    let swiper = await this.slides.getSwiper();
    swiper.freeMode = true;
    swiper.slidesPerView = "auto";
    swiper._supportTouch = true;
  }

  redirect(id: string) {
    // this.navCtrl.push("NewsDetailPage", { page: { id: id } });
  }

  watchMore() {
    if (this.id) {
      // this.navCtrl.push("NewsPage", { id: this.id, title: this.title });
    } else if (this.catId) {
      // this.navCtrl.push("InsurancePage", { catId: this.catId, title: this.title });
    }
  }
}
