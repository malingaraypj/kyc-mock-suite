/// <reference types="vite/client" />

interface Window {
  ethereum?: any;
}

declare module '*.json' {
  const value: any;
  export default value;
}
