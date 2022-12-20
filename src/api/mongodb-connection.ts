
import { MongoClient, ObjectId } from "mongodb";
import mongoose from 'mongoose';
export class MongoDBConnection {
    private client: MongoClient;
    private db: any;
    public snowflakeClient: any;
    public oneHourCache: any;

    public async initMongoDB() {
        const platformDbName = "booking-app";
        const options: any = {
            // If not connected, return errors immediately rather than waiting for reconnect
        };
        const mongodbConnectionUrl = "mongodb://localhost:27017/booking-app";
        mongoose.set("strictQuery", false);
        await mongoose.connect(mongodbConnectionUrl, options, (err)=> {
            if(err) {
                console.log('mongo cannot be initialize');
            } else {
               console.log('mongo initialize sucessfully');
            }
        })
    }
}