import { Button, Col, Container, Row } from "react-bootstrap";

import { Search } from "@chatscope/chat-ui-kit-react";
import FriendButton from "../Shared/FriendButton";
//import useSearchUserByName from "../../Hooks/useSearchUserByName";
import useGetUserFriendList from "../../Hooks/Friends/useGetUserFriendList";
import { useAppSelector } from "../../Hooks/storeHooks";
import { iuserStore, iUserViewModel } from "../../Constants/Types/CommonTypes";
import { UserState } from "../../Store/Slices/userSlice";
import useSearchUserByName from "../../Hooks/useSearchUserByName";
export default function Index() {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);
    const { friend, value, setValue } = useGetUserFriendList(user.value.id);
    const { searchFriends, searchFromList, resetSearch } = useSearchUserByName();

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
                        <Button variant="primary" onClick={() => { searchFromList(value, friend); } } >Search</Button>
                    </Col>
                </Row>
            </Container>

            <Row style={{ overflowY: "auto", overflowX: "hidden" }}>
                {searchFriends.length > 0 && <div>
                    <h5>Search Results</h5>
                    {searchFriends.map((el: iUserViewModel, idx: number) => {
                        return <Col xs={4}>
                            <FriendButton name={el.userName} id={el.id} idx={idx} />
                        </Col>
                    })}
                    <hr />

                </div>}
                <h5>My Friends</h5>
                {friend.length > 0 && friend.map((el: iUserViewModel, idx: number) => {
                    return <Col xs={4}>
                        <FriendButton name={el.userName} id={el.id} idx={idx} />
                    </Col>
                })}
            </Row>
            
        </Container>
    );
}