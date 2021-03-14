export interface MenuItem {
    title: string;
    imgUrl: string;
    handler?: () => void;
    role?: number[];
    excludeApple?: boolean;
    isPermission?: boolean
};