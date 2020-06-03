import { Failure, FailureUnauthorized } from "../../../../core/failures";
import { sleep } from "../../../../core/utils";
import User from "../../../user/data/entities/user";

export interface AuthRemoteDatasource {
    getMyAccount(): Promise<Failure | User>;
}

export class AuthRemoteDatasourceImpl implements AuthRemoteDatasource{
    async getMyAccount(): Promise<Failure | User> {
        await sleep(1000);

        // return new Failure();
        // return new FailureUnauthorized();
        return new User({
            id: 0,
            name: 'Фамилия Имя',
            avatar: 'https://sun9-2.userapi.com/c846524/v846524973/80b77/mZ5xAnrErxQ.jpg?ava=1',
            point: 100,
            orderCount: 1
        });
    }
}