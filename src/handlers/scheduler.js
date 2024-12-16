/**
 * API 비즈니스 로직 핸들러
 * - MongoDB를 통해 스케줄 데이터를 관리
 * - API Gateway 요청 처리 (POST, GET)
 */

import { MongoClient } from "mongodb"; // MongoDB 클라이언트

export const handler = async (event) => {
    const client = new MongoClient(process.env.MONGODB_URI); // MongoDB 연결
    await client.connect();
    const db = client.db("schedulerDB");
    const schedules = db.collection("schedules"); // 스케줄 데이터 저장 컬렉션

    try {
        // POST 요청: 스케줄 생성
        if (event.requestContext.http.method === "POST") {
            const body = JSON.parse(event.body); // 요청 본문 JSON 파싱
            await schedules.insertOne(body); // MongoDB에 스케줄 저장
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Schedule created." }),
            };
        }

        // GET 요청: 모든 스케줄 조회
        if (event.requestContext.http.method === "GET") {
            const data = await schedules.find({}).toArray(); // 스케줄 데이터 조회
            return {
                statusCode: 200,
                body: JSON.stringify(data),
            };
        }
    } catch (error) {
        console.error("Error in scheduler API:", error); // 오류 로깅
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    } finally {
        await client.close(); // MongoDB 연결 종료
    }
};
