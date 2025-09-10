/**
 * Keyboard Navigation Testing Utility
 * Provides functions to test keyboard navigation and focus management
 */

/**
 * Test if an element can receive focus via tab navigation
 * @param {HTMLElement} element - Element to test
 * @returns {Object} Test results
 */
export const testTabNavigation = (element) => {
  const results = {
    canTabTo: false,
    canTabFrom: false,
    hasVisibleFocus: false,
    tabIndex: element.tabIndex,
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
  const ringClasses = element.className.includes('ring-');
  
  if (outline !== 'none' || boxShadow !== 'none' || ringClasses) {
    results.hasVisibleFocus = true;
  } else {
    results.issues.push('No visible focus indicator');
  }

  return results;
};

/**
 * Test keyboard shortcuts for an element
 * @param {HTMLElement} element - Element to test
 * @param {Array} shortcuts - Array of keyboard shortcuts to test
 * @returns {Object} Test results
 */
export const testKeyboardShortcuts = (element, shortcuts = []) => {
  const results = {
    shortcuts: {},
    issues: []
  };

  shortcuts.forEach(shortcut => {
    const { key, code, expectedAction, description } = shortcut;
    
    try {
      // Create a mock event
      const event = new KeyboardEvent('keydown', {
        key,
        code,
        bubbles: true,
        cancelable: true
      });

      // Store initial state
      const initialState = {
        hasFocus: document.activeElement === element,
        value: element.value || '',
        checked: element.checked || false
      };

      // Dispatch event
      element.dispatchEvent(event);

      // Check if event was handled
      if (event.defaultPrevented) {
        results.shortcuts[description] = {
          success: true,
          key,
          code,
          action: expectedAction
        };
      } else {
        results.shortcuts[description] = {
          success: false,
          key,
          code,
          action: expectedAction,
          reason: 'Event not handled'
        };
        results.issues.push(`${description} (${key}) not handled`);
      }
    } catch (error) {
      results.shortcuts[description] = {
        success: false,
        key,
        code,
        action: expectedAction,
        error: error.message
      };
      results.issues.push(`${description} (${key}) failed: ${error.message}`);
    }
  });

  return results;
};

/**
 * Test tab order for a group of elements
 * @param {Array} elements - Array of elements to test in order
 * @returns {Object} Test results
 */
export const testTabOrder = (elements) => {
  const results = {
    tabOrder: [],
    issues: [],
    recommendations: []
  };

  // Test each element's tab index
  elements.forEach((element, index) => {
    const tabIndex = element.tabIndex;
    const isFocusable = element.tabIndex >= 0 || 
                       element.tagName === 'BUTTON' || 
                       element.tagName === 'A' || 
                       element.tagName === 'INPUT' ||
                       element.tagName === 'SELECT' ||
                       element.tagName === 'TEXTAREA';

    results.tabOrder.push({
      index,
      element: element.tagName,
      text: element.textContent?.substring(0, 50) || 'No text content',
      tabIndex,
      isFocusable,
      canFocus: false
    });

    if (!isFocusable) {
      results.issues.push(`Element ${index} (${element.tagName}) is not focusable`);
    }
  });

  // Test actual tab navigation
  let currentIndex = 0;
  const focusableElements = elements.filter(el => 
    el.tabIndex >= 0 || 
    el.tagName === 'BUTTON' || 
    el.tagName === 'A' || 
    el.tagName === 'INPUT' ||
    el.tagName === 'SELECT' ||
    el.tagName === 'TEXTAREA'
  );

  if (focusableElements.length === 0) {
    results.issues.push('No focusable elements found');
    return results;
  }

  // Start with first focusable element
  focusableElements[0].focus();
  
  // Test tab navigation
  for (let i = 0; i < focusableElements.length; i++) {
    const currentElement = focusableElements[i];
    const nextElement = focusableElements[(i + 1) % focusableElements.length];
    
    if (document.activeElement === currentElement) {
      results.tabOrder[i].canFocus = true;
    } else {
      results.issues.push(`Element ${i} cannot receive focus`);
    }

    // Press Tab to move to next element
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      code: 'Tab',
      bubbles: true,
      cancelable: true
    });

    currentElement.dispatchEvent(tabEvent);
    
    // Check if focus moved to next element
    if (document.activeElement === nextElement) {
      // Success
    } else {
      results.issues.push(`Tab navigation failed from element ${i} to element ${(i + 1) % focusableElements.length}`);
    }
  }

  // Check for logical tab order
  const naturalOrder = focusableElements.map((el, i) => i);
  const actualOrder = focusableElements.map(el => {
    const originalIndex = elements.indexOf(el);
    return originalIndex;
  });

  if (JSON.stringify(naturalOrder) !== JSON.stringify(actualOrder.sort())) {
    results.recommendations.push('Consider reordering elements for more logical tab flow');
  }

  return results;
};

/**
 * Test escape key functionality
 * @param {HTMLElement} element - Element to test
 * @param {Function} onEscape - Expected escape key handler
 * @returns {Object} Test results
 */
export const testEscapeKey = (element, onEscape) => {
  const results = {
    escapeHandled: false,
    issues: []
  };

  try {
    // Focus the element
    element.focus();
    
    // Create escape key event
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      bubbles: true,
      cancelable: true
    });

    // Dispatch event
    element.dispatchEvent(escapeEvent);

    // Check if event was handled
    if (escapeEvent.defaultPrevented) {
      results.escapeHandled = true;
    } else {
      results.issues.push('Escape key not handled');
    }

    // Test custom handler if provided
    if (onEscape && typeof onEscape === 'function') {
      try {
        onEscape();
        results.escapeHandled = true;
      } catch (error) {
        results.issues.push(`Custom escape handler failed: ${error.message}`);
      }
    }
  } catch (error) {
    results.issues.push(`Escape key test failed: ${error.message}`);
  }

  return results;
};

/**
 * Test arrow key navigation for custom components
 * @param {HTMLElement} element - Element to test
 * @param {Object} arrowKeys - Expected arrow key behavior
 * @returns {Object} Test results
 */
export const testArrowKeyNavigation = (element, arrowKeys = {}) => {
  const results = {
    arrowKeys: {},
    issues: []
  };

  const defaultArrowKeys = {
    ArrowUp: 'Move up/previous',
    ArrowDown: 'Move down/next',
    ArrowLeft: 'Move left/previous',
    ArrowRight: 'Move right/next'
  };

  const keysToTest = { ...defaultArrowKeys, ...arrowKeys };

  Object.entries(keysToTest).forEach(([key, description]) => {
    try {
      // Focus the element
      element.focus();
      
      // Create arrow key event
      const arrowEvent = new KeyboardEvent('keydown', {
        key,
        code: key,
        bubbles: true,
        cancelable: true
      });

      // Dispatch event
      element.dispatchEvent(arrowEvent);

      // Check if event was handled
      if (arrowEvent.defaultPrevented) {
        results.arrowKeys[key] = {
          success: true,
          description
        };
      } else {
        results.arrowKeys[key] = {
          success: false,
          description,
          reason: 'Event not handled'
        };
        results.issues.push(`${key} (${description}) not handled`);
      }
    } catch (error) {
      results.arrowKeys[key] = {
        success: false,
        description,
        error: error.message
      };
      results.issues.push(`${key} (${description}) failed: ${error.message}`);
    }
  });

  return results;
};

/**
 * Comprehensive keyboard navigation test for a component
 * @param {HTMLElement} element - Element to test
 * @param {Object} options - Test options
 * @returns {Object} Comprehensive test results
 */
export const runComprehensiveKeyboardTest = (element, options = {}) => {
  const results = {
    element: {
      tagName: element.tagName,
      text: element.textContent?.substring(0, 50) || 'No text content',
      className: element.className
    },
    tabNavigation: null,
    keyboardShortcuts: null,
    escapeKey: null,
    arrowKeys: null,
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      issues: []
    }
  };

  // Test tab navigation
  results.tabNavigation = testTabNavigation(element);
  results.summary.total++;
  if (results.tabNavigation.issues.length === 0) {
    results.summary.passed++;
  } else {
    results.summary.failed++;
    results.summary.issues.push(...results.tabNavigation.issues);
  }

  // Test keyboard shortcuts if specified
  if (options.shortcuts) {
    results.keyboardShortcuts = testKeyboardShortcuts(element, options.shortcuts);
    results.summary.total++;
    if (results.keyboardShortcuts.issues.length === 0) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
      results.summary.issues.push(...results.keyboardShortcuts.issues);
    }
  }

  // Test escape key
  results.escapeKey = testEscapeKey(element, options.onEscape);
  results.summary.total++;
  if (results.escapeKey.escapeHandled) {
    results.summary.passed++;
  } else {
    results.summary.failed++;
    results.summary.issues.push(...results.escapeKey.issues);
  }

  // Test arrow keys if specified
  if (options.arrowKeys) {
    results.arrowKeys = testArrowKeyNavigation(element, options.arrowKeys);
    results.summary.total++;
    if (results.arrowKeys.issues.length === 0) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
      results.summary.issues.push(...results.arrowKeys.issues);
    }
  }

  return results;
};

export default {
  testTabNavigation,
  testKeyboardShortcuts,
  testTabOrder,
  testEscapeKey,
  testArrowKeyNavigation,
  runComprehensiveKeyboardTest
};
