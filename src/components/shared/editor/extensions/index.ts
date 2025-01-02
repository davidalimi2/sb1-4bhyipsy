import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { Extension } from '@tiptap/core';

// Custom placeholder extension
const Placeholder = Extension.create({
  name: 'placeholder',
  addOptions() {
    return {
      placeholder: '',
      showOnlyWhenEmpty: true,
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          'data-placeholder': {
            default: this.options.placeholder,
            parseHTML: () => this.options.placeholder,
            renderHTML: (attributes) => ({
              'data-placeholder': attributes['data-placeholder'],
            }),
          },
        },
      },
    ];
  },
});

export const defaultExtensions = [
  StarterKit,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-indigo-600 hover:text-indigo-900'
    }
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: 'border-collapse table-fixed w-full'
    }
  }),
  TableRow,
  TableHeader,
  TableCell,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right']
  }),
  Image.configure({
    HTMLAttributes: {
      class: 'max-w-full h-auto rounded-lg'
    }
  }),
  Placeholder.configure({
    placeholder: 'Write something...'
  })
];