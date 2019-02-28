import { Component, OnInit } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import {
  on as appOn,
  off as appOff,
  suspendEvent,
  resumeEvent,
  lowMemoryEvent,
  launchEvent,
  uncaughtErrorEvent,
  exitEvent,
  ApplicationEventData,
  android as appAndroid
  } from "tns-core-modules/application";

  declare var com: any;
declare var android: any;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: Array<Item>;
    static startNotificationInForegroundService(context, notification, notificationId) {
        const startForegroundIntent = new android.content.Intent(context, com.tns.ForegroundNotificationPlugin.class);
        startForegroundIntent.putExtra("notification", notification);
        startForegroundIntent.putExtra("notificationId", notificationId);
        startForegroundIntent.setAction("startForeground");
        context.startService(startForegroundIntent);
      }
    // This pattern makes use of Angular’s dependency injection implementation to
    // inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule,
    // defined in app.module.ts.
    constructor(private itemService: ItemService) { }

    ngOnInit(): void {
        this.unsubscribeAll();
        this.items = this.itemService.getItems();
        const intent = new android.content.Intent(appAndroid.context, com.tns.NativeScriptActivity.class);
        const resources = appAndroid.context.getResources();
        const pIntent = android.app.PendingIntent.getActivity(appAndroid.context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
        const smallIcon = resources.getIdentifier(
            "ic_stat_notify", "drawable", appAndroid.context.getApplicationInfo().packageName
          );
        // Build a notification.
        const builder = new android.app.Notification.Builder(appAndroid.context)
          .setContentTitle("TEST")
          .setContentText("TestConect")
          .setSmallIcon(smallIcon)
          .setOngoing(true) // cannot be cleared
          .setContentIntent(pIntent); // open the application when the notification is tapped
    
        if (android.os.Build.VERSION.SDK_INT >= 26 /* Oreo */) {
          const a: any = android;
          const b: any = builder;
          const channelId = "CHANNEL";
          const nm: any = appAndroid.context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
          const notificationChannel: any = nm.getNotificationChannel(channelId);
          if (notificationChannel === null) {
            const channel26: any = new a.app.NotificationChannel(
              channelId,
              "DUMMYVALUE",
              a.app.NotificationManager.IMPORTANCE_LOW
            );
            nm.createNotificationChannel(channel26);
          }
          b.setChannelId(channelId);
        } else {
          builder.setPriority(android.app.Notification.PRIORITY_DEFAULT);
        }
        const notification = builder.build();
        notification.flags |= android.app.Notification.FLAG_NO_CLEAR | android.app.Notification.FLAG_ONGOING_EVENT;
        ItemsComponent.startNotificationInForegroundService(appAndroid.context, notification, 1111);

    }
    private unsubscribeAll(): void {
      appOff(launchEvent);
      appOff(suspendEvent);
      appOff(resumeEvent);
      appOff(lowMemoryEvent);
      appOff(exitEvent);
      appOff(uncaughtErrorEvent);
    }

}
