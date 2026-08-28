import { useRef, useState } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = preRef.current?.innerText ?? '';
    const cleaned = text.replace(/^(copy|Copy)\n?/, '').trim();
    navigator.clipboard.writeText(cleaned).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <pre ref={preRef} className={className}>
      <button className="copy-btn" onClick={handleCopy} type="button">
        {copied ? 'copied' : 'copy'}
      </button>
      {children}
    </pre>
  );
}
