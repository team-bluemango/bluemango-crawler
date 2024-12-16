import { generateMessages, sendMessagesToSQS } from "./messageUtils.js";

// Example usage
const baseJson = {
    provider: "AGODA",
    type: "HOTEL",
    api: "",
    detailUrl: "",
    data: "",
};
const count = 5;
  
// Generate messages and send to SQS
const messages = generateMessages(baseJson, count);
(async () => {
    await sendMessagesToSQS(messages);
})();