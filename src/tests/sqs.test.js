import { sendMessageToSQS, receiveMessagesFromSQS, deleteMessageFromSQS } from "@/libs/sqsClient";

const QUEUE_URL = process.env.QUEUE_URL || "https://sqs.ap-northeast-2.amazonaws.com/484681937527/schedule-queue";

describe("SQS Operations", () => {
    test("Send a message to SQS", async () => {
        // 현재 PWD 출력
        console.log("PWD:", process.cwd());
        // console.log();
        const message = { schedule_id: "test123", detail: "Test message" };

        const messageId = await sendMessageToSQS(QUEUE_URL, message);

        expect(messageId).toBeDefined();
        console.log("Message sent successfully:", messageId);
    });

    test("Receive a message from SQS", async () => {
        const messages = await receiveMessagesFromSQS(QUEUE_URL);

        if (messages.length > 0) {
            console.log("Messages received:", messages);

            // Check message content
            expect(messages[0].Body).toBeDefined();

            // Delete the message after processing
            await deleteMessageFromSQS(QUEUE_URL, messages[0].ReceiptHandle);
            console.log("Message deleted successfully");
        } else {
            console.log("No messages available in SQS");
        }
    }, 20000);
});
