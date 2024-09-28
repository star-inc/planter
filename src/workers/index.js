import { AutoRouter } from 'itty-router';

const router = AutoRouter();

router
  .get('/states/:id', ({id}) => {
	return id;
  });

export default router;
