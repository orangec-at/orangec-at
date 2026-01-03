/* eslint-disable @next/next/no-html-link-for-pages */
import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge Component', () => {
  describe('기본 렌더링', () => {
    it('텍스트를 렌더링해야 함', () => {
      render(<Badge>Test Badge</Badge>)
      expect(screen.getByText('Test Badge')).toBeInTheDocument()
    })

    it('span 요소로 렌더링되어야 함', () => {
      const { container } = render(<Badge>Test</Badge>)
      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge?.tagName).toBe('SPAN')
    })

    it('data-slot 속성이 있어야 함', () => {
      render(<Badge>Test</Badge>)
      const badge = screen.getByText('Test')
      expect(badge).toHaveAttribute('data-slot', 'badge')
    })
  })

  describe('Variant 스타일', () => {
    it('기본 variant를 적용해야 함', () => {
      render(<Badge>Default</Badge>)
      const badge = screen.getByText('Default')
      expect(badge).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('secondary variant를 적용해야 함', () => {
      render(<Badge variant="secondary">Secondary</Badge>)
      const badge = screen.getByText('Secondary')
      expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground')
    })

    it('destructive variant를 적용해야 함', () => {
      render(<Badge variant="destructive">Destructive</Badge>)
      const badge = screen.getByText('Destructive')
      expect(badge).toHaveClass('bg-destructive', 'text-white')
    })

    it('outline variant를 적용해야 함', () => {
      render(<Badge variant="outline">Outline</Badge>)
      const badge = screen.getByText('Outline')
      expect(badge).toHaveClass('text-foreground')
    })
  })

  describe('커스텀 Props', () => {
    it('커스텀 className을 병합해야 함', () => {
      render(<Badge className="custom-class">Test</Badge>)
      const badge = screen.getByText('Test')
      expect(badge).toHaveClass('custom-class')
      // 기본 클래스도 유지되어야 함
      expect(badge).toHaveClass('inline-flex', 'items-center')
    })

    it('추가 HTML 속성을 전달해야 함', () => {
      render(
        <Badge data-testid="custom-badge" aria-label="test label">
          Test
        </Badge>
      )
      const badge = screen.getByTestId('custom-badge')
      expect(badge).toHaveAttribute('aria-label', 'test label')
    })
  })

  describe('asChild prop', () => {
    it('asChild가 true일 때 Slot을 사용해야 함', () => {
      render(
        <Badge asChild>
          <a href="/test">Link Badge</a>
        </Badge>
      )
      const link = screen.getByRole('link', { name: 'Link Badge' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })

    it('asChild 없이는 span으로 렌더링되어야 함', () => {
      const { container } = render(<Badge>Normal Badge</Badge>)
      const badge = screen.getByText('Normal Badge')
      expect(badge.tagName).toBe('SPAN')
    })
  })

  describe('복합 시나리오', () => {
    it('variant와 className을 함께 사용할 수 있어야 함', () => {
      render(
        <Badge variant="destructive" className="my-custom-class">
          Combined
        </Badge>
      )
      const badge = screen.getByText('Combined')
      expect(badge).toHaveClass('bg-destructive', 'my-custom-class')
    })

    it('여러 children을 렌더링할 수 있어야 함', () => {
      render(
        <Badge>
          <svg data-testid="icon" />
          <span>Text with Icon</span>
        </Badge>
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('Text with Icon')).toBeInTheDocument()
    })
  })
})
