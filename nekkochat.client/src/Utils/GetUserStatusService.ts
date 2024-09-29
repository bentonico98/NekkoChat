export default function GetUserStatusService(status:number) {
    switch (status) {
        case 0: {
            return "available"
        }
        case 1: {
            return "unavailable"
        }
        case 2: {
            return "dnd"
        }
        case 3: {
            return "invisible"
        }
        case 4: {
            return "eager"
        }
        default: {
            return "unavailable"
        }
    }
}