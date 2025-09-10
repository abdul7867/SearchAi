import React from 'react';
import { Shield, Lock, Eye, Database, Users } from 'lucide-react';
import { cn } from '../utils/cn';

const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Your Privacy Matters</h2>
          </div>
          <p className="text-muted-foreground">
            At AI Search, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data when you use our service.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Name and email address when you create an account</li>
                <li>Search queries and preferences</li>
                <li>Usage data and interaction with our service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Technical Information</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system and platform</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Eye className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">How We Use Your Information</h2>
          </div>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Provide and improve our AI search services</li>
              <li>Personalize your search experience</li>
              <li>Analyze usage patterns and optimize performance</li>
              <li>Communicate with you about our services</li>
              <li>Ensure the security and integrity of our platform</li>
            </ul>
          </div>
        </section>

        {/* Data Protection */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Data Protection</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication measures</li>
            <li>Secure data centers and infrastructure</li>
          </ul>
        </section>

        {/* Data Sharing */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Data Sharing</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
            <li>With trusted service providers who assist in our operations</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Your Rights</h2>
          <p className="text-muted-foreground mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Access and review your personal information</li>
            <li>Update or correct inaccurate data</li>
            <li>Request deletion of your personal information</li>
            <li>Opt-out of certain data collection and processing</li>
            <li>Export your data in a portable format</li>
          </ul>
        </section>

        {/* Contact Information */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-muted-foreground">
            <p>Email: privacy@aisearch.com</p>
            <p>Address: [Your Company Address]</p>
            <p>Phone: [Your Company Phone]</p>
          </div>
        </section>

        {/* Updates to Policy */}
        <section className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. 
            We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
