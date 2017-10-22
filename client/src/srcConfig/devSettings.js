export const productionMode = true;
export const isOnboardingActive = true;
export const modalType = productionMode ? 'WELCOME' : 'WELCOME';
const renderModal = false;
export const renderFormModal = productionMode ? false : (isOnboardingActive || renderModal);
export const showProgressBar = true || false;
export const isDevOnboardingActive = isOnboardingActive;
