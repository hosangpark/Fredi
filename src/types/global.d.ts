export {};

declare global {
  interface Window {
    IMP: any;
    ReactNativeWebView: { postMessage };
    history: any;
    Kakao: any;
  }

  interface Document {
    ReactNativeWebView: { postMessage };
  }
}
