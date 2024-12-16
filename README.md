## 설치되어야 하는 것들
- serverless
    ```
    npm install -g serverless
    ```
- mongodb
  - mac 이라면 아래 링크에 따라서 설치
    ```
    // 서비스 실행
    brew services start mongodb/brew/mongodb-community
    ```
## cloudfront api 정보
endpoints:
  POST - https://32zh5dokee.execute-api.ap-northeast-2.amazonaws.com/schedules
  GET - https://32zh5dokee.execute-api.ap-northeast-2.amazonaws.com/schedules
functions:
  schedulerApi: scheduler-service-dev-schedulerApi (47 MB)
  sqsWorker: scheduler-service-dev-sqsWorker (47 MB)