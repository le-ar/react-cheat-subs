import { sleep } from "../../../../core/utils";
import { Failure } from "../../../../core/failures";

export default interface DonateRemoteDatasource {
    donate(sum: number): Promise<Failure | string>;
    getExchange(): Promise<Failure | number>;
}

export class DonateRemoteDatasourceImpl implements DonateRemoteDatasource {
    async donate(sum: number): Promise<Failure | string> {
        await sleep(500);

        // return new Failure();
        return 'https://google.com';
    }

    async getExchange(): Promise<Failure | number> {
        await sleep(350);

        // return new Failure();
        return 3;
    }
}