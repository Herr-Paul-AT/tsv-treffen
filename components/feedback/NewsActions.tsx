'use client';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

export function StarToggle() {
  const [starred, setStarred] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setStarred((s) => !s)}
      aria-pressed={starred}
      aria-label={starred ? 'Aus Merkliste entfernen' : 'Auf Merkliste setzen'}
      className={[
        'w-11 h-11 inline-flex items-center justify-center rounded-full shadow-card transition-colors',
        starred ? 'bg-sand-500 text-stone-900' : 'bg-white/90 text-stone-700',
      ].join(' ')}
    >
      <Icon.Star size={18} />
    </button>
  );
}

export function FollowButton() {
  const [following, setFollowing] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFollowing((f) => !f)}
      aria-pressed={following}
      className={[
        'text-[13px] font-medium px-3 py-2 rounded-md transition-colors',
        following ? 'bg-lake-50 text-lake-800' : 'text-lake-700 hover:bg-paper-100',
      ].join(' ')}
    >
      {following ? 'Folge ich' : 'Folgen'}
    </button>
  );
}
