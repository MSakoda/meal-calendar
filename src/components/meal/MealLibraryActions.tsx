import { Plus } from 'lucide-react';

type MealLibraryActionsProps = {
  onCreateMeal: () => void;
};

export function MealLibraryActions({ onCreateMeal }: MealLibraryActionsProps) {
  return (
    <section className="tool-panel compact-panel">
      <h2>Meal library</h2>
      <button className="primary-button" onClick={onCreateMeal} type="button">
        <Plus size={18} /> Create meal
      </button>
    </section>
  );
}
