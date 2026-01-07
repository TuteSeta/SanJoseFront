'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PlayerCard({ nombre, posicion, rol, dorsal, imagen_url }) {
  const [imgFailed, setImgFailed] = useState(false);

  const HOVER_BG = 'hover:bg-[color-mix(in_srgb,var(--celeste-sanjo)_18%,transparent)]';
  const PLACEHOLDER_BG = 'bg-[color-mix(in_srgb,var(--celeste-sanjo)_20%,var(--blanco))]';

  const showImg = Boolean(imagen_url) && !imgFailed;

  return (
    <div
      className={[
        'group overflow-hidden rounded-xl',
        'border border-app bg-[var(--blanco)]',
        'shadow-sm md:shadow',
        'transform-gpu will-change-transform transition-all duration-1000 ease-out',
        'hover:border-[var(--brand)]',
        HOVER_BG,
        'md:hover:scale-[1.03] hover:shadow-lg',
      ].join(' ')}
    >
      <div className="relative aspect-[7/10] w-full">
        {showImg ? (
          <Image
            src={imagen_url}
            alt={nombre || 'Jugador/a'}
            fill
            sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 18vw"
            className="object-cover object-center md:transition-transform md:duration-1000 md:ease-out md:group-hover:scale-[1.05]"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className={`absolute inset-0 grid place-items-center ${PLACEHOLDER_BG} text-brand text-xs`}>
            Sin foto
          </div>
        )}

        <div className="absolute left-2 top-2 rounded-lg border border-app bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-semibold text-app backdrop-blur md:left-3 md:top-3 md:px-2 md:py-1 md:text-xs">
          #{Number.isFinite(dorsal) && dorsal !== 0 ? dorsal : '—'}
        </div>
      </div>

      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-base font-semibold leading-tight text-app line-clamp-1">
          {nombre || '—'}
        </h3>
        <p className="mt-0.5 md:mt-1 text-[11px] md:text-xs text-brand line-clamp-1">
          {posicion || rol || '—'}
        </p>
      </div>
    </div>
  );
}
