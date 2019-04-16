import { Component } from "@angular/core";
import { AppService } from "./app.service";
@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html"
})
export class AppComponent {
    constructor(private app: AppService) {}
}
