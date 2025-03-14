# Git Branch Naming Conventions

## Basic Rules

- **Lowercase and Hyphen-separated**: Stick to lowercase for branch names and use hyphens to separate words. For example:
  - `feature/new-login`
  - `bugfix/header-styling`
  
- **Alphanumeric Characters**: Use only alphanumeric characters (`a-z`, `A-Z`, `0–9`) and hyphens. Avoid punctuation, spaces, underscores, or any non-alphanumeric character.

- **No Continuous Hyphens**: Do not use continuous hyphens. For example:
  - `feature--new-login` can be confusing and hard to read.

- **No Trailing Hyphens**: Do not end your branch name with a hyphen. For example:
  - `feature-new-login-` is not recommended.

- **Descriptive**: The name should be descriptive and concise, ideally reflecting the work done on the branch.

## Branch Prefixes

Using prefixes in branch names helps to quickly identify the purpose of the branches. Here are some common types of branches with their corresponding prefixes:

### Feature Branches
- **Purpose**: These branches are used for developing new features.
- **Prefix**: `feature/`
- **Example**: `feature/login-system`

### Bugfix Branches
- **Purpose**: These branches are used to fix bugs in the code.
- **Prefix**: `bugfix/`
- **Example**: `bugfix/header-styling`

### Hotfix Branches
- **Purpose**: These branches are made directly from the production branch to fix critical bugs in the production environment.
- **Prefix**: `hotfix/`
- **Example**: `hotfix/critical-security-issue`

### Release Branches
- **Purpose**: These branches are used to prepare for a new production release. They allow for last-minute dotting of i’s and crossing t’s.
- **Prefix**: `release/`
- **Example**: `release/v1.0.1`

### Documentation Branches
- **Purpose**: These branches are used to write, update, or fix documentation (e.g., the README.md file).
- **Prefix**: `docs/`
- **Example**: `docs/api-endpoints`
