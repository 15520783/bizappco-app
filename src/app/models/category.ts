export class Category {
    access: string;
    description: string;
    extraFieldsGroup: string;
    alias: string;
    children: Category[];
    category_name: string;
    category_parent_id: string;
    child: string;
    id: string;
    img_ori: string;
    page: string
    thumb: string;
    image: string;
    language: string;
    link: string;
    name: string;
    numOfItems: string;
    ordering: string;
    params: string;
    parent: string
    plugins: string;
    published: string;
    trash: string;
    events: { K2CategoryDisplay: string; }

    constructor(item: Object) {
        Object.keys(item).forEach((prop) => {
            this[prop] = item[prop]
        });
    }
}