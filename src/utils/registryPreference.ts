export type RegistryMode = 'shadcn' | 'amicro';

const PREF_KEY = 'amicro_cli_registry_pref';

export function getStoredRegistryMode(): RegistryMode {
  if (typeof window === 'undefined') return 'shadcn';
  try {
    const saved = localStorage.getItem(PREF_KEY);
    if (saved === 'amicro' || saved === 'shadcn') return saved;
  } catch {
    // fallback
  }
  return 'shadcn'; // Primary by default
}

export function setStoredRegistryMode(mode: RegistryMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREF_KEY, mode);
  } catch {
    // ignore
  }
}

export function formatCliCommand(
  kebabName: string,
  mode: RegistryMode = 'shadcn',
  options?: { directUrl?: boolean }
): string {
  const cleanName = kebabName.replace(/^@subhanhq\/amicro\//, '').replace(/^@amicro\//, '');
  
  if (mode === 'shadcn') {
    if (options?.directUrl) {
      return `npx shadcn@latest add https://amicro.vercel.app/r/${cleanName}.json`;
    }
    return `npx shadcn@latest add @amicro/${cleanName}`;
  }
  
  return `npx @subhanhq/amicro@latest add ${cleanName}`;
}
