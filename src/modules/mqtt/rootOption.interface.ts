export interface TopicHandler {
  topic: string;
  handler?: (message: string) => void;
}

export interface RootOption {
  connection: string;
  topics: TopicHandler[];
}
