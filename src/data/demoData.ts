import type { AppState, Meal, MealAssignment } from '../types';
import { mealPalette } from '../utils/constants';
import { getWeekDays, toDateKey } from '../utils/date';

const ownerId = 'demo-parent';
const calendarId = 'family-calendar';
const now = new Date().toISOString();

export const demoMeals: Meal[] = [
  {
    id: 'meal-oats',
    ownerId,
    name: 'Banana oatmeal',
    ingredients: ['oats', 'banana', 'milk', 'cinnamon'],
    notes: 'Mash banana first so it sweetens the oats.',
    color: mealPalette[2],
    isPublic: true,
    isFavorite: true,
    createdAt: now,
  },
  {
    id: 'meal-bento',
    ownerId,
    name: 'Mini lunch box',
    ingredients: ['cheese cubes', 'berries', 'crackers', 'cucumber'],
    notes: 'Pack cucumber separately if prepping ahead.',
    color: mealPalette[1],
    isPublic: false,
    isFavorite: true,
    createdAt: now,
  },
  {
    id: 'meal-pasta',
    ownerId,
    name: 'Tiny tomato pasta',
    ingredients: ['small pasta', 'tomato sauce', 'peas', 'parmesan'],
    notes: 'Use pea pasta for extra protein when needed.',
    color: mealPalette[0],
    isPublic: true,
    isFavorite: false,
    createdAt: now,
  },
  {
    id: 'meal-yogurt',
    ownerId,
    name: 'Yogurt dip plate',
    ingredients: ['greek yogurt', 'apple slices', 'pretzels'],
    notes: 'Add honey only for adults.',
    color: mealPalette[5],
    isPublic: true,
    isFavorite: true,
    createdAt: now,
  },
  {
    id: 'meal-pancakes',
    ownerId,
    name: 'Spinach pancakes',
    ingredients: ['egg', 'spinach', 'banana', 'flour'],
    notes: 'Freezes well in pairs.',
    color: mealPalette[6],
    isPublic: false,
    isFavorite: false,
    createdAt: now,
  },
];

const week = getWeekDays(new Date());

export const demoAssignments: MealAssignment[] = [
  { id: 'assign-1', calendarId, mealId: 'meal-oats', date: toDateKey(week[0]), slot: 'breakfast', status: 'followed' },
  { id: 'assign-2', calendarId, mealId: 'meal-bento', date: toDateKey(week[0]), slot: 'lunch', status: 'planned' },
  { id: 'assign-3', calendarId, mealId: 'meal-pasta', date: toDateKey(week[1]), slot: 'dinner', status: 'planned' },
  { id: 'assign-4', calendarId, mealId: 'meal-yogurt', date: toDateKey(week[2]), slot: 'snack', status: 'skipped', replacementMeal: 'Applesauce pouch' },
  { id: 'assign-5', calendarId, mealId: 'meal-pancakes', date: toDateKey(week[3]), slot: 'breakfast', status: 'planned' },
];

export const initialState: AppState = {
  profile: {
    id: ownerId,
    email: 'parent@example.com',
    displayName: 'Demo Parent',
  },
  calendars: [
    {
      id: calendarId,
      name: 'Demo Meal calendar',
      ownerId,
      childName: 'Demo',
      members: [
        { id: 'member-owner', calendarId, email: 'parent@example.com', role: 'owner' },
        { id: 'member-editor', calendarId, email: 'partner@example.com', role: 'editor' },
      ],
    },
  ],
  currentCalendarId: calendarId,
  meals: demoMeals,
  assignments: demoAssignments,
};
