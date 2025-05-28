declare module 'botframework-webchat' {
  export interface WebChatOptions {
    directLine: {
      token: string;
    };
    styleOptions?: {
      hideUploadButton?: boolean;
      botAvatarInitials?: string;
      userAvatarInitials?: string;
      backgroundColor?: string;
      bubbleBackground?: string;
      bubbleTextColor?: string;
      bubbleFromUserBackground?: string;
      bubbleFromUserTextColor?: string;
    };
    userID?: string;
    username?: string;
  }

  export const WebChat: {
    renderWebChat: (options: WebChatOptions, element: HTMLElement) => void;
  };
} 