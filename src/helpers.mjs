function mockedRequestDelay(config) {
  return new Promise((res) => {
    setTimeout(() => {
      res(config);
    }, 1500);
  });
}

export const withMockedRequestDelay = (axiosInstance) => {
  axiosInstance.interceptors.request.use(mockedRequestDelay);
  return axiosInstance;
};
