# React Hook Form으로 폼 리렌더링 90% 줄이기: 측정부터 최적화까지

**작성자:** 이재일
**작성일:** 2025년 12월
**태그:** React, Performance, React Hook Form, Optimization

---

## TL;DR (요약)

마이다스아이티에서 레거시 React 프로젝트의 심각한 성능 문제를 발견하고 개선한 경험을 공유합니다.

**문제:** 폼 입력 시 과도한 리렌더링 (입력 1회당 평균 12번 리렌더링, 45ms 소요)
**해결:** React Hook Form 도입
**결과:** 리렌더링 **90% 감소** (입력 1회당 1-2번 리렌더링, 4.5ms 소요)

---

## 1. 문제 상황: "원래 이렇게 느렸나요?"

### 입사 첫날의 발견

2022년 10월, 마이다스아이티에 입사한 첫 주에 기존 React 프로젝트를 살펴보던 중 이상한 점을 발견했습니다.

**회원가입 폼에서 이름을 입력할 때마다 화면이 버벅거렸습니다.**

"원래 이렇게 느렸나요?"라고 물었고, "원래 그랬어요"라는 답변을 들었습니다.

하지만 저는 "원래 그런 것"을 의심하기로 했습니다.

### React DevTools Profiler로 측정

React DevTools Profiler를 열어 실제 수치를 측정했습니다.

**측정 결과 (Before):**
```
사용자 액션: input에 "홍" 입력
리렌더링 횟수: 12번
리렌더링 시간: 평균 45ms
리렌더링 컴포넌트:
  - FormContainer (45ms)
  - UserInfoSection (38ms)
  - NameInput (35ms)
  - EmailInput (재렌더링됨, 불필요)
  - PhoneInput (재렌더링됨, 불필요)
  - AddressSection (재렌더링됨, 불필요)
  ... 총 12개 컴포넌트
```

**문제:**
- 이름 input에 한 글자 입력했을 뿐인데 **12개 컴포넌트가 모두 리렌더링**
- 심지어 **관련 없는 EmailInput, PhoneInput까지 리렌더링**
- 사용자가 타이핑할 때마다 45ms씩 버벅거림

---

## 2. 원인 분석: 중첩된 useState의 함정

### 문제의 코드

```typescript
// ❌ 안티패턴: 중첩된 객체를 하나의 useState로 관리
const [formData, setFormData] = useState({
  userInfo: {
    name: '',
    email: '',
    phone: ''
  },
  address: {
    city: '',
    district: '',
    street: '',
    zipCode: ''
  },
  agreement: {
    terms: false,
    privacy: false,
    marketing: false
  }
});

// 이름 하나만 변경해도 전체 객체를 새로 생성
const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
  setFormData({
    ...formData,
    userInfo: {
      ...formData.userInfo,
      name: e.target.value  // 이것만 바뀌는데...
    }
  });
};
```

### 왜 모든 컴포넌트가 리렌더링될까?

```typescript
// FormContainer 컴포넌트
function FormContainer() {
  const [formData, setFormData] = useState({...});

  return (
    <>
      <UserInfoSection data={formData.userInfo} />  {/* formData가 변경되면 */}
      <AddressSection data={formData.address} />    {/* 모든 자식이 */}
      <AgreementSection data={formData.agreement} /> {/* 리렌더링됨 */}
    </>
  );
}

// UserInfoSection 컴포넌트
function UserInfoSection({ data }) {
  // data.userInfo 객체 참조가 바뀌면 이 컴포넌트도 리렌더링
  return (
    <>
      <NameInput value={data.name} />     {/* 이것만 변경되어도 */}
      <EmailInput value={data.email} />   {/* 전부 */}
      <PhoneInput value={data.phone} />   {/* 리렌더링 */}
    </>
  );
}
```

**핵심 문제:**
1. `formData` 전체 객체가 새로 생성됨 (얕은 복사)
2. `formData` 변경 → FormContainer 리렌더링
3. FormContainer 리렌더링 → 모든 자식 컴포넌트 리렌더링
4. 불필요한 EmailInput, PhoneInput, AddressSection까지 모두 리렌더링

---

## 3. 해결책 탐색: 왜 React Hook Form인가?

### 고려한 대안들

**대안 1: useState 분리**
```typescript
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
// ... 너무 많아짐
```
❌ 필드가 10개 이상이면 관리 불가

**대안 2: useReducer**
```typescript
const [state, dispatch] = useReducer(formReducer, initialState);
```
⚠️ 보일러플레이트 코드 과다

**대안 3: React Hook Form**
```typescript
const { register, handleSubmit } = useForm();
```
✅ **선택!**

### React Hook Form의 핵심 장점

**1. Uncontrolled Components 방식**
```typescript
// Controlled (기존 방식 - 매번 리렌더링)
<input
  value={formData.name}           // state에서 값 가져옴
  onChange={(e) => setFormData({  // 타이핑마다 state 업데이트
    ...formData,
    userInfo: { ...formData.userInfo, name: e.target.value }
  })}
/>

// Uncontrolled (React Hook Form - 리렌더링 없음)
<input {...register('name')} />  // ref로 직접 DOM 접근, state 없음
```

**2. 성능 최적화**
- DOM ref를 사용하여 **React 상태 없이** 폼 값 관리
- 타이핑할 때 **리렌더링 발생하지 않음**
- Submit 시에만 값을 가져옴

**3. 검증 통합**
```typescript
<input
  {...register('email', {
    required: '이메일을 입력하세요',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: '올바른 이메일 형식이 아닙니다'
    }
  })}
/>
```

---

## 4. 실제 적용: Before vs After

### Before: 중첩된 useState

```typescript
import { useState, ChangeEvent } from 'react';

function SignupForm() {
  const [formData, setFormData] = useState({
    userInfo: { name: '', email: '', phone: '' },
    address: { city: '', district: '', street: '', zipCode: '' },
    agreement: { terms: false, privacy: false, marketing: false }
  });

  const [errors, setErrors] = useState({});

  const handleChange = (section: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.userInfo.name) newErrors.name = '이름을 입력하세요';
    if (!formData.userInfo.email) newErrors.email = '이메일을 입력하세요';
    // ... 검증 로직 길어짐
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // API 호출
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.userInfo.name}
        onChange={(e) => handleChange('userInfo', 'name', e.target.value)}
      />
      {errors.name && <span>{errors.name}</span>}
      {/* 반복... */}
    </form>
  );
}
```

**코드 라인 수:** ~150줄
**리렌더링:** 입력 1회당 12번
**성능:** 45ms/입력

---

### After: React Hook Form

```typescript
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  street: string;
  zipCode: string;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // API 호출
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>이름</label>
        <input
          {...register('name', {
            required: '이름을 입력하세요',
            minLength: {
              value: 2,
              message: '이름은 2글자 이상이어야 합니다'
            }
          })}
        />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <label>이메일</label>
        <input
          {...register('email', {
            required: '이메일을 입력하세요',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: '올바른 이메일 형식이 아닙니다'
            }
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <button type="submit">가입하기</button>
    </form>
  );
}
```

**코드 라인 수:** ~80줄 (50% 감소)
**리렌더링:** 입력 시 0번, Submit 시에만 1-2번
**성능:** 4.5ms/submit

---

## 5. 측정 결과: 구체적 수치로 증명

### React DevTools Profiler 측정

**Before (useState):**
```
===== Profiler Recording: Form Input "홍" =====
Render #1: FormContainer (45.2ms)
  └─ UserInfoSection (38.1ms)
     ├─ NameInput (35.2ms) ← 실제 변경
     ├─ EmailInput (2.1ms) ← 불필요 리렌더링
     └─ PhoneInput (1.8ms) ← 불필요 리렌더링
  └─ AddressSection (5.2ms) ← 불필요 리렌더링
  └─ AgreementSection (1.9ms) ← 불필요 리렌더링

Total: 12 components, 45.2ms
```

**After (React Hook Form):**
```
===== Profiler Recording: Form Input "홍" =====
(렌더링 없음)

===== Profiler Recording: Form Submit =====
Render #1: FormContainer (4.5ms)
  └─ (validation only)

Total: 1 component, 4.5ms
```

### 정량적 성과

| 지표 | Before | After | 개선율 |
|------|--------|-------|--------|
| 입력당 리렌더링 횟수 | 12번 | 0번 | **100%** |
| 입력당 리렌더링 시간 | 45ms | 0ms | **100%** |
| Submit 리렌더링 시간 | 45ms | 4.5ms | **90%** |
| 코드 라인 수 | ~150줄 | ~80줄 | **47%** |
| 사용자 체감 속도 | 버벅거림 | 부드러움 | **획기적** |

### Lighthouse 점수 개선

```
Before:
Performance: 62
Best Practices: 78

After:
Performance: 87 (+25점)
Best Practices: 92 (+14점)
```

---

## 6. 실전 팁: React Hook Form 제대로 사용하기

### Tip 1: Zod로 타입 안전 검증

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, '이름은 2글자 이상'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/, '010-0000-0000 형식')
});

type FormData = z.infer<typeof schema>;

function Form() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  // ...
}
```

### Tip 2: 복잡한 폼은 useFieldArray

```typescript
const { fields, append, remove } = useFieldArray({
  control,
  name: 'addresses'
});

return (
  <>
    {fields.map((field, index) => (
      <div key={field.id}>
        <input {...register(`addresses.${index}.city`)} />
        <button onClick={() => remove(index)}>삭제</button>
      </div>
    ))}
    <button onClick={() => append({ city: '', street: '' })}>
      주소 추가
    </button>
  </>
);
```

### Tip 3: Watch는 최소한으로

```typescript
// ❌ 나쁜 예: 전체 폼 watch (불필요한 리렌더링)
const formData = watch();

// ✅ 좋은 예: 필요한 필드만 watch
const email = watch('email');

// ✅ 더 좋은 예: useEffect로 필요할 때만
useEffect(() => {
  const subscription = watch((value, { name }) => {
    if (name === 'email') {
      // 이메일 변경 시에만 실행
    }
  });
  return () => subscription.unsubscribe();
}, [watch]);
```

---

## 7. 배운 교훈

### 1. "원래 그런 것"을 의심하라

입사 첫 주에 "원래 그랬어요"라는 답변을 들었지만, 측정을 통해 실제 문제를 증명했습니다.

**교훈:** 느낌이 아닌 **측정**으로 판단하라.

### 2. 측정 없는 최적화는 추측일 뿐

React DevTools Profiler 없이는 90% 개선을 증명할 수 없었습니다.

**교훈:** Before/After를 **정량적 수치**로 비교하라.

### 3. 올바른 도구 선택의 중요성

React Hook Form은 이 문제를 위해 설계된 도구였습니다.

**교훈:** 문제에 맞는 **검증된 도구**를 사용하라.

---

## 8. 참고 자료

- **React Hook Form 공식 문서:** https://react-hook-form.com/
- **React DevTools Profiler:** https://react.dev/reference/react/Profiler
- **Zod 스키마 검증:** https://zod.dev/

---

## 마무리

"원래 이렇게 느렸나요?"

이 질문 하나가 프로젝트 전체의 사용자 경험을 개선했습니다.

여러분의 프로젝트에도 "원래 그런 것"으로 방치된 성능 문제가 있지 않나요?

React DevTools Profiler를 열어 **지금 바로 측정**해보세요.

---

**질문이나 피드백은 언제든 환영합니다!**
- Email: jaeil1117@gmail.com
- GitHub: https://github.com/orangec-at
