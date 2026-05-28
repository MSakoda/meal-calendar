import { useLayoutEffect, useState } from 'react';

type TooltipState = {
  left: number;
  text: string;
  top: number;
};

const viewportPadding = 10;

export function FloatingTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    if (!tooltip) return;

    const tooltipElement = document.querySelector<HTMLElement>('.floating-tooltip');
    if (!tooltipElement) return;

    const rect = tooltipElement.getBoundingClientRect();
    const left = Math.min(
      Math.max(tooltip.left - rect.width / 2, viewportPadding),
      window.innerWidth - rect.width - viewportPadding,
    );
    const preferredTop = tooltip.top - rect.height - viewportPadding;
    const top =
      preferredTop < viewportPadding
        ? tooltip.top + viewportPadding
        : Math.min(preferredTop, window.innerHeight - rect.height - viewportPadding);

    setPosition({ left, top });
  }, [tooltip]);

  useLayoutEffect(() => {
    const showTooltip = (target: EventTarget | null) => {
      const element = target instanceof Element ? target.closest<HTMLElement>('[data-tooltip]') : null;
      const text = element?.dataset.tooltip;
      if (!element || !text || element.getAttribute('disabled') !== null) {
        setTooltip(null);
        return;
      }

      const rect = element.getBoundingClientRect();
      setTooltip({
        left: rect.left + rect.width / 2,
        text,
        top: rect.top,
      });
    };

    const hideTooltip = () => setTooltip(null);

    const handlePointerOver = (event: PointerEvent) => showTooltip(event.target);
    const handleFocusIn = (event: FocusEvent) => showTooltip(event.target);

    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('pointerout', hideTooltip);
    document.addEventListener('focusout', hideTooltip);
    window.addEventListener('scroll', hideTooltip, true);
    window.addEventListener('resize', hideTooltip);

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('pointerout', hideTooltip);
      document.removeEventListener('focusout', hideTooltip);
      window.removeEventListener('scroll', hideTooltip, true);
      window.removeEventListener('resize', hideTooltip);
    };
  }, []);

  if (!tooltip) return null;

  return (
    <div className="floating-tooltip" role="tooltip" style={{ left: position.left, top: position.top }}>
      {tooltip.text}
    </div>
  );
}
