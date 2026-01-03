import { cn } from '../utils'

describe('cn utility function', () => {
  describe('기본 동작', () => {
    it('단일 클래스명을 반환해야 함', () => {
      expect(cn('text-red-500')).toBe('text-red-500')
    })

    it('여러 클래스명을 병합해야 함', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
    })

    it('빈 값을 무시해야 함', () => {
      expect(cn('text-red-500', '', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
    })

    it('undefined와 null을 무시해야 함', () => {
      expect(cn('text-red-500', undefined, null, 'bg-blue-500')).toBe(
        'text-red-500 bg-blue-500'
      )
    })
  })

  describe('조건부 클래스', () => {
    it('조건부 클래스를 올바르게 처리해야 함', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class active-class')
    })

    it('false 조건은 무시해야 함', () => {
      const isActive = false
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toBe('base-class')
    })
  })

  describe('Tailwind 충돌 해결', () => {
    it('충돌하는 Tailwind 클래스를 올바르게 병합해야 함', () => {
      // tailwind-merge가 충돌하는 클래스를 처리
      const result = cn('px-2', 'px-4')
      expect(result).toBe('px-4')
    })

    it('다른 속성의 클래스는 유지해야 함', () => {
      const result = cn('px-2 py-2', 'px-4')
      expect(result).toBe('py-2 px-4')
    })
  })

  describe('객체 형태 클래스', () => {
    it('객체 형태의 클래스를 처리해야 함', () => {
      const result = cn({
        'text-red-500': true,
        'bg-blue-500': false,
        'font-bold': true,
      })
      expect(result).toBe('text-red-500 font-bold')
    })
  })

  describe('배열 형태 클래스', () => {
    it('배열 형태의 클래스를 처리해야 함', () => {
      const result = cn(['text-red-500', 'bg-blue-500'])
      expect(result).toBe('text-red-500 bg-blue-500')
    })

    it('중첩 배열을 처리해야 함', () => {
      const result = cn(['text-red-500', ['bg-blue-500', 'font-bold']])
      expect(result).toBe('text-red-500 bg-blue-500 font-bold')
    })
  })
})
