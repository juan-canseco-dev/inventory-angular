export interface Error {
  status: number;
  message: string;
  errors: ValidationError[] | null;
};

export interface ValidationError {
  field: string;
  message: string;
};
