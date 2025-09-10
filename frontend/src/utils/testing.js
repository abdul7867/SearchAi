/**
 * Testing Utilities
 * Provides comprehensive testing capabilities for cross-browser and device testing
 */

import { browserInfo, features, getCurrentBrowserOptimizations, getBrowserCapabilityScore } from './browserSupport.js';

// Test results storage
const testResults = new Map();

// Test categories
export const TEST_CATEGORIES = {
  ACCESSIBILITY: 'accessibility',
  PERFORMANCE: 'performance',
  COMPATIBILITY: 'compatibility',
  FUNCTIONALITY: 'functionality',
  VISUAL: 'visual',
  RESPONSIVE: 'responsive'
};

// Test statuses
export const TEST_STATUS = {
  PASSED: 'passed',
  FAILED: 'failed',
  WARNING: 'warning',
  SKIPPED: 'skipped'
};

/**
 * Base test class
 */
class Test {
  constructor(name, category, description) {
    this.name = name;
    this.category = category;
    this.description = description;
    this.status = TEST_STATUS.SKIPPED;
    this.details = '';
    this.duration = 0;
    this.timestamp = Date.now();
  }

  async run() {
    const startTime = performance.now();
    try {
      await this.execute();
      this.status = TEST_STATUS.PASSED;
    } catch (error) {
      this.status = TEST_STATUS.FAILED;
      this.details = error.message;
    } finally {
      this.duration = performance.now() - startTime;
      this.timestamp = Date.now();
    }
  }

  async execute() {
    throw new Error('Test execute method must be implemented');
  }
}

/**
 * Accessibility Tests
 */
export class AccessibilityTest extends Test {
  constructor(name, description) {
    super(name, TEST_CATEGORIES.ACCESSIBILITY, description);
  }

  // Test for proper heading structure
  static async testHeadingStructure() {
    const test = new AccessibilityTest(
      'Heading Structure',
      'Verify proper heading hierarchy (h1, h2, h3, etc.)'
    );
    
    test.execute = async () => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
      
      // Check for proper hierarchy
      let currentLevel = 0;
      for (let i = 0; i < headingLevels.length; i++) {
        const level = headingLevels[i];
        if (level > currentLevel + 1) {
          throw new Error(`Invalid heading hierarchy: h${level} follows h${currentLevel} (skipped levels)`);
        }
        currentLevel = level;
      }
      
      if (headings.length === 0) {
        throw new Error('No headings found on the page');
      }
    };
    
    return test;
  }

  // Test for proper ARIA attributes
  static async testARIAAttributes() {
    const test = new AccessibilityTest(
      'ARIA Attributes',
      'Verify proper ARIA attribute usage'
    );
    
    test.execute = async () => {
      const elementsWithAria = document.querySelectorAll('[aria-*]');
      let issues = [];
      
      elementsWithAria.forEach(element => {
        const ariaAttributes = Array.from(element.attributes)
          .filter(attr => attr.name.startsWith('aria-'));
        
        ariaAttributes.forEach(attr => {
          // Check for common ARIA issues
          if (attr.name === 'aria-label' && !attr.value.trim()) {
            issues.push(`Empty aria-label on ${element.tagName}`);
          }
          
          if (attr.name === 'aria-expanded' && !['true', 'false'].includes(attr.value)) {
            issues.push(`Invalid aria-expanded value "${attr.value}" on ${element.tagName}`);
          }
          
          if (attr.name === 'aria-controls' && !document.getElementById(attr.value)) {
            issues.push(`aria-controls references non-existent element: ${attr.value}`);
          }
        });
      });
      
      if (issues.length > 0) {
        throw new Error(`ARIA issues found: ${issues.join(', ')}`);
      }
    };
    
    return test;
  }

  // Test for keyboard navigation
  static async testKeyboardNavigation() {
    const test = new AccessibilityTest(
      'Keyboard Navigation',
      'Verify all interactive elements are keyboard accessible'
    );
    
    test.execute = async () => {
      const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [tabindex], [role="button"], [role="link"]'
      );
      
      let issues = [];
      
      interactiveElements.forEach(element => {
        if (element.tagName === 'A' && !element.href && !element.getAttribute('tabindex')) {
          issues.push(`Link without href or tabindex: ${element.textContent}`);
        }
        
        if (element.getAttribute('tabindex') === '-1' && element.style.display !== 'none') {
          issues.push(`Visible element with tabindex="-1": ${element.tagName}`);
        }
      });
      
      if (issues.length > 0) {
        throw new Error(`Keyboard navigation issues: ${issues.join(', ')}`);
      }
    };
    
    return test;
  }
}

/**
 * Performance Tests
 */
export class PerformanceTest extends Test {
  constructor(name, description) {
    super(name, TEST_CATEGORIES.PERFORMANCE, description);
  }

  // Test Core Web Vitals
  static async testCoreWebVitals() {
    const test = new PerformanceTest(
      'Core Web Vitals',
      'Measure and verify Core Web Vitals metrics'
    );
    
    test.execute = async () => {
      if (!features.supportsPerformanceObserver) {
        throw new Error('Performance Observer not supported');
      }
      
      return new Promise((resolve, reject) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint') {
              if (entry.startTime > 2500) {
                reject(new Error(`LCP too slow: ${Math.round(entry.startTime)}ms (target: <2500ms)`));
              }
            }
          });
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Resolve after 5 seconds if no LCP issues
        setTimeout(() => {
          observer.disconnect();
          resolve();
        }, 5000);
      });
    };
    
    return test;
  }

  // Test bundle size
  static async testBundleSize() {
    const test = new PerformanceTest(
      'Bundle Size',
      'Check if bundle size is within acceptable limits'
    );
    
    test.execute = async () => {
      // This would typically be done at build time
      // For runtime, we can check if certain large libraries are loaded
      const largeLibraries = ['lodash', 'moment', 'date-fns'];
      let issues = [];
      
      largeLibraries.forEach(lib => {
        if (window[lib]) {
          issues.push(`Large library detected: ${lib}`);
        }
      });
      
      if (issues.length > 0) {
        throw new Error(`Bundle size issues: ${issues.join(', ')}`);
      }
    };
    
    return test;
  }
}

/**
 * Compatibility Tests
 */
export class CompatibilityTest extends Test {
  constructor(name, description) {
    super(name, TEST_CATEGORIES.COMPATIBILITY, description);
  }

  // Test browser feature support
  static async testBrowserFeatures() {
    const test = new CompatibilityTest(
      'Browser Features',
      'Verify browser supports required features'
    );
    
    test.execute = async () => {
      const requiredFeatures = [
        'supportsCSSGrid',
        'supportsCSSFlexbox',
        'supportsFetch',
        'supportsPromise'
      ];
      
      let missingFeatures = [];
      
      requiredFeatures.forEach(feature => {
        if (!features[feature]) {
          missingFeatures.push(feature);
        }
      });
      
      if (missingFeatures.length > 0) {
        throw new Error(`Missing required features: ${missingFeatures.join(', ')}`);
      }
    };
    
    return test;
  }

  // Test CSS support
  static async testCSSSupport() {
    const test = new CompatibilityTest(
      'CSS Support',
      'Verify CSS features are supported'
    );
    
    test.execute = async () => {
      const cssTests = [
        { property: 'display', value: 'grid', fallback: 'flex' },
        { property: 'display', value: 'flex', fallback: 'block' },
        { property: 'animation', value: 'fadeIn 1s', fallback: 'none' }
      ];
      
      let issues = [];
      
      cssTests.forEach(test => {
        if (!CSS.supports(test.property, test.value)) {
          issues.push(`${test.property}: ${test.value} not supported`);
        }
      });
      
      if (issues.length > 0) {
        this.status = TEST_STATUS.WARNING;
        this.details = `CSS warnings: ${issues.join(', ')}`;
      }
    };
    
    return test;
  }
}

/**
 * Responsive Design Tests
 */
export class ResponsiveTest extends Test {
  constructor(name, description) {
    super(name, TEST_CATEGORIES.RESPONSIVE, description);
  }

  // Test viewport responsiveness
  static async testViewportResponsiveness() {
    const test = new ResponsiveTest(
      'Viewport Responsiveness',
      'Test responsive behavior at different viewport sizes'
    );
    
    test.execute = async () => {
      const viewports = [
        { width: 320, height: 568, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1024, height: 768, name: 'Desktop' },
        { width: 1920, height: 1080, name: 'Large Desktop' }
      ];
      
      let issues = [];
      
      for (const viewport of viewports) {
        // Simulate viewport change
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width
        });
        
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: viewport.height
        });
        
        // Trigger resize event
        window.dispatchEvent(new Event('resize'));
        
        // Wait for layout to settle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check for horizontal scrollbar
        if (document.documentElement.scrollWidth > viewport.width) {
          issues.push(`Horizontal scrollbar at ${viewport.name} (${viewport.width}x${viewport.height})`);
        }
      }
      
      if (issues.length > 0) {
        throw new Error(`Responsive issues: ${issues.join(', ')}`);
      }
    };
    
    return test;
  }
}

/**
 * Test Runner
 */
export class TestRunner {
  constructor() {
    this.tests = [];
    this.results = new Map();
    this.isRunning = false;
  }

  // Add test to runner
  addTest(test) {
    this.tests.push(test);
  }

  // Add multiple tests
  addTests(tests) {
    this.tests.push(...tests);
  }

  // Run all tests
  async runAllTests() {
    if (this.isRunning) {
      throw new Error('Test runner is already running');
    }
    
    this.isRunning = true;
    const startTime = performance.now();
    
    try {
      for (const test of this.tests) {
        await test.run();
        this.results.set(test.name, test);
      }
    } finally {
      this.isRunning = false;
    }
    
    const totalDuration = performance.now() - startTime;
    return {
      totalTests: this.tests.length,
      passed: this.tests.filter(t => t.status === TEST_STATUS.PASSED).length,
      failed: this.tests.filter(t => t.status === TEST_STATUS.FAILED).length,
      warnings: this.tests.filter(t => t.status === TEST_STATUS.WARNING).length,
      skipped: this.tests.filter(t => t.status === TEST_STATUS.SKIPPED).length,
      totalDuration,
      results: Array.from(this.results.values())
    };
  }

  // Run tests by category
  async runTestsByCategory(category) {
    const categoryTests = this.tests.filter(t => t.category === category);
    const runner = new TestRunner();
    runner.addTests(categoryTests);
    return await runner.runAllTests();
  }

  // Get test results
  getResults() {
    return Array.from(this.results.values());
  }

  // Get results by category
  getResultsByCategory(category) {
    return this.getResults().filter(r => r.category === category);
  }

  // Generate test report
  generateReport() {
    const results = this.getResults();
    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === TEST_STATUS.PASSED).length,
      failed: results.filter(r => r.status === TEST_STATUS.FAILED).length,
      warnings: results.filter(r => r.status === TEST_STATUS.WARNING).length,
      skipped: results.filter(r => r.status === TEST_STATUS.SKIPPED).length
    };
    
    const byCategory = {};
    TEST_CATEGORIES.forEach(category => {
      byCategory[category] = results.filter(r => r.category === category);
    });
    
    return {
      summary,
      byCategory,
      details: results,
      timestamp: Date.now(),
      browser: browserInfo,
      capabilityScore: getBrowserCapabilityScore()
    };
  }
}

/**
 * Predefined test suites
 */
export const testSuites = {
  // Quick accessibility check
  quickAccessibility: [
    AccessibilityTest.testHeadingStructure(),
    AccessibilityTest.testARIAAttributes(),
    AccessibilityTest.testKeyboardNavigation()
  ],
  
  // Performance check
  performance: [
    PerformanceTest.testCoreWebVitals(),
    PerformanceTest.testBundleSize()
  ],
  
  // Compatibility check
  compatibility: [
    CompatibilityTest.testBrowserFeatures(),
    CompatibilityTest.testCSSSupport()
  ],
  
  // Responsive check
  responsive: [
    ResponsiveTest.testViewportResponsiveness()
  ]
};

// Add the full test suite after testSuites is fully defined
testSuites.full = [
  ...testSuites.quickAccessibility,
  ...testSuites.performance,
  ...testSuites.compatibility,
  ...testSuites.responsive
];

/**
 * Utility functions
 */
export const testingUtils = {
  // Wait for element to be present
  waitForElement: (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }
      
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },
  
  // Wait for condition to be true
  waitForCondition: (condition, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      if (condition()) {
        resolve();
        return;
      }
      
      const interval = setInterval(() => {
        if (condition()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error(`Condition not met within ${timeout}ms`));
      }, timeout);
    });
  },
  
  // Simulate user interaction
  simulateClick: (element) => {
    element.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));
  },
  
  simulateKeyPress: (element, key) => {
    element.dispatchEvent(new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true
    }));
  }
};

// Export default
export default {
  Test,
  AccessibilityTest,
  PerformanceTest,
  CompatibilityTest,
  ResponsiveTest,
  TestRunner,
  testSuites,
  testingUtils,
  TEST_CATEGORIES,
  TEST_STATUS
};
