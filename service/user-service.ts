import { MongoClient } from 'mongodb'

export default class UserService {

    private readonly client: MongoClient;

    public constructor() {
        this.client = (global as any).client as MongoClient;
    }

    public async getUser(_id: string): Promise<User> {
        const query = this.client.db('docapi')
            .collection('users_data').find({ _id });

        if (await query.hasNext()) {
            return await query.next();
        }

        throw new Error('Usuário não localizado');
    }

}

export declare interface User {

    readonly email: string;

    readonly nome: string;

    readonly data_criacao: string;

}