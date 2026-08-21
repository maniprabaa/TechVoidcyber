import type { CSSProperties, ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type TextDotsProps = ComponentProps<'span'> & {
  dots?: number;
};

function TextDots({ className, children, dots = 3, style, ...props }: TextDotsProps) {
  const dotCount = Number.isFinite(dots) ? Math.max(1, Math.floor(dots)) : 3;

  return (
    <>
      <style>{`
        @keyframes loading-ui-text-dots {
          0%,
          100% {
            opacity: 0;
          }

          50% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading-ui-text-dot {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
      <span
        role="status"
        aria-live="polite"
        className={cn('inline-flex items-center', className)}
        style={style}
        {...props}
      >
        {children}
        <span aria-hidden="true" className="inline-flex">
          {Array.from({ length: dotCount }, (_, index) => (
            <span
              key={index}
              className="loading-ui-text-dot"
              style={
                {
                  animation: 'loading-ui-text-dots var(--duration, 1.4s) infinite',
                  animationDelay: `calc(var(--delay, 0.2s) * ${index + 1})`,
                } as CSSProperties
              }
            >
              .
            </span>
          ))}
        </span>
      </span>
    </>
  );
}

export { TextDots };
