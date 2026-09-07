'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import styles from './dashboard.module.scss';

interface Project {
  id: string;
  name: string;
  createdAt: number;
}

export default function DashboardPage() {
  const { data: session, isPending, refetch } = useSession();
  const [hasResolved, setHasResolved] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState('New Project');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isCreating]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCreating) setIsCreating(false);
        if (isPremiumOpen) setIsPremiumOpen(false);
        if (isAccountOpen) setIsAccountOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreating, isPremiumOpen, isAccountOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    } finally {
      window.location.href = '/login';
    }
  };

  const handleStartCreate = () => {
    setProjectName('New Project');
    setIsCreating(true);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = projectName.trim();
    if (!trimmed) return;

    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    const newProject: Project = {
      id: tempId,
      name: trimmed,
      createdAt: Date.now(),
    };

    const nextProjects = [newProject, ...projects];
    setProjects(nextProjects);

    try {
      localStorage.setItem('somo_projects', JSON.stringify(nextProjects));
    } catch (err) {
      console.error(err);
    }

    setIsCreating(false);
    setProjectName('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
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
        }
      }
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
          onClick={() => setIsPremiumOpen((prev) => !prev)}
          className={`${styles.tabPremium} ${isPremiumOpen ? styles.active : ''}`}
        >
          Premium
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPremiumOpen(false);
            setIsAccountOpen(false);
            setIsCreating(false);
          }}
          className={styles.tabHome}
        >
          Home
        </button>

        <button
          type="button"
          onClick={() => setIsAccountOpen((prev) => !prev)}
          className={`${styles.tabAccount} ${isAccountOpen ? styles.active : ''}`}
        >
          Account
        </button>
      </header>

      <main
        onClick={(e) => {
          if (e.target === e.currentTarget && isCreating) {
            setIsCreating(false);
          }
        }}
        className={`${styles.canvas} ${projects.length > 0 || isCreating ? styles.hasProjects : ''} ${isPremiumOpen || isAccountOpen ? styles.canvasBlurred : ''}`}
      >
        {projects.length === 0 ? (
          isCreating ? (
            <div className={styles.createProjectBox}>
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
            <>
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
            </>
          )
        ) : (
          <div className={styles.projectsContainer}>
            {isCreating && (
              <div className={styles.createProjectBox}>
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

            {projects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectNameWrapper}>
                  <span className={styles.projectName}>{project.name}</span>
                </div>
                <div className={styles.slashDivider} />
                <button type="button" className={styles.seeProjectBtn}>
                  <span>SEE</span>
                  <span>PROJECT</span>
                </button>
              </div>
            ))}

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
      </main>

      <div
        className={`${styles.sidebarBackdrop} ${isPremiumOpen || isAccountOpen ? styles.open : ''}`}
        onClick={() => {
          setIsPremiumOpen(false);
          setIsAccountOpen(false);
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
    </div>
  );
}
