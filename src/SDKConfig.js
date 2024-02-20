let sdkConfig = {
    notificationService: null, 
  };
  
  export const initializeSDK = (config = {}) => {
    sdkConfig = { ...sdkConfig, ...config };
  };
  
  export const getSDKConfig = () => sdkConfig;