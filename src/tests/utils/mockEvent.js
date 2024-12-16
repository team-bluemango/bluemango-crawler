/**
 * 테스트 유틸리티: Mock API Gateway 이벤트 생성
 * - Lambda 핸들러 테스트 시 API Gateway 요청을 시뮬레이션
 */

/**
 * Mock API Gateway 이벤트 생성
 * @param {string} method - HTTP 메서드 (예: 'GET', 'POST')
 * @param {Object} body - 요청 본문 데이터 (POST/PUT)
 * @param {Object} queryString - 쿼리 스트링 파라미터
 * @returns {Object} - Mock 이벤트 객체
 */
export function mockApiEvent(method, body = null, queryString = null) {
    return {
        requestContext: {
            http: { method }, // HTTP 메서드
        },
        queryStringParameters: queryString || {}, // 쿼리 스트링 파라미터
        body: body ? JSON.stringify(body) : null, // 요청 본문
    };
}

/**
 * Mock SQS 이벤트 생성
 * @param {Array} messages - SQS 메시지 배열
 * @returns {Object} - Mock SQS 이벤트 객체
 */
export function mockSqsEvent(messages) {
    return {
        Records: messages.map((msg, index) => ({
            messageId: `msg-${index + 1}`,
            body: JSON.stringify(msg),
            receiptHandle: `handle-${index + 1}`,
        })),
    };
}
