import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
        try {
            await Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        } catch (error) {
            console.error("Failed to create notification channel:", error);
        }
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            throw new Error(
                "Push notification permissions are required. Please enable them in your device settings."
            );
        }

        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ||
            Constants?.easConfig?.projectId;

        if (!projectId) {
            throw new Error(
                "Project ID not found in Expo configuration. Ensure it is correctly set."
            );
        }

        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;

            if (__DEV__) {
                console.log("Expo Push Token:", pushTokenString);
            }

            return pushTokenString;
        } catch (error) {
            console.error("Error getting push token:", error);
            throw new Error(
                "Failed to retrieve push token. Ensure your project is configured correctly."
            );
        }
    } else {
        throw new Error(
            "Push notifications can only be tested on a physical device, not on a simulator or emulator."
        );
    }
}
