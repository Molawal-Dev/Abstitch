import { useRef, useEffect, useState } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered,
  Link, AlignLeft, AlignCenter, AlignRight, Type
} from 'lucide-react';

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  orderedList: boolean;
  unorderedList: boolean;
}

type HeadingTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}


function ToolbarButton({ onClick, active = false, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onClick();
      }}
      className={`w-8 h-8 flex items-center justify-center text-sm transition-colors rounded
        ${active ? 'bg-gold-500 text-ebony-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-gray-200 mx-1" />;
}


export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your product description...',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    orderedList: false,
    unorderedList: false,
  });

    const isInitialised = useRef(false);

  useEffect(() => {
    if (editorRef.current && value && !isInitialised.current) {
      editorRef.current.innerHTML = value;
      isInitialised.current = true;
    }
  }, [value]);

  const exec = (command: string, val: string | null = null): void => {
    editorRef.current?.focus();
    document.execCommand(command, false, val ?? undefined);
    updateActiveFormats();
    triggerChange();
  };

  const triggerChange = (): void => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const updateActiveFormats = (): void => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      orderedList: document.queryCommandState('insertOrderedList'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
    });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html) {
        document.execCommand('insertHTML', false, html);
    } else {
        document.execCommand('insertText', false, text);
    }
    triggerChange();
  };

  const insertLink = (): void => {
    const url = window.prompt('Enter URL:', 'https://');
    if (url) exec('createLink', url);
  };

  const formatHeading = (tag: HeadingTag): void => {
    exec('formatBlock', tag);
  };

  return (
    <div className="border border-gray-300 rounded overflow-hidden focus-within:border-burgundy-800 focus-within:ring-1 focus-within:ring-burgundy-800 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        {/* Headings */}
        <ToolbarButton onClick={() => formatHeading('p')} title="Paragraph">
          <Type size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => formatHeading('h3')} title="Heading">
          <span className="font-bold text-xs">H</span>
        </ToolbarButton>

        <ToolbarDivider />

        {/* Text styles */}
        <ToolbarButton onClick={() => exec('bold')} active={activeFormats.bold} title="Bold">
          <Bold size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('italic')} active={activeFormats.italic} title="Italic">
          <Italic size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('underline')} active={activeFormats.underline} title="Underline">
          <Underline size={13} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton onClick={() => exec('insertUnorderedList')} active={activeFormats.unorderedList} title="Bullet List">
          <List size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('insertOrderedList')} active={activeFormats.orderedList} title="Numbered List">
          <ListOrdered size={13} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton onClick={() => exec('justifyLeft')} title="Align Left">
          <AlignLeft size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('justifyCenter')} title="Align Center">
          <AlignCenter size={13} />
        </ToolbarButton>
        <ToolbarButton onClick={() => exec('justifyRight')} title="Align Right">
          <AlignRight size={13} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <ToolbarButton onClick={insertLink} title="Insert Link">
          <Link size={13} />
        </ToolbarButton>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={triggerChange}
        onPaste={handlePaste}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        onSelect={updateActiveFormats}
        className="min-h-[180px] max-h-[400px] overflow-y-auto px-4 py-3 text-sm text-gray-800 font-sans focus:outline-none prose prose-sm max-w-none"
        style={{ lineHeight: '1.7' }}
        data-placeholder={placeholder}
      />

      {/* Placeholder style */}
      <style>{`
        [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
        }
        [contenteditable] h3 { font-size: 1.1rem; font-weight: 700; margin: 0.75rem 0 0.25rem; color: #0A0A0A; }
        [contenteditable] ul { list-style: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
        [contenteditable] ol { list-style: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
        [contenteditable] li { margin: 0.2rem 0; }
        [contenteditable] a { color: #B8960C; text-decoration: underline; }
        [contenteditable] strong { font-weight: 700; }
        [contenteditable] em { font-style: italic; }

        [contenteditable] table {
            border-collapse: collapse;
            width: 100%;
            margin: 0.75rem 0;
            font-size: 0.85rem;
        }
        [contenteditable] table td,
        [contenteditable] table th {
            border: 1px solid #d1d5db;
            padding: 0.5rem 0.75rem;
            text-align: left;
            vertical-align: top;
            min-width: 80px;
        }
        [contenteditable] table th,
        [contenteditable] table thead td {
            background-color: #f3f4f6;
            font-weight: 700;
            color: #111827;
        }
        [contenteditable] table tr:nth-child(even) td {
            background-color: #f9fafb;
        }`}
      </style>
    </div>
  );
}
