# 고민우체국 (gominPost)

익명으로 고민을 나누고 따뜻한 위로를 주고받는 공간, 고민우체국입니다.

## 서비스 소개

고민우체국은 누구나 익명으로 자신의 고민을 털어놓고, 다른 사람들이 그 고민에 대해 진심 어린 답변을 남길 수 있는 웹 서비스입니다. 힘든 시기를 겪고 있는 사람들에게는 익명성을 보장하며 마음속 이야기를 꺼낼 기회를 제공하고, 다른 사람의 이야기에 귀 기울이고 싶은 봉사자들에게는 따뜻한 마음을 나눌 수 있는 장을 마련합니다.

### 주요 기능

1.  **고민 작성 (익명):** 사용자는 닉네임과 비밀번호만으로 완전히 익명으로 자신의 고민을 작성할 수 있습니다. 카테고리를 선택하여 고민의 성격을 분류할 수 있습니다.
2.  **고민 확인 및 답변 확인:** 고민 작성 시 설정한 닉네임과 비밀번호를 통해 본인이 작성한 고민과 해당 고민에 달린 봉사자들의 답변을 확인할 수 있습니다.
3.  **봉사자 로그인:** 봉사자는 별도의 회원가입 및 로그인을 통해 시스템에 접속합니다. 로그인한 봉사자는 등록된 고민 목록을 확인하고, 고민자에게 답변을 작성할 수 있습니다.
4.  **고민 답변:** 봉사자는 자신이 답변하고 싶은 고민을 선택하여 진솔한 답변을 작성합니다. 작성된 답변은 해당 고민자만 확인 가능합니다.
5.  **전문 상담 신청 (예정):** 향후 전문 상담사와 1:1 상담을 연계하는 기능을 추가할 예정입니다.

## 기술 스택

### Frontend

*   Next.js (React Framework)
*   TypeScript
*   Material UI (MUI)
*   Axios

### Backend

*   Spring Boot (Java)
*   Spring Data JPA
*   Spring Security (인증/인가)
*   JWT (JSON Web Token)
*   MySQL (Database)
*   Gradle (Build Tool) 또는 Maven

## 프로젝트 실행 방법

### 필수 설치 항목

*   Node.js 및 npm 또는 yarn
*   Java Development Kit (JDK) 17 이상
*   Maven 또는 Gradle
*   MySQL 데이터베이스

### Backend 실행

1.  `backend` 디렉토리로 이동합니다.
    ```bash
    cd backend
    ```
2.  `src/main/resources/application.properties` 파일을 열어 데이터베이스 연결 정보를 설정합니다.
3.  터미널에서 다음 명령어를 실행하여 애플리케이션을 빌드하고 실행합니다.
    *   Maven 사용 시:
        ```bash
        ./mvnw spring-boot:run
        ```
        (`mvnw` 파일이 없다면 `mvn wrapper:wrapper` 명령으로 생성 후 실행 권한을 부여하세요: `chmod +x mvnw`)
    *   Gradle 사용 시:
        ```bash
        ./gradlew bootRun
        ```

### Frontend 실행

1.  `frontend` 디렉토리로 이동합니다.
    ```bash
    cd frontend
    ```
2.  의존성 패키지를 설치합니다.
    ```bash
    npm install # 또는 yarn install
    ```
3.  개발 서버를 실행합니다.
    ```bash
    npm run dev # 또는 yarn dev
    ```
4.  브라우저에서 `http://localhost:3000` (또는 개발 서버가 실행된 포트)으로 접속합니다.

## 향후 개선/추가 예정 기능

*   전문 상담 기능 구현
*   봉사자-고민자 간 실시간 익명 채팅 기능
*   고민 및 답변 검색 기능
*   UI/UX 개선 및 추가 디자인 요소 적용

## 기여 방법

프로젝트에 기여하고 싶으시면 Issue를 통해 제안해주시거나 Pull Request를 보내주세요.
