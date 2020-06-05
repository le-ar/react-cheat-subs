import { Failure, FailureTasksCompleted } from "../../../../core/failures";
import { sleep } from "../../../../core/utils";
import Task from "../entities/task";
import Prices from "../entities/peices";
import AddTask from "../entities/addTask";
import MyTask from "../entities/myTask";

export default interface TaskRemoteDatasource {
    getLikesTask(loadedTasks: number[], bannedTasks: number[]): Promise<Failure | Task[]>;
    addTask(task: AddTask): Promise<Failure | null>;
    getPrices(): Promise<Failure | Prices>;
    getMyTasks(offset: number): Promise<Failure | MyTask[]>;
    completeTask(taskId: number, key: string): Promise<Failure | null>;
}

export class TaskRemoteDatasourceImpl implements TaskRemoteDatasource {
    async getLikesTask(loadedTasks: number[], bannedTasks: number[]): Promise<Failure | Task[]> {
        await sleep(1000);

        // return new Failure();
        // return new FailureTasksCompleted();
        // return [];
        return [
            new Task({
                id: 0,
                price: 5,
                url: 'https://vk.com',
                resourceType: 'note',
            }),
            new Task({
                id: 1,
                price: 5,
                url: 'https://vk.com',
                resourceType: 'photo',
            }),
            new Task({
                id: 2,
                price: 5,
                url: 'https://vk.com',
                resourceType: 'photo',
            }),
            new Task({
                id: 3,
                price: 5,
                url: 'https://vk.com',
                resourceType: 'note',
            }),
            new Task({
                id: 4,
                price: 5,
                url: 'https://vk.com',
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

    taskId = 0;
    
    async getMyTasks(offset: number): Promise<Failure | MyTask[]> {
        // return new Failure();
        if (offset === 0) {
            this.taskId = 0;
        }
        await sleep(1000);
        if (this.taskId > 12) {
            return [];
        }

        return [
            new MyTask({
                id: this.taskId++,
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
                id: this.taskId++,
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
                id: this.taskId++,
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
                id: this.taskId++,
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

    async completeTask(taskId: number, key: string): Promise<Failure | null> {
        await sleep(500);
        return new Failure();
    }
}