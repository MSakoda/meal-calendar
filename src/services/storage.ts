import type { AppState, CalendarMember, Meal, MealAssignment, MealCalendar, MealInput, MemberRole } from '../types';
import { initialState } from '../data/demoData';

const STORAGE_KEY = 'toddler-meal-planner-state';
const MAX_MEALS = 100;

const cloneState = (state: AppState): AppState => JSON.parse(JSON.stringify(state)) as AppState;

function normalizeDemoCalendar(calendar: MealCalendar): MealCalendar {
  return {
    ...calendar,
    name:
      calendar.name === 'Family Meal Calendar' || calendar.name === 'Demo food calendar'
        ? 'Demo Meal calendar'
        : calendar.name,
    childName: calendar.childName === 'Ari' ? 'Demo' : calendar.childName,
  };
}

function normalizeState(state: AppState & { calendar?: MealCalendar }): AppState {
  if (state.calendars?.length && state.currentCalendarId) {
    return {
      ...state,
      calendars: state.calendars.map(normalizeDemoCalendar),
    };
  }

  const calendar = normalizeDemoCalendar(state.calendar ?? initialState.calendars[0]);
  return {
    profile: state.profile ?? null,
    calendars: [calendar],
    currentCalendarId: calendar.id,
    meals: state.meals ?? [],
    assignments: state.assignments ?? [],
  };
}

export function loadState(): AppState {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return cloneState(initialState);
  try {
    return normalizeState(JSON.parse(saved) as AppState & { calendar?: MealCalendar });
  } catch {
    return cloneState(initialState);
  }
}

export function saveState(state: AppState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  const state = cloneState(initialState);
  saveState(state);
  return state;
}

export function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function canCreateMeal(state: AppState) {
  const ownerId = state.profile?.id ?? state.calendars.find((calendar) => calendar.id === state.currentCalendarId)?.ownerId ?? initialState.calendars[0].ownerId;
  return state.meals.filter((meal) => meal.ownerId === ownerId).length < MAX_MEALS;
}

export function makeMeal(state: AppState, input: MealInput): Meal {
  if (!canCreateMeal(state)) throw new Error('The MVP allows 100 saved meals per user.');
  const ownerId = state.profile?.id ?? state.calendars.find((calendar) => calendar.id === state.currentCalendarId)?.ownerId ?? initialState.calendars[0].ownerId;
  return {
    id: createId('meal'),
    ownerId,
    createdAt: new Date().toISOString(),
    ...input,
    isPublic: input.isPublic ?? false,
  };
}

export function upsertAssignment(
  state: AppState,
  payload: Pick<MealAssignment, 'date' | 'slot' | 'mealId'>,
): MealAssignment[] {
  const existing = state.assignments.find(
    (assignment) =>
      assignment.calendarId === state.currentCalendarId && assignment.date === payload.date && assignment.slot === payload.slot,
  );
  if (existing) {
    return state.assignments.map((assignment) =>
      assignment.id === existing.id ? { ...assignment, mealId: payload.mealId, notes: undefined, status: 'planned' } : assignment,
    );
  }
  return [
    ...state.assignments,
    {
      id: createId('assign'),
      calendarId: state.currentCalendarId,
      mealId: payload.mealId,
      date: payload.date,
      slot: payload.slot,
      status: 'planned',
    },
  ];
}

export function inviteMember(state: AppState, email: string, role: MemberRole): CalendarMember {
  return {
    id: createId('member'),
    calendarId: state.currentCalendarId,
    email,
    role,
  };
}

export function makeCalendar(state: AppState, name: string): MealCalendar {
  const ownerId = state.profile?.id ?? initialState.calendars[0].ownerId;
  const calendarId = createId('calendar');
  return {
    id: calendarId,
    name,
    ownerId,
    childName: name,
    members: [{ id: createId('member'), calendarId, email: state.profile?.email ?? 'parent@example.com', role: 'owner' }],
  };
}
