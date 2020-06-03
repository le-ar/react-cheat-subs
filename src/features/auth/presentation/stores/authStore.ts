import { observable } from 'mobx';
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

    @observable isMyAccountLoading: boolean = false;
    @observable myAccount: User | null = null;
    @observable myAccountError: string = '';
    @observable myAccountHasError: boolean = true;

    async getMyAccount() {
        this.isMyAccountLoading = true;
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
        this.isMyAccountLoading = false;
    }
}