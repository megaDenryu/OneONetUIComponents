import { DocumentBody, HtmlComponentBase } from "SengenUI/index";




export interface IWindow開閉破棄 {
    get state(): "open" | "closed";
    open(): void;
    close(): void;
    toggle(): void;
    isOpen(): boolean;
    get view():HtmlComponentBase;
}

//具体的なウインドウの型をもっておくべきなのか疑問。UIComponentBaseの配列のほうが良いかも。
export interface IWindowRipository {
    addWindow(window:IWindow開閉破棄):void;
    addUIComponentBase(window:HtmlComponentBase):void;
}
export class WindowRipository implements IWindowRipository{
    // private _appPageSettingBoard: AppPageSettingBoard;
    // private _characterSettingViews:CharacterSettingView2Base<any>[] = []
    windows:IWindow開閉破棄[] = [];
    public constructor(){
    }
    public addWindow(window:IWindow開閉破棄){
        this.windows.push(window)
        DocumentBody().child(window.view);
    }

    public addUIComponentBase(window:HtmlComponentBase){
        DocumentBody().child(window);
    }
    // public addCharacterSettingView2Base(characterSettingView:CharacterSettingView2Base<any>){
    //     this._characterSettingViews.push(characterSettingView)
    //     DocumentBody().child(characterSettingView)
    // }
}
