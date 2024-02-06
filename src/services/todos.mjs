import axios from 'axios';
import { withTraceabilityInterceptor } from '../traceability/index.mjs';
import { withMockedRequestDelay } from '../helpers.mjs';

const restClient = withTraceabilityInterceptor(
  withMockedRequestDelay(
    axios.create({
      baseURL: 'https://jsonplaceholder.typicode.com',
    })
  )
);

const fetchTodo = (id) => restClient.get(`/todos/${id}`);

export default {
  fetchTodo,
};
