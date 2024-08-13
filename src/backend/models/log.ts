/**
 * Interfaces
 */

export interface ILog {
  time: string;
  type: string;
  message: string;
}

/**
 * Metodos
 */

const createLog = (type: string, message: string): ILog => {
  return {
    time: new Date().toISOString(),
    type,
    message,
  };
};

export default { createLog };
