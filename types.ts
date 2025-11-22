export interface PromptResult {
  id: string;
  originalInput: string;
  generatedPrompt: string;
  timestamp: number;
}

export interface GenerateResponse {
  text: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}