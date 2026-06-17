'use client'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import React from 'react'
import { createForm } from '@/services/formServices'
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler'
import { Toast } from '../ui/Toast'
import { UpgradeButton } from '../billing/UpgradeButton'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'

export function CreatePost() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [posts, setPosts] = React.useState({ title: '', description: '' });
  const [toast, setToast] = React.useState<{ type: 'info' | 'success' | 'error'; message: string } | null>(null);

  const router = useRouter();
  const { user } = useAuthStore();
  const { parseError } = useApiErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createForm(posts);
      setIsModalOpen(false);
      setPosts({ title: '', description: '' });
      setToast({ type: 'success', message: 'Form created successfully!' });
      router.refresh();
    } catch (error) {
      const { message } = parseError(error);
      setToast({ type: 'error', message });
    }
  };

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showUpgrade = user?.plan !== 'pro' && toast?.type === 'error';

  return (
    <div>
      <Button variant="primary" label="Create New Form" onClick={() => setIsModalOpen(true)} />
      
      <Modal title="Create New Post" open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Title</label>
            <input
              type="text"
              placeholder="e.g., Customer Feedback Form"
              value={posts.title}
              onChange={(e) => setPosts({ ...posts, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the main purpose of this document dataset..."
              value={posts.description}
              onChange={(e) => setPosts({ ...posts, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="primary" label="Create Form" type="submit" className="w-full sm:w-auto" />
          </div>
        </form>
      </Modal>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          body={showUpgrade ? <div className="mt-2"><UpgradeButton /></div> : undefined}
        />
      )}
    </div>
  );
}