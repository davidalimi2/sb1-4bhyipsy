import React from 'react';
import type { StructureElement } from '../types/template';

export function renderElement(element: StructureElement): React.ReactNode {
  switch (element.type) {
    case 'heading': {
      const HeadingTag = `h${element.properties.level || 1}` as keyof JSX.IntrinsicElements;
      return <HeadingTag className={element.properties.className}>{element.content}</HeadingTag>;
    }

    case 'paragraph':
      return (
        <p className={`${element.properties.className} ${
          element.properties.style === 'emphasis' ? 'font-medium' :
          element.properties.style === 'small' ? 'text-sm' : ''
        }`}>
          {element.content}
        </p>
      );

    case 'list': {
      const items = JSON.parse(element.content);
      const ListTag = element.properties.ordered ? 'ol' : 'ul';
      return (
        <ListTag className={element.properties.className}>
          {items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ListTag>
      );
    }

    case 'table': {
      const data = JSON.parse(element.content);
      return (
        <table className={`${element.properties.className} min-w-full divide-y divide-gray-200`}>
          <tbody className="divide-y divide-gray-200">
            {data.map((row: string[], rowIndex: number) => (
              <tr key={rowIndex}>
                {row.map((cell: string, colIndex: number) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    case 'quote':
      return (
        <blockquote className={element.properties.className}>
          <p>{element.content}</p>
          {element.properties.citation && (
            <footer className="mt-2 text-sm text-gray-500">
              — {element.properties.citation}
            </footer>
          )}
        </blockquote>
      );

    default:
      return null;
  }
}