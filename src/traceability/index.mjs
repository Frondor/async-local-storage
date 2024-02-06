import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

/**
 * Se inicializa la instancia de AsyncLocalStorage donde guardamos el requestId
 * Esto ya se encarga de aplicar optimizaciones de memoria
 *
 * Podemos argumentar que no es necesario utilizar AsyncLocalStorage
 */
export const traceabilityStorage = new AsyncLocalStorage();

/**
 * El middleware de express encargado de generar el ID y guardarlo
 */
export const traceabilityMiddleware = (req, res, next) => {
  req.requestId = randomUUID({});

  traceabilityStorage.enterWith({
    requestId: req.requestId,
  });

  next();
};

/**
 * El interceptor de Axios que obtiene el contexto desde la instancia de AsyncLocalStorage
 * y lo utiliza para configurarle el header necesario a cada request, antes de que se ejecute
 */
export const interceptor = (config) => {
  const context = traceabilityStorage.getStore();

  if (!context?.requestId) {
    throw new Error('Missing traceability/middleware registration');
  }

  config.headers.set('X-Request-Id', context.requestId);

  return config;
};

/**
 * Helper para register el interceptor de forma elegante
 */
export const withTraceabilityInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(interceptor);
  return axiosInstance;
};
