import {Component, EventEmitter, Input, Output, OnDestroy} from '@angular/core';

@Component({
    selector:'app-page-header1',
    templateUrl:'./pageHeader.components.html'
})
export class PageHeaderComponents implements OnDestroy{
    @Input() b1label;
    @Input() isShowHelp:boolean;
    @Output() eventPressed: EventEmitter<any> = new EventEmitter();
    @Output() helpPressed: EventEmitter<any> = new EventEmitter();
    constructor(){
    }
    buttonPressed(){
        this.eventPressed.emit();
    }
    buttonHelpPressed(){
        this.helpPressed.emit();
    }
    ngOnDestroy() {
    }

}

