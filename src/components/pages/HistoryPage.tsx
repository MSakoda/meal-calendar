import type { Meal, MealAssignment } from '../../types';
import { MealHistory } from '../meal/MealHistory';

type HistoryPageProps = {
  assignments: MealAssignment[];
  mealsById: Map<string, Meal>;
  onResetDemo: () => void;
};

export function HistoryPage({ assignments, mealsById, onResetDemo }: HistoryPageProps) {
  return <MealHistory assignments={assignments} mealsById={mealsById} onResetDemo={onResetDemo} />;
}
