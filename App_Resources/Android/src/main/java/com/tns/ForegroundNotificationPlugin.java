package com.tns;

import android.os.IBinder;
import android.content.Intent;
import android.content.Context;
import android.app.Notification;
import android.app.Service;

public class ForegroundNotificationPlugin extends Service {
    private static final String ACTION_START = "startForeground";
    private static final String ACTION_DETACH = "detachNotification";

    public ForegroundNotificationPlugin() {
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Let it continue running until it is stopped.
        final String action = intent.getAction();
        if (intent != null) {
            if (ACTION_START.equals(action)) {
                Notification notification = (Notification) intent.getParcelableExtra("notification");
                int notificationId = intent.getIntExtra("notificationId", -1);
                this.startForeground(notificationId, notification);
            } else if (ACTION_DETACH.equals(action)) {
                this.stopForeground(STOP_FOREGROUND_DETACH);
            }
        }
        return START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        this.stopForeground(true);
    }

    @Override
    public IBinder onBind(Intent intent) {
        // TODO: Return the communication channel to the service.
        return null;
    }
}
