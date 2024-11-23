
import { Box, Stack, Typography } from "@mui/material";
import { Search } from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
import { iConversationClusterProps, iuserStore } from "../../Constants/Types/CommonTypes";
import { useAppSelector } from "../../Hooks/storeHooks";
import { UserState } from "../../Store/Slices/userSlice";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ChatIcon from '@mui/icons-material/Chat';
interface iCustomProps {
    item: iConversationClusterProps[],
    func: (arg: iConversationClusterProps[]) => void,
    refresh: () => void,
    category: string
}
export default function ProfileHeader({ item, func, refresh, category }: iCustomProps) {
    const [value, setValue] = useState<string>('');
    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);

    const filterSearch = () => {
        if (item.length <= 0) return
        if (!value) return

        var payload = [];

        if (category === "Chats") {
            payload = filterArray(item);
        } else {
            payload = filterArrayGroup(item);
        }

        if (payload.length <= 0) return;

        func([...payload]);
    }

    const filterArray = (item: iConversationClusterProps[]) => {
        const payload: iConversationClusterProps[] = [];

        item.forEach((arr) => {
            arr.participants.forEach((part) => {
                if (part.name.toLowerCase().includes(value) && part.id != user.value.id) {
                    payload.push(arr);
                }
            })
        });

        return payload;
    }

    const filterArrayGroup = (item: iConversationClusterProps[]) => {
        const payload: iConversationClusterProps[] = [];

        item.forEach((arr) => {
            if (arr.groupname && arr.groupname.toLowerCase().includes(value)) {
                payload.push(arr);
            }
        });

        return payload;
    }


    return (
        <Stack direction="column" >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingX: '1rem', paddingY: '0.5rem' }}>
                <Typography variant="h6">{category}</Typography>
                {category === "Chats" ? <ChatIcon sx={{ color: 'gray' }} /> : <GroupAddIcon sx={{ color: 'gray' }} />}
            </Box>
            <Box sx={{ width: "100%", maxWidth: '100%' }}>
                <Search
                    placeholder="Search..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            filterSearch();
                        }
                    }}
                    onChange={(e) => setValue(e)}
                    onClearClick={() => {
                        setValue("");
                        refresh();
                    }} />
            </Box>
        </Stack>
    );
}