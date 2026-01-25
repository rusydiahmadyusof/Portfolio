interface TerminalWindowProps {
  children: React.ReactNode;
  showCursor?: boolean;
}

export const TerminalWindow = ({ children, showCursor = true }: TerminalWindowProps) => {
  return (
    <div className="flex-1 rounded-lg border border-border-dark bg-surface-dark overflow-hidden font-mono text-sm shadow-2xl">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-background-dark border-b border-border-dark">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-slate-500">user@dev-console:~</div>
        <div className="w-10"></div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 overflow-x-auto">
        {children}
        {showCursor && (
          <div className="mt-4 flex gap-2">
            <span className="text-primary">$</span>
            <span className="w-2 h-5 bg-primary animate-blink"></span>
          </div>
        )}
      </div>
    </div>
  );
};

