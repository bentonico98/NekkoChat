import {  FormHelperText } from "@mui/material";

interface iPropsBanner {
    error: string,
}
export default function ErrorBanner({ error }: iPropsBanner) {
    return (
        <FormHelperText  className="text-danger">{error}</FormHelperText>
    );
}