export class Siteinfo {
    public email: string;
    public phone: string;
    public sitename: string;
    public faq: number = 0;
    public support: number = 0;
    public viewed_type: string = 'grid';
    public show_wishlist: boolean = false;


    constructor(item: Object) {
        Object.keys(item).forEach((prop) => {
            this[prop] = item[prop]
        });
    }
}
