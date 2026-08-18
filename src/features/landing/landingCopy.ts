export type LandingLanguage = 'en' | 'ko' | 'ja' | 'zh'

interface ContactCard { title: string; body: string; action: string; note: string }

export interface LandingCopy {
  meta: { title: string; description: string }
  nav: { how: string; privacy: string; faq: string; install: string; languageLabel: string; systemLanguage: string }
  hero: { eyebrow: string; line1: string; line2: string; body: string; install: string; how: string; meta: string }
  supportedSites: string
  how: { eyebrow: string; title: string; steps: Array<{ n: string; title: string; body: string }> }
  // A fixed-length tuple, not `string[]`: LandingPage pairs each point with one of 3 fixed
  // icons positionally (PRIVACY_ICONS[index]), so a locale with a different count would
  // silently render `undefined` for the extra/missing icon -- the tuple type catches that
  // at compile time instead.
  privacy: { eyebrow: string; title: string; body: string; points: [string, string, string] }
  languages: { eyebrow: string; body: string; defaultLabel: string }
  faq: { eyebrow: string; title: string; items: Array<{ q: string; a: string }> }
  contact: {
    eyebrow: string
    title: string
    body: string
    // Same reasoning as `privacy.points`: paired positionally with CONTACT_CHANNELS (3 entries).
    cards: [ContactCard, ContactCard, ContactCard]
  }
  cta: { title: string; steps: string[]; release: string; guide: string; note: string }
  footer: { privacy: string; guide: string; contact: string; note: string }
  demo: {
    before: string
    after: string
    rationale: string[]
    model: string
    status: { draft: string; scoring: string; typing: string; result: string }
  }
  architecture: {
    label: string
    noServer: string
    prompt: string
    editor: string
    provider: string
    providerSub: string
    storage: string
    storageSub: string
  }
}

export const LANGUAGE_OPTIONS: Array<{ code: LandingLanguage; short: string; label: string }> = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'ko', short: 'KO', label: '한국어' },
  { code: 'ja', short: 'JA', label: '日本語' },
  { code: 'zh', short: 'ZH', label: '简体中文' },
]

export const LANDING_COPY: Record<LandingLanguage, LandingCopy> = {
  en: {
    meta: {
      title: 'Ondrift — A clearer prompt before you send',
      description: 'A free Chrome extension that makes rough prompts clearer and more specific before you send them in ChatGPT, Claude, Gemini, or Perplexity.',
    },
    nav: { how: 'How it works', privacy: 'Privacy', faq: 'FAQ', install: 'Add to Chrome', languageLabel: 'Page language', systemLanguage: 'System' },
    hero: {
      eyebrow: 'A CLEARER PROMPT, RIGHT WHERE YOU TYPE', line1: 'Start with a rough prompt.', line2: 'Send a clearer one.',
      body: 'Write as usual in ChatGPT, Claude, Gemini, or Perplexity. Ondrift highlights what is missing, explains the score, and lets you apply a clearer version in one click. No account or Ondrift server required.',
      install: 'Add to Chrome — Free', how: 'See how it works',
      meta: 'Chrome extension · English by default · Korean, Japanese & Chinese supported · AI provider API key required',
    },
    supportedSites: 'Supported sites',
    how: {
      eyebrow: 'HOW IT WORKS', title: 'Three steps. That’s it.',
      steps: [
        { n: '01', title: 'Write as usual', body: 'Type your prompt in ChatGPT, Claude, Gemini, or Perplexity just like you always do. Ondrift stays out of the way.' },
        { n: '02', title: 'Score and rewrite', body: 'Ask the Ondrift widget to review clarity, context, and constraints. It returns a score, rationale, and an improved version.' },
        { n: '03', title: 'Review and apply', body: 'Apply the rewrite with one click, ignore it, or keep editing directly in the prompt box. You stay in control.' },
      ],
    },
    privacy: {
      eyebrow: 'WHY NO SERVER?', title: 'No account. No Ondrift server.',
      body: 'When you choose to rewrite a prompt, your browser sends only that prompt directly to your selected AI provider. No Ondrift-operated server sits in between.',
      points: [
        'Settings stay in chrome.storage.local. Optional history stays in your browser’s local IndexedDB.',
        'Only prompts you explicitly ask to rewrite are sent. AI response content is never collected or stored.',
        'Your AI provider API keys stay under your control — and keeping them secure remains your responsibility.',
      ],
    },
    languages: { eyebrow: 'SUPPORTED LANGUAGES', body: 'English is the default. Use the header control to switch languages anytime.', defaultLabel: 'Default' },
    faq: {
      eyebrow: 'FAQ', title: 'Common questions',
      items: [
        { q: 'Is Ondrift free to use?', a: 'Yes. Ondrift itself is free and open source. You only ever pay your AI provider directly for API usage — Ondrift never charges a fee or runs its own server.' },
        { q: 'Does Ondrift send my prompts to a server?', a: 'No. Ondrift has no backend. When you ask it to rewrite a prompt, your browser sends that prompt directly to the AI provider you configured, using your own API key.' },
        { q: 'Which chat sites and AI providers does Ondrift support?', a: 'Ondrift works inside ChatGPT, Claude, Gemini, and Perplexity, and currently rewrites prompts using your own Gemini API key.' },
        { q: 'How do I install Ondrift? Is it on the Chrome Web Store?', a: 'Yes — Ondrift is on the Chrome Web Store. Click Add to Chrome above, pin the extension, and add your AI provider API key to get started.' },
        { q: 'Is my API key safe?', a: 'Your key is stored locally in chrome.storage.local and is only ever sent in direct calls to your AI provider. Keeping it secure remains your responsibility, the same as any API key.' },
        { q: 'Can I keep a history of my prompt rewrites?', a: 'Yes, optionally. History is stored locally in your browser’s IndexedDB only — never on a server — and you can clear it anytime from the Options page.' },
      ],
    },
    contact: {
      eyebrow: 'CONTACT & FEEDBACK',
      title: 'Still have a question?',
      body: 'Choose the channel that fits. Everything runs through GitHub, with no Ondrift server or support fee.',
      cards: [
        { title: 'Found a bug?', body: 'Tell us what happened and how to reproduce it.', action: 'Report a bug', note: 'Public GitHub issue' },
        { title: 'Have an idea?', body: 'Suggest a feature or improvement for Ondrift.', action: 'Suggest a feature', note: 'Public GitHub issue' },
        { title: 'Need help?', body: 'GitHub Discussions is just getting started. General questions and first posts are welcome.', action: 'Ask in Q&A', note: 'Public GitHub discussion' },
      ],
    },
    cta: {
      title: 'Install it in your browser',
      steps: ['Click “Add to Chrome” on the Chrome Web Store page', 'Pin the Ondrift icon for quick access', 'Add your AI provider API key and start using Ondrift'],
      release: 'Add to Chrome', guide: 'View on GitHub',
      note: 'Free to install · No account required.',
    },
    footer: {
      privacy: 'Privacy policy', guide: 'Install guide', contact: 'Contact',
      note: 'Google, Gemini, ChatGPT, Claude, and Perplexity are trademarks of their respective owners. Ondrift is not affiliated with them.',
    },
    demo: {
      before: 'Turn this meeting transcript into notes',
      after: `## **Meeting notes goal**
Turn the transcript below into actionable meeting notes.

## **Output format**
1. **Key points by participant**
2. **Decisions and rationale**
3. **Action items** — owner | task | due date in a Markdown table

## **Rules**
- Mark unclear owners or deadlines as **Needs confirmation**
- Preserve all numbers and dates exactly`,
      rationale: ['Turns a vague request into an actionable goal', 'Specifies Markdown headings, emphasis, and a table', 'Adds rules for missing details and accuracy'],
      model: 'Based on Gemini 3.6 Flash',
      status: { draft: 'Drafting', scoring: 'Ondrift is reviewing…', typing: 'Writing the improved prompt…', result: 'Rewrite complete · Ready to apply' },
    },
    architecture: {
      label: 'The extension calls your selected AI provider directly from the browser. Settings and optional history stay in local storage, with no Ondrift server in the data path.',
      noServer: 'No Ondrift server', prompt: 'Prompt', editor: 'editor', provider: 'AI provider', providerSub: 'Your API key', storage: 'Local storage', storageSub: 'storage · IndexedDB',
    },
  },
  ko: {
    meta: {
      title: 'Ondrift — 보내기 전에 더 명확한 프롬프트로',
      description: '대충 쓴 프롬프트도 ChatGPT, Claude, Gemini, Perplexity에 보내기 전에 더 명확하고 구체적으로 개선하는 무료 Chrome 확장 프로그램입니다.',
    },
    nav: { how: '동작 방식', privacy: '프라이버시', faq: '자주 묻는 질문', install: 'Chrome에 추가', languageLabel: '페이지 언어', systemLanguage: '시스템 언어' },
    hero: {
      eyebrow: '쓰던 입력창에서 바로 더 명확하게', line1: '대충 써도 괜찮습니다.', line2: '보내기 전에 더 명확하게.',
      body: 'ChatGPT, Claude, Gemini, Perplexity에서 평소처럼 작성하세요. Ondrift가 빠진 내용을 짚고 점수의 이유를 설명한 뒤, 더 명확한 프롬프트를 한 번에 적용해 줍니다. 계정이나 Ondrift 서버는 필요 없습니다.',
      install: 'Chrome에 추가 (무료)', how: '동작 방식 보기',
      meta: 'Chrome 확장 · 기본 언어 English · 한국어·日本語·中文 지원 · AI 제공자 API 키 필요',
    },
    supportedSites: '지원 사이트',
    how: {
      eyebrow: '동작 방식', title: '세 단계면 충분합니다',
      steps: [
        { n: '01', title: '그대로 씁니다', body: '평소처럼 ChatGPT, Claude, Gemini, Perplexity에 프롬프트를 작성합니다. Ondrift는 방해하지 않습니다.' },
        { n: '02', title: '점수와 재작성', body: 'Ondrift 위젯이 명확성·맥락·제약을 검토해 점수, 근거, 다시 쓴 버전을 함께 보여줍니다.' },
        { n: '03', title: '검토 후 적용', body: '마음에 들면 한 클릭으로 적용하고, 아니면 무시하거나 입력창에서 계속 수정할 수 있습니다.' },
      ],
    },
    privacy: {
      eyebrow: '왜 서버가 없나요', title: '계정도, Ondrift 서버도 없습니다',
      body: '재작성을 선택하면 해당 프롬프트만 브라우저에서 선택한 AI 제공자로 직접 전송됩니다. 그 사이에 Ondrift가 운영하는 서버는 없습니다.',
      points: [
        '설정은 chrome.storage.local에, 선택한 경우의 기록은 브라우저의 로컬 IndexedDB에만 남습니다.',
        '재작성을 요청한 프롬프트만 전송되며, AI 응답 본문은 수집하거나 저장하지 않습니다.',
        'AI 제공자 API 키는 사용자가 직접 관리하며, 안전하게 보관할 책임도 사용자에게 있습니다.',
      ],
    },
    languages: { eyebrow: '지원 언어', body: '기본 언어는 영어이며, 헤더에서 언제든 한국어·일본어·중국어로 변경할 수 있습니다.', defaultLabel: '기본' },
    faq: {
      eyebrow: '자주 묻는 질문', title: '궁금한 점',
      items: [
        { q: 'Ondrift는 무료인가요?', a: '네. Ondrift 자체는 무료이며 오픈소스입니다. AI 제공자에게 지불하는 API 사용 비용만 발생하며, Ondrift는 별도 요금이나 자체 서버를 두지 않습니다.' },
        { q: 'Ondrift가 제 프롬프트를 서버로 전송하나요?', a: '아니요. Ondrift에는 백엔드 서버가 없습니다. 재작성을 요청하면 브라우저가 설정한 AI 제공자에게 직접 프롬프트를 전송하며, 이때 사용자의 API 키가 사용됩니다.' },
        { q: 'Ondrift는 어떤 사이트와 AI 제공자를 지원하나요?', a: 'ChatGPT, Claude, Gemini, Perplexity 안에서 동작하며, 현재는 사용자의 Gemini API 키로 프롬프트를 재작성합니다.' },
        { q: 'Ondrift는 어떻게 설치하나요? 크롬 웹 스토어에 있나요?', a: '네, Ondrift는 Chrome 웹 스토어에 있습니다. 위의 "Chrome에 추가" 버튼을 눌러 확장 프로그램을 추가하고 AI 제공자 API 키를 등록하면 바로 사용할 수 있습니다.' },
        { q: '제 API 키는 안전한가요?', a: 'API 키는 chrome.storage.local에 로컬로 저장되며, 선택한 AI 제공자로 직접 전송될 때만 사용됩니다. 다른 API 키와 마찬가지로 안전하게 보관하는 책임은 사용자에게 있습니다.' },
        { q: '재작성 기록을 남길 수 있나요?', a: '네, 선택 사항입니다. 기록은 서버가 아닌 브라우저의 로컬 IndexedDB에만 저장되며, Options 페이지에서 언제든 삭제할 수 있습니다.' },
      ],
    },
    contact: {
      eyebrow: '문의 및 피드백',
      title: '아직 궁금한 점이 있나요?',
      body: '문의 유형에 맞는 채널을 선택하세요. 모두 GitHub에서 무료로 운영되며 Ondrift 서버를 거치지 않습니다.',
      cards: [
        { title: '문제가 발생했나요?', body: '발생한 현상과 재현 방법을 알려주세요.', action: '버그 제보하기', note: '공개 GitHub 이슈' },
        { title: '아이디어가 있나요?', body: 'Ondrift에 필요한 기능이나 개선점을 제안해 주세요.', action: '기능 제안하기', note: '공개 GitHub 이슈' },
        { title: '도움이 필요한가요?', body: 'GitHub Discussions에 일반 질문을 남겨주세요. 첫 질문도 환영합니다.', action: 'Q&A에 질문하기', note: '공개 GitHub 토론' },
      ],
    },
    cta: {
      title: '지금 브라우저에 설치하세요',
      steps: ['Chrome 웹 스토어 페이지에서 "Chrome에 추가" 클릭', '빠른 접근을 위해 확장 프로그램 고정', 'AI 제공자 API 키를 등록하고 사용 시작'],
      release: 'Chrome에 추가', guide: 'GitHub에서 보기',
      note: '무료 설치 · 계정이 필요 없습니다.',
    },
    footer: {
      privacy: '개인정보 처리방침', guide: '설치 가이드', contact: '문의하기',
      note: 'Google, Gemini, ChatGPT, Claude, Perplexity는 각 소유자의 상표이며 Ondrift와 제휴 관계가 없습니다.',
    },
    demo: {
      before: '회의 녹취 정리해줘',
      after: `## **회의록 작성 목표**
다음 회의 녹취를 실행 가능한 회의록으로 정리해줘.

## **출력 형식**
1. **참석자별 핵심 발언**
2. **결정 사항과 근거**
3. **후속 조치** — 담당자 | 할 일 | 기한 마크다운 표

## **작성 규칙**
- 불명확한 담당자·기한은 추측하지 말고 **확인 필요**로 표시
- 수치와 날짜는 원문 그대로 유지`,
      rationale: ['업무 목적을 실행 중심으로 구체화', '마크다운 제목·강조·표 형식 적용', '누락 정보 처리·정확성 규칙 추가'],
      model: 'Gemini 3.6 Flash 기준',
      status: { draft: '작성 중', scoring: 'Ondrift가 검토하는 중…', typing: '개선된 프롬프트 작성 중…', result: '재작성 완료 · 적용 대기' },
    },
    architecture: {
      label: '확장 프로그램이 브라우저에서 선택한 AI 제공자를 직접 호출하고, 설정과 기록은 로컬 저장소에만 남기는 구조도입니다. Ondrift 서버는 이 경로에 없습니다.',
      noServer: 'Ondrift 서버 없음', prompt: '프롬프트', editor: '편집기', provider: 'AI 제공자', providerSub: '내 API 키', storage: '로컬 저장소', storageSub: 'storage · IndexedDB',
    },
  },
  ja: {
    meta: {
      title: 'Ondrift — 送信前に、もっと明確なプロンプトへ',
      description: 'ラフなプロンプトも、ChatGPT、Claude、Gemini、Perplexityへ送信する前に、より明確で具体的に改善できる無料のChrome拡張機能です。',
    },
    nav: { how: '仕組み', privacy: 'プライバシー', faq: 'よくある質問', install: 'Chromeに追加', languageLabel: 'ページの言語', systemLanguage: 'システム言語' },
    hero: {
      eyebrow: 'いつもの入力欄で、もっと明確に', line1: 'ラフに書いても大丈夫。', line2: '送信前に、もっと明確に。',
      body: 'ChatGPT、Claude、Gemini、Perplexityでいつも通り入力してください。Ondriftが不足している内容とスコアの理由を示し、より明確なプロンプトをワンクリックで適用します。アカウントもOndriftサーバーも不要です。',
      install: 'Chromeに追加(無料)', how: '仕組みを見る',
      meta: 'Chrome拡張 · デフォルトは英語 · 韓国語・日本語・中国語対応 · AIプロバイダーのAPIキーが必要',
    },
    supportedSites: '対応サイト',
    how: {
      eyebrow: '仕組み', title: 'わずか3ステップ',
      steps: [
        { n: '01', title: 'いつも通り書く', body: 'ChatGPT、Claude、Gemini、Perplexityに、いつも通りプロンプトを入力します。' },
        { n: '02', title: '評価して改善', body: 'Ondriftが明確さ、文脈、制約を確認し、スコア、根拠、改善案を表示します。' },
        { n: '03', title: '確認して適用', body: '気に入ればワンクリックで適用。無視することも、入力欄でさらに編集することもできます。' },
      ],
    },
    privacy: {
      eyebrow: 'なぜサーバーがないのか', title: 'アカウントもOndriftサーバーも不要',
      body: '改善を選択すると、そのプロンプトだけがブラウザから選択したAIプロバイダーへ直接送信されます。Ondriftのサーバーは介在しません。',
      points: [
        '設定はchrome.storage.localに、任意の履歴はブラウザのIndexedDBにのみ保存されます。',
        '明示的に改善を依頼したプロンプトだけを送信し、AIの回答本文は収集・保存しません。',
        'AIプロバイダーのAPIキーはユーザー自身が管理し、安全に保管する責任もユーザーにあります。',
      ],
    },
    languages: { eyebrow: '対応言語', body: 'デフォルトは英語です。ヘッダーからいつでも韓国語・日本語・中国語に切り替えられます。', defaultLabel: 'デフォルト' },
    faq: {
      eyebrow: 'よくある質問', title: 'よくある質問',
      items: [
        { q: 'Ondriftは無料ですか？', a: 'はい。Ondrift自体は無料でオープンソースです。かかるのはAIプロバイダーへのAPI利用料のみで、Ondriftが料金を請求したり自前のサーバーを運用したりすることはありません。' },
        { q: 'Ondriftはプロンプトをサーバーに送信しますか？', a: 'いいえ。Ondriftにバックエンドはありません。プロンプトの改善を依頼すると、ブラウザが設定したAIプロバイダーへ直接そのプロンプトを送信します。その際に使われるのは自分のAPIキーです。' },
        { q: 'Ondriftはどのサイトとプロバイダーに対応していますか？', a: 'ChatGPT、Claude、Gemini、Perplexityの中で動作し、現在は自分のGemini APIキーでプロンプトを改善します。' },
        { q: 'Ondriftはどうやってインストールしますか？Chromeウェブストアにありますか？', a: 'はい、OndriftはChromeウェブストアで公開されています。上の「Chromeに追加」ボタンから追加し、AIプロバイダーのAPIキーを登録すればすぐに使えます。' },
        { q: 'APIキーは安全ですか？', a: 'APIキーはchrome.storage.localにローカル保存され、選択したAIプロバイダーへの直接通信でのみ使用されます。他のAPIキーと同様、安全な管理はユーザーの責任です。' },
        { q: '改善履歴を残せますか？', a: 'はい、任意で残せます。履歴はサーバーではなくブラウザのローカルIndexedDBにのみ保存され、Optionsページからいつでも削除できます。' },
      ],
    },
    contact: {
      eyebrow: 'お問い合わせ・フィードバック',
      title: 'まだ質問がありますか？',
      body: '内容に合う窓口を選んでください。すべてGitHub上で無料運用され、Ondriftサーバーは使用しません。',
      cards: [
        { title: '不具合を見つけましたか？', body: '発生した問題と再現手順をお知らせください。', action: '不具合を報告', note: '公開GitHub Issue' },
        { title: 'アイデアがありますか？', body: 'Ondriftの新機能や改善案をご提案ください。', action: '機能を提案', note: '公開GitHub Issue' },
        { title: 'サポートが必要ですか？', body: 'GitHub Discussionsに一般的な質問を投稿してください。最初の質問も歓迎します。', action: 'Q&Aで質問する', note: '公開GitHub Discussion' },
      ],
    },
    cta: {
      title: 'ブラウザにインストール',
      steps: ['Chromeウェブストアのページで「Chromeに追加」をクリック', 'すぐ使えるように拡張機能をピン留め', 'AIプロバイダーのAPIキーを追加して利用開始'],
      release: 'Chromeに追加', guide: 'GitHubで見る',
      note: '無料でインストール · アカウント不要。',
    },
    footer: {
      privacy: 'プライバシーポリシー', guide: 'インストールガイド', contact: 'お問い合わせ',
      note: 'Google、Gemini、ChatGPT、Claude、Perplexityは各社の商標です。Ondriftは各社と提携していません。',
    },
    demo: {
      before: '会議の文字起こしを議事録にまとめて',
      after: `## **議事録の目的**
以下の文字起こしを、実行可能な議事録にまとめてください。

## **出力形式**
1. **参加者ごとの主な発言**
2. **決定事項と根拠**
3. **フォローアップ** — 担当者 | タスク | 期限のMarkdown表

## **作成ルール**
- 不明な担当者や期限は推測せず、**要確認**と表示
- 数値と日付は原文のまま維持`,
      rationale: ['目的を実行中心に具体化', 'Markdownの見出し・強調・表を指定', '不足情報と正確性のルールを追加'],
      model: 'Gemini 3.6 Flashを基準',
      status: { draft: '入力中', scoring: 'Ondriftが確認中…', typing: '改善したプロンプトを作成中…', result: '改善完了 · 適用可能' },
    },
    architecture: {
      label: '拡張機能はブラウザから選択したAIプロバイダーを直接呼び出します。設定と任意の履歴はローカルに保存され、Ondriftサーバーは介在しません。',
      noServer: 'Ondriftサーバーなし', prompt: 'プロンプト', editor: 'エディター', provider: 'AIプロバイダー', providerSub: '自分のAPIキー', storage: 'ローカル保存', storageSub: 'storage · IndexedDB',
    },
  },
  zh: {
    meta: {
      title: 'Ondrift — 发送前先打磨你的提示词',
      description: '一款本地优先的 Chrome 扩展程序,在 ChatGPT、Claude、Gemini 和 Perplexity 中为提示词打分并重写,使用你自己的 AI 提供商 API 密钥。',
    },
    nav: { how: '工作原理', privacy: '隐私', faq: '常见问题', install: '添加到 Chrome', languageLabel: '页面语言', systemLanguage: '系统语言' },
    hero: {
      eyebrow: '本地优先的提示词工具', line1: '先写一次,', line2: '发送前更进一步。',
      body: '在 ChatGPT、Claude、Gemini 和 Perplexity 的输入框中检查提示词,查看评分和理由,然后一键重写。无需账号,也没有 Ondrift 服务器 — 只需要你自己的 AI 提供商 API 密钥。',
      install: '添加到 Chrome(免费)', how: '查看工作原理',
      meta: 'Chrome 扩展程序 · 默认英文 · 支持韩语、日语与中文 · 需要 AI 提供商 API 密钥',
    },
    supportedSites: '支持的网站',
    how: {
      eyebrow: '工作原理', title: '只需三步',
      steps: [
        { n: '01', title: '照常输入', body: '像往常一样在 ChatGPT、Claude、Gemini 或 Perplexity 中输入提示词。Ondrift 不会打扰你。' },
        { n: '02', title: '评分并重写', body: '让 Ondrift 小组件检查清晰度、上下文和限制条件,它会返回评分、理由和改进后的版本。' },
        { n: '03', title: '检查并应用', body: '一键应用重写结果,忽略它,或直接在输入框中继续编辑。主导权始终在你手中。' },
      ],
    },
    privacy: {
      eyebrow: '为什么没有服务器', title: '无需账号,也没有 Ondrift 服务器',
      body: '当你选择重写提示词时,浏览器只会把该提示词直接发送给你选择的 AI 提供商。中间没有 Ondrift 运营的服务器。',
      points: [
        '设置保存在 chrome.storage.local 中,可选的历史记录只保存在浏览器本地的 IndexedDB 中。',
        '只有你明确要求重写的提示词才会被发送,AI 的回复内容不会被收集或存储。',
        '你的 AI 提供商 API 密钥由你自己保管,安全责任也在于你。',
      ],
    },
    languages: { eyebrow: '支持的语言', body: '默认语言为英语,你可以随时在页头切换为韩语、日语或中文。', defaultLabel: '默认' },
    faq: {
      eyebrow: '常见问题', title: '常见问题',
      items: [
        { q: 'Ondrift 是免费的吗?', a: '是的。Ondrift 本身是免费且开源的。你只需要直接向 AI 提供商支付 API 使用费用 — Ondrift 不收取任何费用,也不运行自己的服务器。' },
        { q: 'Ondrift 会把我的提示词发送到服务器吗?', a: '不会。Ondrift 没有后端服务器。当你要求重写提示词时,浏览器会使用你自己的 API 密钥,把提示词直接发送给你配置的 AI 提供商。' },
        { q: 'Ondrift 支持哪些聊天网站和 AI 提供商?', a: 'Ondrift 可在 ChatGPT、Claude、Gemini 和 Perplexity 中使用,目前使用你自己的 Gemini API 密钥来重写提示词。' },
        { q: '如何安装 Ondrift?它上架 Chrome 网上应用店了吗?', a: '是的,Ondrift 已上架 Chrome 网上应用店。点击上方的「添加到 Chrome」按钮添加扩展程序,并配置你的 AI 提供商 API 密钥即可开始使用。' },
        { q: '我的 API 密钥安全吗?', a: '你的密钥保存在本地的 chrome.storage.local 中,只有在直接调用你的 AI 提供商时才会被发送。和任何 API 密钥一样,安全保管的责任在于你自己。' },
        { q: '可以保留提示词重写的历史记录吗?', a: '可以,这是可选的。历史记录只保存在浏览器本地的 IndexedDB 中 — 绝不会上传到服务器 — 你可以随时在 Options 页面中清除它。' },
      ],
    },
    contact: {
      eyebrow: '联系与反馈',
      title: '还有其他问题?',
      body: '选择适合你的渠道。一切都在 GitHub 上免费运行,没有 Ondrift 服务器,也不收取支持费用。',
      cards: [
        { title: '发现了 bug?', body: '告诉我们发生了什么,以及如何重现。', action: '报告 bug', note: '公开 GitHub issue' },
        { title: '有新想法?', body: '为 Ondrift 提出新功能或改进建议。', action: '提出建议', note: '公开 GitHub issue' },
        { title: '需要帮助?', body: 'GitHub Discussions 刚刚起步,欢迎提出一般性问题,也欢迎第一次发帖。', action: '在 Q&A 中提问', note: '公开 GitHub discussion' },
      ],
    },
    cta: {
      title: '在浏览器中安装',
      steps: ['在 Chrome 网上应用店页面点击「添加至 Chrome」', '固定扩展程序图标以便快速访问', '添加你的 AI 提供商 API 密钥,开始使用 Ondrift'],
      release: '添加到 Chrome', guide: '在 GitHub 上查看',
      note: '免费安装 · 无需账号。',
    },
    footer: {
      privacy: '隐私政策', guide: '安装指南', contact: '联系我们',
      note: 'Google、Gemini、ChatGPT、Claude 和 Perplexity 是其各自所有者的商标。Ondrift 与它们没有从属关系。',
    },
    demo: {
      before: '把这段会议记录整理成笔记',
      after: `## **会议纪要目标**
把下面的会议记录整理成可执行的会议纪要。

## **输出格式**
1. **按参与者列出的要点**
2. **决定事项及理由**
3. **行动项** — 负责人 | 任务 | 截止日期,使用 Markdown 表格

## **规则**
- 负责人或截止日期不明确时,标记为 **需要确认**
- 保持所有数字和日期原样不变`,
      rationale: ['把模糊的请求转化为可执行的目标', '指定了 Markdown 标题、强调和表格格式', '为缺失信息和准确性添加了规则'],
      model: '基于 Gemini 3.6 Flash',
      status: { draft: '起草中', scoring: 'Ondrift 正在审查…', typing: '正在撰写改进后的提示词…', result: '重写完成 · 可以应用' },
    },
    architecture: {
      label: '扩展程序会直接从浏览器调用你选择的 AI 提供商。设置和可选的历史记录都保存在本地存储中,数据路径中没有 Ondrift 服务器。',
      noServer: '没有 Ondrift 服务器', prompt: '提示词', editor: '编辑器', provider: 'AI 提供商', providerSub: '你的 API 密钥', storage: '本地存储', storageSub: 'storage · IndexedDB',
    },
  },
}
