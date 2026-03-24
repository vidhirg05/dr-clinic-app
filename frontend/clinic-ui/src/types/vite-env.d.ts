export {};

declare global {
  interface Window {
    api: {
      loginDoctor: (data: {
        identifier: string;
        password: string;
      }) => Promise<{
        success: boolean;
        doctor?: any;
        message?: string;}>;
      openResetWindow: () => void;
      openChangeWindow: () => void;
      closeApp: () => void;
      
      registerWithClinic: (data: any) => Promise<any>;

      expandWindow?: () => Promise<void>;
    };
  }
}
