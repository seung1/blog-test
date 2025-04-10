---
title: '[React 19] 공식문서 톺아보기 - UI표현하기'
date: 2025-03-28
description: '[리액트 공식문서 - 학습하기 - UI 표현하기] 내용을 공부하고 정리하였습니다.'
thumbnail: /images/react.webp
category: study
---

---

#### 다음에 대해서 잘 모른다면 본문을 읽어보세요.

1. CSR이 SSR와 비교하여 더 나은 점은 없을까요?
2. jsx에서는 왜 하나의 루트 엘리먼트를 반환해야 할까요?
3. key값에 왜 index를 사용하면 안될까요?

---

### 1. 첫번째 컴포넌트

#### 리액트를 이용한 컴포넌트 선언

```jsx
function Button() {
  return <button onClick={() => alert('Clicked!')}>Submit</button>;
}
```

#### 리액트 이전에 웹개발 방식

```jsx
// html
<div class='button'>Submit</div>;

// js
document.querySelector('.button').addEventListener('click', function () {
  alert('버튼이 클릭되었습니다!');
});
```

- 관심사 분리 - html, js, css로 나누어 개발
- 명령형 - js가 dom을 직접 조작하여 상호작용을 추가

#### onclick 이벤트를 html 태그에서 바로 사용할수는 없을까?

```jsx
  <button onclick="handleClick()">클릭</button>

  <script>
    function handleClick() {
      alert("BODY에 정의된 함수!");
    }
  </script>
```

위와 같이 이벤트를 처리할수는 있었으나 권장하지 않는다.

1. 가독성과 유지보수 저하 - html과 js가 혼재되어있어 html 코드가 복잡해진다.
2. 위와같은 로직을 통해 실행되는 handleClick은 전역 스코프에서 관리된다.
3. 이벤트 핸들러를 동적으로 처리하기가 어렵다.
4. XSS 공격에 취약하다. (악성 스크립트 실행)

---

#### 컴포넌트 정의 규칙 1 - 컴포넌트를 정의할때는 대문자로 시작해야한다.

- html 태그와 구분한다.
- 컴파일 단계에서 대문자로 시작하는 함수는 컴포넌트로 처리된다.

#### 컴포넌트 정의 규칙 2 - 컴포넌트안에 다른 컴포넌트를 정의하면 안된다.

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);

  // 매번 출력된다.
  function ChildComponent() {
    console.log('ChildComponent rendered');
    return <div>Child Component</div>;
  }

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increase Count</button>
      <ChildComponent />
    </div>
  );
}
```

- 부모 컴포넌트가 렌더링될때마다 자식 컴포넌트도 매번 재정의된다.

  - 원래 자식 컴포넌트는 부모에서 넘겨주는 props가 변경되면 리렌더링되는데 내부에 선언할 경우는 이와 상관없이 무조건 리렌더링된다.

- 재사용할수 없다.

  - 자식 컴포넌트를 다른곳에서 재사용할 수 없다.
  - 자식 컴포넌트의 독립적인 테스트가 어렵다.

---

#### 전통적인 리액트 동작 CSR

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My React App</title>
  </head>
  <body>
    <div id="root">
      <!-- 여기에 React 앱이 렌더링됨 -->
    </div>

    <script src="app.js">
      // <!-- React JavaScript 파일 -->
    </script>
  </body>
</html>
```

- 사용자는 js가 다운될때까지 빈화면을 보게된다.
- CSR은 대부분 js 코드로 구성되어있어서 첫 방문시 로딩 속도는 느리지만 js 코드를 캐싱할 수 있어서 재방문시 빠르게 보여줄 수 있고 코드분할 등을 적용할 수 있다.
- 재방문율이 높고 SEO가 중요하지 않은 어드민 페이지 같은 경우는 SSR보다 CSR이 좋은 선택일 수 있다.

#### 리액트 기반 프레임워크에서 지원하는 SSR SSG ISR

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My React App</title>
  </head>
  <body>
    <div id="root">
      <div class="card">
        <h2>Title 1</h2>
        <p>Description 1</p>
      </div>
      <div class="card">
        <h2>Title 2</h2>
        <p>Description 2</p>
      </div>
    </div>
    <script src="app.js">
      // <!-- React JavaScript 파일 -->
    </script>
  </body>
</html>
```

- html 파일을 컴포넌트를 렌더링해 html을 미리 생성한다.
  - SSR - 서버에서 생성
  - SSG - 빌드 시점에 생성
  - ISR - 주기마다 생성
- 브라우저가 html을 먼저 표시하고 app.js를 다운하고 실행한다. 그리고 html과 이벤트 핸들러를 연결하는 하이드레이션 과정을 수행한다.
  - 사용자는 js가 다운되기전에 컨텐츠를 먼저 볼 수 있디.
  - 미리 생성한 html에 컨텐츠에 대한 내용이 있으므로 seo에 유리하다.
  - 서버에서 생성하므로 클라이언트 부담이 줄어든다.
- CSR과 비교하여 html의 코드양은 다시 늘어나고 js 코드는 줄어든다. 이때 js는 하이드레이션만 수행한다.
- 완성된 html에 하이드레이션을 수행해서 초기 로딩속도는 CSR보다 빠르지만 방문할때마다 html을 로드해야한다.

<br />

### 2. 컴포넌트 Import 및 Export 하기

#### default export

```jsx
export default function Profile() {
  // ...
}
```

```jsx
import Profile from './Gallery.js';
```

#### named export

```jsx
export function Profile() {
  // ...
}
```

```jsx
import { Profile } from './Gallery.js';
```

![export](/images/react-dev/1-1.svg)

- 두 방법 다 한 파일에서 사용할 수도 있지만 한 파일에서는 하나의 default export만 존재할 수 있다.

#### 다른 이름으로 불러오는 방법

```jsx
import CustomName1 from './Gallery.js';
import { Profile as CustomName2 } from './Gallery.js';
```

### 3. JSX로 마크업 작성하기

- 로직이 내용을 결정하는 경우가 많아졌고 이것이 바로 React에서 렌더링 로직과 마크업이 같은 위치에 함께 있게 된 이유다.

- JSX와 React는 서로 다른 별개의 개념이다. JSX는 확장된 문법이고, React는 JavaScript 라이브러리다.

#### 기본적으로 js는 html 코드를 직접 작성할 수 없다.

```jsx
// 올바르지 못한 예시. js는 html을 작성할 수 없다.
function Profile() {
  return <img src='https://i.imgur.com/QIrZWGIs.jpg' alt='Alan L. Hart' />;
}
```

```jsx
// 위 코드를 js로 바꾼 결과
function Profile() {
  const img = document.createElement('img');
  img.src = 'https://i.imgur.com/QIrZWGIs.jpg';
  img.alt = 'Alan L. Hart';
  return img;
}
```

- html은 마크업 언어이고 js는 프로그래밍 언어이다.

- js에서 html을 직접적으로 사용할 수 있게해주는 문법이 JSX이다.

- 첫번째 예시에서 babel이 html 코드를 js로 바꿔주는 역할을 수행한다.

- js 파일에서 html 태그를 사용가능한게 아니라 babel이 바꿔주고 있었다. 즉, html 태그처럼보이지만 js코드로 변환된다.

#### 하나의 루트 엘리먼트 반환하기

```jsx
<div>Hello</div>

// React.createElement("div", null, "Hello")
```

- 하나의 태그로 반환한다.
- JSX는 HTML처럼 보이지만 내부적으로는 일반 JavaScript 객체로 변환된다.

```jsx
// ❌ 불가능
function Component() {
  return (
    <h1>Title</h1>
    <p>Content</p>
  );
}

// ✅ Fragment로 감싸준다
function Component() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}

// ✅ 배열로 감싸되 key값을 입력한다
function Component() {
  return [
    <h1 key="1">Title</h1>,
    <p key="2">Content</p>
  ];
}
```

- 하나의 배열로 감싸지 않은 하나의 함수에서는 두 개의 객체를 반환할 수 없기 때문에 또 다른 태그나 Fragment로 감싸지 않으면 두 개의 JSX 태그를 반환할 수 없다.

#### 하나의 루트 엘리먼트를 반환해야하는 이유

- jsx는 html과 비슷하게 생겼지만 js로 변환되며 최종적으로 React.createElement() 함수 호출로 이어지는데 자바스크립트의 return문은 하나의 값만 반환할 수 있다.
- 가상 dom은 트리구조로 이루어져 있다. 따라서 하나의 루트 엘리먼트를 사용해야 가상 dom 구조가 일관되게 유지된다. 또한 React의 재조정 알고리즘은 단일 트리구조에 최적화 되어있다.

```jsx
// jsx
function App() {
  return (
    <div className="container" id="app-root">
      <h1 style={{ color: 'blue' }}>Hello, World!</h1>
      <p className="text">This is a paragraph.</p>
    </div>
  );
}

// js
function App() {
  return React.createElement(
    'div',
    { className: 'container', id: 'app-root' },
    React.createElement('h1', { style: { color: 'blue' } }, 'Hello, World!'),
    React.createElement('p', { className: 'text' }, 'This is a paragraph.')
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// 트리구조
div
├── h1
│   └── "Hello, World!"
└── p
    └── "This is a paragraph."
```

- 가상 dom의 분기 기준은 컴포넌트가 아니다. 컴포넌트는 개념적인 단위일 뿐이며, 실제 비교는 React 요소(JSX로 생성된 객체)의 타입과 구조에 따라 이루어진다.

#### 속성명은 카멜케이스로 작성한다.

- jsx에서의 속성은 js 객체의 키값이 된다.
- 예약어는 사용할 수 없으므로 class 대신 className등으로 사용한다.

### 4. 중괄호가 있는 JSX 안에서 자바스크립트 사용하기

#### JSX안에서 자바스크립트 사용하기

```jsx
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return <img className='avatar' src={avatar} alt={description} />;
}
```

- 따옴표로 문자열 전달

```jsx
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return <h1>{name}'s To Do List</h1>;
}
```

- 중괄호 `{}` 사용하여 자바스크립트 호출하기

```jsx
export default function TodoList() {
  return (
    <ul
      style={{
        backgroundColor: 'black',
        color: 'pink',
      }}
    >
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

- 이중 중괄호 `{{}}` 객체 넘기기

#### HTML하고 jsx의 차이

```jsx
// html
<ul style="background-color: black"></ul>

// jsx
<ul style={{ backgroundColor: 'black' }}></ul>
```

- html에서
  - style 속성은 문자열로 작성된다.
  - 문자열속 ;로 값을 구분한다.
- JSX에서
  - style 속성은 객체로 작성된다.
  - 객체의 속성은 카멜케이스로 작성된다.

### 5. 컴포넌트에 props 전달하기

#### Props 전달하기

```jsx
export default function Profile() {
  return (
    <Avatar person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }} size={100} />
  );
}
```

```jsx
function Avatar({ person, size }) {
  return (
    <img
      className='avatar'
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
```

- Avatar 컴포넌트에 `{ name: 'Lin Lanying', imageId: '1bX5QH6' }` 객체를 전달

#### Props를 구조분해 할당

```jsx
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}

function Avatar({ person, size }) {
  // ...
}
```

#### Props 기본값 지정

```jsx
function Avatar({ person, size = 100 }) {
  // ...
}
```

#### spread 문법으로 props 전달

```jsx
function Profile(props) {
  return (
    <div className='card'>
      <Avatar {...props} />
    </div>
  );
}
```

- spread 문법은 제한적으로 사용해야한다.
  - 어떤 props가 전달되는지 불분명
  - 불필요한 props 전달문제 → 불필요한 렌더링 발생

#### 모든 props를 전달하기보다 children를 사용해서 필요한것만 넘기기

```jsx
// 필요한 props 상황
<GrandParentComponent a={a} b={b} c={c} d={d} />;
<ParentComponent a={a} b={b} />
<ChildComponent a={a} b={b} c={c} d={d} />
```

```jsx
// ⚠️ 무엇을 전달하는지 명확하지 않고 ParentComponent에서는 c,d가 필요하지 않다.
function GrandParentComponent(props) {
  return <ParentComponent {...props} />;
}

function ParentComponent(props) {
  return <ChildComponent {...props} />;
}
```

```jsx
// ✅ ParentComponent를 memo로 감쌌다면 c,d의 변화에서 ParentComponent는 리렌더링이 발생하지 않는다.
function GrandParentComponent(props) {
  return (
    <ParentComponent a={props.a} b={props.b}>
      <ChildComponent {...props} />
    </ParentComponent>
  );
}
```

#### props는 컴퓨터 과학에서 “변경할 수 없다”라는 의미의 불변성을 가진다.

- 컴포넌트가 props를 변경해야 하는 경우, 부모 컴포넌트에 다른 props, 즉 새로운 객체를 전달하도록 “요청”해야 한다. 그러면 이전의 props는 버려지고, 결국 자바스크립트 엔진은 기존 props가 차지했던 메모리를 회수하게 된다.

- 즉, 부모로 부터 전달받은 props (읽기전용)를 자식 컴포넌트에서 “직접” 변경하지말고 핸들러 등의 함수를 사용하여 변경을 “요청”해야한다.

- state는 컴포넌트가 소유하고 관리하는 데이터로, state도 불변성을 가지기에 직접 값을 변경하지않고 set함수를 통해 변경한다.

### 6. 조건부 렌더링

#### if문과 삼항연산자를 이용한 조건부 렌더링

```jsx
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

```jsx
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

> 개발을 진행하면서 위 두가지 방법에 대해서 고민을 하다가 나름대로 기준을 세웠다.
>
> 컴포넌트가 많이 변하게 되면 if문을 이용하고
>
> 프레임과 같은 부분은 그대로면서 내부만 변하거나 일부만 변경될경우 삼항연산자를 사용했다.
>
> 왠지 if문을 사용하게 되면 DOM 노드 전체가 교체되는 것같은 느낌이 들어서 리소스가 많이 소모될것 같았다.

<b>두 가지 코드에 대해서 isPacked 값이 바뀌었을때 React는 동일하게 동작한다.</b>

- JSX 엘리먼트는 실제 DOM 노드가 아니다.
- 리액트가 가상 dom을 구성하기 위한 단순히 청사진일뿐이다.
  - 따라서 값이 바뀌는지 비교하는데에만 쓰이지 실제로 돔을 조작하거나하지 않는다. if문을 기준으로 두 개의 li가 있는거같지만 결국 <b>결과의 JSX를 가지고 비교하는 용도로만 쓰인다.</b>
  - 즉, 변화가 생겼을때 두 코드 모두 동일하게 동작하며 리액트는 li를 재사용하고 내용만 업데이트한다.
- 다만 유지보수 측면에서 동일한 li컴포넌트를 쓴다면 if문보다는 삼항연산자를 쓰는것이 수정에 좀더 잘 대응할 수 있는 개발이지 않을까 생각한다.

#### && 표현식을 이용한 조건부 렌더링

```jsx
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

- 왼쪽(조건)이 `true`이면 오른쪽(체크 표시)의 값을 반환한다. 그러나 조건이 `false`이면 전체 표현 식이 `false`가 된다. React는 `false`를 `null` 또는 `undefined`처럼 JSX 트리의 “구멍”으로 간주하고 그 자리에 아무것도 렌더링하지 않는다.
- 표현식에 숫자0이 오지않도록 조심해야한다.
  - 무작정 Boolean() 이걸로 감싸게 되면 0은 false로 처리. 부등호를 이용하여 확실하게 판단하기

#### 변수에 할당하여 조건부 렌더링

```jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + ' ✅';
  }
  return <li className='item'>{itemContent}</li>;
}
```

> 삼항연산자보다 if문을 사용하는것이 코드를 읽는 측면에서 더 가독성이 좋은 코드라고 생각했는데, 변수에 할당할때 if문을 이용한다면 가독성을 좀더 챙길수 있을것 같다.

### 7. 리스트 렌더링

- 서로 다른 데이터를 사용하여 동일한 컴포넌트의 여러 인스턴스를 표시해야하는 경우 filter(), map()을 사용할 수 있다.

#### Key를 사용하여 리스트 항목을 순서대로 유지하기

- 각 배열 항목에 고유하게 식별할 수 있는 문자열 혹은 숫자를 key로 지정한다.
- 배열 항목이 정렬등으로 이동하거나 삽입/삭제 될수 있는 경우에 중요해진다.

key값을 통해 <b>React가 무슨일이 일어났는지 추론하고 DOM트리를 올바르게 업데이트한다.</b>

- 이때 `<></>`로 감싼경우에는

```jsx
<Fragment key={1}>
  <h1>{person.name}</h1>
  <p>{person.bio}</p>
</Fragment>
<Fragment key={2}>
  <h1>{person.name}</h1>
  <p>{person.bio}</p>
</Fragment>
```

- 위와 같이 key를 설정하기 위해 Fragment를 이용하는데, 이는 리액트가 가상돔의 변화를 파악하는데만 쓰이고 실제 돔을 업데이트할때는 Fragment를 그리진않는다.
- 따라서 key가 업데이트 되었는지 파악될때 쓰이므로, 렌더링 도중에 key값이 업데이트되거나 동일한 값이 쓰이거나 하면 안된다.

#### key값으로 index를 사용하면 안되는 이유

- 실제로 `key`를 전혀 지정하지 않으면 React는 인덱스를 사용한다. 하지만 항목이 삽입되거나 삭제하거나 배열의 순서가 바뀌면 항목을 렌더링하는 순서가 변경된다. 이때 index 값도 순서에 따라 함께 변경되므로 인덱스를 key로 사용하면 종종 미묘하고 혼란스러운 버그가 발생한다.

> 가장 좋은 방법은 데이터의 고유 값을 key로 사용하는 것이지만, key값이 단지 React가 요소의 순서 변경 여부를 감지하기 위해서만 사용한다면,
> 리스트의 순서가 변경되지 않는 경우는 index를 key로 사용해도 괜찮을것 같다.

1. 항목의 순서가 변경될 때

- 리스트의 항목 순서가 변경되면, `index`는 고정되어 있으므로 React는 항목을 잘못 식별할 수 있습니다.
- 이로 인해, React는 항목을 재사용하지 않고 모든 항목을 다시 렌더링할 수 있습니다.

2. 항목이 추가되거나 삭제될 때

- 리스트에 항목이 추가되거나 삭제되면, `index`가 변경됩니다.
- 이로 인해, React는 항목을 잘못 식별하고, 상태가 유실되거나 잘못된 항목이 렌더링될 수 있습니다.

3. 성능 저하

- `index`를 `key`로 사용하면, React는 항목의 변경을 정확히 감지하지 못해 불필요한 렌더링이 발생할 수 있습니다.
- `key={Math.random()}`처럼 즉석에서 key를 생성하는 경우에도 렌더링 간에 key가 일치하지 않아 모든 컴포넌트와 DOM이 매번 다시 생성될 수 있다.

### 8. 컴포넌트를 순수하게 유지하기

- 함수바깥의 일에 관여하지 않는다.
- 같은 입력에 대해 항상 같은 출력을 낸다.

#### 순수하지 않은 컴포넌트

```jsx
let guest = 0;

function Cup() {
  // ❌ 함수에서 외부 변수를 변경하고 있다.
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

```jsx
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

- guest props를 추가하여 순수하게 만들기

#### 엄격모드로 순수하지 않은 연산을 감지

- 각 컴포넌트의 함수를 두번 호출하는 엄격모드 “strict mode”는 두번 호출함으로써 규칙을 위반하는 컴포넌트를 찾는데 도움을 준다.
- 엄격 모드를 사용하기 위해서, 최상단 컴포넌트를 `<React.StrictMode>`로 감쌀 수 있다. 몇몇 프레임워크는 기본적으로 사용한다.

```jsx
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

- 렌더링하는 동안 만든 변수와 객체를 변경하는 것은 전혀 문제가 없다.
- 위 코드에서 cups가 TeaGathering 바깥이 아니라 내부에서 생성되었기에 cups의 값이 바뀌더라도 문제가 없다.

#### 순수하지만 바뀌어야할것들 → 사이드 이펙트

- 렌더링 도중에 발생하는 것이 아니라 렌더링 이후에 발생하는 것을 “사이드에서” 발생한다고 한다.
- 이러한 사이드에서 발생하는 작업을 '사이드 이팩트'라고 하고 `useEffect`를 통해서 렌더링 이후에 사이드 이펙트를 처리할 수 있게 도와준다.

#### 사이드 이펙트를 최소화하고 렌더링만으로 로직을 표현하기

- 렌더링만으로 로직을 표현한다는 것은, 컴포넌트의 렌더링 결과를 통해 모든 로직을 표현하는 것을 의미한다.
- 이는 사이드 이펙트를 최소화하고, 컴포넌트의 예측 가능성을 높이는 데 도움이 된다.
- 다른 옵션을 모두 사용했지만, 사이드 이펙트에 적합한 이벤트 핸들러를 찾을 수 없는 경우에만 최후의 수단으로 `useEffect`를 사용해야 한다.

#### 컴포넌트가 순수성을 가질때 이점

- 서버에서도 실행할수 있게한다.
- 캐시하기에 안전하다.
- 깊은 컴포넌트 트리를 렌더링하는 도중에 일부 데이터가 변경되는 경우, 완료하고 다시 렌더링을 하는게 아니라 안전하게 중단하고 렌더링을 다시 새로 시작한다.

### 9. 트리로서의 UI

- React와 많은 다른 UI 라이브러리는 UI를 트리로 모델링 한다.

#### 렌더트리

![render_tree.webp](/images/react-dev/1-2.webp)

- React 앱을 렌더링할 때, 이 관계를 렌더 트리라고 알려진 트리로 모델링할 수 있다.
- 각 노드는 컴포넌트를 나타낸다. 루트 노드는 Root 컴포넌트이고 트리의 각 화살표는 부모컴포넌트에서 자식컴포넌트를 가리킨다.

![conditional_render_tree.webp](/images/react-dev/1-3.webp)

- 조건부 렌더링이 진행될때 렌더트리는 렌더링 될때마다 다르게 구성된다.
- 위쪽에 있는 컴포넌트일수록 그 아래의 모든 컴포넌트의 렌더링 성능에 영향을 미치며 복잡성이 높고, 아래에 있는 컴포넌트일수록 자주 렌더링된다.

#### 모듈 의존성 트리

![module_dependency_tree.webp](/images/react-dev/1-4.webp)

- 트리로 모델링 할 수 있는 React 앱의 다른 관계는 앱의 모듈 의존성이다.
- 컴포넌트를 분리하고 로직을 별도의 파일로 분리하면 컴포넌트, 함수 또는 상수를 내보내는 JS 모듈을 만들 수 있다.
- 노드는 컴포넌트가 아닌 모듈을 나타내며 연결 선은 해당 모듈의 import문을 나타낸다.
- 단순히 렌더트리 구조에서 js 모듈로 바꾸어 표현한 것이 아니다.
  - `inspirations.js`와 같이 모듈의존성 트리에만 존재할수도 있고 `Copyright.js`의 경우는 트리에서 위치가 서로 다르다.
  - app에서 import해서 자식 컴포넌트에서 렌더링되기 때문에 위와같이 위치가 다르게 나타난다.
  - 모듈 의존성 트리는 리액트 앱을 실행하는데 필요한 모듈을 결정하는데 유용하다
  - 번들러는 의존성 트리를 사용하여 포함해야할 모듈을 결정한다.

---

#### 참고자료

- [React 공식문서](https://ko.react.dev/learn/describing-the-ui)
