import React from 'react';
import { FileText, CheckCircle, AlertTriangle, Scale, Shield, Users } from 'lucide-react';
import { cn } from '../utils/cn';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Agreement to Terms</h2>
          </div>
          <p className="text-muted-foreground">
            By accessing and using AI Search, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        {/* Service Description */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Service Description</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            AI Search provides an AI-powered search engine that delivers intelligent, contextual results to help users discover information efficiently.
          </p>
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Our services include:</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Advanced AI-powered search capabilities</li>
              <li>Personalized search results and recommendations</li>
              <li>Search history and collection management</li>
              <li>User account management and preferences</li>
            </ul>
          </div>
        </section>

        {/* User Accounts */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">User Accounts</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-2">Account Creation</h3>
              <p className="text-muted-foreground">
                To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Account Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Acceptable Use */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Acceptable Use</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Use the service for any illegal or unauthorized purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the service or servers</li>
            <li>Transmit harmful, offensive, or inappropriate content</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Scale className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Intellectual Property</h2>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              The service and its original content, features, and functionality are owned by AI Search and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-muted-foreground">
              You retain ownership of any content you submit, but grant us a license to use, modify, and display such content in connection with our service.
            </p>
          </div>
        </section>

        {/* Privacy and Data */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Privacy and Data</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
          </p>
          <p className="text-muted-foreground">
            By using our service, you consent to the collection and use of information in accordance with our Privacy Policy.
          </p>
        </section>

        {/* Disclaimers */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Disclaimers</h2>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              The service is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, and hereby disclaim all warranties, including without limitation:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Warranties of merchantability and fitness for a particular purpose</li>
              <li>Warranties that the service will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy or reliability of search results</li>
              <li>Warranties that defects will be corrected</li>
            </ul>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            In no event shall AI Search, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
          </p>
        </section>

        {/* Termination */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Termination</h2>
          <p className="text-muted-foreground mb-4">
            We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p className="text-muted-foreground">
            Upon termination, your right to use the service will cease immediately. If you wish to terminate your account, you may simply discontinue using the service.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
          </p>
        </section>

        {/* Governing Law */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </p>
        </section>

        {/* Contact Information */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2 text-muted-foreground">
            <p>Email: legal@aisearch.com</p>
            <p>Address: [Your Company Address]</p>
            <p>Phone: [Your Company Phone]</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms;
