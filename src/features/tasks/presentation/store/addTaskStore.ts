import { observable, action, computed } from "mobx";
import TaskRemoteDatasource from "../../data/datasources/taskRemoteDatasource";
import Prices from "../../data/entities/peices";
import AddTask, { TaskType } from "../../data/entities/addTask";
import { Failure } from "../../../../core/failures";
import { AuthStore } from "../../../auth/presentation/stores/authStore";

export default class AddTaskStore {
    private taskRemoteDatasource: TaskRemoteDatasource;
    private authStore: AuthStore;

    constructor(props: {
        taskRemoteDatasource: TaskRemoteDatasource;
        authStore: AuthStore;
    }) {
        this.taskRemoteDatasource = props.taskRemoteDatasource;
        this.authStore = props.authStore;
    }

    taskTypes = [
        { label: 'Лайки', value: 'like' },
        { label: 'Подписчики в группу', value: 'subscribeGroup' },
        { label: 'Подписчики пользователю', value: 'subscribeUser' },
    ];
    @observable taskSelected: TaskType = 'like';

    @observable taskUrl: string = '';
    @observable private _taskCount: string = '';
    @observable private _validTaskCount: boolean = true;
    @computed get validTaskCount(): boolean {
        return this._validTaskCount;
    }
    @computed get taskCount(): string {
        return this._taskCount;
    }
    @action setTaskCount(value: string) {
        let val = parseInt(value);
        if (typeof val === 'undefined' || val < 1) {
            this._validTaskCount = false;
        } else {
            this._validTaskCount = true;
        }
        this._taskCount = value;
    }

    @computed get calculatedPrice(): string {
        if (this.prices === null || !this.validTaskCount) {
            return '0';
        }
        let price = this.prices.like;
        if (this.taskSelected === 'subscribeGroup') {
            price = this.prices.subscribeGroup;
        } else if (this.taskSelected === 'subscribeUser') {
            price = this.prices.subscribeUser;
        }

        return (parseInt(this.taskCount) * price).toString();
    }

    @observable private _isModalOpen: boolean = false;
    @computed get isModalOpen(): boolean {
        return this._isModalOpen;
    }
    @action setIsModalOpen(open: boolean) {
        if (open) {
            this.loadPrices();
            this.taskUrl = '';
            this.taskSelected = 'like';
            this._taskCount = '1';
            this._validTaskCount = true;
            this.addTaskSuccess = false;
            this.addTaskLoading = false;
            this.addTaskHasError = false;
            this.addTaskError = '';
            this.addTaskSuccess = false;
        }

        this._isModalOpen = open;
    }

    @observable pricesError: string = '';
    @observable pricesHasError: boolean = false;
    @observable isPricesLoading: boolean = true;
    @observable prices: Prices | null = null;

    @action async loadPrices() {
        this.isPricesLoading = true;

        let result = await this.taskRemoteDatasource.getPrices();
        if (result instanceof Prices) {
            this.prices = result;
            this.pricesHasError = false;
        } else {
            this.pricesError = 'Обновите страницу';
            this.pricesHasError = true;
        }

        this.isPricesLoading = false;
    }

    @observable addTaskSuccess: boolean = false;
    @observable addTaskLoading: boolean = false;
    @observable addTaskHasError: boolean = false;
    @observable addTaskError: string = '';
    @action async addTask() {
        this.addTaskLoading = true;
        this.addTaskHasError = false;
        this.addTaskError = '';

        let result = await this.taskRemoteDatasource.addTask(new AddTask({
            type: this.taskSelected,
            count: parseInt(this.taskCount),
            url: this.taskUrl
        }));
        if (result instanceof Failure) {
            this.addTaskHasError = true;
            this.addTaskError = 'Попробуйте позже';
        } else {
            this.addTaskHasError = false;
            this.addTaskError = '';
            this.addTaskSuccess = true;
            this.authStore.updateMyAccount();
        }

        this.addTaskLoading = false;
    }
}