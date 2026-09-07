'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import styles from './dashboard.module.scss';

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    if (!isPending && !session?.user) {
      window.location.href = '/login';
    }
  }, [session, isPending]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    } finally {
      window.location.href = '/login';
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    setProjectName('');
    setIsCreateOpen(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.topNav}>
        <button
          type="button"
          onClick={() => setIsPremiumOpen(true)}
          className={styles.tabPremium}
        >
          Premium
        </button>

        <div className={styles.tabHome}>
          Home
        </div>

        <button
          type="button"
          onClick={() => setIsAccountOpen(true)}
          className={styles.tabAccount}
        >
          Account
        </button>
      </header>

      <main className={styles.canvas}>
        <div className={styles.shapesWrapper}>
          <div className={styles.largeBox} />
          <div className={styles.smallBox} />
        </div>

        <div className={styles.emptyPrompt}>
          <p className={styles.emptyNotice}>No projects yet...</p>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className={styles.createLink}
          >
            Create new one?
          </button>
        </div>
      </main>

      {isCreateOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsCreateOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>New Project</h2>
            <p className={styles.modalSubtitle}>Give your visual design project a name</p>

            <form onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="e.g. Acme Brand Guide"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
                className={styles.modalInput}
              />
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.confirmBtn}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAccountOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsAccountOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Your Account</h2>
            <p className={styles.modalSubtitle}>Manage your current workspace profile</p>

            <div className={styles.userInfoRow}>
              <span>Name</span>
              <span>{session?.user?.name || 'Workspace Member'}</span>
            </div>
            <div className={styles.userInfoRow}>
              <span>Email</span>
              <span>{session?.user?.email || 'Active Session'}</span>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className={styles.signOutBtn}
            >
              Sign out
            </button>

            <div className={styles.modalActions} style={{ marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setIsAccountOpen(false)}
                className={styles.cancelBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isPremiumOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsPremiumOpen(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Membership</h2>
            <p className={styles.modalSubtitle}>Current tier: Free Plan</p>

            <div className={styles.userInfoRow}>
              <span>Icons Allowance</span>
              <span>Up to 9 icons</span>
            </div>
            <div className={styles.userInfoRow}>
              <span>Colors</span>
              <span>Up to 6 colors</span>
            </div>
            <div className={styles.userInfoRow}>
              <span>Fonts</span>
              <span>Up to 3 fonts</span>
            </div>

            <div className={styles.modalActions} style={{ marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setIsPremiumOpen(false)}
                className={styles.cancelBtn}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
