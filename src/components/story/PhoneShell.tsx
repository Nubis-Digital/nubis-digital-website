import type { ReactNode } from 'react';

interface DeviceShellProps {
  children: ReactNode;
  className?: string;
}

export function PhoneShell({ children, className = '' }: DeviceShellProps) {
  return (
    <div
      className={`story-device story-phone ${className}`.trim()}
      data-device="phone"
      aria-label="Mobile experience"
    >
      <span className="story-phone__speaker" aria-hidden="true" />
      <div className="story-device__viewport story-phone__viewport">
        {children}
      </div>
      <span className="story-phone__home" aria-hidden="true" />
    </div>
  );
}
