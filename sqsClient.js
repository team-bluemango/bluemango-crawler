// File: sqsClient.js
import { SQSClient } from "@aws-sdk/client-sqs";

// AWS SQS 클라이언트 설정
export const sqsClient = new SQSClient({ region: "ap-northeast-2" }); // AWS 리전
export const QUEUE_URL = "https://sqs.ap-northeast-2.amazonaws.com/484681937527/my-queue"; // SQS URL