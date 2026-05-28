import { useState } from 'react';
import { CreateCalendarModal } from './components/calendar/CreateCalendarModal';
import { DeleteCalendarModal } from './components/calendar/DeleteCalendarModal';
import { PasteConfirmModal } from './components/calendar/PasteConfirmModal';
import { AppToast } from './components/common/AppToast';
import { FloatingTooltip } from './components/common/FloatingTooltip';
import { AppHeader } from './components/layout/AppHeader';
import { AssignMealForm } from './components/meal/AssignMealForm';
import { MealFormModal } from './components/meal/MealFormModal';
import { MealInfoModal } from './components/meal/MealInfoModal';
import { HomePage } from './components/pages/HomePage';
import { MealsPage } from './components/pages/MealsPage';
import { SharedAccessModal } from './components/sharing/SharedAccessModal';
import { SideNav } from './components/layout/SideNav';
import { SkipReasonModal } from './components/meal/SkipReasonModal';
import { useMealPlanner } from './hooks/useMealPlanner';

export function App() {
  const planner = useMealPlanner();
  const [isCreateCalendarOpen, setIsCreateCalendarOpen] = useState(false);
  const [isDeleteCalendarOpen, setIsDeleteCalendarOpen] = useState(false);

  return (
    <main className={planner.dark ? 'app dark app-shell' : 'app app-shell'}>
      <SideNav
        activeView={planner.activeView}
        dark={planner.dark}
        isCollapsed={planner.isSideNavCollapsed}
        onGoHomeToday={planner.goHomeToday}
        onResetDemo={planner.resetDemo}
        onSelectView={planner.setActiveView}
        onToggleTheme={() => planner.setDark(!planner.dark)}
        onToggle={() => planner.setIsSideNavCollapsed(!planner.isSideNavCollapsed)}
      />

      <div className="app-content">
        {planner.activeView === 'home' && (
          <AppHeader
            calendars={planner.state.calendars}
            childName={planner.currentCalendar.childName}
            currentCalendarId={planner.currentCalendar.id}
            onCreateCalendar={() => setIsCreateCalendarOpen(true)}
            onDeleteCalendar={() => setIsDeleteCalendarOpen(true)}
            onSwitchCalendar={planner.switchCalendar}
          />
        )}

        {planner.activeView === 'home' && (
          <HomePage
            anchor={planner.anchor}
            assignments={planner.currentAssignments}
            copiedSourceStart={planner.copiedPlan?.sourceStart}
            copiedType={planner.copiedPlan?.type}
            hasCopiedPlan={Boolean(planner.copiedPlan)}
            isEditMode={planner.isCalendarEditMode}
            mealsById={planner.mealsById}
            onAddSlot={planner.openAssignMeal}
            onCopyDay={planner.copyDay}
            onCopyPeriod={planner.copyVisiblePeriod}
            onMovePeriod={planner.movePeriod}
            onOpenMealInfo={planner.openMealInfo}
            onOpenSharedAccess={() => planner.setIsSharedAccessModalOpen(true)}
            onPasteDay={planner.pasteDay}
            onPastePeriod={planner.pasteVisiblePeriod}
            onRemoveAssignment={planner.removeAssignment}
            onSetAnchor={planner.setAnchor}
            onSetEditMode={planner.setIsCalendarEditMode}
            onSetView={planner.setView}
            onSkipAssignment={planner.openSkipMeal}
            onUpdateStatus={planner.updateAssignmentStatus}
            view={planner.view}
            visibleDays={planner.visibleDays}
          />
        )}

        {planner.activeView === 'meals' && (
          <MealsPage
            meals={planner.filteredMeals}
            onCreateFromQuery={planner.openCreateMealModal}
            onCreateMeal={() => planner.openCreateMealModal()}
            onDelete={planner.deleteMeal}
            onEdit={planner.editMeal}
            onOpenInfo={planner.openMealInfo}
            onQueryChange={planner.setQuery}
            onToggleFavorite={planner.toggleFavorite}
            profileId={planner.currentOwnerId}
            query={planner.query}
          />
        )}

      </div>

      <AssignMealForm
        favoriteMeals={planner.favoriteMeals}
        isOpen={planner.isAssignModalOpen}
        meals={planner.state.meals}
        onChange={planner.setSlotDraft}
        onClose={() => planner.setIsAssignModalOpen(false)}
        onCreateMeal={planner.openMealModalFromAssignment}
        onSearchChange={planner.setAssignMealQuery}
        onSubmit={planner.assignMeal}
        searchQuery={planner.assignMealQuery}
        slotDraft={planner.slotDraft}
      />

      <MealFormModal
        canAddMeal={planner.canAddMeal}
        draft={planner.mealDraft}
        isEditing={Boolean(planner.editingMealId)}
        isOpen={planner.isMealModalOpen}
        onChange={planner.setMealDraft}
        onClose={planner.closeMealModal}
        onSubmit={planner.submitMeal}
      />

      <SkipReasonModal
        draft={planner.skipDraft}
        isOpen={planner.isSkipModalOpen}
        onChange={planner.setSkipDraft}
        onClose={planner.closeSkipMeal}
        onSubmit={planner.submitSkipMeal}
      />

      <SharedAccessModal
        inviteDraft={planner.inviteDraft}
        isOpen={planner.isSharedAccessModalOpen}
        members={planner.currentCalendar.members}
        onClose={() => planner.setIsSharedAccessModalOpen(false)}
        onInvite={planner.invite}
        onInviteChange={planner.setInviteDraft}
        onRemoveMember={planner.removeMember}
      />

      <MealInfoModal
        assignmentNotes={planner.selectedMealInfoAssignmentNotes}
        calendarOwnerId={planner.currentCalendar.ownerId}
        canEdit={planner.selectedMealInfo?.ownerId === (planner.state.profile?.id ?? planner.currentCalendar.ownerId)}
        deleteConfirmText={
          planner.selectedMealInfoAssignmentId
            ? `This will remove "${planner.selectedMealInfo?.name}" from this calendar slot only. The saved meal will stay in your meals list.`
            : undefined
        }
        deleteConfirmTitle={planner.selectedMealInfoAssignmentId ? 'Remove planned meal?' : undefined}
        deleteLabel={planner.selectedMealInfoAssignmentId ? 'Remove from calendar' : undefined}
        meal={planner.selectedMealInfo}
        members={planner.currentCalendar.members}
        onClose={planner.closeMealInfo}
        onDelete={() => {
          if (planner.selectedMealInfoAssignmentId) {
            planner.removeAssignment(planner.selectedMealInfoAssignmentId);
            return;
          }
          if (planner.selectedMealInfo) planner.deleteMeal(planner.selectedMealInfo.id);
        }}
        onEdit={(meal) => {
          planner.closeMealInfo();
          planner.editMeal(meal);
        }}
        onSaveAssignmentNotes={
          planner.selectedMealInfoAssignmentId
            ? (notes) => planner.updateAssignmentNotes(planner.selectedMealInfoAssignmentId!, notes)
            : undefined
        }
        onToggleFavorite={planner.toggleFavorite}
        profile={planner.state.profile}
      />

      <CreateCalendarModal
        isOpen={isCreateCalendarOpen}
        onClose={() => setIsCreateCalendarOpen(false)}
        onSubmit={planner.createCalendar}
      />

      <DeleteCalendarModal
        calendar={planner.currentCalendar}
        isOpen={isDeleteCalendarOpen}
        onClose={() => setIsDeleteCalendarOpen(false)}
        onConfirm={() => {
          planner.deleteCalendar(planner.currentCalendar.id);
          setIsDeleteCalendarOpen(false);
        }}
      />
      <PasteConfirmModal isOpen={Boolean(planner.pendingPaste)} onCancel={planner.cancelPaste} onConfirm={planner.confirmPaste} />
      <AppToast message={planner.toastMessage} onDismiss={() => planner.setToastMessage('')} />
      <FloatingTooltip />

    </main>
  );
}
