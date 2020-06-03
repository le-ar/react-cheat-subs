import { Failure, FailureTasksCompleted } from "../../../../core/failures";
import { sleep } from "../../../../core/utils";
import Task from "../entities/task";
import Prices from "../entities/peices";
import AddTask from "../entities/addTask";
import MyTask from "../entities/myTask";

export default interface TaskRemoteDatasource {
    getLikesTask(): Promise<Failure | Task[]>;
    addTask(task: AddTask): Promise<Failure | null>;
    getPrices(): Promise<Failure | Prices>;
    getMyTasks(): Promise<Failure | MyTask[]>;
}

export class TaskRemoteDatasourceImpl implements TaskRemoteDatasource {
    async getLikesTask(): Promise<Failure | Task[]> {
        await sleep(1000);

        // return new Failure();
        // return new FailureTasksCompleted();
        // return [];
        return [
            new Task({
                id: 0,
                price: 5,
                url: '',
                resourceType: 'note',
            }),
            new Task({
                id: 1,
                price: 5,
                url: '',
                resourceType: 'photo',
            }),
            new Task({
                id: 2,
                price: 5,
                url: '',
                resourceType: 'photo',
            }),
            new Task({
                id: 3,
                price: 5,
                url: '',
                resourceType: 'note',
            }),
            new Task({
                id: 4,
                price: 5,
                url: '',
                resourceType: 'note',
            }),
        ];
    }

    async getPrices(): Promise<Failure | Prices> {
        await sleep(500);
        // return new Failure();
        return new Prices({
            like: 1,
            subscribeGroup: 2,
            subscribeUser: 2
        });
    }

    async addTask(task: AddTask): Promise<Failure | null> {
        await sleep(500);

        // return new Failure();
        return null;
    }

    async getMyTasks(): Promise<Failure | MyTask[]> {
        // return new Failure();
        return [
            new MyTask({
                id: 0,
                resourceType: 'photo',
                price: 100,
                url: 'https://google.com',
                userId: 0,
                userName: 'Фамилия Имя',
                userUrl: 'https://google.com',
                done: 4,
                orderCount: 10,
                name: 'photo12312938',
                taskType: 'like',
            }),
            new MyTask({
                id: 2,
                resourceType: 'note',
                price: 100,
                url: 'https://google.com',
                userId: 0,
                userName: 'Фамилия Имя',
                userUrl: 'https://google.com',
                done: 4,
                orderCount: 10,
                name: 'wall12312938',
                taskType: 'like',
            }),
            new MyTask({
                id: 3,
                resourceType: 'group',
                price: 100,
                url: 'https://google.com',
                userId: 0,
                userName: 'Фамилия Имя',
                userUrl: 'https://google.com',
                done: 4,
                orderCount: 10,
                name: 'group12312938',
                taskType: 'subscribeGroup',
            }),
            new MyTask({
                id: 4,
                resourceType: 'user',
                price: 100,
                url: 'https://google.com',
                userId: 0,
                userName: 'Фамилия Имя',
                userUrl: 'https://google.com',
                done: 4,
                orderCount: 10,
                name: 'id12312938',
                taskType: 'subscribeUser',
            }),
        ];
    }
}