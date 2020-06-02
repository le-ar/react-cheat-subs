import { Failure, FailureUnauthorized } from "../../../../core/failures";
import { sleep } from "../../../../core/utils";
import { Account } from "../entities/account";

export interface AuthRemoteDatasource {
    getMyAccount(): Promise<Failure | Account>;
}

export class AuthRemoteDatasourceImpl implements AuthRemoteDatasource{
    async getMyAccount(): Promise<Failure | Account> {
        await sleep(1000);

        // return new Failure();
        // return new FailureUnauthorized();
        return new Account({
            id: 0,
            points: 100
        });
    }
}