import type { Meal, MealInput } from '../../types';
import { MealLibraryActions } from '../meal/MealLibraryActions';
import { MealSearch } from '../meal/MealSearch';

type MealsPageProps = {
  meals: Meal[];
  profileId?: string;
  query: string;
  onCreateMeal: () => void;
  onCreateFromQuery: (draft: MealInput) => void;
  onDelete: (mealId: string) => void;
  onEdit: (meal: Meal) => void;
  onOpenInfo: (mealId: string) => void;
  onQueryChange: (query: string) => void;
  onToggleFavorite: (mealId: string) => void;
};

export function MealsPage({
  meals,
  profileId,
  query,
  onCreateMeal,
  onCreateFromQuery,
  onDelete,
  onEdit,
  onOpenInfo,
  onQueryChange,
  onToggleFavorite,
}: MealsPageProps) {
  return (
    <div className="page-stack">
      <MealLibraryActions onCreateMeal={onCreateMeal} />
      <MealSearch
        meals={meals}
        onCreateFromQuery={onCreateFromQuery}
        onDelete={onDelete}
        onEdit={onEdit}
        onOpenInfo={onOpenInfo}
        onQueryChange={onQueryChange}
        onToggleFavorite={onToggleFavorite}
        profileId={profileId}
        query={query}
      />
    </div>
  );
}
