import { isAfter, parseISO } from 'date-fns';
import { History } from 'lucide-react';
import type { Meal, MealAssignment } from '../../types';

type MealHistoryProps = {
  assignments: MealAssignment[];
  mealsById: Map<string, Meal>;
  onResetDemo: () => void;
};

export function MealHistory({ assignments, mealsById, onResetDemo }: MealHistoryProps) {
  const history = assignments
    .filter((assignment) => isAfter(new Date(), parseISO(assignment.date)) || assignment.status !== 'planned')
    .slice(0, 8);

  return (
    <section className="tool-panel">
      <h2>
        <History size={18} /> History
      </h2>
      {history.map((assignment) => (
        <div className="history-row" key={assignment.id}>
          <strong>{mealsById.get(assignment.mealId)?.name}</strong>
          <span>{assignment.date} - {assignment.slot} - {assignment.status}</span>
          {assignment.skippedReason && <small>Reason: {assignment.skippedReason}</small>}
        </div>
      ))}
      <button onClick={onResetDemo}>Reset demo data</button>
    </section>
  );
}
