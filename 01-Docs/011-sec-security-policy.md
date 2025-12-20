# Security Policy

## Supported Versions

We actively support the following versions of vibe-prd with security updates:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

As vibe-prd is a documentation generation tool with minimal external dependencies, we recommend always using the latest version for the most up-to-date templates and security practices.

## Security Considerations

### What vibe-prd Does
- **Template Processing**: Generates documentation from user input using AI assistants
- **Local File Operations**: Creates and manages documentation files in your local filesystem
- **AI Integration**: Interfaces with Claude Code CLI and Cursor IDE for content generation

### What vibe-prd Does NOT Do
- **Network Operations**: No network calls or external API dependencies
- **Code Execution**: Does not execute user-generated code or scripts
- **Data Collection**: No telemetry, analytics, or user data collection
- **Cloud Services**: No cloud-based processing or storage

### Security Best Practices

When using vibe-prd:

1. **Input Validation**: While vibe-prd templates are safe, always review AI-generated content before using in production
2. **File Permissions**: Generated documentation files inherit your system's default permissions
3. **Sensitive Data**: Avoid including secrets, API keys, or sensitive information in template inputs
4. **AI Assistant Security**: Follow your AI assistant's security guidelines when sharing project information

## Reporting a Vulnerability

If you discover a security vulnerability in vibe-prd, please help us maintain a secure project by reporting it responsibly.

### How to Report

1. **Email**: Send a detailed report to [jeremy@intentionsolutions.com](mailto:jeremy@intentionsolutions.com)
2. **Subject Line**: Use "SECURITY: vibe-prd vulnerability report"
3. **Include**:
   - Detailed description of the vulnerability
   - Steps to reproduce (if applicable)
   - Potential impact assessment
   - Suggested remediation (if available)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within 24 hours
- **Assessment**: Initial assessment and response within 72 hours
- **Resolution**: Security fixes will be prioritized and released as soon as possible
- **Credit**: With your permission, we will credit you in the security advisory

### Responsible Disclosure

- Please allow reasonable time for us to address the issue before public disclosure
- We commit to keeping you informed of our progress
- We will coordinate with you on the timing of any public announcements

## Security Updates

Security updates will be communicated through:

- **GitHub Security Advisories**: Primary channel for security-related announcements
- **GitHub Releases**: Security fixes will be clearly marked in release notes
- **README Updates**: Critical security information will be highlighted in the main README

## Contact Information

For security-related questions or concerns:

- **Primary Contact**: [jeremy@intentionsolutions.com](mailto:jeremy@intentionsolutions.com)
- **GitHub Issues**: For non-sensitive security questions (use the Security issue template)
- **GitHub Discussions**: For community security best practices discussions

## Security-First Design

vibe-prd is designed with security in mind:

- **Minimal Dependencies**: Reduces attack surface by limiting external dependencies
- **Local-First**: All processing happens on your local machine
- **Open Source**: Full transparency allows community security review
- **No Network Requirements**: Eliminates network-based attack vectors
- **File System Isolation**: Works within user-controlled directories only

---

**Last Updated**: September 18, 2025
**Next Review**: December 18, 2025

Thank you for helping keep vibe-prd secure for the entire developer community.