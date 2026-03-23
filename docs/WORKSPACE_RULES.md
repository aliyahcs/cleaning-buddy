# Cleaning Buddy - Workspace Rules & Guidelines

## 1. Naming Conventions

### 1.1 Components
- **Format**: PascalCase
- **Examples**: `TaskCard`, `UserProfile`, `CleaningDashboard`
- **Files**: Component files should match the component name
  - `TaskCard.tsx`
  - `UserProfile.tsx`
  - `CleaningDashboard.tsx`

### 1.2 Variables & Functions
- **Format**: camelCase
- **Variable Examples**: `userName`, `taskList`, `isLoading`
- **Function Examples**: `createTask()`, `getUserProfile()`, `handleSubmit()`
- **Boolean Variables**: Prefix with `is`, `has`, `can`, `should`
  - `isLoading`, `hasCompletedTasks`, `canEdit`, `shouldRefresh`

### 1.3 Constants
- **Format**: UPPER_SNAKE_CASE
- **Examples**: `API_BASE_URL`, `MAX_TASK_LIMIT`, `DEFAULT_TIMEOUT`
- **File Location**: Store in dedicated constants files or at top of files
  ```typescript
  // constants/api.ts
  export const API_BASE_URL = 'https://api.cleaningbuddy.com/v1';
  export const MAX_TASK_LIMIT = 100;
  ```

### 1.4 Database & API
- **Database Tables**: snake_case
  - `task_instances`, `user_profiles`, `cleaning_categories`
- **API Endpoints**: kebab-case
  - `/api/v1/task-instances`, `/api/v1/user-profiles`
- **Query Parameters**: snake_case
  - `?user_id=123&task_status=pending`

### 1.5 CSS Classes
- **Format**: kebab-case with BEM methodology
- **Examples**: 
  - `task-card`
  - `task-card__title`
  - `task-card--completed`
  - `cleaning-dashboard__sidebar`

### 1.6 Files & Folders
- **Files**: kebab-case
  - `task-service.ts`, `user-utils.ts`, `api-client.ts`
- **Folders**: kebab-case
  - `components/`, `services/`, `utils/`, `hooks/`

### 1.7 Branch Names
- **Format**: type/description
- **Feature Branches**: `feature/task-management-system`
- **Bug Fix Branches**: `bugfix/login-validation-error`
- **Hotfix Branches**: `hotfix/critical-security-patch`
- **Release Branches**: `release/v1.2.0`

## 2. Commit Message Guidelines

### 2.1 Conventional Commits Format
```
type(scope): description

[optional body]

[optional footer(s)]
```

### 2.2 Commit Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting, missing semi colons, etc. (no code change)
- **refactor**: Code refactoring without feature changes
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates, etc.

### 2.3 Commit Examples
```bash
feat(auth): add user registration with email verification
fix(tasks): resolve task completion not saving to database
docs(readme): update installation instructions
style(components): fix linting errors in TaskCard component
refactor(api): simplify task service logic
test(auth): add unit tests for login functionality
chore(deps): update react to v18.2.0
```

### 2.4 Scope Guidelines
- Use specific scope when possible
- Common scopes: `auth`, `tasks`, `dashboard`, `api`, `ui`, `db`
- Example: `feat(tasks): add task priority levels`

### 2.5 Description Rules
- Use present tense ("add" not "added")
- Use imperative mood ("add feature" not "adds feature")
- Keep it under 50 characters when possible
- Don't capitalize first letter
- Don't end with period

### 2.6 Body & Footer
- **Body**: Explain what and why, not how
- **Footer**: Use for breaking changes, issue references
```bash
feat(api): add task filtering by category

Add support for filtering tasks by category ID in the API endpoint.
This improves performance by reducing payload size for mobile clients.

Closes #123
```

## 3. Pull Request Process

### 3.1 Branch Creation
1. Create feature branch from latest `main`
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/task-management-system
   ```

### 3.2 Development Workflow
1. Make small, focused changes
2. Follow naming conventions and commit guidelines
3. Test your changes thoroughly
4. Update documentation if needed

### 3.3 Pull Request Creation
1. Push your branch to remote
   ```bash
   git push origin feature/task-management-system
   ```
2. Create pull request with:
   - Clear title following commit format
   - Detailed description of changes
   - Screenshots for UI changes
   - Testing instructions
   - Related issue numbers

### 3.4 PR Template
```markdown
## Description
Brief description of what this PR accomplishes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Mobile responsive testing done

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### 3.5 Review Process
1. **Self-Review**: Review your own changes first
2. **Team Review**: Request at least one team member review
3. **Address Feedback**: Make requested changes
4. **Approval**: Wait for approval before merging
5. **Merge**: Use squash merge to maintain clean history

### 3.6 Merge Guidelines
- **Squash Merge**: For feature branches to maintain clean history
- **Rebase**: Keep your branch up to date with main
- **Delete Branch**: Clean up after merge
  ```bash
  git branch -d feature/task-management-system
  git push origin --delete feature/task-management-system
  ```

## 4. Branching Strategy

### 4.1 Main Branches
- **main**: Production-ready code
  - Always deployable
  - Protected branch
  - Requires PR for changes
- **develop**: Integration branch for features
  - Next release candidate
  - Features merged here first

### 4.2 Supporting Branches
- **feature/***: New features
  - Created from develop
  - Merged back to develop
  - Example: `feature/task-priority-system`

- **bugfix/***: Bug fixes
  - Created from develop
  - Merged back to develop
  - Example: `bugfix/login-validation-error`

- **hotfix/***: Critical production fixes
  - Created from main
  - Merged to both main and develop
  - Example: `hotfix/security-vulnerability-patch`

- **release/***: Release preparation
  - Created from develop
  - Merged to main and develop
  - Example: `release/v1.2.0`

### 4.3 Branch Protection Rules
- **main branch**:
  - Require PR reviews (minimum 2)
  - Require status checks to pass
  - Require up-to-date branches
  - Restrict force pushes

- **develop branch**:
  - Require PR reviews (minimum 1)
  - Require status checks to pass
  - Allow force pushes for maintainers

### 4.4 Workflow Example
```bash
# 1. Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/task-analytics

# 2. Development work
git add .
git commit -m "feat(analytics): add task completion charts"
git push origin feature/task-analytics

# 3. Create PR to develop
# 4. Review and merge
# 5. Clean up
git checkout develop
git pull origin develop
git branch -d feature/task-analytics
```

## 5. Code Quality Standards

### 5.1 Linting & Formatting
- Use ESLint for JavaScript/TypeScript
- Use Prettier for code formatting
- Configure pre-commit hooks
- Run linting before committing

### 5.2 Testing Requirements
- Unit tests for all utility functions
- Integration tests for API endpoints
- Component tests for UI components
- E2E tests for critical user flows

### 5.3 Documentation
- Update README for API changes
- Add inline comments for complex logic
- Document new features in docs/
- Keep OpenAPI spec updated

## 6. Development Environment Setup

### 6.1 Pre-commit Setup
```bash
# Install husky and lint-staged
npm install --save-dev husky lint-staged

# Configure package.json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
},
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"]
}
```

### 6.2 IDE Configuration
- Configure ESLint extension
- Set up Prettier formatter
- Use consistent code style
- Configure TypeScript settings

## 7. Release Process

### 7.1 Version Management
- Use semantic versioning (semver)
- Update package.json versions
- Create Git tags for releases
- Generate changelog

### 7.2 Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Changelog generated
- [ ] Release notes prepared
- [ ] Deployment tested in staging

## 8. Security Guidelines

### 8.1 Code Security
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Review dependencies for vulnerabilities
- Follow OWASP security guidelines

### 8.2 Access Control
- Use principle of least privilege
- Regular access reviews
- Secure authentication practices
- Encrypt sensitive data

## 9. Performance Guidelines

### 9.1 Code Performance
- Optimize database queries
- Use caching strategies
- Minimize bundle size
- Monitor performance metrics

### 9.2 Mobile Optimization
- Optimize images and assets
- Use lazy loading
- Implement service workers
- Test on various devices

## 10. Communication & Collaboration

### 10.1 Team Communication
- Use descriptive commit messages
- Document decisions in project docs
- Participate in code reviews
- Ask questions in appropriate channels

### 10.2 Issue Management
- Create issues for bugs and features
- Use labels and milestones
- Provide detailed issue descriptions
- Update issue status regularly