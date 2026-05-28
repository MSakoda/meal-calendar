import { format, startOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, ClipboardPaste, Copy, Pencil, Printer, Share2 } from 'lucide-react';
import { SegmentedToggle } from '../common/SegmentedToggle';
import type { ViewMode } from '../../types';
import { monthTitle } from '../../utils/date';

type CalendarHeaderProps = {
  anchor: Date;
  hasCopiedPlan: boolean;
  includesToday: boolean;
  isEditMode: boolean;
  isPeriodCopySource: boolean;
  view: ViewMode;
  onCopyPeriod: () => void;
  onMovePeriod: (direction: -1 | 1) => void;
  onOpenSharedAccess: () => void;
  onPastePeriod: () => void;
  onSetAnchor: (date: Date) => void;
  onSetEditMode: (isEditMode: boolean) => void;
  onSetView: (view: ViewMode) => void;
};

export function CalendarHeader({
  anchor,
  hasCopiedPlan,
  includesToday,
  isEditMode,
  isPeriodCopySource,
  view,
  onCopyPeriod,
  onMovePeriod,
  onOpenSharedAccess,
  onPastePeriod,
  onSetAnchor,
  onSetEditMode,
  onSetView,
}: CalendarHeaderProps) {
  return (
    <>
      <div className="section-header">
        <div className="calendar-title-group">
          <div className="calendar-title-nav">
            <button aria-label="Previous period" className="icon-button" data-tooltip="Previous" onClick={() => onMovePeriod(-1)}>
              <ChevronLeft size={18} />
            </button>
            <h2>{view === 'week' ? `Week of ${format(startOfWeek(anchor, { weekStartsOn: 1 }), 'MMM d')}` : monthTitle(anchor)}</h2>
            <button aria-label="Next period" className="icon-button" data-tooltip="Next" onClick={() => onMovePeriod(1)}>
              <ChevronRight size={18} />
            </button>
            <button className={includesToday ? 'today-button active' : 'today-button'} onClick={() => onSetAnchor(new Date())}>
              Today
            </button>
          </div>
        </div>
      </div>
      <div className="period-actions">
        <SegmentedToggle
          ariaLabel="Calendar view"
          className="calendar-view-toggle"
          onChange={onSetView}
          options={[
            { label: 'Week', value: 'week' },
            { label: 'Month', value: 'month' },
          ]}
          value={view}
        />
        <div className="calendar-tools">
          {isEditMode && (
            <>
              <button aria-label={`Copy ${view} meals`} className="icon-button" data-tooltip={`Copy ${view}`} onClick={onCopyPeriod}>
                <Copy size={16} />
              </button>
              {hasCopiedPlan && !isPeriodCopySource && (
                <button aria-label={`Paste copied meals to ${view}`} className="icon-button" data-tooltip={`Paste to ${view}`} onClick={onPastePeriod}>
                  <ClipboardPaste size={16} />
                </button>
              )}
            </>
          )}
          <button aria-label="Print meal plan" className="icon-button" data-tooltip="Print meal plan" onClick={() => window.print()}>
            <Printer size={16} />
          </button>
          <button aria-label="Manage shared access" className="icon-button" data-tooltip="Manage shared access" onClick={onOpenSharedAccess}>
            <Share2 size={16} />
          </button>
          <button
            aria-label={isEditMode ? 'Exit calendar edit mode' : 'Edit calendar'}
            className={isEditMode ? 'icon-button calendar-edit-button active' : 'icon-button calendar-edit-button'}
            onClick={() => onSetEditMode(!isEditMode)}
            data-tooltip={isEditMode ? 'Done editing' : 'Edit calendar'}
            data-tooltip-align="right"
          >
            <Pencil size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
