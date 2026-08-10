# Ondrift Frontend

[한국어](#한국어) | [English](#english)

## 한국어

Ondrift의 현재 Free MVP는 ChatGPT, Claude, Gemini, Perplexity에서 동작하는
로컬 우선 Chrome 확장 프로그램입니다. 사용자가 제공한 Gemini API 키로
프롬프트를 재작성하고 점수화하며, 개선된 프롬프트를 한 번에 적용할 수 있습니다.

### 현재 제품

- Manifest V3 Chrome 확장 프로그램
- ChatGPT, Claude, Gemini, Perplexity 프롬프트 입력창 연동
- 프롬프트 재작성, 명확성 점수, 개선 근거, 원클릭 적용
- 사용자 소유 Gemini API 키 사용
- API 키와 설정은 `chrome.storage.local`에 저장
- 프롬프트 기록과 사용량 메타데이터는 로컬 IndexedDB에 저장
- Free MVP에는 Ondrift 계정, 백엔드, 클라우드 동기화가 없음
- AI 응답 본문을 수집하거나 저장하지 않음

활성 제품의 소스와 설치 안내는
[Ondrift-Extension](https://github.com/Ondrift-labs/Ondrift-Extension) 저장소에
있습니다.

### 이 저장소의 상태

이 저장소에 있는 React 웹 대시보드는 이전 프로토타입이며 현재 Ondrift Free
MVP의 활성 클라이언트가 아닙니다. 제품 구조를 확장 프로그램 중심으로 이전하는
동안 참고용으로 유지합니다.

프로토타입 검증 명령:

```bash
npm install
npm test
npm run build
```

개발 규칙은 [docs/DEVELOPMENT_CONVENTIONS.md](docs/DEVELOPMENT_CONVENTIONS.md)를
참고하세요.

## English

The current Ondrift Free MVP is a local-first Chrome extension for ChatGPT,
Claude, Gemini, and Perplexity. It rewrites and scores prompts with the user's
own Gemini API key and lets the user apply an improved prompt in one click.

### Current product

- Manifest V3 Chrome extension
- Prompt-editor integrations for ChatGPT, Claude, Gemini, and Perplexity
- Prompt rewriting, clarity score, rationale, and one-click apply
- User-supplied Gemini API key
- API key and settings stored in `chrome.storage.local`
- Prompt history and usage metadata stored locally in IndexedDB
- No Ondrift account, backend, or cloud sync in the Free MVP
- No collection or storage of AI response bodies

The active product source and installation guide are in the
[Ondrift-Extension](https://github.com/Ondrift-labs/Ondrift-Extension)
repository.

### Status of this repository

The React web dashboard in this repository is an earlier prototype and is not
the active client for the Ondrift Free MVP. It remains available as a reference
while the product structure is migrated to the extension-first architecture.

Run the prototype checks with:

```bash
npm install
npm test
npm run build
```

See [docs/DEVELOPMENT_CONVENTIONS.md](docs/DEVELOPMENT_CONVENTIONS.md) for the
development rules.
