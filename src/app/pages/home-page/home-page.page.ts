import { Component, OnInit } from '@angular/core';
import { IonApp, NavController, Platform } from '@ionic/angular';

import { AuthProvider } from 'src/app/services/auth';
import { BannerHomePage } from 'src/app/models/bannerHomePage';
import { ConfigService } from 'src/app/services/config.service';
import { HomeData } from 'src/app/models/homeData';
import { MenuItem } from 'src/app/models/menuItem';
import { apiUrl } from 'src/app/commons/api';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})

export class HomePage implements OnInit {

  public slideNews: { imgUrl: string }[] = [];
  public menu: MenuItem[] = [];
  public isLoading: boolean = false;
  public banner_slide1 = [];
  public banner_slide2 = [];
  public banner_slide3 = [];
  public banners: BannerHomePage[];

  public slideOpts = {
    paginationType:"bullets",
    autoHeight:true,
    centeredSlides:false,
    pager:true,
    autoplay:3000,
    loop:false,
    speed:500
  }

  constructor(
    private navCtrl: NavController,
    private authService: AuthProvider,
    public app: IonApp,
    public platform: Platform,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    let data = await this.configService.getHttp(apiUrl.home, {}, false);
    if (data && data['err_code'] === '') {
      let homeDate = new HomeData(data['data']);
      if ('slide' in homeDate) {
        this.slideNews = homeDate.slide.map((item) => {
          return {
            imgUrl: item.thumb
          }
        });
      }
      if ('preferred' in data['data']) {
        if (data['data']['preferred'] && data['data']['preferred']['items'].length) {
          this.banner_slide1 = data['data']['preferred']['items'].map(item => {
            return {
              imgUrl: item.image ? `${ConfigService.domain}${item.image}` : '../../assets/imgs/photo.png',
              title: item.title,
              subtitle: item.created,
              id: item.id
            }
          })
        }
      }
      if ('news' in data['data']) {
        if (data['data']['news'] && data['data']['news']['items'].length) {
          this.banner_slide2 = data['data']['news']['items'].map(item => {
            return {
              imgUrl: item.image ? `${ConfigService.domain}${item.image}` : '../../assets/imgs/photo.png',
              title: item.title,
              subtitle: item.created,
              id: item.id
            }
          })
        }
      }
      if ('knowlegde' in data['data']) {
        if (data['data']['knowlegde'] && data['data']['knowlegde']['items'].length) {
          this.banner_slide3 = data['data']['knowlegde']['items'].map(item => {
            return {
              imgUrl: item.image ? `${ConfigService.domain}${item.image}` : '../../assets/imgs/photo.png',
              title: item.title,
              subtitle: item.created,
              id: item.id
            }
          })
        }
      }

      this.banners = [
        {
          title: "Ưu đãi",
          banners: this.banner_slide1,
          id: 105,
          role: [2, 3],
        }, {
          title: "Tin tức",
          banners: this.banner_slide2,
          id: 104,
          role: [2, 3]
        }, {
          title: "Kiến thức",
          banners: this.banner_slide3,
          catId: 89,
          role: [3],
          isPermission: true
        }
      ]
      this.isLoading = false;
    }
  }

  ionViewWillEnter() {
    this.menu.length = 0;
    this.menu = [
      {
        title: "Bảo hiểm",
        imgUrl: "../../assets/imgs/home-icon/insurance.png",
        handler: () => {
          //this.navCtrl.push("InsurancePage", { catId: 8, title: "Bảo hiểm" });
        },
        excludeApple: true,
        isPermission: true
      },
      {
        title: "Mua sắm",
        imgUrl: "../../assets/imgs/home-icon/supermarket.png",
        handler: () => {
          //this.navCtrl.push(CategoriesPage);
        }
      },
      {
        title: "Yêu cầu<br>tư vấn",
        imgUrl: "../../assets/imgs/home-icon/support-24h.png",
        handler: () => {
          if (this.isLogined) {
            //this.navCtrl.push("InquiryRequestPage");
          } else {
            //this.navCtrl.push("LoginPage");
          }
        },
        role: [2],
        isPermission: true
      },
      {
        title: "Tin tức",
        imgUrl: "../../assets/imgs/home-icon/feedback.png",
        handler: () => {
          //this.navCtrl.push("NewsPage", { id: 104, title: "Tin tức" });
        }
      },
      {
        title: "Thông báo",
        imgUrl: "../../assets/imgs/home-icon/speaker.png",
        handler: () => {
          // this.navCtrl.push("NotifyPage");
          this.configService.navigationForwardTo("/news");
        }
      },
      {
        title: "Kiến thức<br>bảo hiểm",
        imgUrl: "../../assets/imgs/home-icon/health-insurance.png",
        handler: () => {
          //this.navCtrl.push("InsurancePage", { catId: 89, title: "Kiến thức bảo hiểm" });
        },
        excludeApple: true,
        isPermission: true
      },
      {
        title: "Cơ hội<br>kinh doanh",
        imgUrl: "../../assets/imgs/home-icon/success.png",
        handler: () => {
          //this.navCtrl.push("NewsDetailPage", { page: { id: 33 } });
        }
      },
      {
        title: "Trung tâm<br>hỏi đáp",
        imgUrl: "../../assets/imgs/home-icon/support.png",
        handler: () => {
          //this.navCtrl.push("InsurancePage", { catId: 89, title: "Trung tâm hỏi đáp" });
        },
        isPermission: true,
        role: [2, 3],
      },
      {
        title: "Giới thiệu",
        imgUrl: "../../assets/imgs/home-icon/info.png",
        handler: () => {
          if (!this.isLogined || this._isAppleUser) {
            //this.navCtrl.push("NewsDetailPage", { page: { id: 176, title: "Giới thiệu" } });
          } else {
            //this.navCtrl.push("NewsDetailPage", { page: { id: 4, title: "Giới thiệu" } });
          }
        }
      },
      {
        title: "Tài khoản",
        imgUrl: "../../assets/imgs/home-icon/account.png",
        handler: () => {
          this.goToAccountPage();

        },
        role: [2, 3]
      },

      {
        title: "Đơn hàng",
        imgUrl: "../../assets/imgs/home-icon/order.png",
        handler: () => {
          if (this.isLogined) {
            //this.navCtrl.push("ShopOrderPage");
          } else {
            //this.navCtrl.push("LoginPage");
          }
        },
        role: [2, 3],
      },
      {
        title: "Affiliate",
        imgUrl: "../../assets/imgs/home-icon/affiliate.png",
        handler: () => {
          //this.navCtrl.push("NewsDetailPage", { page: { id: 170, title: "Chương trình Affiliate" } });
        },
        role: [2, 3],
        excludeApple: true,
        isPermission: true
      },
      {
        title: "DataCenter<br>là gì?",
        imgUrl: "../../assets/imgs/home-icon/database.png",
        handler: () => {
          //this.navCtrl.push("NewsDetailPage", { page: { id: 157, title: "DataCenter là gì?" } });
        },
        role: [3],
        excludeApple: true,
        isPermission: true
      },
      {
        title: "Dự án",
        imgUrl: "../../assets/imgs/home-icon/project.png",
        handler: () => {
          //this.navCtrl.push('ProjectPage');
        },
        excludeApple: true,
        isPermission: true
      },
      {
        title: "Khách hàng",
        imgUrl: "../../assets/imgs/home-icon/customer.png",
        handler: () => {
          //this.navCtrl.push('CustomerPage');
        },
        excludeApple: true,
        isPermission: true
      },
      {
        title: "Thống kê",
        imgUrl: "../../assets/imgs/home-icon/Statistical.png",
        handler: () => {
          if (!this.isLogined || this._isAppleUser) {
            //this.navCtrl.push("ReportPage");
          } else {
            //this.navCtrl.push("ReportPage");
          }
        },
        role: [3],
        excludeApple: true,
        isPermission: true
      },
      {
        title: "Tuyến dưới",
        imgUrl: "../../assets/imgs/home-icon/twoprofile.png",
        handler: () => {
          if (!this.isLogined || this._isAppleUser) {
            //this.navCtrl.push("MembersPage");
          } else {
            //this.navCtrl.push("MembersPage");
          }
        },
        role: [3],
        excludeApple: true,
        isPermission: true
      },
      {
        title: `<span class="landingpage-title">Landingpage</span>`,
        imgUrl: "../../assets/imgs/home-icon/registers.png",
        handler: () => {
          //this.navCtrl.push("SubscribersPage");
        },
        role: [3],
        excludeApple: true,
        isPermission: true
      },
      {
        title: `Yêu cầu tư vấn`,
        imgUrl: "../../assets/imgs/home-icon/headphones.png",
        handler: () => {
          //this.navCtrl.push("RequestPackageListPage");
        },
        role: [2],
        excludeApple: true,
        isPermission: true
      }
    ];
  }

  get isLogined() {
    return this.authService.getUserInfo() && this.authService.getUserInfo().id;
  }

  get _isAppleUser() {
    return this.authService.getUserInfo() && this.authService.getUserInfo().is_apple;
  }

  get username() {
    return this.authService.user ? this.authService.user.name : null;
  }

  goToAccountPage() {
    // const tabsNav = this.app.getNavByIdOrName('biznetTab') as Tabs;
    // tabsNav.select(4);
  }


  doRefresh(e) {
    setTimeout(async () => {
      this.isLoading=true;
      await this.loadData();
      this.isLoading = false;
      e.target.complete();
    }, 1000);
  }

}
