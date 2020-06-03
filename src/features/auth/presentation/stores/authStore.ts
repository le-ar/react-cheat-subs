import { observable, action } from 'mobx';
import { AuthRemoteDatasource } from "../../data/datasources/authRemoteDatasource";
import { Failure, FailureUnauthorized } from '../../../../core/failures';
import User from '../../../user/data/entities/user';

export class AuthStore {
    private authRemoteDatasource: AuthRemoteDatasource;

    constructor(props: {
        authRemoteDatasource: AuthRemoteDatasource;
    }) {
        this.authRemoteDatasource = props.authRemoteDatasource;

        
    }

    updating() {
        setInterval(() => {
            if (this.myAccount !== null) {
                this.updateMyAccount();
            }
        }, 5000);
    }

    @observable isMyAccountLoading: boolean = false;
    @observable myAccount: User | null = null;
    @observable myAccountError: string = '';
    @observable myAccountHasError: boolean = true;

    @action async getMyAccount() {
        this.isMyAccountLoading = true;
        
        await this.updateMyAccount();

        this.isMyAccountLoading = false;
    }

    @action async updateMyAccount() {
        let result = await this.authRemoteDatasource.getMyAccount();
        if (result instanceof User) {
            this.myAccount = result;
        } else if (result instanceof Failure) {
            if (result instanceof FailureUnauthorized) {
                this.myAccountHasError = false;
                this.myAccount = null;
            } else if (result instanceof Failure) {
                this.myAccountHasError = true;
                this.myAccountError = 'Обновите страницу';
            }
        }
    }
}