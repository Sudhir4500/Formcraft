import type { Metadata } from 'next'
import { djangoGet } from '@/app/api/_lib/django'
import type { Form } from '@/types/forms'
import { CreatePost } from '@/components/forms/CreatePost'

export const metadata: Metadata = {
  title: 'Dashboard — FormCraft',
  robots: { index: false },
}

export default async function DashboardPage() {
  const result = await djangoGet<Form[]>('forms/')
  const forms = result.success && result.data ? result.data : []

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Dynamic Upper Header Action Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-surface-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Forms</h1>
          <p className="text-sm text-secondary mt-0.5">
            {forms.length} active form{forms.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <div className="sm:self-center">
          <CreatePost />
        </div>
      </div>

      {!result.success ? (
        <div className="p-4 rounded-xl bg-error/10 border border-error/20 text-sm text-error font-medium">
          {result.message}
        </div>
      ) : forms.length === 0 ? (
        <div className="app-card flex flex-col items-center justify-center text-center py-16">
          <div className="size-14 rounded-2xl bg-base-300 flex items-center justify-center text-2xl mb-4 shadow-inner">📋</div>
          <h2 className="text-lg font-bold text-foreground mb-1">No forms found</h2>
          <p className="text-sm text-secondary mb-6 max-w-sm">
            Create your target workspace profile to start processing responses live.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {forms.map((form) => (
            <div key={form.id} className="app-card flex flex-col justify-between group hover:border-primary/40 transition-all duration-200">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="font-semibold text-base text-foreground truncate group-hover:text-primary transition-colors">{form.title}</h2>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0
                    ${form.is_published ? 'bg-success/15 text-success' : 'bg-base-300 text-secondary'}`}>
                    {form.is_published ? 'Live' : 'Draft'}
                  </span>
                </div>
                {form.description && (
                  <p className="text-xs text-secondary line-clamp-2 mb-4">{form.description}</p>
                )}
              </div>
              <p className="text-xs text-secondary/70 font-mono bg-base-300/40 px-2 py-1 rounded border border-surface-border w-fit truncate">
                /{form.slug}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}