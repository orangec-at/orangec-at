'use client';

import React from 'react';
import {cn} from '@/lib/utils';
import {Check} from 'lucide-react';
import {Body} from '@/components/ui/typography';
import {Ellipsis} from '@/components/svgs';

export interface Step {
  id: number;
  label: string;
  title: string;
  status: 'completed' | 'current' | 'pending';
}

export interface StepperProps {
  steps: Step[];
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({steps, className}) => {
  return (
    <div className={cn('w-[600px]', className)}>
      <div className="flex items-start ">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Item */}
            <div className="flex flex-col items-start flex-1 ">
              {/* Step Circle with Double Ring */}
              <div className="mb-4 flex flex-row w-full items-center">
                {/* Outer Ring */}
                <div
                  className={cn('w-5 h-5 rounded-full border-1 transition-all duration-300 relative z-20', {
                    'border-(--krds-secondary-50) bg-(--krds-secondary-50)': step.status === 'completed',
                    'border-(--krds-primary-50) bg-white': step.status === 'current',
                    'border-(--krds-gray-20) bg-(--krds-gray-20)': step.status === 'pending',
                  })}>
                  {/* Inner Circle */}
                  <div
                    className={cn(
                      'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                      'w-3 h-3 rounded-full flex items-center justify-center transition-all duration-300',
                      {
                        'bg-(--krds-secondary-50) text-white': step.status === 'completed',
                        'bg-(--krds-gray-20) text-gray-600': step.status === 'pending',
                        'bg-(--krds-primary-50) text-white': step.status === 'current',
                      },
                    )}>
                    {step.status === 'completed' && <Check className="w-3 h-3" />}
                    {step.status === 'pending' && <div className="w-5 h-5 rounded-full bg-(--krds-gray-20)" />}
                    {step.status === 'current' && <Ellipsis className="w-3 h-3 text-(--krds-primary-50)" />}
                  </div>
                </div>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 w-full">
                    <div
                      className={cn('h-0 border transition-colors duration-300', {
                        'border-(--krds-secondary-50)': step.status === 'completed', // 왼쪽이 완료면 채움
                        'border-(--krds-gray-20)': step.status !== 'completed', // 아직 진행 전이면 회색
                      })}
                    />
                  </div>
                )}
              </div>

              {/* Step Label and Title */}
              <div className="text-left">
                {/* Step Number */}
                <Body variant={'s-400'}>{step.label}</Body>
                {/* Step Title */}
                <Body variant={'s-700'} className="whitespace-nowrap">
                  {step.title}
                </Body>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
