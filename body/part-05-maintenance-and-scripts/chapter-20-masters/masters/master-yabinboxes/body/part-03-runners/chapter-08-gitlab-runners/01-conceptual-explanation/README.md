# 1. Conceptual explanation

A GitLab runner is the machine that executes a GitLab CI/CD job. The job selects it from `.gitlab-ci.yml`, either a GitLab-hosted shared runner or a runner registered for the project.

Snow Monkeys reusable workflows in this book are GitHub Actions workflows. They run on a GitHub runner, not on a GitLab runner. When the caller repository is hosted on GitLab, the workflow sends `git_type: gitlab` to Snow so Snow records that Git host. That value does not start a GitLab runner.
