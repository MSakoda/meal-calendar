export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type MemberRole = 'owner' | 'editor' | 'viewer';
export type AssignmentStatus = 'planned' | 'followed' | 'skipped';
export type ViewMode = 'week' | 'month';
export type AppView = 'home' | 'meals';

export type Profile = {
  id: string;
  email: string;
  displayName: string;
};

export type CalendarMember = {
  id: string;
  calendarId: string;
  email: string;
  role: MemberRole;
};

export type MealCalendar = {
  id: string;
  name: string;
  ownerId: string;
  childName: string;
  members: CalendarMember[];
};

export type Meal = {
  id: string;
  ownerId: string;
  name: string;
  ingredients: string[];
  notes?: string;
  color: string;
  isPublic: boolean;
  isFavorite: boolean;
  createdAt: string;
};

export type MealAssignment = {
  id: string;
  calendarId: string;
  mealId: string;
  date: string;
  slot: MealType;
  status: AssignmentStatus;
  notes?: string;
  replacementMeal?: string;
  skippedReason?: string;
};

export type AppState = {
  profile: Profile | null;
  calendars: MealCalendar[];
  currentCalendarId: string;
  meals: Meal[];
  assignments: MealAssignment[];
};

export type MealInput = Pick<Meal, 'name' | 'ingredients' | 'notes' | 'color' | 'isPublic' | 'isFavorite'>;
