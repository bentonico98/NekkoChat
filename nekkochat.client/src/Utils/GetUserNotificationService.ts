export default function GetUserNotificationService(status: number | undefined) {

    switch (status) {
        case 0: {
            return "regular"
        }
        case 1: {
            return "request"
        }
        case 2: {
            return "group"
        }
        case 3: {
            return "call"
        }
        case 4: {
            return "video"
        }
        default: {
            return "regular"
        }
    }
}