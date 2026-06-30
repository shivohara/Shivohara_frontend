import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://shivohara-backend-1.onrender.com/api';

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All', 'Full-time', 'Internship'
  const [filterDept, setFilterDept] = useState('All');
  const [filterLoc, setFilterLoc] = useState('All');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  
  // Selected Job for Detail Drawer
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isDirectApply, setIsDirectApply] = useState(false);

  // Toggle body class when drawer opens to manage stacking contexts
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }
    return () => {
      document.body.classList.remove('drawer-open');
    };
  }, [isDrawerOpen]);
  
  // Application form state
  const [applyFormData, setApplyFormData] = useState({
    name: '',
    email: '',
    portfolio_url: '',
    resume_text: '',
    cover_letter: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 30 seconds timeout to allow Render free tier database to spin up on cold start

    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error('Failed to load job listings.');
      }
      const data = await response.json();
      setJobs(data && data.length > 0 ? data : []);
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Backend connection failed:', err);
      setJobs([]);
      if (err.name === 'AbortError') {
        setError('Connection timed out. The server is taking longer than expected to respond.');
      } else {
        setError('We encountered a temporary connection issue. Please check your internet connection or try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenJob = (job, autoApply = false) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
    setShowApplyForm(autoApply);
    setIsDirectApply(autoApply);
    setSubmitSuccess(false);
    setSubmitError(null);
    setResumeFile(null);
    setApplyFormData({
      name: '',
      email: '',
      portfolio_url: '',
      resume_text: '',
      cover_letter: ''
    });
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Delay setting to null for closing animation transition
    setTimeout(() => {
      setSelectedJob(null);
    }, 400);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!applyFormData.name || !applyFormData.email || !resumeFile) {
      setSubmitError('Please fill out all required fields and upload your resume.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append('name', applyFormData.name);
    formData.append('email', applyFormData.email);
    formData.append('portfolio_url', applyFormData.portfolio_url);
    formData.append('cover_letter', applyFormData.cover_letter);
    formData.append('resume', resumeFile);

    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${selectedJob.id}/apply`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit your application.');
      }

      setSubmitSuccess(true);
      setResumeFile(null);
      setApplyFormData({
        name: '',
        email: '',
        portfolio_url: '',
        resume_text: '',
        cover_letter: ''
      });
    } catch (err) {
      console.error('Submit application error:', err);
      setSubmitError(err.message || 'An error occurred while submitting. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Process search and type filtering
  const jobsArray = Array.isArray(jobs) ? jobs : [];
  const departmentsList = ['All', ...new Set(jobsArray.map(job => job.department).filter(Boolean))];
  const locationsList = ['All', ...new Set(jobsArray.map(job => job.location).filter(Boolean))];

  const filteredJobs = jobsArray.filter(job => {
    const matchesSearch = 
      (job.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = 
      filterType === 'All' || 
      (job.type || '').toLowerCase() === filterType.toLowerCase();

    const matchesDept = 
      filterDept === 'All' || 
      job.department === filterDept;

    const matchesLoc = 
      filterLoc === 'All' || 
      job.location === filterLoc;
      
    return matchesSearch && matchesType && matchesDept && matchesLoc;
  });

  return (
    <div className="careers-page-view">
      {/* Careers Hero Area */}
      <section className="careers-hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3.5rem 0 0.5rem 0' }}>
        <div className="hero-bg">
        </div>
        <div className="container">
        </div>
      </section>

      {/* Careers Content Section */}
      <section className="careers-listings-section" style={{ paddingTop: 0 }}>
        <div className="container">
          
          {/* Search & Filters Controls */}
          <div className="careers-controls-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'center' }}>
              <div className="search-input-wrap" style={{ flex: 1, maxWidth: 'none' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  placeholder="Search jobs by title, skills, or department..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-field"
                />
              </div>
              <button
                type="button"
                className={`filter-toggle-btn ${showFiltersPanel ? 'active' : ''}`}
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Filters
                {(filterType !== 'All' || filterDept !== 'All' || filterLoc !== 'All') && (
                  <span style={{
                    background: 'var(--accent-cyan)',
                    color: '#000000',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '4px'
                  }}>
                    {[filterType, filterDept, filterLoc].filter(v => v !== 'All').length}
                  </span>
                )}
              </button>
            </div>

            {/* Expandable Filter Details panel */}
            {showFiltersPanel && (
              <div className="expanded-filters-panel" style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1.25rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--border-color)',
                marginTop: '0.5rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  
                  {/* Position Type filter */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Position Type</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['All', 'Full-time', 'Internship'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          className={`filter-pill ${filterType === type ? 'active' : ''}`}
                          onClick={() => setFilterType(type)}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.8rem',
                            borderRadius: '16px'
                          }}
                        >
                          {type === 'All' ? 'All Roles' : type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Department filter dropdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</span>
                    <select
                      value={filterDept}
                      onChange={(e) => setFilterDept(e.target.value)}
                      className="filter-select"
                    >
                      <option value="All">All Departments</option>
                      {departmentsList.filter(d => d !== 'All').map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location filter dropdown */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</span>
                    <select
                      value={filterLoc}
                      onChange={(e) => setFilterLoc(e.target.value)}
                      className="filter-select"
                    >
                      <option value="All">All Locations</option>
                      {locationsList.filter(l => l !== 'All').map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                </div>
                
                {/* Reset Filters Option */}
                {(filterType !== 'All' || filterDept !== 'All' || filterLoc !== 'All') && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setFilterType('All');
                        setFilterDept('All');
                        setFilterLoc('All');
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--accent-orange)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      Clear Active Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Job listings lists */}
          {loading ? (
            <div className="jobs-table-wrapper skeleton-wrapper">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((index) => (
                    <tr key={`skeleton-${index}`} className="skeleton-row">
                      <td>
                        <div className="skeleton-text skeleton-title"></div>
                        <div className="skeleton-text skeleton-subtitle"></div>
                      </td>
                      <td>
                        <div className="skeleton-text skeleton-dept"></div>
                      </td>
                      <td>
                        <div className="skeleton-text skeleton-location"></div>
                      </td>
                      <td>
                        <div className="skeleton-text skeleton-badge"></div>
                      </td>
                      <td className="text-right">
                        <div className="skeleton-text skeleton-btn"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : error ? (
            <div className="careers-error-box glass-card">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <h3>Unable to Load Job Listings</h3>
              <p>{error}</p>
              <button className="btn btn-secondary" onClick={fetchJobs} style={{ marginTop: '1rem' }}>Retry Connection</button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="careers-empty-box glass-card">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>
              <h3>No Positions Match Your Query</h3>
              <p>We couldn't find any openings matching your search criteria. Check back soon or send us an inquiry via the Contact form!</p>
            </div>
          ) : (
            <div className="jobs-table-wrapper">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id} onClick={() => handleOpenJob(job)}>
                      <td>
                        <div className="job-table-title">{job.title}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.2rem' }}>
                          {job.salary && <div className="job-table-salary-sub">{job.salary}</div>}
                          {job.deadline && (
                            <div style={{ fontSize: '0.75rem', color: job.deadline_completed ? 'var(--accent-orange)' : 'var(--text-muted)' }}>
                              📅 Apply by: {job.deadline} {job.deadline_completed && ' (Closed)'}
                            </div>
                          )}
                          {job.skills && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              🛠️ Skills: {job.skills}
                            </div>
                          )}
                        </div>
                      </td>
                      <td><span className="job-table-dept">{job.department}</span></td>
                      <td><span className="job-table-location">{job.location}</span></td>
                      <td>
                        <span className={`job-type-badge ${job.type.toLowerCase() === 'internship' ? 'type-internship' : 'type-job'}`}>
                          {job.type}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="job-row-actions">
                          {job.deadline_completed ? (
                            <span style={{ color: 'var(--accent-orange)', fontSize: '0.85rem', fontWeight: 600, paddingRight: '0.5rem' }}>
                              Closed
                            </span>
                          ) : (
                            <button className="job-table-apply-btn" onClick={(e) => { e.stopPropagation(); handleOpenJob(job, true); }}>
                              Apply Now
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </section>

      {/* Careers Job Details Sliding Drawer overlay */}
      <div className={`job-detail-drawer-backdrop ${isDrawerOpen ? 'open' : ''}`} onClick={handleCloseDrawer} />
      
      <div className={`job-detail-drawer ${isDrawerOpen ? 'open' : ''}`}>
          {selectedJob && (
            <>
              {/* Drawer Header */}
              <div className="drawer-header-wrapper">
                <div className="drawer-inner-container">
                  <div className="drawer-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem', paddingInline: 0, paddingBlock: '2rem 1.5rem' }}>
                    <button 
                      className="back-to-jobs-btn" 
                      onClick={handleCloseDrawer} 
                      style={{
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = 'var(--text-primary)';
                        e.currentTarget.style.color = 'var(--bg-card)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      Back to Positions
                    </button>

                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span className={`job-type-badge ${selectedJob.type.toLowerCase() === 'internship' ? 'type-internship' : 'type-job'}`}>
                          {selectedJob.type}
                        </span>
                        <span className="job-location" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedJob.location}</span>
                      </div>
                      <h2 className="drawer-job-title" style={{ marginTop: '0.75rem', fontSize: '1.8rem' }}>{selectedJob.title}</h2>
                      <p className="drawer-job-meta" style={{ marginTop: '0.35rem' }}>
                        <strong>{selectedJob.department}</strong> {selectedJob.salary ? `• ${selectedJob.salary}` : ''}
                      </p>
                      {selectedJob.deadline && selectedJob.deadline.trim() !== '' && (
                        <p className="drawer-job-deadline" style={{ fontSize: '0.88rem', color: selectedJob.deadline_completed ? 'var(--accent-orange)' : 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>
                          📅 Apply by: {selectedJob.deadline} {selectedJob.deadline_completed && ' (Applications Closed)'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="drawer-content">
                <div className="drawer-inner-container">
                <div className="job-details-block">
                  <h3>About the Role</h3>
                  <p>{selectedJob.description}</p>
                </div>

                {selectedJob.requirements && (
                  <div className="job-details-block">
                    <h3>Requirements</h3>
                    <ul className="drawer-details-list">
                      {selectedJob.requirements.split('\n').filter(r => r.trim() !== '').map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedJob.skills && (
                  <div className="job-details-block">
                    <h3>Preferred Skills</h3>
                    <div className="drawer-skills-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {selectedJob.skills.split(',').map((skill, idx) => (
                        <span 
                          key={idx} 
                          style={{ 
                            background: 'rgba(255, 255, 255, 0.05)', 
                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                            borderRadius: '4px', 
                            padding: '0.25rem 0.6rem', 
                            fontSize: '0.82rem',
                            color: 'var(--text-primary)'
                          }}
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJob.responsibilities && (
                  <div className="job-details-block">
                    <h3>Key Responsibilities</h3>
                    <ul className="drawer-details-list">
                      {selectedJob.responsibilities.split('\n').filter(r => r.trim() !== '').map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Application Section */}
                <div className="drawer-apply-box">
                  {selectedJob.deadline_completed ? (
                    <div className="apply-closed-box" style={{ 
                      border: '1px dashed var(--accent-orange)', 
                      borderRadius: '6px', 
                      padding: '1.25rem', 
                      textAlign: 'center', 
                      background: 'rgba(239, 68, 68, 0.03)' 
                    }}>
                      <h4 style={{ color: 'var(--accent-orange)', margin: 0, fontSize: '1rem', fontWeight: 600 }}>Applications are Closed</h4>
                      <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>The deadline for this position has passed and we are no longer accepting new submissions.</p>
                    </div>
                  ) : !showApplyForm ? (
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '1rem' }}
                      onClick={() => setShowApplyForm(true)}
                    >
                      Apply For This Position
                    </button>
                  ) : (
                    <div className="apply-form-container glass-card">
                      <h3>Submit Your Application</h3>
                      
                      {submitSuccess ? (
                        <div className="apply-success-box">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          <h4>Application Submitted!</h4>
                          <p>Thank you for applying to SHIVOHARA. Our hiring team will review your credentials and get back to you shortly.</p>
                          <button className="btn btn-secondary" onClick={() => setShowApplyForm(false)} style={{ marginTop: '1rem' }}>Close Form</button>
                        </div>
                      ) : (
                        <form onSubmit={handleApplySubmit}>
                          <div className="form-group">
                            <label htmlFor="applicant-name">Full Name <span className="req">*</span></label>
                            <input 
                              type="text" 
                              id="applicant-name" 
                              name="name" 
                              required 
                              value={applyFormData.name}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              className="form-input"
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="applicant-email">Email Address <span className="req">*</span></label>
                            <input 
                              type="email" 
                              id="applicant-email" 
                              name="email" 
                              required 
                              value={applyFormData.email}
                              onChange={handleInputChange}
                              placeholder="john.doe@example.com"
                              className="form-input"
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="applicant-portfolio">Portfolio / LinkedIn / GitHub Link <span className="req">*</span></label>
                            <input 
                              type="url" 
                              id="applicant-portfolio" 
                              name="portfolio_url" 
                              required 
                              value={applyFormData.portfolio_url}
                              onChange={handleInputChange}
                              placeholder="https://linkedin.com/in/username or https://github.com/..."
                              className="form-input"
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="applicant-resume">Resume File (PDF / DOCX) <span className="req">*</span></label>
                            <input 
                              type="file" 
                              id="applicant-resume" 
                              name="resume" 
                              required 
                              accept=".pdf,.docx,.doc"
                              onChange={handleFileChange}
                              className="form-input"
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="applicant-cover">Cover Letter / Message (Optional)</label>
                            <textarea 
                              id="applicant-cover" 
                              name="cover_letter" 
                              rows="3" 
                              value={applyFormData.cover_letter}
                              onChange={handleInputChange}
                              placeholder="Briefly tell us why you are a great fit for this role..."
                              className="form-textarea"
                            />
                          </div>

                          {submitError && (
                            <div className="form-status error" style={{ marginBlock: '1rem' }}>
                              {submitError}
                            </div>
                          )}

                          <div className="apply-form-actions">
                            <button 
                              type="button" 
                              className="btn btn-secondary" 
                              onClick={() => isDirectApply ? handleCloseDrawer() : setShowApplyForm(false)}
                              disabled={submitting}
                            >
                              {isDirectApply ? 'Back to Positions' : 'Cancel'}
                            </button>
                            <button 
                              type="submit" 
                              className="btn btn-primary"
                              disabled={submitting}
                            >
                              {submitting ? 'Submitting...' : 'Submit Application'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            </>
          )}
      </div>
    </div>
  );
}
