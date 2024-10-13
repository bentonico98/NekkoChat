import {  Container,  Row } from "react-bootstrap";


type incomingProps = {
    name: any,
    idx: number
}

export default function GroupButton({ name,  idx }: incomingProps) {
    return (
        <Container key={idx}>
            <Row >
                <input type="checkbox" className="btn-check"  id={`${name}`}  />
                <label className="btn btn-outline-primary" htmlFor={`${name}`}>{name}</label>
            </Row>
        </Container>
    );
}

