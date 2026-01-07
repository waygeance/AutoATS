# Security Policy

## Supported Versions

Only the latest version of AutoATS is supported with security updates.

## Reporting a Vulnerability

To report a security vulnerability, please use the following process:

1. **Do NOT open a public issue** on GitHub
2. Send an email to: [INSERT SECURITY EMAIL]
3. Include as much detail as possible:
   - Type of vulnerability
   - Steps to reproduce
   - Potential impact
   - Any proof-of-concept code (if applicable)

### What Happens Next

- We will acknowledge receipt within 48 hours
- We will provide a detailed response within 7 days
- We will release a patch within 30 days (depending on complexity)
- We will credit you in the release notes (unless you prefer anonymity)

## Security Best Practices for Users

- Keep your Ollama instance updated and not publicly exposed
- Run AutoATS in a sandboxed environment when processing untrusted job descriptions
- Review generated PDFs before submitting to employers
- Do not share your LaTeX templates with sensitive personal information

## Scope

This security policy applies to:

- The AutoATS web application
- The API service
- The LaTeX compilation service
- Infrastructure and deployment scripts

## Out of Scope

The following are not covered by this security policy:

- Vulnerabilities in third-party dependencies (report to their respective projects)
- Issues with Ollama or the LLaMA model (report to Ollama project)
- LaTeX compiler vulnerabilities (report to TeX Live project)
