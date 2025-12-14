"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  KRDSBody,
  KRDSHeading,
  Title,
} from "@orangec-at/design";

/**
 * 디자인 시스템 활용 예시 컴포넌트
 * 이력서 페이지에서 DPP Design System의 컴포넌트들을 활용하는 방법을 보여줍니다.
 */
export function DesignSystemExample() {
  return (
    <div className="space-y-8 p-6">
      {/* Typography 예시 */}
      <section>
        <KRDSHeading variant="large" className="mb-4">
          Typography 예시
        </KRDSHeading>
        <div className="space-y-2">
          <Title variant="xl-700">Title XL 700</Title>
          <Title variant="l-700">Title L 700</Title>
          <Title variant="m-700">Title M 700</Title>
          <KRDSBody variant="large">
            Body Large - 일반 텍스트 예시입니다.
          </KRDSBody>
          <KRDSBody variant="medium">
            Body Medium - 중간 크기 텍스트입니다.
          </KRDSBody>
          <KRDSBody variant="small">
            Body Small - 작은 크기 텍스트입니다.
          </KRDSBody>
        </div>
      </section>

      {/* Button 예시 */}
      <section>
        <KRDSHeading variant="large" className="mb-4">
          Button 예시
        </KRDSHeading>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" size="medium">
            Default Button
          </Button>
          <Button variant="primary" size="medium">
            Primary Button
          </Button>
          <Button variant="secondary" size="medium">
            Secondary Button
          </Button>
          <Button variant="tertiary" size="medium">
            Tertiary Button
          </Button>
          <Button variant="destructive" size="medium">
            Destructive Button
          </Button>
          <Button variant="outline" size="medium">
            Outline Button
          </Button>
          <Button variant="ghost" size="medium">
            Ghost Button
          </Button>
        </div>

        {/* Size variants */}
        <div className="flex flex-wrap gap-3 mt-4">
          <Button size="xsmall">X-Small</Button>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
          <Button size="xlarge">X-Large</Button>
        </div>
      </section>

      {/* Badge 예시 */}
      <section>
        <KRDSHeading variant="large" className="mb-4">
          Badge 예시
        </KRDSHeading>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Accordion 예시 */}
      <section>
        <KRDSHeading variant="large" className="mb-4">
          Accordion 예시
        </KRDSHeading>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>경력 사항</AccordionTrigger>
            <AccordionContent>
              <KRDSBody variant="medium">
                회사명: OrangeCat Tech
                <br />
                직책: Senior Software Engineer
                <br />
                기간: 2020.01 - 현재
              </KRDSBody>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>학력 사항</AccordionTrigger>
            <AccordionContent>
              <KRDSBody variant="medium">
                대학교: 00대학교
                <br />
                전공: 컴퓨터공학
                <br />
                학위: 학사
              </KRDSBody>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>기술 스택</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                <Badge>React</Badge>
                <Badge>Next.js</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Tailwind CSS</Badge>
                <Badge>Node.js</Badge>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* 이력서 섹션 예시 */}
      <section>
        <KRDSHeading variant="large" className="mb-4">
          이력서 섹션 예시
        </KRDSHeading>
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <Title variant="l-700" className="mb-2">
              프론트엔드 개발자
            </Title>
            <KRDSBody variant="medium" className="text-gray-600 mb-3">
              2020.01 - 현재 · OrangeCat Tech
            </KRDSBody>
            <KRDSBody variant="medium">
              Next.js 기반의 웹 애플리케이션 개발 및 유지보수를 담당하고
              있습니다. 디자인 시스템 구축 및 컴포넌트 라이브러리 개발 경험이
              있습니다.
            </KRDSBody>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <Title variant="l-700" className="mb-2">
              주요 프로젝트
            </Title>
            <div className="space-y-3">
              <div>
                <KRDSBody variant="large" className="font-semibold">
                  디자인 시스템 구축
                </KRDSBody>
                <KRDSBody variant="medium" className="text-gray-600">
                  재사용 가능한 UI 컴포넌트 라이브러리 개발
                </KRDSBody>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
