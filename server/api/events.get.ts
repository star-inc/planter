import {defineEventHandler, createError} from 'h3';

interface EventRow {
  id: number;
  nodeId: number;
  nodeName: string;
  previousStatus: number;
  newStatus: number;
  createdAt: string;
}

interface CloudflareContext {
  env: {
    DB: {
      prepare: (sql: string) => {
        all: () => Promise<{results: EventRow[]}>;
      };
    };
  };
}

export default defineEventHandler(async (event) => {
  const cloudflare = event.context.cloudflare as unknown as
    CloudflareContext | undefined;
  if (!cloudflare || !cloudflare.env) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudflare Workers environment is not available',
    });
  }

  const {DB} = cloudflare.env;

  const stmt = DB.prepare(
      'SELECT events.id, events.nodeId, nodes.name AS nodeName, ' +
      'events.previousStatus, events.newStatus, events.createdAt ' +
      'FROM events ' +
      'JOIN nodes ON events.nodeId = nodes.id ' +
      'ORDER BY events.createdAt DESC LIMIT 50',
  );

  const {results} = await stmt.all() as {results: EventRow[]};

  return {
    events: results,
  };
});
