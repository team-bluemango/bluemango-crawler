import AWS from "aws-sdk";

const region = process.env.CUSTOM_AWS_REGION || "ap-northeast-2";
const eventBridge = new AWS.EventBridge({ region });

/**
 * EventBridge에 규칙 생성
 * @param {string} ruleName - 규칙 이름
 * @param {string} scheduleExpression - cron 또는 rate 표현식
 * @returns {Promise<void>}
 */
export async function createEventBridgeRule(ruleName, scheduleExpression) {
    const params = {
        Name: ruleName,
        ScheduleExpression: scheduleExpression,
        State: "ENABLED",
    };

    try {
        const result = await eventBridge.putRule(params).promise();
        console.log(`EventBridge rule created: ${result.RuleArn}`);
        return result.RuleArn;
    } catch (error) {
        console.error("Failed to create EventBridge rule:", error);
        throw error;
    }
}

/**
 * EventBridge 규칙에 Lambda 타겟 추가
 * @param {string} ruleName - 규칙 이름
 * @param {string} targetId - 타겟 ID
 * @param {string} lambdaArn - Lambda 함수 ARN
 * @returns {Promise<void>}
 */
export async function addLambdaTargetToRule(ruleName, targetId, lambdaArn) {
    const params = {
        Rule: ruleName,
        Targets: [
            {
                Id: targetId,
                Arn: lambdaArn,
            },
        ],
    };

    try {
        await eventBridge.putTargets(params).promise();
        console.log(`Target added to EventBridge rule: ${ruleName}`);
    } catch (error) {
        console.error("Failed to add target to EventBridge rule:", error);
        throw error;
    }
}

/**
 * EventBridge 규칙 삭제
 * @param {string} ruleName - 규칙 이름
 * @returns {Promise<void>}
 */
export async function deleteEventBridgeRule(ruleName) {
    try {
        await eventBridge.deleteRule({ Name: ruleName, Force: true }).promise();
        console.log(`EventBridge rule deleted: ${ruleName}`);
    } catch (error) {
        console.error("Failed to delete EventBridge rule:", error);
        throw error;
    }
}
