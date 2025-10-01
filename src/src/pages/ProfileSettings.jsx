import React, { useEffect } from "react";

const ProfileSettings = () => {
  useEffect(() => {
    (async function() {
      if (window.SidebarComponent) {
        window.sidebarComponent = await window.SidebarComponent.loadSidebar('sidebar-container');
      }
      if (window.HeaderComponent) {
        window.headerComponent = await window.HeaderComponent.loadHeader('header-container');
      }
    })();
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar Container */}
      <div id="sidebar-container"></div>
      {/* Main Content */}
      <main className="main-content" id="mainContent">
        {/* Header Container */}
        <div id="header-container"></div>
        {/* Content */}
        <div className="content">
          {/* Coming Soon Card */}
          <div className="coming-soon-container">
            <div className="coming-soon-card">
              <div className="coming-soon-icon">
                <i className="material-icons-round">person</i>
              </div>
              <h1 className="coming-soon-title">Profile Settings</h1>
              <p className="coming-soon-subtitle">Coming Soon</p>
              <p className="coming-soon-description">
                We're working on bringing you a comprehensive profile management system.
                Soon you'll be able to update your personal information, change your password,
                and customize your account settings.
              </p>
              <div className="coming-soon-features">
                <div className="feature-item">
                  <i className="material-icons-round">person</i>
                  <span>Personal Information</span>
                </div>
                <div className="feature-item">
                  <i className="material-icons-round">lock</i>
                  <span>Password Management</span>
                </div>
                <div className="feature-item">
                  <i className="material-icons-round">settings</i>
                  <span>Account Preferences</span>
                </div>
              </div>
              <div className="coming-soon-actions">
                <button className="btn-primary" onClick={() => window.history.back()}>
                  <i className="material-icons-round">arrow_back</i>
                  <span>Go Back</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
