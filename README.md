# Ondrift Control Tower

전기·전자부품 제조사의 수주부터 출하·서비스까지 연결하는 React 기반 통합 제조 대시보드 MVP입니다.

## 시작하기

Node.js 20 이상을 권장합니다.

```bash
npm install
copy .env.example .env
npm run dev
```

기본 API 주소는 `http://localhost:8000/api/v1`입니다. 다른 주소는 `.env`의 `VITE_API_BASE_URL`로 지정합니다.

첫 화면에서 백엔드가 제공하는 `admin / ondrift-admin`(ADMIN) 또는 `viewer / ondrift-viewer`(VIEWER) 데모 계정으로 로그인합니다. 이 값은 로컬 검토용이며 배포 전에 반드시 교체해야 합니다. 인증 토큰은 브라우저 탭 세션에만 보관됩니다. 백엔드 없이 UI를 검토할 때는 명시적인 데모 둘러보기를 선택할 수 있습니다.

## 검증

```bash
npm test
npm run build
```

## 제품 범위

- 반응형 앱 셸과 11개 제조 모듈 내비게이션
- 홈 KPI, 단계별 진행 차트, 위험 신호와 근거 목록 drill-down
- 프로젝트 Digital Thread를 통한 수주→BOM→구매→생산→품질→출하 추적
- 서버 응답 기준 페이지네이션
- 로딩, 오류, 빈 상태와 명시적 데모 fallback

API와 현재 MVP 경계는 [MVP 범위와 API 계약](docs/MVP_SCOPE_AND_API.md), 코드 규칙은 [개발 컨벤션](docs/DEVELOPMENT_CONVENTIONS.md)을 참고하세요.
