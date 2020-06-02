import { Failure, FailureTasksCompleted } from "../../../../core/failures";
import { sleep } from "../../../../core/utils";
import Task from "../entities/task";

export interface TaskRemoteDatasource {
    getLikesTask(): Promise<Failure | Task[]>;
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
}