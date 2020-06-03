export type TaskResourceType = 'photo' | 'note' | 'user' | 'group';

export default class Task {
    id: number;
    resourceType: TaskResourceType;
    price: number;
    url: string;

    constructor(props: {
        id: number;
        resourceType: TaskResourceType;
        price: number;
        url: string;
    }) {
        this.id = props.id;
        this.resourceType = props.resourceType;
        this.price = props.price;
        this.url = props.url;
    }
}