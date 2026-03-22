export type Result<T> =
  | { success: true; value: T }
  | { success: false; error: string };

export const success = <T>(value: T): Result<T> => ({ success: true, value });
export const fail = <T>(error: string): Result<T> => ({
  success: false,
  error,
});
