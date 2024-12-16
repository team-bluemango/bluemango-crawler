export default {
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // Babel을 사용해 ESModules 변환
    },
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    testEnvironment: "node", // Node.js 환경에서 테스트 실행
    rootDir: "./src", // 테스트 파일의 루트 경로 설정
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1", // @/ 경로를 src/로 매핑
    },
};
