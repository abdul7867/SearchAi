import axe from 'axe-core';

/**
 * Accessibility testing utility using axe-core
 * Provides functions to run accessibility audits on components and pages
 */

/**
 * Run accessibility audit on a DOM element or document
 * @param {HTMLElement|Document} context - Element to test (defaults to document)
 * @param {Object} options - Axe options
 * @returns {Promise<Object>} Audit results
 */
export const runAccessibilityAudit = async (context = document, options = {}) => {
  try {
    const results = await axe.run(context, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'best-practice']
      },
      ...options
    });
    
    return {
      success: results.violations.length === 0,
      violations: results.violations,
      passes: results.passes,
      timestamp: new Date().toISOString(),
      summary: {
        total: results.violations.length + results.passes.length,
        violations: results.violations.length,
        passes: results.passes.length,
        score: Math.round(((results.passes.length) / (results.violations.length + results.passes.length)) * 100)
      }
    };
  } catch (error) {
    console.error('Accessibility audit failed:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Run accessibility audit on specific WCAG criteria
 * @param {HTMLElement|Document} context - Element to test
 * @param {Array} criteria - Array of WCAG criteria to test
 * @returns {Promise<Object>} Audit results
 */
export const runWCAGAudit = async (context = document, criteria = ['wcag2a', 'wcag2aa']) => {
  return runAccessibilityAudit(context, {
    runOnly: {
      type: 'tag',
      values: criteria
    }
  });
};

/**
 * Generate accessibility report in a readable format
 * @param {Object} auditResults - Results from runAccessibilityAudit
 * @returns {Object} Formatted report
 */
export const generateAccessibilityReport = (auditResults) => {
  if (auditResults.error) {
    return {
      status: 'ERROR',
      message: auditResults.error,
      timestamp: auditResults.timestamp
    };
  }

  const { violations, passes, summary } = auditResults;
  
  const report = {
    status: auditResults.success ? 'PASS' : 'FAIL',
    score: summary.score,
    timestamp: auditResults.timestamp,
    summary: {
      total: summary.total,
      violations: summary.violations,
      passes: summary.passes
    },
    violations: violations.map(violation => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      tags: violation.tags,
      nodes: violation.nodes.map(node => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary
      }))
    })),
    recommendations: violations.length > 0 ? [
      'Fix all critical and serious violations first',
      'Ensure proper color contrast ratios (4.5:1 for normal text, 3:1 for large text)',
      'Add proper ARIA labels and roles where needed',
      'Ensure keyboard navigation is possible for all interactive elements',
      'Test with screen readers to verify announcements'
    ] : [
      'Great job! All accessibility checks passed',
      'Continue to test with real users and assistive technologies',
      'Monitor for regressions during future development'
    ]
  };

  return report;
};

/**
 * Check if an element meets basic accessibility requirements
 * @param {HTMLElement} element - Element to check
 * @returns {Object} Basic accessibility check results
 */
export const checkBasicAccessibility = (element) => {
  const results = {
    hasLabel: false,
    hasAltText: false,
    hasFocusable: false,
    hasProperRole: false,
    issues: []
  };

  // Check for proper labeling
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
    const id = element.id;
    const label = document.querySelector(`label[for="${id}"]`);
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    
    if (label || ariaLabel || ariaLabelledBy) {
      results.hasLabel = true;
    } else {
      results.issues.push('Missing label or aria-label');
    }
  }

  // Check for alt text on images
  if (element.tagName === 'IMG') {
    const alt = element.getAttribute('alt');
    if (alt !== null) {
      results.hasAltText = true;
    } else {
      results.issues.push('Missing alt text');
    }
  }

  // Check if element is focusable
  if (element.tabIndex >= 0 || element.tagName === 'BUTTON' || element.tagName === 'A' || element.tagName === 'INPUT') {
    results.hasFocusable = true;
  }

  // Check for proper ARIA role
  const role = element.getAttribute('role');
  if (role) {
    results.hasProperRole = true;
  }

  return results;
};

/**
 * Test keyboard navigation for an element
 * @param {HTMLElement} element - Element to test
 * @returns {Object} Keyboard navigation test results
 */
export const testKeyboardNavigation = (element) => {
  const results = {
    canTabTo: false,
    canTabFrom: false,
    hasVisibleFocus: false,
    issues: []
  };

  // Test if element can receive focus via tab
  element.focus();
  if (document.activeElement === element) {
    results.canTabTo = true;
  } else {
    results.issues.push('Element cannot receive focus via tab');
  }

  // Test if element can lose focus
  element.blur();
  if (document.activeElement !== element) {
    results.canTabFrom = true;
  } else {
    results.issues.push('Element cannot lose focus');
  }

  // Test visible focus indicator
  element.focus();
  const computedStyle = window.getComputedStyle(element);
  const outline = computedStyle.outline;
  const boxShadow = computedStyle.boxShadow;
  
  if (outline !== 'none' || boxShadow !== 'none') {
    results.hasVisibleFocus = true;
  } else {
    results.issues.push('No visible focus indicator');
  }

  return results;
};

export default {
  runAccessibilityAudit,
  runWCAGAudit,
  generateAccessibilityReport,
  checkBasicAccessibility,
  testKeyboardNavigation
};
