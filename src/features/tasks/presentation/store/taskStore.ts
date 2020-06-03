import TaskRemoteDatasource from "../../data/datasources/taskRemoteDatasource";
import { observable, action } from "mobx";
import Task from "../../data/entities/task";
import { Failure, FailureTasksCompleted } from "../../../../core/failures";

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

        let result = await this.taskRemoteDatasource.getLikesTask();
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
}