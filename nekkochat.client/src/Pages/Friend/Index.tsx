import { Button, Col, Container, Row } from "react-bootstrap";

import { Search } from "@chatscope/chat-ui-kit-react";
import FriendButton from "../Shared/FriendButton";
//import useSearchUserByName from "../../Hooks/useSearchUserByName";
import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";
import { iuserStore, iUserViewModel } from "../../Constants/Types/CommonTypes";
import { toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification, UserState } from "../../Store/Slices/userSlice";
import useGetUserFriendList from "../../Hooks/Friends/useGetUserFriendList";
import useSearchUserByName from "../../Hooks/useSearchUserByName";
import useDisplayMessage from "../../Hooks/useDisplayMessage";
import { useEffect } from "react";
import RegularSkeleton from "../Shared/Skeletons/RegularSkeleton";
export default function Index() {
    const dispatch = useAppDispatch();

    const { displayInfo, setDisplayInfo } = useDisplayMessage();

    useEffect(() => {
        if (displayInfo.hasError) {
            dispatch(toggleErrorModal({ status: true, message: displayInfo.error }));
        }
        if (displayInfo.hasMsj) {
            dispatch(toggleMsjModal({ status: true, message: displayInfo.msj }));
        }
        if (displayInfo.hasNotification) {
            dispatch(toggleNotification({ status: true, message: displayInfo.notification }));
        }
        dispatch(toggleLoading(displayInfo.isLoading));

    }, [displayInfo]);

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);

    const {
        friend,
        friendRequest,
        value,
        setValue } = useGetUserFriendList(user.value.id, setDisplayInfo);

    const {
        searchFriends,
        searchFromList,
        resetSearch } = useSearchUserByName(user.value.id, setDisplayInfo);

    return (
        <Container className="h-100"  >
            <h1>Friends List</h1>
            <br />
            <Container>
                <Row>
                    <Col xs={10}>
                        <Search placeholder="Search..." onChange={(e) => setValue(e)} onClearClick={() => { setValue(""); resetSearch(); }} />
                    </Col>
                    <Col>
                        <Button variant="primary" onClick={() => { searchFromList(value, friend); }} >Search</Button>
                    </Col>
                </Row>
            </Container>
            <Row style={{ overflowY: "auto", overflowX: "hidden" }}>
                {friendRequest.length > 0 && <div>
                    <h3>Pending Friend Requests</h3>
                    {friendRequest.map((el: iUserViewModel, idx: number) => {
                        return <Col xs={4} key={idx}>
                            <FriendButton
                                key={idx}
                                name={el.userName}
                                id={el.id}
                                idx={idx}
                                item={el}
                                DisplayMessage={setDisplayInfo} />
                        </Col>
                    })}
                    <hr />
                </div>}

                {searchFriends.length > 0 && <div>
                    <h5>Search Results</h5>
                    {searchFriends.map((el: iUserViewModel, idx: number) => {
                        return <Col xs={4} key={idx}>
                            <FriendButton
                                key={idx}
                                name={el.userName}
                                id={el.id}
                                idx={idx}
                                item={el}
                                DisplayMessage={setDisplayInfo} />
                        </Col>
                    })}
                    <hr />

                </div>}

                <h5>My Friends</h5>
                {friend.length > 0 ? friend.map((el: iUserViewModel, idx: number) => {
                    return <Col xs={4} key={idx}>
                        <FriendButton
                            key={idx}
                            name={el.userName}
                            id={el.id}
                            idx={idx}
                            item={el}
                            DisplayMessage={setDisplayInfo} />
                    </Col>
                })
                    :
                <RegularSkeleton />}
            </Row>

        </Container>
    );
}