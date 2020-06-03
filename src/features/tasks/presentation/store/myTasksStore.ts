import TaskRemoteDatasource from "../../data/datasources/taskRemoteDatasource";
import { observable, action, computed } from "mobx";
import Task from "../../data/entities/task";
import { Failure } from "../../../../core/failures";
import MyTask from "../../data/entities/myTask";

export default class MyTasksStore {
    private taskRemoteDatasource: TaskRemoteDatasource;

    constructor(props: {
        taskRemoteDatasource: TaskRemoteDatasource;
    }) {
        this.taskRemoteDatasource = props.taskRemoteDatasource;
    }

    @observable private _isModalOpen: boolean = false;
    @computed get isModalOpen(): boolean {
        return this._isModalOpen;
    }
    @action setModalOpen(open: boolean) {
        if (open) {
            this.loadMyTasks();
        }
        this._isModalOpen = open;
    }

    @observable myTasks: MyTask[] = [];
    @observable myTasksLoading: boolean = false;
    @observable private _myTasksError: string = '';
    @computed get myTasksError(): string {
        return this._myTasksError;
    }
    @action async loadMyTasks() {
        this.myTasksLoading = true;

        let result = await this.taskRemoteDatasource.getMyTasks();
        if (result instanceof Failure) {
            this._myTasksError = 'Попробуйте позже';
        } else {
            this._myTasksError = '';
            this.myTasks = result;
        }

        this.myTasksLoading = false;
    }
}