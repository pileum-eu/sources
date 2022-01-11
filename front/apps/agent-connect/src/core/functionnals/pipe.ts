export const pipe = (...functions: any[]) =>
  functions.reduce(
    (previous, next) =>
      (...args: any) =>
        next(previous(...args)),
  );
