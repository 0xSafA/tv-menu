'use client';

import { useEffect, useState } from 'react';

/**
 * Порядок, в котором цвета «дышат».
 * Значения должны один-в-один совпадать с атрибутом
 * data-color у точек / листиков.
 */
const GROUPS = ['hybrid', 'sativa', 'indica', 'leaf'] as const;

/** Интервал переключения, мс (20 секунд) */
const SWITCH_MS = 20_000;

export default function PulseController() {
  const [idx, setIdx] = useState(0);

  /** При каждой смене idx ставим data-active на <body> */
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.dataset.active = GROUPS[idx];
    }
  }, [idx]);

  /** Запускаем таймер переключения */
  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % GROUPS.length),
      SWITCH_MS,
    );
    return () => clearInterval(t);
  }, []);

  /** Ничего не рисуем — компонент «невидимка» */
  return null;
}