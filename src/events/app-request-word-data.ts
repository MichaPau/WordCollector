export type AppRequestWordDataEvent = CustomEvent<{ table: string, word_id: number }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'app-request-word-data': AppRequestWordDataEvent;
  }
}