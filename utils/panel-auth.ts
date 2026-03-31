import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';

export const panelCookieName = 'portfolio-panel-session';

export function getPanelPassword() {
  return process.env.CMS_PANEL_PASSWORD?.trim() ?? '';
}

function getPanelSessionSecret() {
  return process.env.PANEL_SESSION_SECRET?.trim() || getPanelPassword();
}

export function createPanelSessionToken(password = getPanelPassword()) {
  return createHash('sha256').update(`${password}:${getPanelSessionSecret()}`).digest('hex');
}

export function isPanelPasswordEnabled() {
  return getPanelPassword().length > 0;
}

export async function isPanelAuthenticated() {
  const expectedPassword = getPanelPassword();

  if (!expectedPassword) {
    return true;
  }

  const cookieStore = await cookies();
  return cookieStore.get(panelCookieName)?.value === createPanelSessionToken(expectedPassword);
}
