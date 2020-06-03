import { Failure, FailureTasksCompleted } from "../../../../core/failures";
import { sleep } from "../../../../core/utils";
import Task from "../entities/task";
import Prices from "../entities/peices";
import AddTask from "../entities/addTask";

export interface TaskRemoteDatasource {
    getLikesTask(): Promise<Failure | Task[]>;
    addTask(task: AddTask): Promise<Failure | null>;
    getPrices(): Promise<Failure | Prices>;
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
}