import { MongoClient } from "mongodb";

let client; // MongoDB 클라이언트 싱글턴
let db; // 데이터베이스 인스턴스 싱글턴

/**
 * MongoDB 연결 초기화
 * @returns {Promise<Db>} MongoDB Database 인스턴스
 */
export async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            await client.connect();
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("MongoDB connection error:", error);
            throw error;
        }
    }

    if (!db) {
        db = client.db("schedulerDB"); // 데이터베이스 이름 설정
    }

    return db;
}

/**
 * MongoDB 연결 종료
 * @returns {Promise<void>}
 */
export async function closeDatabase() {
    if (client) {
        await client.close();
        console.log("MongoDB connection closed");
        client = null;
        db = null;
    }
}
