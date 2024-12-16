/**
 * SQS 메시지 처리 핸들러
 * - SQS 메시지를 소비하고 MongoDB에 처리 결과 저장
 */

import { MongoClient } from "mongodb"; // MongoDB 클라이언트
import AWS from "aws-sdk"; // AWS SDK

const region = process.env.CUSTOM_AWS_REGION || "ap-northeast-2";

const sqs = new AWS.SQS({ region }); // SQS 클라이언트

export const handler = async (event) => {
    console.log("Start Worker Handler");

    try {
        const client = new MongoClient(process.env.MONGODB_URI); // MongoDB 연결
        await client.connect();
        const db = client.db("schedulerDB");
        const results = db.collection("results"); // 처리 결과 저장 컬렉션

        for (const record of event.Records) {
            try {
                console.log("Processing SQS message:", record.body); // 메시지 로깅

                const message = JSON.parse(record.body); // 메시지 JSON 파싱

                // 처리 결과 생성 (예제 로직)
                const result = {
                    schedule_id: message.schedule_id,
                    status: "success",
                    processed_at: new Date(),
                };

                await results.insertOne(result); // 처리 결과 저장
                console.log("Message processed successfully:", message.schedule_id);
            } catch (error) {
                console.error("Message processing failed:", error.message); // 실패 로깅

                // 실패한 메시지를 Dead Letter Queue로 이동
                const dlqParams = {
                    QueueUrl: process.env.QUEUE_URL, // Dead Letter Queue URL
                    MessageBody: record.body,
                };
                await sqs.sendMessage(dlqParams).promise(); // SQS로 메시지 전송
            }
        }

        await client.close(); // MongoDB 연결 종료
    } catch (error) {
        console.error("Worker handler error:", error);
        throw error;
    }
};
