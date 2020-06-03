export default class User {
    id: number;
    name: string;
    avatar: string;
    point: number;
    orderCount: number;

    constructor(props: {
        id: number;
        name: string;
        avatar: string;
        point: number;
        orderCount: number;
    }) {
        this.id = props.id;
        this.name = props.name;
        this.avatar = props.avatar;
        this.point = props.point;
        this.orderCount = props.orderCount;
    }
}