# Cleaning Buddy - Workspace Rules

## 1. Naming Conventions

### Code
- **Components**: PascalCase (e.g., `TaskCard`, `UserProfile`)
- **Variables/Functions**: camelCase (e.g., `userName`, `createTask()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_TASKS`)

### Files & Folders
- **Files**: kebab-case (e.g., `task-service.ts`, `user-utils.ts`)
- **Folders**: kebab-case (e.g., `components/`, `services/`)

### Git Branches
- **Feature branches**: `feature/description` (e.g., `feature/neat-freak-quiz`)
- **Bug fixes**: `bugfix/description` (e.g., `bugfix/login-error`)

---

## 2. Commit Message Guidelines

### Format
```
type(scope): description
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Formatting changes (no code logic change)
- **refactor**: Code restructuring

### Examples
```
feat(auth): add user registration
fix(tasks): resolve task completion bug
docs(readme): update installation steps
```

### Rules
- Use present tense ("add" not "added")
- Keep description under 50 characters
- Don't capitalize first letter
- Don't end with period

---

## 3. Pull Request Process

### Creating a PR
1. Create feature branch from `main`
```bash
   git checkout main
   git pull origin main
   git checkout -b feature/your-feature-name
```

2. Make changes and commit following commit guidelines

3. Push your branch
```bash
   git push origin feature/your-feature-name
```

4. Open pull request on GitHub with:
   - Clear title
   - Description of changes
   - Screenshots for UI changes (if applicable)

### Review Process
1. At least one team member must review
2. Address all review comments
3. Get approval before merging
4. Delete branch after merge

---

## 4. Branching Strategy

### Main Branch
- **main**: Production-ready code
  - Protected (requires PR to merge)
  - Always deployable

### Supporting Branches
- **feature/***: New features
  - Branch from: `main`
  - Merge to: `main`
  - Example: `feature/cleaning-dashboard`

- **bugfix/***: Bug fixes
  - Branch from: `main`
  - Merge to: `main`
  - Example: `bugfix/login-validation`

### Workflow
```bash
# Start new feature
git checkout main
git pull origin main
git checkout -b feature/your-feature

# Work and commit
git add .
git commit -m "feat(scope): description"

# Push and create PR
git push origin feature/your-feature

# After merge, update local
git checkout main
git pull origin main
git branch -d feature/your-feature
```