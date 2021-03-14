import { BannerInfo } from './bannerInfo';
import { Category } from './category';

export class HomeData {
    categories: Category[];
    knowlegde: BannerInfo;
    news: BannerInfo;
    preferred: BannerInfo;
    modules: Object;
    slide: {
        id: string;
        page: string;
        thumb: string;
        title: string;
    }[];

    constructor(item: Object) {
        Object.keys(item).forEach((prop) => {
            this[prop] = item[prop]
        });
    }
}