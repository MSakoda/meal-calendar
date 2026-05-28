import { Heart, Pencil, Search, Trash2 } from 'lucide-react';
import type { Meal, MealInput } from '../../types';
import { emptyMeal } from '../../hooks/useMealPlanner';

type MealSearchProps = {
  meals: Meal[];
  profileId?: string;
  query: string;
  onCreateFromQuery: (draft: MealInput) => void;
  onDelete: (mealId: string) => void;
  onEdit: (meal: Meal) => void;
  onOpenInfo: (mealId: string) => void;
  onQueryChange: (query: string) => void;
  onToggleFavorite: (mealId: string) => void;
};

export function MealSearch({
  meals,
  profileId,
  query,
  onCreateFromQuery,
  onDelete,
  onEdit,
  onOpenInfo,
  onQueryChange,
  onToggleFavorite,
}: MealSearchProps) {
  return (
    <section className="tool-panel">
      <h2>
        <Search size={18} /> Search meals
      </h2>
      <input placeholder="Search yours and public meals" value={query} onChange={(event) => onQueryChange(event.target.value)} />
      {!meals.length && (
        <button className="empty-state" onClick={() => onCreateFromQuery({ ...emptyMeal, name: query })}>
          Create meal
        </button>
      )}
      <div className="meal-list">
        {meals.map((meal) => (
          <article
            key={meal.id}
            className="meal-row clickable-row"
            onClick={() => onOpenInfo(meal.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpenInfo(meal.id);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <span className="dot" style={{ background: meal.color }} />
            <div className="meal-row-text">
              <strong>{meal.name}</strong>
              <small>{meal.isPublic ? 'public' : 'private'}</small>
            </div>
            <div className="meal-row-actions" onClick={(event) => event.stopPropagation()}>
              <button aria-label="Favorite" data-tooltip="Favorite" onClick={() => onToggleFavorite(meal.id)}>
                <Heart size={16} fill={meal.isFavorite ? 'currentColor' : 'none'} />
              </button>
              {meal.ownerId === profileId && (
                <button aria-label={`Edit ${meal.name}`} data-tooltip="Edit meal" onClick={() => onEdit(meal)}>
                  <Pencil size={16} />
                </button>
              )}
              {meal.ownerId === profileId && (
                <button aria-label={`Delete ${meal.name}`} className="danger-icon-button" data-tooltip="Delete meal" onClick={() => onDelete(meal.id)}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
