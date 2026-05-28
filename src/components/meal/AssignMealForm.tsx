import { CalendarDays, Search, X } from 'lucide-react';
import { FormEvent } from 'react';
import type { Meal, MealType } from '../../types';
import { mealTypes } from '../../utils/constants';

type SlotDraft = {
  date: string;
  slot: MealType;
  mealId: string;
};

type AssignMealFormProps = {
  favoriteMeals: Meal[];
  isOpen: boolean;
  meals: Meal[];
  searchQuery: string;
  slotDraft: SlotDraft;
  onChange: (slotDraft: SlotDraft) => void;
  onClose: () => void;
  onCreateMeal: () => void;
  onSearchChange: (query: string) => void;
  onSubmit: (event: FormEvent) => void;
};

export function AssignMealForm({
  favoriteMeals,
  isOpen,
  meals,
  searchQuery,
  slotDraft,
  onChange,
  onClose,
  onCreateMeal,
  onSearchChange,
  onSubmit,
}: AssignMealFormProps) {
  if (!isOpen) return null;

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const favoriteMealIds = new Set(favoriteMeals.map((meal) => meal.id));
  const matchingMeals = meals.filter((meal) => {
    const text = `${meal.name} ${meal.ingredients.join(' ')} ${meal.notes}`.toLowerCase();
    return !normalizedQuery || text.includes(normalizedQuery);
  });

  return (
    <div aria-modal="true" className="modal-backdrop" role="dialog">
      <form className="modal-panel" onSubmit={onSubmit}>
        <div className="modal-header">
          <h2>
            <CalendarDays size={18} /> Assign meal
          </h2>
          <button aria-label="Close assign meal modal" className="icon-button" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>
        <div className="field-row">
          <input type="date" value={slotDraft.date} onChange={(event) => onChange({ ...slotDraft, date: event.target.value })} />
          <select value={slotDraft.slot} onChange={(event) => onChange({ ...slotDraft, slot: event.target.value as MealType })}>
            {mealTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <label className="search-field">
          <Search size={16} />
          <input
            autoFocus
            placeholder="Search saved and public meals"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>
        <div className="assign-results">
          {matchingMeals.map((meal) => (
            <button
              className={slotDraft.mealId === meal.id ? 'assign-result selected' : 'assign-result'}
              key={meal.id}
              onClick={() => onChange({ ...slotDraft, mealId: meal.id })}
              type="button"
            >
              <span className="dot" style={{ background: meal.color }} />
              <span>
                <strong>{meal.name}</strong>
                <small>
                  {favoriteMealIds.has(meal.id) ? 'favorite' : meal.isPublic ? 'public' : 'private'}
                </small>
              </span>
            </button>
          ))}
          {!matchingMeals.length && (
            <button className="empty-state" onClick={onCreateMeal} type="button">
              Create meal
            </button>
          )}
        </div>
        <div className="modal-actions">
          <button onClick={onClose} type="button">
            Cancel
          </button>
          <button className="primary-button" type="submit">
            Assign
          </button>
        </div>
      </form>
    </div>
  );
}
