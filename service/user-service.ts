import { MongoClient } from 'mongodb'

export default class UserService {

    public async createUser(_id: string, email: string, nome: string): Promise<void> {
        const data_criacao = new Date()
            .toLocaleDateString();
        const user = {
            email, nome,
            data_criacao
        } as User;

        await this.client.db('docapi').collection('users_data')
            .insertOne(Object.assign({ _id }, user));
    }

    public async getUser(_id: string): Promise<User> {
        const query = this.client.db('docapi')
            .collection('users_data').find({ _id });

        if (await query.hasNext()) {
            return await query.next();
        }

        throw new Error('Usuário não localizado');
    }

    public async deleteUser(_id: string): Promise<void> {
        await this.client.db('docapi').collection('users')
            .updateOne({ _id }, { active: false });
    }

    public async getUsers(limit: number = 20, offset: number = 0): Promise<User[]> {
        const query = this.client.db('docapi')
            .collection('users_data').find({})
            .limit(limit).skip(offset);
        return await query.toArray();
    }

    private get client(): MongoClient {
        return (global as any).client as MongoClient;
    }

}

export declare interface User {

    readonly active: boolean;

    readonly email: string;

    readonly nome: string;

    readonly data_criacao: string;

}