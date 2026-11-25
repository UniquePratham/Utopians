'use client';

import { useState } from 'react';
import { sendJoinRequest } from '@/app/actions';

const FIELD =
  'w-full rounded-md border hairline bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary';

export function JoinForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    const result = await sendJoinRequest(formData);

    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setErrorMessage(result.error || 'Something went wrong.');
    }
  }

  if (status === 'success') {
    return (
      <div className="py-6">
        <p className="font-medium">Request sent</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We read every message and reply to the address you gave.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm font-medium text-primary underline underline-offset-4"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          Name
        </label>
        <input id="name" name="name" type="text" required className={FIELD} />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input id="email" name="email" type="email" required className={FIELD} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          What have you worked on?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className={`${FIELD} resize-none`}
          placeholder="A writeup, a solved challenge, a project — anything concrete."
        />
      </div>

      {status === 'error' && <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending…' : 'Send request'}
      </button>
    </form>
  );
}
