import type { MealType } from '../types';

export const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export const mealPalette = [
  '#ef7d57',
  '#58a88b',
  '#f2b84b',
  '#7a8fd8',
  '#d86f9f',
  '#4aa6c4',
  '#8fbe5d',
  '#c08b5c',
];

export const roleDescriptions = {
  owner: 'Full access',
  editor: 'Can plan and track meals',
  viewer: 'Can view calendar',
};
