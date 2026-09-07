'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { ProjectCanvas, type Project, type ProjectData } from '@/components/dashboard/ProjectCanvas';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  const { data: session, isPending, refetch } = useSession();
  const [hasResolved, setHasResolved] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [projectName, setProjectName] = useState('New Project');
  const [editProjectName, setEditProjectName] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isProjectSettingsOpen, setIsProjectSettingsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  const triggerClose = () => {
    if (!isCreating || isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsCreating(false);
      setIsClosing(false);
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isCreating || isClosing) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        triggerClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isCreating, isClosing]);

  useEffect(() => {
    refetch().finally(() => {
      setHasResolved(true);
    });
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('somo_projects');
      if (stored) {
        setProjects(JSON.parse(stored));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    let isCancelled = false;

    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isCancelled && Array.isArray(data?.projects)) {
          setProjects(data.projects);
          try {
            localStorage.setItem('somo_projects', JSON.stringify(data.projects));
          } catch {}
        }
      })
      .catch((err) => console.error(err));

    return () => {
      isCancelled = true;
    };
  }, [session?.user]);

  useEffect(() => {
    if (hasResolved && !isPending && !session?.user) {
      window.location.href = '/login';
    }
  }, [session, isPending, hasResolved]);

  useEffect(() => {
    if (isCreating && !isClosing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isCreating, isClosing]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCreating) triggerClose();
        if (isPremiumOpen) setIsPremiumOpen(false);
        if (isAccountOpen) setIsAccountOpen(false);
        if (isProjectSettingsOpen) setIsProjectSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreating, isClosing, isPremiumOpen, isAccountOpen, isProjectSettingsOpen]);

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = '/login';
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
    document.cookie = 'better-auth.session_token=; Max-Age=0; path=/;';
    document.cookie = 'better-auth.session_data=; Max-Age=0; path=/;';
    document.cookie = 'better-auth.dont_remember=; Max-Age=0; path=/;';
    window.location.href = '/login';
  };

  const handleViewProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      setEditProjectName(proj.name);
    }
    setActiveProjectId(projectId);
    setIsAccountOpen(false);
    setIsPremiumOpen(false);
    setIsProjectSettingsOpen(false);
  };

  const handleGoHome = () => {
    setActiveProjectId(null);
    setIsAccountOpen(false);
    setIsPremiumOpen(false);
    setIsProjectSettingsOpen(false);
    if (isCreating) triggerClose();
  };

  const handleStartCreate = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setIsClosing(false);
    setProjectName('New Project');
    setIsCreating(true);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = projectName.trim();
    if (!trimmed) return;

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setIsClosing(false);

    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    const newProject: Project = {
      id: tempId,
      name: trimmed,
      createdAt: Date.now(),
      data: {},
    };

    const nextProjects = [...projects, newProject];
    setProjects(nextProjects);

    try {
      localStorage.setItem('somo_projects', JSON.stringify(nextProjects));
    } catch (err) {
      console.error(err);
    }

    setIsCreating(false);
    setProjectName('');
    handleViewProject(tempId);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, data: {} }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.project) {
          setProjects((prev) => {
            const updated = prev.map((p) => (p.id === tempId ? data.project : p));
            try {
              localStorage.setItem('somo_projects', JSON.stringify(updated));
            } catch {}
            return updated;
          });
          if (activeProjectId === tempId) {
            setActiveProjectId(data.project.id);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === updatedProject.id ? updatedProject : p));
      try {
        localStorage.setItem('somo_projects', JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      await fetch(`/api/projects/${updatedProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedProject.name,
          data: updatedProject.data,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    const trimmed = editProjectName.trim();
    if (!trimmed) return;
    handleUpdateProject({
      ...activeProject,
      name: trimmed,
    });
  };

  const handleToggleSharpLines = () => {
    if (!activeProject) return;
    const nextData: ProjectData = {
      ...(activeProject.data || {}),
      sharpLines: !activeProject.data?.sharpLines,
    };
    handleUpdateProject({
      ...activeProject,
      data: nextData,
    });
  };

  const handleDeleteActiveProject = async () => {
    if (!activeProject) return;
    const targetId = activeProject.id;
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== targetId);
      try {
        localStorage.setItem('somo_projects', JSON.stringify(next));
      } catch {}
      return next;
    });
    setActiveProjectId(null);
    setIsProjectSettingsOpen(false);

    try {
      await fetch(`/api/projects/${targetId}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
  };

  if (!hasResolved || isPending || !session?.user) {
    return null;
  }

  const username = session.user.name || session.user.email?.split('@')[0] || 'Username';

  const perks = [
    'Unlimited icons allowance',
    'Custom color palettes',
    'Font pairings & uploads',
    'Unlimited canvas projects',
    'Vector SVG & PNG export',
  ];

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.topNav}>
        <button
          type="button"
          onClick={() => {
            setIsPremiumOpen((prev) => !prev);
            setIsAccountOpen(false);
            setIsProjectSettingsOpen(false);
          }}
          className={`${styles.tabPremium} ${isPremiumOpen ? styles.active : ''}`}
        >
          Premium
        </button>

        <button
          type="button"
          onClick={handleGoHome}
          className={`${styles.tabHome} ${!activeProject && !isPremiumOpen && !isAccountOpen ? styles.active : ''}`}
        >
          Home
        </button>

        {activeProject ? (
          <button
            type="button"
            onClick={() => {
              setIsProjectSettingsOpen((prev) => !prev);
              setIsPremiumOpen(false);
            }}
            className={`${styles.tabAccount} ${isProjectSettingsOpen ? styles.active : ''}`}
          >
            Settings
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsAccountOpen((prev) => !prev);
              setIsPremiumOpen(false);
            }}
            className={`${styles.tabAccount} ${isAccountOpen ? styles.active : ''}`}
          >
            Account
          </button>
        )}
      </header>

      <main
        className={`${styles.canvasViewport} ${
          isPremiumOpen || isAccountOpen || isProjectSettingsOpen ? styles.canvasBlurred : ''
        }`}
      >
        <div
          className={`${styles.projectsSlidePanel} ${
            projects.length > 0 || isCreating ? styles.hasProjects : ''
          } ${activeProjectId ? styles.slideLeft : ''}`}
        >
          {projects.length === 0 ? (
            isCreating ? (
              <div
                ref={boxRef}
                className={`${styles.createProjectBox} ${isClosing ? styles.closing : ''}`}
              >
                <form onSubmit={handleCreateProject} className={styles.createProjectForm}>
                  <div className={styles.inputWrapper}>
                    <input
                      ref={inputRef}
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className={styles.projectInput}
                      placeholder="New Project"
                      maxLength={60}
                    />
                  </div>
                  <div className={styles.slashDivider} />
                  <button type="submit" className={styles.seeProjectBtn}>
                    <span>SEE</span>
                    <span>PROJECT</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className={styles.emptyStateWrapper}>
                <div className={styles.shapesWrapper}>
                  <div className={styles.largeBox} />
                  <div className={styles.smallBox} />
                </div>

                <div className={styles.emptyPrompt}>
                  <p className={styles.emptyNotice}>No projects yet...</p>
                  <button
                    type="button"
                    onClick={handleStartCreate}
                    className={styles.createLink}
                  >
                    Create new one?
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className={styles.projectsContainer}>
              {projects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectNameWrapper}>
                    <span className={styles.projectName}>{project.name}</span>
                  </div>
                  <div className={styles.slashDivider} />
                  <button
                    type="button"
                    onClick={() => handleViewProject(project.id)}
                    className={styles.seeProjectBtn}
                  >
                    <span>SEE</span>
                    <span>PROJECT</span>
                  </button>
                </div>
              ))}

              {isCreating && (
                <div
                  ref={boxRef}
                  className={`${styles.createProjectBox} ${isClosing ? styles.closing : ''}`}
                >
                  <form onSubmit={handleCreateProject} className={styles.createProjectForm}>
                    <div className={styles.inputWrapper}>
                      <input
                        ref={inputRef}
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className={styles.projectInput}
                        placeholder="New Project"
                        maxLength={60}
                      />
                    </div>
                    <div className={styles.slashDivider} />
                    <button type="submit" className={styles.seeProjectBtn}>
                      <span>SEE</span>
                      <span>PROJECT</span>
                    </button>
                  </form>
                </div>
              )}

              {!isCreating && (
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className={styles.addProjectBtn}
                  aria-label="Add project"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        <div className={`${styles.canvasSlidePanel} ${activeProjectId ? styles.slideIn : ''}`}>
          {activeProject && (
            <ProjectCanvas
              project={activeProject}
              onUpdateProject={handleUpdateProject}
              onOpenSettings={() => setIsProjectSettingsOpen(true)}
            />
          )}
        </div>
      </main>

      <div
        className={`${styles.sidebarBackdrop} ${
          isPremiumOpen || isAccountOpen || isProjectSettingsOpen ? styles.open : ''
        }`}
        onClick={() => {
          setIsPremiumOpen(false);
          setIsAccountOpen(false);
          setIsProjectSettingsOpen(false);
        }}
      />

      <aside className={`${styles.premiumSidebar} ${isPremiumOpen ? styles.open : ''}`}>
        <div>
          <button
            type="button"
            onClick={() => setIsPremiumOpen(false)}
            className={styles.closeSidebarBtn}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <h2 className={styles.premiumTitle}>Enjoy all these perks with premium:</h2>

          <ul className={styles.perksList}>
            {perks.map((perk) => (
              <li key={perk} className={styles.perkItem}>
                <svg
                  className={styles.perkIcon}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.premiumActionWrapper}>
          <button type="button" className={styles.getPremiumBtn}>
            Get premium
          </button>
        </div>
      </aside>

      <aside className={`${styles.accountSidebar} ${isAccountOpen ? styles.open : ''}`}>
        <div className={styles.accountTopGroup}>
          <button
            type="button"
            onClick={() => setIsAccountOpen(false)}
            className={styles.closeSidebarBtn}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className={styles.avatarCircle}>
            <svg
              className={styles.avatarSvg}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>

          <div className={styles.usernameDisplay}>
            {username}
          </div>

          <div className={styles.accountActions}>
            <button type="button" className={styles.accountPillBtn}>
              Details
            </button>
            <button type="button" className={styles.accountPillBtn}>
              Security
            </button>
            <button type="button" className={styles.accountPillBtn}>
              Data
            </button>
            <button type="button" className={styles.accountPillBtn}>
              Subscription
            </button>
          </div>
        </div>

        <div className={styles.logoutWrapper}>
          <button
            type="button"
            onClick={handleSignOut}
            className={styles.logoutLink}
          >
            Log out
          </button>
        </div>
      </aside>

      <aside className={`${styles.projectSettingsSidebar} ${isProjectSettingsOpen ? styles.open : ''}`}>
        <div className={styles.settingsTopGroup}>
          <button
            type="button"
            onClick={() => setIsProjectSettingsOpen(false)}
            className={styles.closeSidebarBtn}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <h2 className={styles.projectSettingsTitle}>
            {activeProject?.name || 'Project'}
            <span>Settings</span>
          </h2>

          <div className={styles.settingsActions}>
            <div className={styles.settingBlock}>
              <label className={styles.settingLabel}>Rename Project</label>
              <form onSubmit={handleRenameSubmit} className={styles.renameForm}>
                <input
                  type="text"
                  className={styles.renameInput}
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  placeholder="Project name..."
                />
                <button type="submit" className={styles.renameSaveBtn}>
                  Save
                </button>
              </form>
            </div>

            <div className={styles.settingBlock}>
              <button
                type="button"
                onClick={handleToggleSharpLines}
                className={`${styles.sharpLinesToggleBtn} ${activeProject?.data?.sharpLines ? styles.active : ''}`}
              >
                <span>Sharp lines?</span>
                <span className={styles.toggleStateBadge}>
                  {activeProject?.data?.sharpLines ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.deleteProjectWrapper}>
          <button
            type="button"
            onClick={handleDeleteActiveProject}
            className={styles.deleteProjectBtn}
          >
            Delete Project
          </button>
        </div>
      </aside>
    </div>
  );
}
