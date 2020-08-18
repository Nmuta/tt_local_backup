export class GetUser {
    static readonly type = '[User] Get User';
    constructor() {}
}

export class ResetUserProfile {
    static readonly type = '[User] Reset User Profile';
    constructor() {}
}

export class SetNoUserProfile {
    static readonly type = '[User] Set No User Profile';
    constructor() {}
}

export class RequestAccessToken {
    static readonly type = '[User] Request Access Token';
    constructor() {}
}

export class ResetAccessToken {
    static readonly type = '[User] Reset Access Token';
    constructor() {}
}