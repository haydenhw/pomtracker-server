export const productionMode = false;
export const isOnboardingActive = true;
export const modalType = productionMode ? 'WELCOME' : 'ADD_TASKS';
const renderModal = false;
export const renderFormModal = productionMode ? false : (isOnboardingActive || renderModal);
export const showProgressBar = true || false;
export const isDevOnboardingActive = isOnboardingActive;
