import { useCallback, useState } from "react";
import { iDisplayMessageTypes } from "../Constants/Types/CommonTypes";
export default function useDisplayMessage() {
    const [displayInfo, setDisInfo] = useState<iDisplayMessageTypes>({
        hasError: false,
        error: "",
        hasMsj: false,
        msj: "",
        hasNotification: false,
        notification: "",
        isLoading: false,
    })

    const setDisplayInfo = useCallback((obj: iDisplayMessageTypes) => {
        setDisInfo((ob) => {
            ob = obj;
            return ob;
        });
    }, []);

    return {
        displayInfo,
        setDisplayInfo
    }
}