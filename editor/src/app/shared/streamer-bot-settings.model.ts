
export class StreamerBotSettings {
    public actions: ActionSettings;
}

export class ActionSettings {
    public queues: ActionQueue[];
    public actions: Action[];
}

export class ActionQueue {
    public id: string;
    public blocking: boolean;
    public name: string;
}

export class Action {
    public id: string;
    public queue: string;
    public enabled: boolean;
    public name: string;
    public group: string;
    public alwaysRun: boolean;
    public randomAction: boolean;
    public concurrent: boolean;

    public actions: SubAction[];
}

export class SubAction {
    public id: string;
    public index: number;
    public type: number;
    public value: any;
}