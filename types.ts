export interface DesignStyle {
  id: string;
  name: string;
  prompt: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  image?: string; // Optional generated image URL associated with the message
}

export interface GeneratedImage {
  url: string; // Base64 data URL
  style: string;
  prompt: string;
}
