export default function GetNotificationName(status: string) {

    switch (status) {
        case "regular": {
            return 0
        }
        case "request": {
            return 1
        }
        case "group": {
            return 2
        }
        case "call": {
            return 3
        }
        case "video": {
            return 4
        }
        default: {
            return 0
        }
    }
}