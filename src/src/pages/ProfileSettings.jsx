import React, { useEffect, useState } from "react";

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

  // Demo: load admin from localStorage or use default
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('adminProfile');
    return saved ? JSON.parse(saved) : {
      name: 'Admin User',
      email: 'admin@example.com',
      phone: '',
      password: 'admin123', // for demo only
    };
  });
  const [form, setForm] = useState({ name: admin.name, email: admin.email, phone: admin.phone, password: '', newPassword: '', confirmNewPassword: '' });
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Change password section
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const handlePwChange = e => {
    const { name, value } = e.target;
    setPwForm(f => ({ ...f, [name]: value }));
    setPwError('');
    setPwSuccess('');
  };

  const handlePwSubmit = e => {
    e.preventDefault();
    if (pwForm.current !== admin.password) {
      setPwError('Current password is incorrect.');
      return;
    }
    if (!pwForm.newPw || pwForm.newPw.length < 4) {
      setPwError('New password must be at least 4 characters.');
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError('New passwords do not match.');
      return;
    }
    const updated = { ...admin, password: pwForm.newPw };
    setAdmin(updated);
    localStorage.setItem('adminProfile', JSON.stringify(updated));
    setPwForm({ current: '', newPw: '', confirm: '' });
    setPwSuccess('Password changed successfully.');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleEdit = () => {
    setEditMode(true);
    setForm({ name: admin.name, email: admin.email, phone: admin.phone, password: '', newPassword: '', confirmNewPassword: '' });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({ name: admin.name, email: admin.email, phone: admin.phone, password: '', newPassword: '', confirmNewPassword: '' });
    setError('');
    setSuccess('');
  };

  const handleSave = e => {
    e.preventDefault();
    // Password check for update
    if (form.password !== admin.password) {
      setError('Current password is incorrect.');
      return;
    }
    if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    const updated = {
      ...admin,
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.newPassword ? form.newPassword : admin.password,
    };
    setAdmin(updated);
    localStorage.setItem('adminProfile', JSON.stringify(updated));
    setEditMode(false);
    setSuccess('Profile updated successfully.');
  };

  return (
    <div className="app-container">
      <div id="sidebar-container"></div>
      <main className="main-content" id="mainContent">
        <div id="header-container"></div>
        <div className="content">
          <div className="profile-settings-container" style={{ maxWidth: 900, margin: '32px auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
            <h2 style={{ marginBottom: 24 }}>Profile Settings</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}
                 className="profile-grid-responsive">
              {/* Profile Form */}
              <div>
                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
                <form onSubmit={handleSave} autoComplete="off">
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label>Name</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} disabled={!editMode} className="form-control" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label>Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} disabled={!editMode} className="form-control" required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label>Phone</label>
                    <input type="text" name="phone" value={form.phone} onChange={handleChange} disabled={!editMode} className="form-control" />
                  </div>
                  {editMode && (
                    <>
                      <div className="form-group" style={{ marginBottom: 16 }}>
                        <label>Current Password</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" required autoComplete="current-password" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 16 }}>
                        <label>New Password</label>
                        <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} className="form-control" autoComplete="new-password" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 16 }}>
                        <label>Confirm New Password</label>
                        <input type="password" name="confirmNewPassword" value={form.confirmNewPassword} onChange={handleChange} className="form-control" autoComplete="new-password" />
                      </div>
                    </>
                  )}
                  <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    {editMode ? (
                      <>
                        <button type="submit" className="btn-primary">Save</button>
                        <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
                      </>
                    ) : (
                      <button type="button" className="btn-primary" onClick={handleEdit}>Edit Profile</button>
                    )}
                  </div>
                </form>
              </div>
              {/* Change Password Form */}
              <div style={{ borderLeft: '1px solid #eee', paddingLeft: 32 }}>
                <h3 style={{ marginBottom: 16 }}>Change Password</h3>
                {pwError && <div style={{ color: 'red', marginBottom: 12 }}>{pwError}</div>}
                {pwSuccess && <div style={{ color: 'green', marginBottom: 12 }}>{pwSuccess}</div>}
                <form onSubmit={handlePwSubmit} autoComplete="off">
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label>Current Password</label>
                    <input type="password" name="current" value={pwForm.current} onChange={handlePwChange} className="form-control" required autoComplete="current-password" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label>New Password</label>
                    <input type="password" name="newPw" value={pwForm.newPw} onChange={handlePwChange} className="form-control" required autoComplete="new-password" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label>Confirm New Password</label>
                    <input type="password" name="confirm" value={pwForm.confirm} onChange={handlePwChange} className="form-control" required autoComplete="new-password" />
                  </div>
                  <button type="submit" className="btn-primary">Change Password</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
