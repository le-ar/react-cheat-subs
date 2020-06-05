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
            this.myTasks = [];
            this.isMyTasksAllLoaded = false;
            this.loadMyTasks();
        }
        this._isModalOpen = open;
    }

    @observable myTasksNextLoading: boolean = false;
    @observable isMyTasksAllLoaded: boolean = false;
    @observable myTasks: MyTask[] = [];
    @observable myTasksLoading: boolean = false;
    @observable private _myTasksError: string = '';
    @computed get myTasksError(): string {
        return this._myTasksError;
    }
    @action async loadMyTasks() {
        if (this._myTasksError.length > 0 || this.isMyTasksAllLoaded) {
            return;
        }
        if (this.myTasks.length === 0) {
            this.myTasksLoading = true;
        }
        this.myTasksNextLoading = true;

        let taskOffset = 0;
        if (this.myTasks.length > 0) {
            taskOffset = this.myTasks[this.myTasks.length - 1].id
        }

        let result = await this.taskRemoteDatasource.getMyTasks(taskOffset);
        if (result instanceof Failure) {
            this._myTasksError = 'Попробуйте позже';
        } else {
            this._myTasksError = '';
            if (this.myTasks.length === 0) {
                this.myTasks = result;
            } else {
                if (result.length === 0) {
                    this.isMyTasksAllLoaded = true;
                }
                this.myTasks = this.myTasks.concat(result);
            }
        }

        this.myTasksLoading = false;
        this.myTasksNextLoading = false;
    }

    @action async cancelTask(taskId: number) {
        await this.taskRemoteDatasource.cancelMyTask(taskId);
    }
}