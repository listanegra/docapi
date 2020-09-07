import { MongoClient, ObjectId } from 'mongodb'
import moment from 'moment'

export default class UserService {

    public async createUser(_id: ObjectId, email: string, nome: string): Promise<void> {
        const data_criacao = moment().startOf('day')
            .toDate().getTime();

        const user = {
            email, nome,
            data_criacao
        } as User;

        await this.client.db('docapi').collection('users_data')
            .insertOne(Object.assign({ _id }, user));
    }

    public async getUser(_id: string): Promise<User> {
        const query = this.client.db('docapi')
            .collection('users_data').find({
                _id: new ObjectId(_id)
            });

        if (await query.hasNext()) {
            return await query.next();
        }

        throw new Error('Usuário não localizado');
    }

    public async editUser(_id: string, data: User): Promise<void> {
        for (let key in data) {
            const e = key as keyof User;
            if (!data[e]) delete data[e];
        }

        await this.client.db('docapi').collection('users_data')
            .updateOne({
                _id: new ObjectId(_id)
            }, { $set: data });
    }

    public async deleteUser(_id: string): Promise<void> {
        await this.client.db('docapi').collection('users')
            .updateOne({
                _id: new ObjectId(_id)
            }, { active: false });
    }

    public async getUsers(limit: number, offset: number): Promise<User[]> {
        const query = this.client.db('docapi')
            .collection('users_data').find({})
            .limit(Math.abs(limit) || 20)
            .skip(Math.abs(offset) || 0);
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

    readonly data_criacao: number;

}