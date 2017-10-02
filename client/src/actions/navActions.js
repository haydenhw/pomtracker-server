export const CHANGE_ACTIVE_LINK = 'CHANGE_ACTIVE_LINK';
export function changeActiveLink(activeLink) {
  return {
    type: 'CHANGE_ACTIVE_LINK',
    activeLink,
  };
}
