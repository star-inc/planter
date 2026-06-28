interface NodeRow {
  id: number;
  name: string;
  description: string;
  httpVisible: number;
  httpStatus: number;
  httpUrl: string | null;
  parentId: number | null;
  typeId: number | null;
  typeName: string;
  typeDescription: string;
  typePriority: number;
}

export default defineEventHandler(async (event) => {
  const cloudflare = event.context.cloudflare;
  if (!cloudflare || !cloudflare.env) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudflare Workers environment is not available',
    });
  }

  const {DB, KV} = cloudflare.env;


  const stmt = DB.prepare(
      // eslint-disable-next-line max-len
      'SELECT nodes.id, nodes.name, nodes.description, nodes.httpVisible, nodes.httpStatus, nodes.httpUrl, nodeLinks.parentNodeId AS parentId, nodeTypes.id AS typeId, nodeTypes.name AS typeName, nodeTypes.description AS typeDescription, nodeTypes.priorityClass AS typePriority FROM nodes LEFT JOIN nodeLinks ON nodes.id = nodeLinks.childNodeId LEFT JOIN nodeTypes ON nodes.type = nodeTypes.id GROUP BY nodes.id',
  );

  const {results} = await stmt.all() as {results: NodeRow[]};
  const updatedAt = await KV.get('pingUpdatedAt');

  return {
    nodes: results.map((i: NodeRow) => ({
      name: i.name,
      description: i.description,
      typeId: i.typeId,
      linkId: i.id,
      httpStatus: i.httpStatus,
      httpUrl: i.httpVisible ? i.httpUrl : null,
    })),
    types: Object.fromEntries(
        results
            .filter((i: NodeRow) => i.typeId !== null)
            .map((i: NodeRow) => [
              i.typeId,
              {
                name: i.typeName,
                description: i.typeDescription,
                priority: i.typePriority,
              },
            ]),
    ),
    links: results
        .filter((i: NodeRow) => i.parentId !== null)
        .reduce((acc: Record<number, number[]>, j: NodeRow) => ({
          ...acc,
          [j.parentId as number]: [...(acc[j.parentId as number] || []), j.id],
        }), {}),
    updatedAt,
  };
});
