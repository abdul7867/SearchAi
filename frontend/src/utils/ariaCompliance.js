/**
 * ARIA Compliance Testing Utility
 * Provides functions to test ARIA attributes, roles, and screen reader compatibility
 */

/**
 * Test if an element has proper ARIA attributes
 * @param {HTMLElement} element - Element to test
 * @returns {Object} ARIA compliance test results
 */
export const testARIACompliance = (element) => {
  const results = {
    hasRole: false,
    hasLabel: false,
    hasDescription: false,
    hasState: false,
    hasLiveRegion: false,
    issues: [],
    recommendations: []
  };

  // Test for ARIA role
  const role = element.getAttribute('role');
  if (role) {
    results.hasRole = true;
    
    // Validate role value
    const validRoles = [
      'button', 'link', 'textbox', 'checkbox', 'radio', 'combobox', 'listbox',
      'option', 'tab', 'tabpanel', 'tree', 'treeitem', 'grid', 'gridcell',
      'row', 'columnheader', 'rowheader', 'table', 'cell', 'rowgroup',
      'columnheader', 'rowheader', 'banner', 'complementary', 'contentinfo',
      'form', 'main', 'navigation', 'region', 'search', 'article', 'aside',
      'dialog', 'document', 'feed', 'figure', 'group', 'heading', 'img',
      'list', 'listitem', 'math', 'menubar', 'menuitem', 'menuitemcheckbox',
      'menuitemradio', 'meter', 'none', 'note', 'presentation', 'progressbar',
      'scrollbar', 'separator', 'slider', 'spinbutton', 'status', 'switch',
      'tablist', 'timer', 'toolbar', 'tooltip', 'treegrid'
    ];
    
    if (!validRoles.includes(role)) {
      results.issues.push(`Invalid ARIA role: ${role}`);
    }
  } else {
    // Check if element needs a role
    const tagName = element.tagName.toLowerCase();
    const needsRole = ['div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'nav', 'main'];
    
    if (needsRole.includes(tagName)) {
      results.issues.push(`Element ${tagName} should have an ARIA role`);
      results.recommendations.push(`Add role="${getSuggestedRole(tagName)}" to ${tagName} element`);
    }
  }

  // Test for ARIA label
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  const title = element.getAttribute('title');
  
  if (ariaLabel || ariaLabelledBy || title) {
    results.hasLabel = true;
  } else {
    // Check if element needs a label
    const needsLabel = ['input', 'textarea', 'select', 'button', 'a', 'img', 'video', 'audio'];
    const tagName = element.tagName.toLowerCase();
    
    if (needsLabel.includes(tagName)) {
      results.issues.push(`Element ${tagName} should have an accessible name`);
      results.recommendations.push(`Add aria-label, aria-labelledby, or title attribute to ${tagName} element`);
    }
  }

  // Test for ARIA description
  const ariaDescribedBy = element.getAttribute('aria-describedby');
  if (ariaDescribedBy) {
    results.hasDescription = true;
    
    // Validate describedby references
    const describedByIds = ariaDescribedBy.split(' ').filter(id => id.trim());
    describedByIds.forEach(id => {
      const describedElement = document.getElementById(id);
      if (!describedElement) {
        results.issues.push(`aria-describedby references non-existent ID: ${id}`);
      }
    });
  }

  // Test for ARIA state attributes
  const stateAttributes = [
    'aria-expanded', 'aria-pressed', 'aria-checked', 'aria-selected',
    'aria-hidden', 'aria-disabled', 'aria-required', 'aria-invalid',
    'aria-readonly', 'aria-multiline', 'aria-autocomplete'
  ];
  
  const hasState = stateAttributes.some(attr => element.hasAttribute(attr));
  if (hasState) {
    results.hasState = true;
  }

  // Test for live region attributes
  const ariaLive = element.getAttribute('aria-live');
  const ariaAtomic = element.getAttribute('aria-atomic');
  const ariaRelevant = element.getAttribute('aria-relevant');
  
  if (ariaLive || ariaAtomic || ariaRelevant) {
    results.hasLiveRegion = true;
    
    // Validate aria-live values
    if (ariaLive && !['off', 'polite', 'assertive'].includes(ariaLive)) {
      results.issues.push(`Invalid aria-live value: ${ariaLive}`);
    }
  }

  return results;
};

/**
 * Get suggested ARIA role for HTML elements
 * @param {string} tagName - HTML tag name
 * @returns {string} Suggested ARIA role
 */
const getSuggestedRole = (tagName) => {
  const roleMap = {
    'div': 'generic',
    'span': 'generic',
    'section': 'region',
    'article': 'article',
    'aside': 'complementary',
    'header': 'banner',
    'footer': 'contentinfo',
    'nav': 'navigation',
    'main': 'main',
    'form': 'form',
    'table': 'table',
    'ul': 'list',
    'ol': 'list',
    'li': 'listitem'
  };
  
  return roleMap[tagName] || 'generic';
};

/**
 * Test if an element has proper heading structure
 * @param {HTMLElement} element - Element to test
 * @returns {Object} Heading structure test results
 */
export const testHeadingStructure = (element) => {
  const results = {
    hasProperHeading: false,
    headingLevel: null,
    headingText: '',
    issues: [],
    recommendations: []
  };

  const tagName = element.tagName.toLowerCase();
  if (tagName.match(/^h[1-6]$/)) {
    results.hasProperHeading = true;
    results.headingLevel = parseInt(tagName.charAt(1));
    results.headingText = element.textContent?.trim() || '';
    
    // Check for empty headings
    if (!results.headingText) {
      results.issues.push('Heading element has no text content');
      results.recommendations.push('Add descriptive text to heading element');
    }
    
    // Check for very long headings
    if (results.headingText.length > 100) {
      results.issues.push('Heading text is too long');
      results.recommendations.push('Keep heading text concise (under 100 characters)');
    }
  } else if (element.getAttribute('role') === 'heading') {
    results.hasProperHeading = true;
    results.headingLevel = parseInt(element.getAttribute('aria-level')) || 1;
    results.headingText = element.textContent?.trim() || '';
    
    // Check for aria-level attribute
    if (!element.hasAttribute('aria-level')) {
      results.issues.push('Heading with role="heading" should have aria-level attribute');
      results.recommendations.push('Add aria-level attribute to specify heading level');
    }
  }

  return results;
};

/**
 * Test if an element has proper list structure
 * @param {HTMLElement} element - Element to test
 * @returns {Object} List structure test results
 */
export const testListStructure = (element) => {
  const results = {
    hasProperList: false,
    listType: null,
    itemCount: 0,
    issues: [],
    recommendations: []
  };

  const tagName = element.tagName.toLowerCase();
  if (tagName === 'ul' || tagName === 'ol') {
    results.hasProperList = true;
    results.listType = tagName;
    
    // Check for list items
    const listItems = element.querySelectorAll('li');
    results.itemCount = listItems.length;
    
    if (results.itemCount === 0) {
      results.issues.push('List has no list items');
      results.recommendations.push('Add <li> elements to the list');
    }
    
    // Check for nested lists
    const nestedLists = element.querySelectorAll('ul, ol');
    if (nestedLists.length > 0) {
      results.recommendations.push('Consider using aria-label for nested lists');
    }
  } else if (element.getAttribute('role') === 'list') {
    results.hasProperList = true;
    results.listType = 'custom';
    
    // Check for list items
    const listItems = element.querySelectorAll('[role="listitem"]');
    results.itemCount = listItems.length;
    
    if (results.itemCount === 0) {
      results.issues.push('Custom list has no list items');
      results.recommendations.push('Add role="listitem" to list item elements');
    }
  }

  return results;
};

/**
 * Test if an element has proper form structure
 * @param {HTMLElement} element - Element to test
 * @returns {Object} Form structure test results
 */
export const testFormStructure = (element) => {
  const results = {
    hasProperForm: false,
    hasLabel: false,
    hasDescription: false,
    hasErrorHandling: false,
    issues: [],
    recommendations: []
  };

  const tagName = element.tagName.toLowerCase();
  if (tagName === 'form') {
    results.hasProperForm = true;
    
    // Check for form labels
    const inputs = element.querySelectorAll('input, textarea, select');
    const labels = element.querySelectorAll('label');
    
    if (labels.length > 0) {
      results.hasLabel = true;
    }
    
    // Check for form descriptions
    const descriptions = element.querySelectorAll('[aria-describedby]');
    if (descriptions.length > 0) {
      results.hasDescription = true;
    }
    
    // Check for error handling
    const errorElements = element.querySelectorAll('[aria-invalid="true"], .error, [role="alert"]');
    if (errorElements.length > 0) {
      results.hasErrorHandling = true;
    }
    
    // Check for required fields
    const requiredFields = element.querySelectorAll('[required], [aria-required="true"]');
    if (requiredFields.length > 0) {
      results.recommendations.push('Ensure required fields have clear visual indicators');
    }
  }

  return results;
};

/**
 * Test if an element has proper table structure
 * @param {HTMLElement} element - Element to test
 * @returns {Object} Table structure test results
 */
export const testTableStructure = (element) => {
  const results = {
    hasProperTable: false,
    hasHeaders: false,
    hasCaption: false,
    hasSummary: false,
    issues: [],
    recommendations: []
  };

  const tagName = element.tagName.toLowerCase();
  if (tagName === 'table') {
    results.hasProperTable = true;
    
    // Check for table headers
    const headers = element.querySelectorAll('th, [role="columnheader"], [role="rowheader"]');
    if (headers.length > 0) {
      results.hasHeaders = true;
    } else {
      results.issues.push('Table should have headers for accessibility');
      results.recommendations.push('Add <th> elements or use role="columnheader"/"rowheader"');
    }
    
    // Check for table caption
    const caption = element.querySelector('caption');
    if (caption) {
      results.hasCaption = true;
    } else {
      results.recommendations.push('Consider adding a <caption> element for table description');
    }
    
    // Check for aria-label or aria-labelledby
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    if (ariaLabel || ariaLabelledBy) {
      results.hasSummary = true;
    }
  }

  return results;
};

/**
 * Test if an element has proper button structure
 * @param {HTMLElement} element - Element to test
 * @returns {Object} Button structure test results
 */
export const testButtonStructure = (element) => {
  const results = {
    hasProperButton: false,
    hasAccessibleName: false,
    hasDescription: false,
    issues: [],
    recommendations: []
  };

  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  
  if (tagName === 'button' || role === 'button') {
    results.hasProperButton = true;
    
    // Check for accessible name
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    const title = element.getAttribute('title');
    const hasText = element.textContent?.trim();
    
    if (ariaLabel || ariaLabelledBy || title || hasText) {
      results.hasAccessibleName = true;
    } else {
      results.issues.push('Button should have an accessible name');
      results.recommendations.push('Add aria-label, aria-labelledby, title, or text content');
    }
    
    // Check for description
    const ariaDescribedBy = element.getAttribute('aria-describedby');
    if (ariaDescribedBy) {
      results.hasDescription = true;
    }
    
    // Check for button type
    if (tagName === 'button' && !element.hasAttribute('type')) {
      results.recommendations.push('Add type attribute to button (button, submit, or reset)');
    }
  }

  return results;
};

/**
 * Test if an element has proper link structure
 * @param {HTMLElement} element - Element to test
 * @returns {Object} Link structure test results
 */
export const testLinkStructure = (element) => {
  const results = {
    hasProperLink: false,
    hasAccessibleName: false,
    hasDescription: false,
    hasHref: false,
    issues: [],
    recommendations: []
  };

  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  
  if (tagName === 'a' || role === 'link') {
    results.hasProperLink = true;
    
    // Check for href attribute
    if (element.hasAttribute('href')) {
      results.hasHref = true;
      
      const href = element.getAttribute('href');
      if (href === '#' || href === 'javascript:void(0)') {
        results.issues.push('Link has non-functional href');
        results.recommendations.push('Use button element for non-functional links or provide proper href');
      }
    } else {
      results.issues.push('Link element should have href attribute');
      results.recommendations.push('Add href attribute or use button element instead');
    }
    
    // Check for accessible name
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    const title = element.getAttribute('title');
    const hasText = element.textContent?.trim();
    
    if (ariaLabel || ariaLabelledBy || title || hasText) {
      results.hasAccessibleName = true;
    } else {
      results.issues.push('Link should have an accessible name');
      results.recommendations.push('Add aria-label, aria-labelledby, title, or text content');
    }
    
    // Check for description
    const ariaDescribedBy = element.getAttribute('aria-describedby');
    if (ariaDescribedBy) {
      results.hasDescription = true;
    }
  }

  return results;
};

/**
 * Comprehensive ARIA compliance test for a component
 * @param {HTMLElement} element - Element to test
 * @returns {Object} Comprehensive ARIA test results
 */
export const runComprehensiveARIATest = (element) => {
  const results = {
    element: {
      tagName: element.tagName,
      text: element.textContent?.substring(0, 50) || 'No text content',
      className: element.className
    },
    ariaCompliance: null,
    headingStructure: null,
    listStructure: null,
    formStructure: null,
    tableStructure: null,
    buttonStructure: null,
    linkStructure: null,
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      issues: [],
      recommendations: []
    }
  };

  // Run all ARIA tests
  results.ariaCompliance = testARIACompliance(element);
  results.headingStructure = testHeadingStructure(element);
  results.listStructure = testListStructure(element);
  results.formStructure = testFormStructure(element);
  results.tableStructure = testTableStructure(element);
  results.buttonStructure = testButtonStructure(element);
  results.linkStructure = testLinkStructure(element);

  // Aggregate results
  const allTests = [
    results.ariaCompliance,
    results.headingStructure,
    results.listStructure,
    results.formStructure,
    results.tableStructure,
    results.buttonStructure,
    results.linkStructure
  ];

  allTests.forEach(test => {
    if (test) {
      results.summary.total++;
      if (test.issues.length === 0) {
        results.summary.passed++;
      } else {
        results.summary.failed++;
        results.summary.issues.push(...test.issues);
        results.summary.recommendations.push(...test.recommendations);
      }
    }
  });

  return results;
};

export default {
  testARIACompliance,
  testHeadingStructure,
  testListStructure,
  testFormStructure,
  testTableStructure,
  testButtonStructure,
  testLinkStructure,
  runComprehensiveARIATest
};
