'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const SecurityView: React.FC = () => (
  <section className="space-y-4">
    <h2 className="text-xl font-bold text-white">Seguridad</h2>
    <p className="text-sm text-slate-400">
      Información sobre los controles de seguridad del sistema. Esta página no
      verifica automáticamente su configuración ni garantiza su funcionamiento.
    </p>
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-200">
      <h3 className="flex items-center gap-2 font-semibold">
        <ShieldCheck className="h-5 w-5 text-sky-400" /> Controles y responsabilidades
      </h3>
      <ul className="mt-4 space-y-3 text-sm leading-relaxed">
        <li><strong>Acceso:</strong> Supabase Auth verifica las credenciales de cada cuenta.</li>
        <li><strong>Roles:</strong> administrador y bombero operativo tienen permisos diferentes, controlados mediante políticas de Supabase.</li>
        <li><strong>Auditoría:</strong> registra cambios operativos desde su instalación; no incluye inicios de sesión ni cambios anteriores.</li>
        <li><strong>Conexión:</strong> el intercambio con Supabase está cifrado en tránsito cuando se utiliza una URL HTTPS.</li>
        <li><strong>Respaldos:</strong> deben configurarse y verificarse por separado, incluida la prueba de restauración.</li>
        <li><strong>Claves:</strong> no comparta contraseñas ni claves secretas; nunca las coloque en código accesible desde el navegador.</li>
      </ul>
    </div>
  </section>
);
