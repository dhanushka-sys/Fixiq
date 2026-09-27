# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

---

## Reporting a Vulnerability

Fixiq takes tenant data privacy, credential protection, and API security seriously.

If you discover a security vulnerability within Fixiq, please **do not** disclose it publicly via GitHub Issues.

### How to Report
1. Email your findings directly to the maintainers at `security@fixiq.dev` (or open a GitHub Private Security Advisory).
2. Include:
   * Description of the vulnerability.
   * Steps to reproduce or proof-of-concept payload.
   * Affected endpoints, packages, or tenant boundaries.
   * Potential impact assessment.
3. You will receive an acknowledgment within 48 hours and regular updates on the patch progress.

---

## Core Security Invariants

* **Tenant Isolation:** A tenant must never be able to access, infer, or mutate data belonging to another tenant. Any bypass of `organizationId` scoping is treated as a Critical (P0) security issue.
* **Authentication & Secrets:** JWT secrets, database connection strings, and encryption keys must never be committed to git.
