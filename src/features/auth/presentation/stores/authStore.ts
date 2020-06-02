import { observable } from 'mobx';
import { AuthRemoteDatasource } from "../../data/datasources/authRemoteDatasource";
import { Account } from '../../data/entities/account';
import { Failure, FailureUnauthorized } from '../../../../core/failures';

export class AuthStore {
    private authRemoteDatasource: AuthRemoteDatasource;

    constructor(props: {
        authRemoteDatasource: AuthRemoteDatasource;
    }) {
        this.authRemoteDatasource = props.authRemoteDatasource;
    }

    @observable isMyAccountLoading: boolean = false;
    @observable myAccount: Account | null = null;
    @observable myAccountError: string = '';
    @observable myAccountHasError: boolean = true;

    async getMyAccount() {
        this.isMyAccountLoading = true;
        let result = await this.authRemoteDatasource.getMyAccount();
        if (result instanceof Account) {
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