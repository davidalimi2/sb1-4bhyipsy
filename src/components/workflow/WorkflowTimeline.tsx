import React from 'react';
import { WorkflowTimelineItem } from './WorkflowTimelineItem';
import type { WorkflowStep } from '../../types/workflow';

interface WorkflowTimelineProps {
  steps: WorkflowStep[];
}

export function WorkflowTimeline({ steps }: WorkflowTimelineProps) {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {steps.map((step, idx) => (
          <li key={step.id}>
            <div className="relative pb-8">
              {idx !== steps.length - 1 && (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <WorkflowTimelineItem step={step} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}