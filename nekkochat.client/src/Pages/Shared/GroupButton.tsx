import {  Container,  Row } from "react-bootstrap";
import { iUserViewModel } from "../../Constants/Types/CommonTypes";
import FirstLetterUpperCase from "../../Utils/FirstLetterUpperCase";

type incomingProps = {
    item: iUserViewModel,
    idx: number
    func: (value: string, value2: string, value3:boolean) => void
}
export default function GroupButton({ item, idx, func }: incomingProps) {
   
    return (
        <Container key={idx} className="my-2">
            <Row >
                <input
                    type="checkbox"
                    className="btn-check"
                    id={`${item.userName}`}
                    onChange={(e) => {
                        func(item.id, `${item.fname} ${item.lname}`, e.target.checked);
                    }} />
                <label className="btn btn-outline-primary" htmlFor={`${item.userName}`}>{FirstLetterUpperCase(`${item.fname} ${item.lname}`)}</label>
            </Row>
        </Container>
    );
}

