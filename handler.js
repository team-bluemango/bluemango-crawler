import { Schedule } from "./database.js";
import { eventBridgeClient } from "./eventBridgeClient.js";
import { PutRuleCommand, PutTargetsCommand, DeleteRuleCommand } from "@aws-sdk/client-eventbridge";
import { QUEUE_URL } from "./sqsClient.js";

/**
 * Lambda 핸들러 함수
 * @param {object} event - Lambda 이벤트 객체
 */
export const lambdaHandler = async (event) => {
    console.log("Received event:", event);

    const { httpMethod, path, body, pathParameters } = event;
    let response;

    try {
        switch (httpMethod) {
        case "POST":
            const newSchedule = JSON.parse(body);
            const schedule = new Schedule(newSchedule);
            await schedule.save();

            // EventBridge Rule 생성
            const ruleParams = {
                Name: `rule-${schedule._id}`,
                ScheduleExpression: schedule.crontab,
                State: "ENABLED",
            };

            const ruleCommand = new PutRuleCommand(ruleParams);
            await eventBridgeClient.send(ruleCommand);

            // EventBridge Target 설정
            const targetParams = {
                Rule: `rule-${schedule._id}`,
                Targets: [
                    {
                        Id: `target-${schedule._id}`,
                        Arn: QUEUE_URL,
                    },
                ],
            };

            const targetCommand = new PutTargetsCommand(targetParams);
            await eventBridgeClient.send(targetCommand);

            response = {
                statusCode: 201,
                body: JSON.stringify({ message: "Schedule created successfully." }),
            };
            break;

        case "GET":
            if (pathParameters && pathParameters.id) {
                const schedule = await Schedule.findById(pathParameters.id);
                if (!schedule) {
                    response = {
                        statusCode: 404,
                        body: JSON.stringify({ error: "Schedule not found." }),
                    };
                } else {
                    response = {
                        statusCode: 200,
                        body: JSON.stringify(schedule),
                    };
                }
            }
            break;

        case "PUT":
            if (pathParameters && pathParameters.id) {
                const updatedSchedule = JSON.parse(body);
                const schedule = await Schedule.findByIdAndUpdate(pathParameters.id, updatedSchedule, {
                    new: true,
                });
                response = schedule
                    ? { statusCode: 200, body: JSON.stringify(schedule) }
                    : { statusCode: 404, body: JSON.stringify({ error: "Schedule not found." }) };
            }
            break;

        case "DELETE":
            if (pathParameters && pathParameters.id) {
                const schedule = await Schedule.findByIdAndDelete(pathParameters.id);
                if (!schedule) {
                    response = {
                        statusCode: 404,
                        body: JSON.stringify({ error: "Schedule not found." }),
                    };
                } else {
                    // EventBridge Rule 삭제
                    const ruleParams = { Name: `rule-${schedule._id}` };
                    await eventBridgeClient.send(new DeleteRuleCommand(ruleParams));

                    response = {
                        statusCode: 200,
                        body: JSON.stringify({ message: "Schedule deleted successfully." }),
                    };
                }
            }
            break;

        default:
            response = {
                statusCode: 405,
                body: JSON.stringify({ error: "Method not allowed." }),
            };
        }
    } catch (error) {
        console.error("Error handling request:", error);
        response = {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error." }),
        };
    }

    return response;
};
