import { addDays, addMonths, addWeeks, differenceInCalendarDays, subMonths, subWeeks } from 'date-fns';
import { FormEvent, useMemo, useState } from 'react';
import type { AppView, AssignmentStatus, Meal, MealInput, MealType, MemberRole, ViewMode } from '../types';
import {
  canCreateMeal,
  createId,
  inviteMember,
  loadState,
  makeCalendar,
  makeMeal,
  resetState,
  saveState,
  upsertAssignment,
} from '../services/storage';
import { mealPalette, mealTypes } from '../utils/constants';
import { getMonthGrid, getWeekDays, toDateKey } from '../utils/date';

export const emptyMeal: MealInput = {
  name: '',
  ingredients: [],
  notes: '',
  color: mealPalette[0],
  isPublic: false,
  isFavorite: false,
};

type CopiedMealPlan = {
  items: Array<{ dayOffset: number; mealId: string; notes?: string; slot: MealType }>;
  sourceStart: string;
  type: ViewMode | 'day';
};

type PendingPaste = {
  targetStart: string;
  type: ViewMode | 'day';
};

export function useMealPlanner() {
  const [state, setState] = useState(loadState);
  const [dark, setDark] = useState(false);
  const [activeView, setActiveView] = useState<AppView>('home');
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);
  const [view, setView] = useState<ViewMode>('week');
  const [isCalendarEditMode, setIsCalendarEditMode] = useState(false);
  const [anchor, setAnchor] = useState(new Date());
  const [query, setQuery] = useState('');
  const [assignMealQuery, setAssignMealQuery] = useState('');
  const [mealDraft, setMealDraft] = useState<MealInput>(emptyMeal);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [slotDraft, setSlotDraft] = useState({ date: toDateKey(new Date()), slot: 'breakfast' as MealType, mealId: '' });
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [skipDraft, setSkipDraft] = useState({ assignmentId: '', reason: 'Ordered out', note: '' });
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);
  const [isSharedAccessModalOpen, setIsSharedAccessModalOpen] = useState(false);
  const [selectedMealInfo, setSelectedMealInfo] = useState<{ assignmentId?: string; mealId: string } | null>(null);
  const [inviteDraft, setInviteDraft] = useState({ email: '', role: 'editor' as MemberRole });
  const [copiedPlan, setCopiedPlan] = useState<CopiedMealPlan | null>(null);
  const [pendingPaste, setPendingPaste] = useState<PendingPaste | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [message, setMessage] = useState('Local data is saved in this browser.');

  const persist = (next: typeof state, note?: string) => {
    setState(next);
    saveState(next);
    if (note) setMessage(note);
  };

  const mealsById = useMemo(() => new Map(state.meals.map((meal) => [meal.id, meal])), [state.meals]);
  const currentCalendar = state.calendars.find((calendar) => calendar.id === state.currentCalendarId) ?? state.calendars[0];
  const currentOwnerId = state.profile?.id ?? currentCalendar.ownerId;
  const visibleDays = view === 'week' ? getWeekDays(anchor) : getMonthGrid(anchor);
  const currentAssignments = state.assignments.filter((assignment) => assignment.calendarId === currentCalendar.id);
  const upcoming = useMemo(() => {
    const nowKey = toDateKey(new Date());
    return currentAssignments
      .filter((assignment) => assignment.date >= nowKey)
      .sort((a, b) => `${a.date}-${mealTypes.indexOf(a.slot)}`.localeCompare(`${b.date}-${mealTypes.indexOf(b.slot)}`))
      .find((assignment) => mealsById.has(assignment.mealId));
  }, [currentAssignments, mealsById]);

  const filteredMeals = state.meals.filter((meal) => {
    const text = `${meal.name} ${meal.ingredients.join(' ')} ${meal.notes}`.toLowerCase();
    const canSee = meal.ownerId === currentOwnerId || meal.isPublic;
    return canSee && text.includes(query.toLowerCase());
  });
  const favoriteMeals = state.meals.filter((meal) => meal.isFavorite);
  const selectedMeal = selectedMealInfo ? mealsById.get(selectedMealInfo.mealId) : undefined;
  const selectedMealAssignment = selectedMealInfo?.assignmentId
    ? state.assignments.find((assignment) => assignment.id === selectedMealInfo.assignmentId)
    : undefined;

  const submitMeal = (event: FormEvent) => {
    event.preventDefault();
    const input = {
      ...mealDraft,
      ingredients: mealDraft.ingredients.map((ingredient) => ingredient.trim()).filter(Boolean),
      name: mealDraft.name.trim(),
    };
    if (!input.name) {
      setMessage('Meal name is required.');
      return;
    }

    if (editingMealId) {
      persist({ ...state, meals: state.meals.map((meal) => (meal.id === editingMealId ? { ...meal, ...input } : meal)) }, 'Meal updated.');
    } else {
      try {
        const meal = makeMeal(state, input);
        persist({ ...state, meals: [meal, ...state.meals] }, 'Meal created.');
        setQuery('');
        if (isAssignModalOpen || isMealModalOpen) {
          setSlotDraft((current) => ({ ...current, mealId: meal.id }));
          setAssignMealQuery(meal.name);
        }
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Could not create meal.');
      }
    }

    setMealDraft(emptyMeal);
    setEditingMealId(null);
    setIsMealModalOpen(false);
  };

  const editMeal = (meal: Meal) => {
    setEditingMealId(meal.id);
    setIsMealModalOpen(true);
    setMealDraft({
      name: meal.name,
      ingredients: meal.ingredients,
      notes: meal.notes ?? '',
      color: meal.color,
      isPublic: meal.isPublic,
      isFavorite: meal.isFavorite,
    });
  };

  const deleteMeal = (id: string) => {
    persist(
      {
        ...state,
        meals: state.meals.filter((meal) => meal.id !== id),
        assignments: state.assignments.filter((assignment) => assignment.mealId !== id),
      },
      'Meal deleted.',
    );
  };

  const assignMeal = (event: FormEvent) => {
    event.preventDefault();
    if (!slotDraft.mealId) {
      setMessage('Choose a meal before assigning.');
      return;
    }
    persist({ ...state, assignments: upsertAssignment(state, slotDraft) }, 'Meal assigned.');
    setIsAssignModalOpen(false);
  };

  const updateAssignmentStatus = (id: string, status: AssignmentStatus, skippedReason = '') => {
    persist(
      {
        ...state,
        assignments: state.assignments.map((assignment) =>
          assignment.id === id
            ? {
                ...assignment,
                status,
                skippedReason: status === 'skipped' ? skippedReason : undefined,
                replacementMeal: undefined,
              }
            : assignment,
        ),
      },
      'Meal tracking updated.',
    );
  };

  const removeAssignment = (id: string) => {
    persist({ ...state, assignments: state.assignments.filter((assignment) => assignment.id !== id) }, 'Assignment removed.');
  };

  const updateAssignmentNotes = (id: string, notes: string) => {
    persist(
      {
        ...state,
        assignments: state.assignments.map((assignment) =>
          assignment.id === id ? { ...assignment, notes: notes.trim() || undefined } : assignment,
        ),
      },
      'Meal note saved for this calendar spot.',
    );
  };

  const invite = (event: FormEvent) => {
    event.preventDefault();
    if (!inviteDraft.email.includes('@')) {
      setMessage('Enter a valid email address.');
      return;
    }
    persist(
      {
        ...state,
        calendars: state.calendars.map((calendar) =>
          calendar.id === currentCalendar.id
            ? { ...calendar, members: [...calendar.members, inviteMember(state, inviteDraft.email, inviteDraft.role)] }
            : calendar,
        ),
      },
      'Member invited in demo mode.',
    );
    setInviteDraft({ email: '', role: 'editor' });
  };

  const removeMember = (id: string) => {
    persist(
      {
        ...state,
        calendars: state.calendars.map((calendar) =>
          calendar.id === currentCalendar.id
            ? { ...calendar, members: calendar.members.filter((member) => member.id !== id) }
            : calendar,
        ),
      },
      'Member removed.',
    );
  };

  const movePeriod = (direction: -1 | 1) => {
    setAnchor(view === 'week' ? (direction > 0 ? addWeeks(anchor, 1) : subWeeks(anchor, 1)) : direction > 0 ? addMonths(anchor, 1) : subMonths(anchor, 1));
  };

  const createCalendar = (name: string) => {
    const calendarName = name.trim();
    if (!calendarName) {
      setMessage('Calendar name is required.');
      return false;
    }
    const normalizedName = calendarName.toLowerCase();
    const hasDuplicate = state.calendars.some(
      (calendar) => calendar.ownerId === currentOwnerId && calendar.name.trim().toLowerCase() === normalizedName,
    );
    if (hasDuplicate) {
      setMessage('You already have a calendar with that name.');
      return false;
    }
    const calendar = makeCalendar(state, calendarName);
    persist(
      {
        ...state,
        calendars: [...state.calendars, calendar],
        currentCalendarId: calendar.id,
      },
      'Calendar created.',
    );
    setActiveView('home');
    setAnchor(new Date());
    return true;
  };

  const switchCalendar = (id: string) => {
    if (!state.calendars.some((calendar) => calendar.id === id)) return;
    persist({ ...state, currentCalendarId: id }, 'Calendar switched.');
    setActiveView('home');
    setAnchor(new Date());
  };

  const deleteCalendar = (id: string) => {
    if (state.calendars.length <= 1) {
      setMessage('Keep at least one calendar.');
      return;
    }

    const remainingCalendars = state.calendars.filter((calendar) => calendar.id !== id);
    const nextCalendarId = state.currentCalendarId === id ? remainingCalendars[0].id : state.currentCalendarId;
    persist(
      {
        ...state,
        calendars: remainingCalendars,
        currentCalendarId: nextCalendarId,
        assignments: state.assignments.filter((assignment) => assignment.calendarId !== id),
      },
      'Calendar deleted.',
    );
    setActiveView('home');
    setAnchor(new Date());
  };

  const resetDemo = () => persist(resetState(), 'Demo data restored.');
  const toggleFavorite = (mealId: string) => {
    persist({ ...state, meals: state.meals.map((meal) => (meal.id === mealId ? { ...meal, isFavorite: !meal.isFavorite } : meal)) });
  };
  const openAssignMeal = (date: string, slot: MealType = 'breakfast') => {
    setSlotDraft((current) => ({ ...current, date, slot }));
    setAssignMealQuery('');
    setIsAssignModalOpen(true);
  };
  const goHomeToday = () => {
    setActiveView('home');
    setAnchor(new Date());
    setView('week');
  };
  const openMealModalFromAssignment = () => {
    setEditingMealId(null);
    setMealDraft({ ...emptyMeal, name: assignMealQuery });
    setIsMealModalOpen(true);
  };
  const openCreateMealModal = (draft: MealInput = emptyMeal) => {
    setEditingMealId(null);
    setMealDraft(draft);
    setIsMealModalOpen(true);
  };
  const closeMealModal = () => {
    setIsMealModalOpen(false);
    setMealDraft(emptyMeal);
    setEditingMealId(null);
  };
  const openSkipMeal = (assignmentId: string) => {
    const assignment = state.assignments.find((item) => item.id === assignmentId);
    setSkipDraft({ assignmentId, reason: assignment?.skippedReason || 'Ordered out', note: '' });
    setIsSkipModalOpen(true);
  };
  const closeSkipMeal = () => {
    setIsSkipModalOpen(false);
    setSkipDraft({ assignmentId: '', reason: 'Ordered out', note: '' });
  };
  const submitSkipMeal = (event: FormEvent) => {
    event.preventDefault();
    const reason = skipDraft.reason === 'Other' ? skipDraft.note.trim() : skipDraft.reason;
    updateAssignmentStatus(skipDraft.assignmentId, 'skipped', reason || 'Skipped meal');
    closeSkipMeal();
  };
  const openMealInfo = (mealId: string, assignmentId?: string) => setSelectedMealInfo({ assignmentId, mealId });
  const closeMealInfo = () => setSelectedMealInfo(null);
  const getRangeDays = (type: ViewMode | 'day', startKey: string) => {
    if (type === 'day') return [startKey];
    const startDate = new Date(`${startKey}T00:00:00`);
    return (type === 'week' ? getWeekDays(startDate) : getMonthGrid(startDate)).map(toDateKey);
  };

  const copyPlan = (type: ViewMode | 'day', sourceStart: string, sourceDays: string[]) => {
    const sourceDate = new Date(`${sourceStart}T00:00:00`);
    const sourceDaySet = new Set(sourceDays);
    const items = currentAssignments
      .filter((assignment) => sourceDaySet.has(assignment.date))
      .map((assignment) => ({
        dayOffset: differenceInCalendarDays(new Date(`${assignment.date}T00:00:00`), sourceDate),
        mealId: assignment.mealId,
        notes: assignment.notes,
        slot: assignment.slot,
      }));

    if (!items.length) {
      setToastMessage('There are no meals to copy.');
      return;
    }

    setCopiedPlan({ items, sourceStart, type });
    setToastMessage(`Copied ${type} meals. Choose a target to paste.`);
  };

  const applyPaste = (paste: PendingPaste) => {
    if (!copiedPlan) return;
    const targetDate = new Date(`${paste.targetStart}T00:00:00`);
    const newAssignments = copiedPlan.items.map((item) => ({
      id: createId('assign'),
      calendarId: currentCalendar.id,
      mealId: item.mealId,
      notes: item.notes,
      date: toDateKey(addDays(targetDate, item.dayOffset)),
      slot: item.slot,
      status: 'planned' as AssignmentStatus,
    }));
    const targetDates = new Set(getRangeDays(paste.type, paste.targetStart));

    persist(
      {
        ...state,
        assignments: [
          ...state.assignments.filter(
            (assignment) => assignment.calendarId !== currentCalendar.id || !targetDates.has(assignment.date),
          ),
          ...newAssignments,
        ],
      },
      'Copied meals pasted.',
    );
    setPendingPaste(null);
    setToastMessage('Meals pasted.');
  };

  const requestPaste = (type: ViewMode | 'day', targetStart: string) => {
    if (!copiedPlan) return;
    if (copiedPlan.type === type && copiedPlan.sourceStart === targetStart) return;

    const targetDates = new Set(getRangeDays(type, targetStart));
    const hasExistingMeals = currentAssignments.some((assignment) => targetDates.has(assignment.date));
    const paste = { targetStart, type };

    if (hasExistingMeals) {
      setPendingPaste(paste);
      return;
    }

    applyPaste(paste);
  };

  return {
    state,
    currentCalendar,
    currentOwnerId,
    dark,
    setDark,
    activeView,
    setActiveView,
    isSideNavCollapsed,
    setIsSideNavCollapsed,
    view,
    setView,
    isCalendarEditMode,
    setIsCalendarEditMode,
    anchor,
    setAnchor,
    query,
    setQuery,
    assignMealQuery,
    setAssignMealQuery,
    mealDraft,
    setMealDraft,
    editingMealId,
    slotDraft,
    setSlotDraft,
    isAssignModalOpen,
    setIsAssignModalOpen,
    isMealModalOpen,
    setIsMealModalOpen,
    skipDraft,
    setSkipDraft,
    isSkipModalOpen,
    isSharedAccessModalOpen,
    setIsSharedAccessModalOpen,
    selectedMealInfo: selectedMeal,
    selectedMealInfoAssignmentId: selectedMealInfo?.assignmentId,
    selectedMealInfoAssignmentNotes: selectedMealAssignment?.notes,
    inviteDraft,
    setInviteDraft,
    copiedPlan,
    pendingPaste,
    toastMessage,
    setToastMessage,
    message,
    mealsById,
    visibleDays,
    currentAssignments,
    upcoming,
    filteredMeals,
    favoriteMeals,
    canAddMeal: canCreateMeal(state),
    submitMeal,
    editMeal,
    deleteMeal,
    assignMeal,
    updateAssignmentStatus,
    removeAssignment,
    updateAssignmentNotes,
    invite,
    removeMember,
    movePeriod,
    createCalendar,
    switchCalendar,
    deleteCalendar,
    resetDemo,
    toggleFavorite,
    openAssignMeal,
    openCreateMealModal,
    openMealModalFromAssignment,
    closeMealModal,
    openSkipMeal,
    closeSkipMeal,
    submitSkipMeal,
    copyDay: (date: string) => copyPlan('day', date, [date]),
    copyVisiblePeriod: () => copyPlan(view, toDateKey(visibleDays[0]), visibleDays.map(toDateKey)),
    pasteDay: (date: string) => requestPaste('day', date),
    pasteVisiblePeriod: () => requestPaste(view, toDateKey(visibleDays[0])),
    confirmPaste: () => pendingPaste && applyPaste(pendingPaste),
    cancelPaste: () => setPendingPaste(null),
    goHomeToday,
    openMealInfo,
    closeMealInfo,
  };
}
