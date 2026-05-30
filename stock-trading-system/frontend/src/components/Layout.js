import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, withSidebar = true }) => {
  return (
    <>
      <Navbar />
      {withSidebar && <Sidebar />}
      <main className={`main-content ${withSidebar ? '' : 'no-sidebar'}`}>
        <div className="page-container">{children}</div>
      </main>
    </>
  );
};

export default Layout;
