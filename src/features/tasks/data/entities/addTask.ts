export type TaskType = 'like' | 'subscribeGroup' | 'subscribeUser';

export default class AddTaskt {
    type: TaskType;
    count: number;
    url: string;

    constructor(props: {
        type: TaskType;
        count: number;
        url: string;
    }) {
        this.type = props.type;
        this.count = props.count;
        this.url = props.url;
    }
}