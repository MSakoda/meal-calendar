import { ChefHat } from 'lucide-react';
import { FormEvent } from 'react';
import type { MealInput } from '../../types';
import { mealPalette } from '../../utils/constants';

type MealFormProps = {
  canAddMeal: boolean;
  className?: string;
  draft: MealInput;
  isEditing: boolean;
  onChange: (draft: MealInput) => void;
  onCancel?: () => void;
  onSubmit: (event: FormEvent) => void;
};

export function MealForm({ canAddMeal, className = 'tool-panel', draft, isEditing, onCancel, onChange, onSubmit }: MealFormProps) {
  return (
    <form className={className} onSubmit={onSubmit}>
      <h2>
        <ChefHat size={18} /> {isEditing ? 'Edit meal' : 'Create meal'}
      </h2>
      <input placeholder="Meal name" value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} />
      <div className="field-row">
        <input
          placeholder="Ingredients, comma separated"
          value={draft.ingredients.join(',')}
          onChange={(event) => onChange({ ...draft, ingredients: event.target.value.split(',') })}
        />
      </div>
      <textarea placeholder="Notes or recipe" value={draft.notes} onChange={(event) => onChange({ ...draft, notes: event.target.value })} />
      <div className="swatches">
        {mealPalette.map((color) => (
          <button
            aria-label={`Use ${color}`}
            className={draft.color === color ? 'selected' : ''}
            key={color}
            onClick={() => onChange({ ...draft, color })}
            style={{ background: color }}
            type="button"
          />
        ))}
      </div>
      <label>
        <input checked={draft.isFavorite} onChange={(event) => onChange({ ...draft, isFavorite: event.target.checked })} type="checkbox" /> Favorite
      </label>
      <label>
        <input checked={draft.isPublic} onChange={(event) => onChange({ ...draft, isPublic: event.target.checked })} type="checkbox" /> Public
      </label>
      <div className={onCancel ? 'modal-actions' : undefined}>
        {onCancel && (
          <button onClick={onCancel} type="button">
            Cancel
          </button>
        )}
        <button className="primary-button" disabled={!isEditing && !canAddMeal} type="submit">
          {isEditing ? 'Save meal' : 'Create meal'}
        </button>
      </div>
    </form>
  );
}
