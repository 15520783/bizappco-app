import { Category } from './category';

export class BannerInfo {
    category: Category;
    items: {
        alias: string;
        attachments: Object[]
        author: {
            name: string;
            link: string;
            avatar: string;
            profile: {
                gender: string;
            }
        }
        category: Category;
        catid: string;
        created: string
        created_by_alias: string;
        extra_fields: null
        featured: string;
        fulltext: string;
        gallery: string;
        hits: string;
        id: string;
        image: string;
        imageLarge: string;
        imageMedium: string;
        imageSmall: string;
        imageWidth: string;
        imageXLarge: string;
        imageXSmall: string;
        image_caption: string;
        image_credits: string;
        introtext: string;
        language: string;
        link: string;
        modified: string;
        numOfComments: string;
        numOfvotes: string;
        tags: Object[]
        title: string;
        video: string;
        video_caption: string;
        video_credits: string;
        votingPercentage: number;
    };
    site: {
        url: string;
        name: string;
    }

    constructor(item: Object) {
        Object.keys(item).forEach((prop) => {
            this[prop] = item[prop]
        });
    }
}