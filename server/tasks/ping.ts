interface PingNode {
  id: number;
  httpUrl: string;
  healthzUrl: string | null;
  healthzPass: string | null;
  httpStatus: number;
}

interface CloudflareContext {
  env: {
    DB: {
      prepare: (sql: string) => {
        all: () => Promise<{results: PingNode[]}>;
      };
    };
    KV: {
      put: (key: string, value: string) => Promise<void>;
    };
  };
}

export default defineTask({
  meta: {
    name: 'ping',
    description: 'Ping all status nodes and update their status',
  },
  async run({context}) {
    const cloudflare = (context as {cloudflare?: CloudflareContext}).cloudflare;
    if (!cloudflare || !cloudflare.env) {
      console.error(
          'Cloudflare Workers context is not available in ping task',
      );
      return {
        result: 'error',
        message: 'Cloudflare Workers context is not available',
      };
    }

    const {DB, KV} = cloudflare.env;

    try {
      const stmt = DB.prepare(
          'SELECT id, httpUrl, healthzUrl, healthzPass, httpStatus FROM ' +
          'nodes',
      );
      const {results} = await stmt.all();

      await Promise.allSettled(
          results.map(async (node: PingNode) => {
            const targetUrl = node.healthzUrl || node.httpUrl;
            let httpStatus = 0;
            try {
              const headers: Record<string, string> = {
                'User-Agent': 'Planter/1.0',
              };
              if (node.healthzPass) {
                headers['X-Planter-Pass'] = node.healthzPass;
              }

              const res = await fetch(targetUrl, {
                headers,
                signal: AbortSignal.timeout(5000),
              });
              httpStatus = res.status;
            } catch (fetchErr) {
              console.error(
                  `Failed to ping node ${node.id} (${targetUrl}):`,
                  fetchErr,
              );
              httpStatus = 0;
            }

            if (httpStatus !== node.httpStatus) {
              const insertEventStmt = DB.prepare(
                  'INSERT INTO events (nodeId, previousStatus, ' +
                  'newStatus, createdAt) VALUES (?, ?, ?, ?)',
              ).bind(
                  node.id,
                  node.httpStatus,
                  httpStatus,
                  new Date().toISOString(),
              );
              await insertEventStmt.run();
            }

            const updateStmt = DB.prepare(
                'UPDATE nodes SET httpStatus = ? WHERE id = ?',
            ).bind(httpStatus, node.id);
            await updateStmt.run();
          }),
      );

      const updatedAt = new Date().toISOString();
      await KV.put('pingUpdatedAt', updatedAt);

      return {result: 'success', updatedAt};
    } catch (err) {
      console.error('Failed to run ping task:', err);
      return {
        result: 'error',
        message: (err as {message?: string}).message,
      };
    }
  },
});
