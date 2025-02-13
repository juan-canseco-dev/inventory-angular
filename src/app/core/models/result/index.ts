class Failure {
    static None = new Failure("None");
    static NullValue = new Failure("NullValue");
  
    constructor(public message: string) {}
  };

  class Result<TValue> {
    private readonly _status: string;
    private readonly _value?: TValue;
    private readonly _failure?: Failure;

    protected constructor(status : string, value: TValue | undefined, failure: Failure | undefined) {
      this._status = status;
      this._value = value;
      this._failure = failure;
    }

    static loading<TValue>() : Result<TValue> {
      return new Result<TValue>('loading', undefined, undefined);
    }

    static success<TValue>(value : TValue) : Result<TValue> {
      return new Result<TValue>('success', value, undefined);
    }

    static failure<TValue>(failure: Failure) : Result<TValue> {
      return new Result<TValue>('failure', undefined, failure);
    }

    public get status() : string {
      return this._status;
    }

    public get failure() {
      return this._failure!;
    }

    public get value() {
      return this._value!;
    }
  }
  
  export { Result, Failure };