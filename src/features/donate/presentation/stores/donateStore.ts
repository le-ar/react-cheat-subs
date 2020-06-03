import DonateRemoteDatasource from "../../data/datasources/donateRemoteDatasource";
import { observable, computed, action } from "mobx";
import { Failure } from "../../../../core/failures";

export default class DonateStore {
    private donateRemoteDatasource: DonateRemoteDatasource;

    constructor(props: {
        donateRemoteDatasource: DonateRemoteDatasource;
    }) {
        this.donateRemoteDatasource = props.donateRemoteDatasource;
    }

    @observable private _isModalOpen: boolean = false;
    @computed get isModalOpen(): boolean {
        return this._isModalOpen;
    }
    @action setModalOpen(open: boolean) {
        if (open) {
            this.loadExchange();
        }
        this._isModalOpen = open;
    }

    @observable exchangeLoading: boolean = false;
    @observable exchange: number = 0;
    @observable exchangeError: string = '';
    @action async loadExchange() {
        this.exchangeLoading = true;
        this.exchangeError = '';

        let result = await this.donateRemoteDatasource.getExchange();
        if (result instanceof Failure) {
            this.exchangeError = 'Попробуйте позже';
        } else {
            this.exchange = result;
            this._sumRub = '10';
            this._sumPoints = this.rubToPoints(10).toString();
        }

        this.exchangeLoading = false;
    }

    @observable private _sumError: string = '';
    @computed get sumError() {
        return this._sumError;
    }
    @observable private _sumRub: string = '10';
    @observable private _sumPoints: string = '10';
    @computed get sumRub() {
        return this._sumRub;
    }
    @computed get sumPoints() {
        return this._sumPoints;
    }
    @action setSumRub(value: string) {
        this._sumRub = value;

        let val = parseInt(value);
        if (typeof val === 'undefined' || Number.isNaN(val)) {
            this.setSumError();
        } else {
            if (val < 5) {
                this.setSumError();
            } else {
                this._sumError = '';
            }
            this._sumPoints = this.rubToPoints(val).toString();
        }
    }
    @action setSumPoints(value: string) {
        this._sumPoints = value;

        let val = parseInt(value);
        if (typeof val === 'undefined' || Number.isNaN(val)) {
            this.setSumError();
        } else {
            if (this.pointsToRub(val) < 5) {
                this.setSumError();
            } else {
                this._sumError = '';
            }
            this._sumRub = this.pointsToRub(val).toString();
        }
    }

    @action private setSumError() {
        this._sumError = 'сумма не должна быть меньше 5 руб';
    }

    private rubToPoints(rub: number) {
        return rub * this.exchange;
    }

    private pointsToRub(points: number) {
        return Math.round(points / this.exchange * 100) / 100;
    }

    @observable isDonateLoading: boolean = false;
    @observable donateError: string = '';
    @action async donate() {
        this.isDonateLoading = true;

        let result = await this.donateRemoteDatasource.donate(parseInt(this.sumRub));
        if (result instanceof Failure) {
            this.donateError = 'Попробуйте позже';
        } else {
            let win = window.open(result, '_blank');
            if (win !== null) {
                win.focus();
            }
        }

        this.isDonateLoading = false;
    }
}