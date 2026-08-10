# MVP 범위와 API 계약

## 구현 범위

이번 MVP는 11개 대분류 모듈의 관제 내비게이션과 다음 세로 슬라이스를 제공한다.

1. 홈 KPI에서 근거 업무 목록으로 이동
2. 영업·수주 → 프로젝트 → BOM·설계변경 → MRP·구매 → 생산 → 품질 → 출하·서비스
3. 프로젝트 화면의 Digital Thread에서 단계별 참조번호와 상태 추적
4. 각 모듈의 운영 목록, 상태·진척·납기·위험 표시와 서버 기반 페이지네이션

세부 등록·승인·파일 업로드처럼 아직 API 계약이 확정되지 않은 기능은 별도 메뉴나 빈 화면으로 노출하지 않는다. 현재 `신규 등록`, `필터`, `내보내기` 버튼은 후속 업무 흐름의 위치를 보여주는 MVP UI이며 서버 변경을 실행하지 않는다.

## API 계약

- 기본 Base URL: `http://localhost:8000/api/v1`
- 환경 변수: `VITE_API_BASE_URL`
- 인증: `POST /auth/login`에 `{ "username", "password" }`를 보내고 받은 `access_token`을 Bearer 토큰으로 사용한다. 토큰은 탭 단위 `sessionStorage`에만 보관한다. 로컬 데모 계정은 `admin / ondrift-admin`, `viewer / ondrift-viewer`이며 배포 환경에서는 교체해야 한다.
- 목록 쿼리: `?page={1부터 시작}&size={페이지크기}`
- 공통 응답:

```json
{
  "items": [],
  "total": 0,
  "page": 1,
  "size": 10,
  "pages": 0
}
```

프런트엔드는 서버가 반환한 `page`, `size`, `pages`를 탐색 기준으로 사용한다. `items`와 `total`이 없거나 올바른 타입이 아니면 계약 오류로 처리한다.

## 엔드포인트

| 화면 | GET 엔드포인트 |
| --- | --- |
| 홈 주의 업무 | `/ncrs` |
| 영업·수주 | `/orders` |
| 프로젝트 | `/projects` |
| 설계·PDM | `/bom-items` |
| 구매·공급사 | `/purchase-orders` |
| 생산 | `/work-orders` |
| 자재·물류 | `/inventory` |
| 품질 | `/inspections` |
| 현장·서비스 | `/shipments` |
| 원가·경영 | `/projects` (EAC 전용 API 확정 전 프로젝트 현황) |
| 연구개발·검증 | `/wbs-tasks` (DVP&R 전용 API 확정 전 검증 작업 현황) |

백엔드의 도메인별 레코드는 어댑터가 공통 표시 모델 `id`, `reference`, `name`, `project`, `owner`, `status`, `dueDate`, `progress`, `risk`로 변환한다. 없는 값은 `미지정`으로 명확히 표시한다.

## 장애 및 데모 정책

- 최초에는 로딩 상태를 표시한다.
- 연결 실패, HTTP 오류, 계약 오류 시 원래 오류 메시지를 경고 영역에 노출한다.
- 동시에 페이지 검토가 가능하도록 데모 목록을 표시하며, 데모 데이터임을 표와 경고에서 반복 안내한다.
- 정상 API가 빈 목록을 반환하면 데모로 바꾸지 않고 빈 상태를 표시한다.
