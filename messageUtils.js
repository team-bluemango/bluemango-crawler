import { sqsClient, QUEUE_URL } from "./sqsClient.js";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

/**
 * 조건에 따라 데이터를 생성하는 함수
 * @param {object} baseJson - 기본 JSON 데이터
 * @param {number} count - 생성할 JSON의 개수
 * @returns {array} - 생성된 JSON 객체 배열
 */
export const generateMessages = (baseJson, count) => {
    const messages = [];

    for (let i = 0; i < count; i++) {
        const message = { ...baseJson };

        // 조건에 따른 수정
        switch (baseJson.type) {
        case "HOTEL":
            message.api = `https://api.example.com/hotel/${i}`;
            message.detailUrl = `https://example.com/hotel/detail/${i}`;
            break;
        case "RESORT":
            message.api = `https://api.example.com/resort/${i}`;
            message.detailUrl = `https://example.com/resort/detail/${i}`;
            break;
        default:
            message.api = `https://api.example.com/default/${i}`;
            message.detailUrl = `https://example.com/default/detail/${i}`;
        }

        // Add additional logic or modifications as needed
        message.data = JSON.stringify({ id: i, info: `Sample data for ${baseJson.type}` });

        messages.push(message);
    }

    return messages;
};

/**
 * SQS로 메시지 전송 함수
 * @param {array} messages - 전송할 메시지 배열
 */
export const sendMessagesToSQS = async (messages) => {
    for (const message of messages) {
        const params = {
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(message),
        };

        try {
            const command = new SendMessageCommand(params);
            const result = await sqsClient.send(command);
            console.log("Message sent successfully:", result.MessageId);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
};

/**
 * SQS로 메시지 전송 함수 - 테스트용 함수
 * @param {array} messageBody - 전송할 json message
 */
async function sendMessage(messageBody) {
    const params = {
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(messageBody), // 메시지 본문
    };
  
    try {
        const command = new SendMessageCommand(params);
        const result = await sqsClient.send(command);
        console.log("Message sent successfully:", result.MessageId);
    } catch (error) {
        console.error("Error sending message:", error);
    }
}
