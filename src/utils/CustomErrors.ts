export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

export class GoogleMapsAPIError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GoogleMapsAPIError";
    }
}
