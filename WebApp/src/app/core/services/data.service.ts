import { BadInput, ConflictError, AppError, UnauthorizedError, NotFoundError } from "src/app/core/models/exceptions.types";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { throwError } from "rxjs";

export class DataService {
    protected http = inject(HttpClient)

    constructor(
        protected url: string
    ) { }

    protected handleError(error: HttpErrorResponse) {
        if (error.status === 400)
            return throwError(() => new BadInput(error.error));

        if (error.status === 404)
            return throwError(() => new NotFoundError(error.error));
        if (error.status === 409)
            return throwError(() => new ConflictError(error.error));

        if (error.status === 401)
            return throwError(() => new UnauthorizedError(error.error));


        return throwError(() => new AppError(error.error));
    }
}