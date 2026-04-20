import { EventEmitter } from "events";

// A global singleton event emitter to handle SSE broadcasts in the serverless environment
const globalForEvents = global as unknown as { eventEmitter: EventEmitter };

export const eventEmitter = globalForEvents.eventEmitter || new EventEmitter();

if (process.env.NODE_ENV !== "production")
  globalForEvents.eventEmitter = eventEmitter;

// Define our event constants
export const EVENTS = {
  TRANSACTION_CREATED: "transaction_created",
  TRANSACTION_UPDATED: "transaction_updated",
};
