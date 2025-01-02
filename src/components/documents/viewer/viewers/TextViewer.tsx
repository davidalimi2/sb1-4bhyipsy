import React from 'react';

interface TextViewerProps {
  url: string;
  title: string;
}

export function TextViewer({ url, title }: TextViewerProps) {
  return (
    <iframe
      src={url}
      title={title}
      className="w-full h-full min-h-[600px] border-0"
      sandbox="allow-same-origin"
    />
  );
}