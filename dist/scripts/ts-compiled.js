var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Empty file to enforce TypeScript compilation in Gulp to use this path as the base path for each component. 
System.register("components/angulartest/app.component", ['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'angulartest',
                        template: '<h1>Angular 2 here!</h1>'
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
System.register("components/angulartest/main", ['angular2/platform/browser', "components/angulartest/app.component"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var browser_1, app_component_1;
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            }],
        execute: function() {
            browser_1.bootstrap(app_component_1.AppComponent);
        }
    }
});
System.register("components/quickquote-dip/app.component", ['angular2/core'], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var core_2;
    var AppComponent;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            }],
        execute: function() {
            //import {InputMoney} from './input-money.ts';
            AppComponent = (function () {
                function AppComponent() {
                }
                AppComponent = __decorate([
                    core_2.Component({
                        selector: 'aegon-quickquote-dip',
                        //directives: [InputMoney],
                        template: "\n<div class=\"quickquote lijfrente sparen\">\n    <div class=\"triangle\"></div>\n    <div class=\"calculation\">\n        <h3>Bereken direct uw pensioenuitkering</h3>\n        Beschikbaar pensioenkapitaal\n        <input type=\"text\">\n        <!--input-money currency=\"\u20AC\" ([ngModel])=\"availableMoney\"></input-money-->\n        <div *ngIf=\"step >= 2\">\n            Stap 2!\n        </div>\n        <div *ngIf=\"step >= 3\">\n            Stap 3!\n        </div>\n        <div *ngIf=\"step >= 4\">\n            Stap 4!\n        </div>\n        <div *ngIf=\"step >= 5\">\n            OMG So Many Steps ({{step}})!!!\n        </div>\n        <button class=\"button arrow\" (click)=\"step = step + 1 || 2\">\n            Volgende\n        </button>\n        \n    </div>\n</div>\n"
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_3("AppComponent", AppComponent);
        }
    }
});
System.register("components/quickquote-dip/main", ['angular2/platform/browser', "components/quickquote-dip/app.component"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var browser_2, app_component_2;
    return {
        setters:[
            function (browser_2_1) {
                browser_2 = browser_2_1;
            },
            function (app_component_2_1) {
                app_component_2 = app_component_2_1;
            }],
        execute: function() {
            browser_2.bootstrap(app_component_2.AppComponent);
        }
    }
});
