import React from 'react';

interface MarkdownViewProps {
  text: string;
}

export default function MarkdownView({ text }: MarkdownViewProps) {
  // Helper to parse simple markdown elements (headings, list items, bold text)
  const parseLines = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      
      // Check for headings
      if (trimmed.startsWith('###')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-100 mt-4 mb-2 border-b border-slate-800 pb-1 uppercase tracking-wide">
            {trimmed.replace('###', '').trim()}
          </h4>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h3 key={idx} className="text-base font-extrabold text-indigo-400 mt-5 mb-2.5 uppercase tracking-wide">
            {trimmed.replace('##', '').trim()}
          </h3>
        );
      }
      if (trimmed.startsWith('#')) {
        return (
          <h2 key={idx} className="text-lg font-black text-white mt-6 mb-3 uppercase tracking-wider">
            {trimmed.replace('#', '').trim()}
          </h2>
        );
      }

      // Check for lists
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        // Parse inline bold
        const content = trimmed.substring(1).trim();
        return (
          <li key={idx} className="list-disc list-inside text-slate-300 ml-3 py-0.5 leading-relaxed">
            {parseInlineBold(content)}
          </li>
        );
      }

      // Standard paragraphs
      if (trimmed === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-slate-300 leading-relaxed py-1">
          {parseInlineBold(trimmed)}
        </p>
      );
    });
  };

  const parseInlineBold = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-white font-bold">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="prose prose-invert max-w-none text-xs space-y-1">
      {parseLines(text)}
    </div>
  );
}
