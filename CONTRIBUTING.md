# Contributing to DVD Authoring Tool

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Development Setup

1. **Fork and Clone** the repository:
   ```bash
   git clone https://github.com/yourusername/dvd-authoring-tool.git
   cd dvd-authoring-tool
   ```

2. **Set up the environment**:
   - Ensure Docker and Docker Compose are installed.
   - Start the development container: `docker-compose up -d`
   - Access the container shell: `docker exec -it dvd-author bash`

3. **Install dependencies** (if running locally):
   ```bash
   npm install
   ```

## How to Contribute

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**:
   - Follow the existing code style (see ESLint config).
   - Add tests for new features.
   - Update documentation as needed.

3. **Test Your Changes**:
   - Run the tool with sample media.
   - Ensure Docker builds work: `docker-compose build`
   - Check for linting errors: `npm run lint` (if configured).

4. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   git push origin feature/your-feature-name
   ```

5. **Submit a Pull Request**:
   - Open a PR on GitHub with a clear description.
   - Reference any related issues.

## Code Guidelines

- Use ES6+ syntax and modules.
- Follow the ESLint rules in `eslint.config.js`.
- Write clear, concise commit messages.
- Add JSDoc comments for new functions.
- Keep changes focused and avoid unrelated modifications.

## Reporting Issues

- Use GitHub Issues for bugs, features, or questions.
- Provide detailed steps to reproduce bugs.
- Include system info (OS, Node version, etc.).

## Code of Conduct

Be respectful and constructive in all interactions. This project follows a standard open-source code of conduct.

For questions, reach out via GitHub Issues or Discussions.