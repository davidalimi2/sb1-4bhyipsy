import React from 'react';
import { FileText, FileQuestion, FileCheck, Users } from 'lucide-react';
import type { DiscoveryType } from '../../../types/discovery';

interface DiscoveryIconProps {
  type: DiscoveryType;
  className?: string;
}

export function DiscoveryIcon({ type, className = '' }: DiscoveryIconProps) {
  const icons = {
    interrogatory: FileQuestion,
    document_request: FileText,
    admission_request: FileCheck,
    deposition_notice: Users
  };

  const Icon = icons[type];
  return <Icon className={className} />;
}