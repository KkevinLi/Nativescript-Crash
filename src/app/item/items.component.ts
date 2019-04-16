import { Component, OnInit, OnDestroy } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import { AppService } from "../app.service";

@Component({
  selector: "ns-items",
  moduleId: module.id,
  templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit, OnDestroy {
  items: Array<Item>;

  // This pattern makes use of Angular’s dependency injection implementation to
  // inject an instance of the ItemService service into this class.
  // Angular knows about this service because it is included in your app’s main NgModule,
  // defined in app.module.ts.
  constructor(private itemService: ItemService) { }

  ngOnDestroy() {
    console.log("ON DESTROY");
  }

  ngOnInit(): void {
    // This causes the error after I relaunch the app...


    this.items = this.itemService.getItems();
  }

}
