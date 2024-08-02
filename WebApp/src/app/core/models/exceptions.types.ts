export class AppError extends Error {
    constructor(public override message: string) {
        super(message)
    }
}

export class BadInput extends AppError { }

export class MissingKey extends AppError {
    constructor(key?: string) { super(`Key ${'"' + key + '"'} not found in translation file`) }
}

export class NotFoundError extends AppError { }

export class ConflictError extends AppError { }

export class UnauthorizedError extends AppError { }

