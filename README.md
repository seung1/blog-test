# 테스트 레포

기술블로그를 만드는 과정에서 배포환경에서만 발생하는 문제를 해결하기 위한 테스트 레포입니다.

### 문제 생기기전
![문제생기기전](/public/images/문제생기기전.png)

### 문제 발생
![문제발생](/public/images/문제발생.png)

## 문제상황
![문제발생하는 커밋](/public/images/문제발생하는%20커밋.png)
- [feat: 검색엔진 메타 데이터 추가](https://github.com/seung1/seung1-blog/commit/746add282d9cb60481c9ef0e029a36209bd85507)에서 배포했을때는 문제가 없었지만 [feat: draft 기능 추가](https://github.com/seung1/seung1-blog/commit/6c71ed98777517999e714b11f8b4cc8fb7723d1b)에서 배포했을때, 우측 상단에 테마를 설정하는 컴포넌트가 사라진다.
- 로컬 환경에서는 발생하지 않고 배포환경에서만 발생한다.
- 테마 컴포넌트뿐 아니라 클라이언트에서 동작하는 리액트 코드(ex. useEffect)가 수행되지 않는, Hydration 실패 문제가 발생했다.

## 해결과정
- 새로운 레포지토리 생성 (현재 레포)
- 문제가 되는 12개의 커밋중에서 스타일, 마크다운 추가를 제외한 문제 후보 커밋 리스트 업
- 하나씩 적용 배포하면서 문제 커밋 파악
- 문제가 되는 커밋에서 문제 후보 파일 리스트업
- 파일에서 문제 코드 찾기

## 문제원인
```tsx
import { allMDXPosts, allPosts } from 'contentlayer/generated';

export const Header = () => {
  const categories = [...allPosts, ...allMDXPosts].map((post) => post.category);
  ...
}
```
- 문제가 되는 코드는 위와같다.
  - 왜 Header에서 글 데이터에 접근했냐면, 블로그 설계상 상단 버튼을 카테고리로 구성했다.
  - 근데 새로운 카테고리를 추가할때마다 Header 컴포넌트를 변경하는 번거로움을 줄이려고 현재 있는 글에서 추출해서 동적으로 구성하려고 했다. 그러려면 글 데이터에서 카테고리 정보를 가져와야했다.
- Contentlayer는 빌드 타임 서버 전용 코드인데 클라이언트에서 해당 파일에 접근했던것이 문제였다.
  - fs, path, process, import.meta.url 등 브라우저에 존재하지 않는 Node.js API가 포함되어 있어서 실행 불가하다.
 
> App Directory
> 
> Contentlayer is now optimized for use with React server components (RSC) within the app directory, which was introduced in Next 13. Learn more in the Next beta docs
>
> Server vs Client components
>
> At this time, we recommend using Contentlayer with server components.
>
> Using Contentlayer data with client components is likely to require users to download data from the entire page. Unless solving a specific need that requires Contentlayer, we recommend using server components.

- [공식문서](https://contentlayer.dev/docs/environments/nextjs-dcf8e39e?utm_source=chatgpt.com#app-directory)에 따르면 서버컴포넌트에 최적화 되어있고 서버환경에서 접근하라고 안내하고 있다.
- 결국 사용하는 라이브러리의 사용법조차 안읽고 사용하려했던 것이 문제를 발생시켰다.

## 해결
- 우선 클라이언트에서 `contentlayer/generated`에 접근하는 코드를 모두 제거했다.
- 만약 클라이언트에서 글 데이터가 필요할 경우는 `getStaticProps`를 통해 Contentlayer의 글 데이터를 불러와 페이지에 전달했다.
- 추후에 app router로 변경하여 더 편하게 사용해야겠다.
