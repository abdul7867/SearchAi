import React, { useState, useEffect } from 'react';
import { 
  TestRunner, 
  testSuites, 
  TEST_CATEGORIES, 
  TEST_STATUS 
} from '../utils/testing.js';
import { 
  browserInfo, 
  getCurrentBrowserOptimizations, 
  getBrowserCapabilityScore 
} from '../utils/browserSupport.js';

const TestingDashboard = () => {
  const [testRunner] = useState(() => new TestRunner());
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedSuite, setSelectedSuite] = useState('full');
  const [showDetails, setShowDetails] = useState(false);
  const [browserData, setBrowserData] = useState(null);

  useEffect(() => {
    // Initialize browser data
    setBrowserData({
      info: browserInfo,
      optimizations: getCurrentBrowserOptimizations(),
      capabilityScore: getBrowserCapabilityScore()
    });
  }, []);

  const runTests = async (suiteName = selectedSuite) => {
    setIsRunning(true);
    setResults(null);
    
    try {
      // Clear previous tests
      testRunner.tests = [];
      
      // Add selected test suite
      if (suiteName === 'full') {
        testRunner.addTests(testSuites.full);
      } else if (testSuites[suiteName]) {
        testRunner.addTests(testSuites[suiteName]);
      }
      
      // Run tests
      const testResults = await testRunner.runAllTests();
      setResults(testResults);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Test execution failed:', error);
      }
      setResults({
        error: error.message,
        totalTests: 0,
        passed: 0,
        failed: 1,
        warnings: 0,
        skipped: 0,
        totalDuration: 0,
        results: []
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runCategoryTests = async (category) => {
    setIsRunning(true);
    setResults(null);
    
    try {
      const categoryResults = await testRunner.runTestsByCategory(category);
      setResults(categoryResults);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Category test execution failed:', error);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case TEST_STATUS.PASSED:
        return '✅';
      case TEST_STATUS.FAILED:
        return '❌';
      case TEST_STATUS.WARNING:
        return '⚠️';
      case TEST_STATUS.SKIPPED:
        return '⏭️';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TEST_STATUS.PASSED:
        return 'text-green-600';
      case TEST_STATUS.FAILED:
        return 'text-red-600';
      case TEST_STATUS.WARNING:
        return 'text-yellow-600';
      case TEST_STATUS.SKIPPED:
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (!browserData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Testing Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive testing suite for cross-browser compatibility and performance
          </p>
        </div>

        {/* Browser Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Browser Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-800">Browser</div>
              <div className="text-lg font-semibold text-blue-900">
                {browserData.info.isChrome && 'Chrome'}
                {browserData.info.isFirefox && 'Firefox'}
                {browserData.info.isSafari && 'Safari'}
                {browserData.info.isEdge && 'Edge'}
                {browserData.info.isIE && 'Internet Explorer'}
                {!browserData.info.isChrome && !browserData.info.isFirefox && 
                 !browserData.info.isSafari && !browserData.info.isEdge && 
                 !browserData.info.isIE && 'Unknown'}
              </div>
              <div className="text-sm text-blue-600">v{browserData.info.version}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-green-800">Capability Score</div>
              <div className="text-lg font-semibold text-green-900">
                {browserData.capabilityScore}%
              </div>
              <div className="text-sm text-green-600">
                {browserData.capabilityScore >= 80 ? 'Excellent' : 
                 browserData.capabilityScore >= 60 ? 'Good' : 
                 browserData.capabilityScore >= 40 ? 'Fair' : 'Poor'}
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-purple-800">Device Type</div>
              <div className="text-lg font-semibold text-purple-900">
                {browserData.info.isMobile ? 'Mobile' : 'Desktop'}
              </div>
              <div className="text-sm text-purple-600">
                {browserData.info.isIOS && 'iOS'}
                {browserData.info.isAndroid && 'Android'}
                {!browserData.info.isIOS && !browserData.info.isAndroid && 'Other'}
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-orange-800">Hardware Acceleration</div>
              <div className="text-lg font-semibold text-orange-900">
                {browserData.optimizations.enableHardwareAcceleration ? 'Enabled' : 'Disabled'}
              </div>
              <div className="text-sm text-orange-600">
                {browserData.optimizations.useWebGL ? 'WebGL Supported' : 'WebGL Not Supported'}
              </div>
            </div>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Controls
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={selectedSuite}
              onChange={(e) => setSelectedSuite(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isRunning}
            >
              <option value="full">Full Test Suite</option>
              <option value="quickAccessibility">Quick Accessibility</option>
              <option value="performance">Performance</option>
              <option value="compatibility">Compatibility</option>
              <option value="responsive">Responsive Design</option>
            </select>
            
            <button
              onClick={() => runTests()}
              disabled={isRunning}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? 'Running Tests...' : 'Run Tests'}
            </button>
            
            <button
              onClick={() => runCategoryTests(TEST_CATEGORIES.ACCESSIBILITY)}
              disabled={isRunning}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Accessibility
            </button>
            
            <button
              onClick={() => runCategoryTests(TEST_CATEGORIES.PERFORMANCE)}
              disabled={isRunning}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Performance
            </button>
          </div>
        </div>

        {/* Test Results */}
        {results && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Test Results
              </h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{results.totalTests}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{results.passed}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{results.warnings}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{results.skipped}</div>
                <div className="text-sm text-gray-600">Skipped</div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-sm text-gray-600">Total Duration</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatDuration(results.totalDuration)}
              </div>
            </div>

            {/* Detailed Results */}
            {showDetails && results.results && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Test Details</h3>
                <div className="space-y-3">
                  {results.results.map((test, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getStatusIcon(test.status)}</span>
                        <div>
                          <div className="font-medium text-gray-900">{test.name}</div>
                          <div className="text-sm text-gray-600">{test.description}</div>
                          {test.details && (
                            <div className="text-sm text-red-600 mt-1">{test.details}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getStatusColor(test.status)}`}>
                          {test.status}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDuration(test.duration)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Display */}
            {results.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">❌</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Test Execution Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {results.error}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Test Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(TEST_CATEGORIES).map(([key, category]) => (
            <div key={key} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                {category} Tests
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Run comprehensive {category} testing to ensure compatibility and quality.
              </p>
              <button
                onClick={() => runCategoryTests(category)}
                disabled={isRunning}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Run {category} Tests
              </button>
            </div>
          ))}
        </div>

        {/* Browser Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Browser-Specific Recommendations
          </h2>
          <div className="prose max-w-none">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {browserData.info.isMobile && (
                <li>Optimize for mobile: reduce animations, use touch-friendly interactions</li>
              )}
              {browserData.info.isIOS && (
                <li>iOS Safari: use -webkit- prefixes for CSS animations</li>
              )}
              {!browserData.optimizations.enableHardwareAcceleration && (
                <li>Consider using CSS transforms instead of position changes for animations</li>
              )}
              {!browserData.optimizations.useWebGL && (
                <li>Avoid complex 3D animations and effects</li>
              )}
              {!browserData.optimizations.enableServiceWorker && (
                <li>Implement alternative caching strategies for offline support</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingDashboard;
