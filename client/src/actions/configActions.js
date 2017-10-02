export const UPDATE_CONFIG = 'UPDATE_CONFIG';
export function updateConfig(newConfigData) {
  return {
    type: 'UPDATE_CONFIG',
    newConfigData,
  };
}
