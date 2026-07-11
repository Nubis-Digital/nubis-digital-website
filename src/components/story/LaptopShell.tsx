import type { ReactNode } from 'react';

interface DeviceShellProps {
  children: ReactNode;
  className?: string;
}

export function LaptopShell({ children, className = '' }: DeviceShellProps) {
  return (
    <div
      className={`story-device story-laptop ${className}`.trim()}
      data-device="laptop"
    >
      <img
        src="/assets/laptop-portal.svg"
        alt=""
        aria-hidden="true"
        width={600}
        height={600}
      />
      <div className="story-device__viewport story-laptop__viewport">
        {children}
      </div>
    </div>
  );
}
