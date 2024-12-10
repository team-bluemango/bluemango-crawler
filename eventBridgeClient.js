// File: eventBridgeClient.js
import { EventBridgeClient, PutRuleCommand, PutTargetsCommand, DeleteRuleCommand } from "@aws-sdk/client-eventbridge";

// EventBridge 클라이언트 설정
export const eventBridgeClient = new EventBridgeClient({ region: "ap-northeast-2" });