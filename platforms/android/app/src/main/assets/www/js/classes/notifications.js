class Notifications extends User {
    constructor(notifications, name, email, status, modules, socket) {
        super(name, email, status, modules, socket);

        this.all_notifications = notifications;

        if (typeof notifications !== "string") {
            let unopened_notifications_counter = 0;
            for (let i = 0; i < this.all_notifications.length; i++) {
                if (!this.all_notifications[i]["notification_opened"]) {
                    unopened_notifications_counter++;
                }
            }

            this.total_notifications = this.all_notifications.length;
            this.unread_notifications = unopened_notifications_counter;
        } else {
            this.total_notifications = 0;
            this.unread_notifications = 0;
        }

        console.log(this.all_notifications);
    }

    addToTotalNotifications() {
        this.total_notifications++;
    }

    setTotalNotifications(total_notifications) {
        this.total_notifications = total_notifications;
    }

    getTotalNotifications() {
        return this.total_notifications;
    }

    setUnreadNotifications(unread_notifications) {
        this.unread_notifications = unread_notifications;
    }
    subtractUnreadNotifications() {
        if (this.unread_notifications != 0) {
            this.unread_notifications--;

            if (this.unread_notifications == 0) {
                document.getElementById("new_notifications").remove();
            } else {
                document.getElementById("new_notifications").innerText = this.unread_notifications;
            }
        }
    }

    getUnreadNotifications() {
        return this.unread_notifications;
    }

    addUnreadNotifications() {
        this.unread_notifications++;

        if (this.unread_notifications == 1) {
            this.addUnreadNotificationsToDOM();
        }

        document.getElementById("new_notifications").innerText = this.unread_notifications;
    }

    setAllNotifications(all_notifications) {
        this.all_notifications = all_notifications;
    }

    getAllNotifications() {
        return this.all_notifications;
    }

    setUnreadNotifications(unread_notifications) {
        this.unread_notifications = unread_notifications;
    }

    getUnreadNotifications() {
        return this.notifications;
    }

    getNotificationDetailsById(id) {
        for (let i = 0; i < this.all_notifications.length; i++) {
            if (this.all_notifications[i]._id == id) {
                return this.all_notifications[i];
            }
        }
    }

    updateNotification(notification, id) {
        for (let i = 0; i < this.all_notifications.length; i++) {
            if (this.all_notifications[i]._id == id) {

                this.all_notifications[i] = notification;
                return "Update successfull";
            }
        }
    }

    addToNotifications(notification) {
        console.log(this.all_notifications)
        if (this.all_notifications == "There are no notifications to display!") {
            this.all_notifications = [notification];
        } else {
            this.all_notifications.push(notification);
        }

        this.addToTotalNotifications();
        console.log(this.all_notifications)

        if (document.getElementById('list') != null) {
            document.getElementById("notifications_header").innerText = "NOTIFICATIONS";

            this.addUnreadNotifications();
            const el = document.createElement('ion-list');
            el.classList.add('ion-activatable', 'ripple', 'not_read');
            el.innerHTML = `
                
                <ion-item lines="none" class="notification" notification_id="${notification._id}" post_id="${notification.post_id}" notification_tags="${notification.notification_tags.join(', ')}">
          <ion-avatar slot="start">
            <img src="${notification.notification_avatar}">
        </ion-avatar>
        <ion-label>
            <h2>${notification.notification_title}</h2>
            <span>${notification.notification_posted_on}</span>
            <p>${notification.notification_desc_trunc}</p>
        </ion-label>
            </ion-item>
            <ion-ripple-effect></ion-ripple-effect>
            
        `;
            document.getElementById('list').appendChild(el);
        } else {
            this.addUnreadNotifications();
        }

    }

    addUnreadNotificationsToDOM() {
        if (!this.unread_notifications == 0) {

            let notifications_icon = document.querySelector("[name='notifications']");

            let notification_badge = document.createElement("ion-badge");
            notification_badge.color = "danger";
            notification_badge.id = "new_notifications";
            notification_badge.innerText = this.unread_notifications;


            notification_badge.appendAfter(notifications_icon);
        } else {
            return "No new notifications!"
        }
    }

    sendNewNotification(notification) {
        this.socket.emit('send_notification', notification);
    }

    waitForNewNotifications() {
        let socket = this.socket;

        socket.on('new_notification', (data) => {
            this.addToNotifications(data.response);
            console.log(data);
        });

        socket.on('news', function (data) {
            console.log(data);
        });
    }
}