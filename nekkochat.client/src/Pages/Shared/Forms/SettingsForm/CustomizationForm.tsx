import {  Stack, Typography } from "@mui/material";
import { Form, InputGroup } from "react-bootstrap";

export default function CustomizationForm() {

    return (
        <Stack direction="column" spacing={1.5} sx={{ width: "100%" }}>
            <Typography variant="h6">App Them</Typography>
            <InputGroup>
                <Form.Select aria-label="Default select example">
                    <option>Dark</option>
                    <option value="1">Light</option>
                </Form.Select>
            </InputGroup>

            <Typography variant="h6">Text Size</Typography>
            <InputGroup>
                <Form.Select aria-label="Default select example">
                    <option>Default</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </Form.Select>
            </InputGroup>

        </Stack>
    );
}