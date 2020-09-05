import { MongoClient } from 'mongodb'

export default class UserService {

    private readonly client: MongoClient;

    public constructor() {
        this.client = (global as any).client as MongoClient;
    }

}