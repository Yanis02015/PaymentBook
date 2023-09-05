export interface ExpressException extends Error {
  statusCode?: number; // Propriété pour le statut HTTP
}
