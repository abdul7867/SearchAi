import React, { useState } from 'react';
import LayoutShell from './LayoutShell';
import Header from './Header';
import Footer from './Footer';
import { cn } from '../utils/cn';

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <LayoutShell
      header={<Header onMobileMenuToggle={handleMobileMenuToggle} />}
      footer={<Footer />}
    >
      <div className={cn("container mx-auto px-4 py-6", isMobileMenuOpen && "lg:ml-0")}>
        {children}
      </div>
    </LayoutShell>
  );
};

export default Layout;
