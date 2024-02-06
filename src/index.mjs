import createApp from 'express';
import todosService from './services/todos.mjs';
import { traceabilityMiddleware } from './traceability/index.mjs';

const app = createApp();

app.use(traceabilityMiddleware);

app.get('/', async (req, res) => {
  const [reqA, reqB] = await Promise.all([todosService.fetchTodo(1), todosService.fetchTodo(2)]);

  res.json({
    headers: {
      reqA: reqA.config.headers,
      reqB: reqB.config.headers,
    },
  });
});

app.listen(8081, () => {
  console.log('Server ready on http://localhost:8081');
});
