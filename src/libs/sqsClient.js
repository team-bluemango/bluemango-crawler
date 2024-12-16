import AWS from "aws-sdk";

const region = process.env.CUSTOM_AWS_REGION || "ap-northeast-2";
const sqs = new AWS.SQS({ region });

/**
 * SQS 메시지 전송
 * @param {string} queueUrl - SQS Queue URL
 * @param {Object} messageBody - 전송할 메시지 내용
 * @returns {Promise<string>} - 전송된 메시지 ID
 */
export async function sendMessageToSQS(queueUrl, messageBody) {
    const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(messageBody),
    };

    try {
        const result = await sqs.sendMessage(params).promise();
        console.log(`Message sent to SQS: ${result.MessageId}`);
        return result.MessageId;
    } catch (error) {
        console.error("Failed to send message to SQS:", error);
        throw error;
    }
}

/**
 * SQS에서 메시지 수신
 * @param {string} queueUrl - SQS Queue URL
 * @param {number} maxMessages - 수신할 최대 메시지 수
 * @returns {Promise<Array>} - 수신된 메시지 배열
 */
export async function receiveMessagesFromSQS(queueUrl, maxMessages = 10) {
    // TODO: 메시지를 가져간 이후 SQS 에서 삭제하는 로직 추가필요.
    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxMessages,
        WaitTimeSeconds: 20, // Long Polling 대기 시간
    };

    try {
        const result = await sqs.receiveMessage(params).promise();
        if (!result.Messages || result.Messages.length === 0) {
            // 메시지가 없는 경우 체크
            console.log("No messages received from SQS");
            return []; // 빈 배열 반환
        }
        console.log(`Messages received from SQS: ${result.Messages.length}`);
    } catch (error) {
        console.error("Failed to receive messages from SQS:", error);
        throw error;
    }
}

/**
 * SQS 메시지 삭제
 * @param {string} queueUrl - SQS Queue URL
 * @param {string} receiptHandle - 삭제할 메시지의 Receipt Handle
 * @returns {Promise<void>}
 */
export async function deleteMessageFromSQS(queueUrl, receiptHandle) {
    const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
    };

    try {
        await sqs.deleteMessage(params).promise();
        console.log("Message deleted from SQS");
    } catch (error) {
        console.error("Failed to delete message from SQS:", error);
        throw error;
    }
}
