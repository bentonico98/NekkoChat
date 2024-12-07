import {   Stack, Typography } from "@mui/material";
import { Form, InputGroup } from "react-bootstrap";

export default function VideoCallForm() {

    return (
        <Stack direction="column" spacing={1.5} sx={{ width: "100%" }}>
            <Typography variant="h6">Camera Permission</Typography>
            <InputGroup>
                <Form.Select aria-label="Default select example">
                    <option>Laptop Camera</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </Form.Select>
            </InputGroup>

            <Typography variant="h6">Microphone Permission</Typography>
            <InputGroup>
                <Form.Select aria-label="Default select example">
                    <option>Laptop Microphone</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </Form.Select>
            </InputGroup>

            <Typography variant="h6">Speakers</Typography>
            <InputGroup>
                <Form.Select aria-label="Default select example">
                    <option>Laptop Main Speakers</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </Form.Select>
            </InputGroup>
        </Stack>
    );
}