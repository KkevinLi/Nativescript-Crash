import {
  on as appOn,
  off as appOff,
  suspendEvent,
  resumeEvent,
  launchEvent,
  lowMemoryEvent,
  exitEvent,
  ApplicationEventData,
  AndroidApplication,
  android as appAndroid
} from "tns-core-modules/application";
import { Injectable } from "@angular/core";
import { isAndroid, isIOS } from "tns-core-modules/platform";

declare var com: any;
declare var android: any;

let launchListener;
let suspendListener;
let resumeListener;
let exitListener;
let lowMemoryListener;

@Injectable({ providedIn: "root" })
export class AppService {

  static startNotificationInForegroundService(context, notification, notificationId) {
    const startForegroundIntent = new android.content.Intent(context, com.tns.ForegroundNotificationPlugin.class);
    startForegroundIntent.putExtra("notification", notification);
    startForegroundIntent.putExtra("notificationId", notificationId);
    startForegroundIntent.setAction("startForeground");
    context.startService(startForegroundIntent);
  }

  constructor() {
    console.log("Starting app service");
    this.subscribeHooks();
    this.buildNotifiction();
  }

  private subscribeHooks() {
    launchListener = appOn(launchEvent, (args) => {
      if (args.android) {
        // For Android applications, args.android is an android.content.Intent class.
        console.log("Launched Android application with the following intent: " + args.android + ".");
      } else if (args.ios !== undefined) {
        // For iOS applications, args.ios is NSDictionary (launchOptions).
        console.log("Launched iOS application with options: " + args.ios);
      }
    });

    suspendListener = appOn(suspendEvent, (eventData: ApplicationEventData) => {
      if (eventData.android) {
        // For Android applications, eventData.android is an android activity class.
      } else if (eventData.ios) {
        // For iOS applications, eventData.ios is UIApplication.
      }
    });

    resumeListener = appOn(resumeEvent, (eventData: ApplicationEventData) => {
      if (eventData.android) {
        // For Android applications, eventData.android is an android activity class.
      } else if (eventData.ios) {
        // For iOS applications, eventData.ios is UIApplication.
      }
    });

    lowMemoryListener = appOn(lowMemoryEvent, (eventData: ApplicationEventData) => {
      if (eventData.android) {
        // For Android applications, eventData.android is an android activity class.
      } else if (eventData.ios) {
        // For iOS applications, eventData.ios is UIApplication.

      }
    });

    exitListener = appOn(exitEvent, (eventData: any) => {

      if (eventData.android) {
        const intent = new android.content.Intent(appAndroid.context, com.tns.ForegroundNotificationPlugin.class);
        appAndroid.context.stopService(intent);
      } else if (eventData.ios) {
      }
      this.unsubscribeAll();
    });
  }
  private unsubscribeAll(): void {
    appOff(launchEvent, launchListener);
    appOff(suspendEvent, suspendListener);
    appOff(resumeEvent, resumeListener);
    appOff(lowMemoryEvent, lowMemoryListener);
    appOff(exitEvent, exitListener);
  }

  private buildNotifiction() {
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
    AppService.startNotificationInForegroundService(appAndroid.context, notification, 1111);
  }
}
