// Singleton to hold the io instance
let io = null;

export const setIO = (ioInstance) => {
  io = ioInstance;
};

export { io };