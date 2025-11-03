const stateManager = (() => {
  let isSleep = false;
  let isTimeout = false;
  let isRunning = false;
  let isExit = false;

  return {
    setIsSleep: (set = null) => {
      if (typeof set === "boolean") isSleep = set;
      return isSleep;
    },
    getIsSleep: () => isSleep,

    setIsTimeout: (set = null) => {
      if (typeof set === "boolean") isTimeout = set;
      return isTimeout;
    },
    getIsTimeout: () => isTimeout,

    setIsRunning: (set = null) => {
      if (typeof set === "boolean") isRunning = set;
      return isRunning;
    },
    getIsRunning: () => isRunning,

    setIsExit: (set = null) => {
      if (typeof set === "boolean") isExit = set;
      return isExit;
    },
    getIsExit: () => isExit,
  };
})();

export default stateManager;
