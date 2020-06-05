import TaskRemoteDatasource from "../../data/datasources/taskRemoteDatasource";
import { observable, action, computed } from "mobx";
import Task from "../../data/entities/task";
import { Failure, FailureTasksCompleted } from "../../../../core/failures";
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

export default class TaskStore {
    private taskRemoteDatasource: TaskRemoteDatasource;

    constructor(props: {
        taskRemoteDatasource: TaskRemoteDatasource;
    }) {
        this.taskRemoteDatasource = props.taskRemoteDatasource;
    }

    @observable isTasksLikesLoading: boolean = false;
    @observable isTasksLikesLoaded: boolean = false;
    @observable tasksLikes: Task[] = [];
    @observable tasksLikesHasError: boolean = false;
    @observable tasksLikesError: string = '';

    @action async refreshTasksLikes() {
        this.isTasksLikesLoaded = false;
        await this.loadTasksLikes();
    }

    @action async loadTasksLikes() {
        this.isTasksLikesLoading = true;

        let tasksIds = this.tasksLikes.map(task => task.id);
        let result = await this.taskRemoteDatasource.getLikesTask(tasksIds, this.bannedLikesTasks);
        if (Array.isArray(result)) {
            this.tasksLikes = result;
            this.tasksLikesHasError = false;
        } else {
            if (result instanceof FailureTasksCompleted) {
                this.tasksLikesHasError = true;
                this.tasksLikesError = 'Задания на сегодня закончились!';
            } else if (result instanceof Failure) {
                this.tasksLikesHasError = true;
                this.tasksLikesError = 'Обновите задания';
            }
        }

        this.isTasksLikesLoading = false;
        this.isTasksLikesLoaded = true;
    }

    @action removeTaskLikeById(taskId: number) {
        this.tasksLikes = this.tasksLikes.filter(task => task.id !== taskId);
        this.loadTasksLikes();
    }

    bannedLikesTasks: number[] = [];
    banLikeTask(taskId: number) {
        this.bannedLikesTasks.push(taskId);
    }

    @observable checkingTasks: number[] = [];

    @action async completeTask(taskId: number, userId: number) {
        if (!this.isTaskChecking(taskId)) {
            this.checkingTasks.push(taskId);
        }

        let key = this.encodeCompleteTask(taskId, userId);
        await this.taskRemoteDatasource.completeTask(taskId, key);
        
        this.checkingTasks = this.checkingTasks.filter(id => id !== taskId);
    }

    isTaskChecking(taskId: number): boolean {
        return this.checkingTasks.indexOf(taskId) !== -1;
    }

    private encodeCompleteTask(taskId: number, userId: number): string {
        let key = Base64.stringify(
            sha256(taskId.toString() + '-' + userId.toString())
        );
        let double = Base64.stringify(
            sha256(key)
        );
        return double.substr(0, 3) + key.substr(key.length - 10, 3) + double.substr(double.length - 12, 2);
    }
}