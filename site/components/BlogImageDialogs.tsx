'use client';

import { useEffect } from 'react';

export default function BlogImageDialogs() {
  useEffect(() => {
    const article = document.querySelector<HTMLElement>('article.blog-content');
    if (!article) return;

    const openImage = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey
        || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>('a[data-image-dialog]');
      if (!link?.dataset.imageDialog) return;

      const dialog = document.getElementById(link.dataset.imageDialog) as HTMLDialogElement | null;
      if (!dialog || dialog.tagName !== 'DIALOG' || !article.contains(dialog)
        || typeof dialog.showModal !== 'function') return;

      event.preventDefault();
      if (dialog.open) return;
      link.focus({ preventScroll: true });
      dialog.showModal();
    };

    article.addEventListener('click', openImage);
    return () => article.removeEventListener('click', openImage);
  }, []);

  return null;
}
