import { ButtonC, ButtonOptions, LV2HtmlComponentBase } from "SengenUI/index";



export class StateName {
    constructor(public name: string) {}
    equals(other: StateName): boolean {
        return this.name === other.name;
    }
}

export interface I循環ボタンState {
    name?: StateName;
    options: ButtonOptions;
    toNext? : () => void;
}

export class 循環ボタンState implements I循環ボタンState {
    public readonly options: ButtonOptions;
    public readonly name?: StateName;
    public readonly toNext?: () => void;

    constructor(seed: I循環ボタンState) {
        this.name = seed.name;
        this.options = seed.options;
        this.toNext = seed.toNext;
    }
}

export interface I循環ボタンSeed {
    initStateName?: StateName;
    state: 循環ボタンState[]
}

export class 循環ボタンSeed implements I循環ボタンSeed {
    public readonly initStateName?: StateName;
    public readonly state: 循環ボタンState[];

    constructor(seed: I循環ボタンSeed) {
        this.initStateName = seed.initStateName;
        this.state = seed.state;
    }

    public get 初期index(): number {
        if (this.initStateName) {
            const initStateName = this.initStateName;
            const index = this.state.findIndex(state => state.name?.equals(initStateName));
            if (index == -1) { console.warn("循環ボタンの初期状態が見つかりませんでした", initStateName); return 0; }
            return index;
        }
        return 0;
    }

    public get 状態数(): number {return this.state.length;}
}


export class 循環ボタンC extends LV2HtmlComponentBase {
    protected _componentRoot: ButtonC;
    private readonly _seed: 循環ボタンSeed;
    private _現在index: number = 0;


    constructor(seed: 循環ボタンSeed) {
        super();
        this._seed = seed;
        this._componentRoot = this.createComponentRoot();
        this._現在index = seed.初期index;
        this._componentRoot.addClass(this._seed.state[this._現在index].options.class || []);
        this._componentRoot.setTextContent(this._seed.state[this._現在index].options.text || "");
        

    }

    protected createComponentRoot(): ButtonC {
        return new ButtonC().addTypedEventListener("click", (event) => this.toNext())
    }

    private toNext(): void {
        const currentState = this._seed.state[this._現在index];
        currentState.toNext?.();
        this._現在index = (this._現在index + 1) % this._seed.状態数;
        // 状態を更新
        const nextState = this._seed.state[this._現在index];
        this._componentRoot.removeClass(currentState.options.class || []);
        this._componentRoot.addClass(nextState.options.class || []);
        this._componentRoot.setTextContent(nextState.options.text || "");
    }

}
