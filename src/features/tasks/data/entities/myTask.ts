import Task, { TaskResourceType } from "./task";
import { TaskType } from "./addTask";

export type MyTaskStatus = 'Started' | 'Canceled' | 'Done' | 'Banned';

export default class MyTask extends Task {
    userId: number;
    userName: string;
    userUrl: string;
    done: number;
    orderCount: number;
    name: string;
    taskType: TaskType;
    status: MyTaskStatus;

    constructor(props: {
        id: number;
        resourceType: TaskResourceType;
        price: number;
        url: string;
        userId: number;
        userName: string;
        userUrl: string;
        done: number;
        orderCount: number;
        name: string;
        taskType: TaskType; 
        status: MyTaskStatus;
    }) {
        super({
            id: props.id,
            resourceType: props.resourceType,
            price: props.price,
            url: props.url,
        });

        this.userId = props.userId;
        this.userName = props.userName;
        this.userUrl = props.userUrl;
        this.done = props.done;
        this.orderCount = props.orderCount;
        this.name = props.name;
        this.taskType = props.taskType;
        this.status = props.status;
    }
}