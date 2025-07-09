# g-todo: 게임 특화 투두 리스트 웹 애플리케이션

g-todo는 게이머들이 여러 게임의 일일/주간 과제(숙제)를 효율적으로 관리할 수 있도록 돕는 투두 리스트 서비스입니다. Next.js와 Supabase를 기반으로 구축되었으며, 다국어 지원 및 사용자 맞춤형 테마 기능을 제공합니다.

## ✨ 주요 기능

- **사용자 인증**: Supabase Auth를 통해 소셜 로그인 및 이메일 기반의 간편한 회원가입/로그인 기능을 제공합니다.
- **게임 관리**: 관리하고 싶은 게임을 직접 추가하고 목록으로 관리할 수 있습니다.
- **게임별 숙제 관리**: 각 게임에 맞춰 일일/주간 숙제를 추가하고, 완료 여부를 체크하며 진행 상황을 추적할 수 있습니다.
- **다국어 지원**: 영어, 한국어, 일본어, 중국어를 지원하여 전 세계 사용자들이 편리하게 이용할 수 있습니다. (`next-intl` 기반)
- **테마 변경**: 사용자의 취향에 맞춰 라이트 모드와 다크 모드를 선택할 수 있습니다.

## 🛠️ 기술 스택

- **프레임워크**: Next.js (App Router)
- **언어**: TypeScript
- **백엔드 & 인증**: Supabase
- **ORM**: Prisma
- **스타일링**: Tailwind CSS
- **UI**: Headless UI (예상, 컴포넌트 구조 기반)
- **국제화(i18n)**: `next-intl`
- **코드 품질**: ESLint

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone https://github.com/your-username/g-todo.git
cd g-todo
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

프로젝트 루트 디렉터리에 `.env.local` 파일을 생성하고, Supabase 프로젝트에서 발급받은 키를 입력합니다.

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

### 4. 데이터베이스 설정

Prisma를 사용하여 Supabase 데이터베이스 스키마를 동기화합니다. `init.sql` 파일은 초기 테이블 구조를 정의하고 있으며, 아래 명령어를 통해 데이터베이스에 반영할 수 있습니다.

```bash
npx prisma db push
```

### 5. 개발 서버 실행

```bash
npm run dev
```

이제 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 📜 사용 가능한 스크립트

- `npm run dev`: 개발 모드로 애플리케이션을 실행합니다.
- `npm run build`: 프로덕션용으로 애플리케이션을 빌드합니다.
- `npm run start`: 빌드된 프로덕션 서버를 실행합니다.
- `npm run lint`: ESLint를 사용하여 코드 스타일을 검사합니다.

## 📁 폴더 구조

```
/
├── public/           # 정적 에셋 (이미지, 폰트 등)
├── messages/         # 다국어 지원을 위한 번역 파일 (en, ko, ja, zh)
├── prisma/           # Prisma 스키마 및 설정
├── src/
│   ├── app/          # Next.js App Router 기반 페이지 및 레이아웃
│   │   └── [locale]/ # 다국어 라우팅
│   ├── components/   # 재사용 가능한 UI 컴포넌트
│   ├── i18n/         # next-intl 설정 및 라우팅
│   └── lib/          # Supabase 클라이언트, 유틸리티 함수 등
└── ...
```