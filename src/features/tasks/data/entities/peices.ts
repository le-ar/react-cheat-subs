export default class Prices {
    like: number;
    subscribeGroup: number;
    subscribeUser: number;

    constructor(props: {
        like: number;
        subscribeGroup: number;
        subscribeUser: number;
    }) {
        this.like = props.like;
        this.subscribeGroup = props.subscribeGroup;
        this.subscribeUser = props.subscribeUser;
    }
}