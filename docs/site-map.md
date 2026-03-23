# Cleaning Buddy - Site Map & Navigation Structure

## 1. Primary Navigation

### 1.1 Bottom Navigation (Mobile)
- **Home** - Dashboard with today's tasks and quick stats
- **Tasks** - List view of all tasks with filtering options
- **Calendar** - Calendar view of scheduled tasks
- **Add** - Floating action button for quick task creation
- **Profile** - User settings and preferences

### 1.2 Sidebar Navigation (Desktop/Tablet)
- **Dashboard** - Main overview page
- **Tasks**
  - All Tasks
  - Today
  - Upcoming
  - Completed
  - By Category
- **Calendar**
  - Month View
  - Week View
  - Day View
- **Categories** - Manage task categories
- **Analytics** - Cleaning statistics and reports
- **Settings** - App configuration and preferences

## 2. Page Hierarchy

### 2.1 Dashboard (/)
- **Quick Stats**: Tasks due today, weekly progress, streak counter
- **Today's Tasks**: List of tasks scheduled for today
- **Recent Activity**: Recently completed tasks
- **Quick Actions**: Add task, view calendar, see analytics
- **Upcoming Tasks**: Next 3-5 upcoming tasks

### 2.2 Tasks (/tasks)
#### List View (/tasks)
- **Filter Bar**: Status, category, priority, date range
- **Sort Options**: Due date, priority, category, created date
- **Task Cards**: Title, category, priority, due date, status
- **Bulk Actions**: Mark multiple tasks, delete, change category

#### Task Detail (/tasks/:id)
- **Task Information**: Title, description, category, priority
- **Scheduling**: Due date, recurring settings
- **Time Tracking**: Estimated vs actual time
- **Actions**: Edit, delete, mark complete, duplicate
- **History**: Task status changes and completion history

#### Create/Edit Task (/tasks/new, /tasks/:id/edit)
- **Basic Info**: Title, description, category selection
- **Scheduling**: Due date picker, recurring options
- **Priority**: Low, Medium, High selection
- **Time Estimation**: Estimated duration
- **Save/Cancel**: Form actions

### 2.3 Calendar (/calendar)
#### Month View (/calendar?view=month)
- **Monthly Calendar**: Full month grid with task indicators
- **Task Preview**: Hover/click to see task details
- **Navigation**: Previous/next month, today button
- **Mini Calendar**: Quick date selection

#### Week View (/calendar?view=week)
- **Weekly Grid**: 7-day view with time slots
- **Task Blocks**: Visual task representations
- **Drag & Drop**: Reschedule tasks by dragging

#### Day View (/calendar?view=day)
- **Daily Schedule**: Hour-by-hour task timeline
- **Task Details**: Expanded task information
- **Time Management**: Visual time allocation

### 2.4 Categories (/categories)
#### Category List (/categories)
- **Category Cards**: Name, color, icon, task count
- **Add Category**: Create new category button
- **Edit/Delete**: Manage existing categories

#### Category Detail (/categories/:id)
- **Category Info**: Name, description, color, icon
- **Tasks in Category**: List of all tasks
- **Statistics**: Completion rate, time spent
- **Edit Category**: Modify category details

### 2.5 Analytics (/analytics)
#### Overview (/analytics)
- **Summary Cards**: Total tasks, completion rate, time spent
- **Charts**: Completion trends, category distribution
- **Time Period**: Week, month, quarter, year selectors

#### Detailed Reports (/analytics/reports)
- **Task Completion**: Detailed completion statistics
- **Time Analysis**: Time spent by category and task
- **Productivity**: Daily/weekly productivity patterns
- **Export Options**: Download reports as PDF/CSV

### 2.6 Profile & Settings
#### User Profile (/profile)
- **User Information**: Name, email, avatar
- **Preferences**: Theme, notifications, default views
- **Statistics**: Personal cleaning achievements

#### Settings (/settings)
- **Notifications**: Push notification preferences
- **Appearance**: Theme selection, font size
- **Data & Privacy**: Export data, delete account
- **About**: App version, help, support

## 3. Modal & Overlay Components

### 3.1 Quick Add Task Modal
- **Simplified Form**: Title, category, due date
- **Smart Suggestions**: Category and time suggestions
- **Quick Save**: One-click task creation

### 3.2 Task Completion Modal
- **Completion Confirmation**: Mark task as complete
- **Time Tracking**: Actual time spent
- **Notes**: Add completion notes
- **Next Task**: Quick navigation to next task

### 3.3 Filter & Sort Modal
- **Filter Options**: Status, category, priority, date
- **Sort Options**: Multiple sort criteria
- **Save Filters**: Save frequently used filter combinations

## 4. Navigation Patterns

### 4.1 Mobile Navigation
- **Bottom Tab Bar**: Primary navigation
- **Swipe Gestures**: Navigate between calendar views
- **Pull to Refresh**: Update task lists
- **Long Press**: Context menus for tasks

### 4.2 Desktop Navigation
- **Sidebar**: Primary navigation with expandable sections
- **Breadcrumb Navigation**: Show current page hierarchy
- **Keyboard Shortcuts**: Quick access to common actions
- **Right-click Context Menus**: Task actions

## 5. Deep Links & URLs

### 5.1 Task URLs
- `/tasks` - All tasks
- `/tasks/today` - Today's tasks
- `/tasks/upcoming` - Upcoming tasks
- `/tasks/completed` - Completed tasks
- `/tasks/category/:categoryId` - Tasks by category
- `/tasks/:id` - Specific task detail

### 5.2 Calendar URLs
- `/calendar` - Default (month) view
- `/calendar?view=week` - Week view
- `/calendar?view=day` - Day view
- `/calendar?date=2024-03-15` - Specific date

### 5.3 Other URLs
- `/categories` - Categories list
- `/categories/:id` - Category detail
- `/analytics` - Analytics overview
- `/profile` - User profile
- `/settings` - App settings

## 6. Responsive Design Considerations

### 6.1 Mobile (< 768px)
- **Single Column Layout**: Stack all content vertically
- **Bottom Navigation**: Primary navigation method
- **Touch Targets**: Minimum 44px touch targets
- **Swipe Navigation**: Gesture-based navigation

### 6.2 Tablet (768px - 1024px)
- **Two Column Layout**: Sidebar + main content
- **Hybrid Navigation**: Combination of sidebar and tabs
- **Touch & Mouse**: Support both input methods

### 6.3 Desktop (> 1024px)
- **Multi-column Layout**: Optimize screen real estate
- **Sidebar Navigation**: Full sidebar with all options
- **Keyboard Navigation**: Full keyboard accessibility
- **Hover States**: Rich interaction feedback
