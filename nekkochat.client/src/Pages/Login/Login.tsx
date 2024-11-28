import { useFormik } from 'formik';
import UserAuthServices from '../../Utils/UserAuthServices';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Hooks/storeHooks";
import { login, toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification } from "../../Store/Slices/userSlice";
import useDisplayMessage from '../../Hooks/useDisplayMessage';

import * as yup from 'yup';
import { Box, Button, Checkbox, Container, Divider, FormControl, FormControlLabel, FormHelperText, Link, OutlinedInput, Typography } from '@mui/material';
import { FormGroup} from 'react-bootstrap';
import { iLoginTypes } from '../../Constants/Types/CommonTypes';
import ErrorBanner from '../Shared/ErrorBanner';

import nekkoAlt from "../../assets/nekkoAlt.png";

export default function Login() {

    const dispatch = useAppDispatch();

    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const [isGlobalError, setIsGlobalError] = useState<boolean>(false);
    const [globalError, setGlobalError] = useState<string>("");

    const [currentUser, setCurrentUser] = useState<any>({ success: false, user: {} });
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

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

    const handleSubmit = async (values: iLoginTypes) => {
        setDisplayInfo({ isLoading: true });

        const res = await UserAuthServices.Login(values);
        setLoggedIn(res.success);

        if (res.success) {
            setCurrentUser(res.singleUser);

            await UserAuthServices.SetUserStatusTo(res.singleUser.id, 0);
            setDisplayInfo({
                hasMsj: true,
                msj: res.message + " Authentication.",
                isLoading: false
            });
            UserAuthServices.RememberUser(values.remember);
            setSubmitting(false);
        } else {
            if (res.internalMessage) return setDisplayInfo({
                hasError: true,
                error: res.internalMessage,
                isLoading: true
            });
            setDisplayInfo({
                hasError: true,
                error: res.error,
                isLoading: true
            });
            setIsGlobalError((e: boolean) => {
                e = true;
                return e;
            });
            setGlobalError((er: string) => {
                er = res.error;
                return er;
            });
            setSubmitting(false);
        }
        return res;
    }

    useEffect(() => {
        if (loggedIn) {
            dispatch(login({ success: loggedIn, user: currentUser }));
            window.location.href = "/inbox";
        }
    }, [loggedIn]);

    const validationSchema = yup.object({
        email: yup
            .string()
            .email('Enter a valid email')
            .required('Email is required'),
        password: yup
            .string()
            .min(8, 'Password should be of minimum 8 characters length')
            .max(12, 'Password must be less than 12 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/,
                'Password must contain uppercare letter, a number & special character.')
            .required('Password is required'),
        remember: yup
            .string()
            .default('off')
            .nullable(),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            remember: false
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setSubmitting(true);
            handleSubmit(values);
        },
    });


    return (
        <Container maxWidth="sm" sx={{ paddingTop: '2em' }} className="fluidContainer" >
            <Box className="AuthPageMainContainer" >
                <Box className="AuthPageProfileHeader">
                    <img
                        src={nekkoAlt}
                        width="100"
                        height="100"
                        className="d-inline-block align-top"
                        style={{ cursor: 'pointer' }}
                        onClick={() => { navigate('/'); }}
                    />{' '}
                    <Divider/>
                    <Typography variant="body1" component="h3">Login to your account. Miaw!</Typography>
                </Box>

                <form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }}>
                    <Box>
                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            {formik.errors.email && <ErrorBanner error={formik.errors.email} />}
                            <OutlinedInput
                                name="email"
                                type="email"
                                id="outlined-adornment-weight1"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                    'aria-label': 'weight',
                                }}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                            />
                            <FormHelperText id="outlined-weight-helper-text">Email</FormHelperText>
                        </FormControl>
                    </Box>

                    <Box>
                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            {formik.errors.password && <ErrorBanner error={formik.errors.password} />}
                            <OutlinedInput
                                name="password"
                                type="password"
                                id="outlined-adornment-weight2"
                                aria-describedby="outlined-weight-helper-text"
                                inputProps={{
                                    'aria-label': 'weight',
                                }}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                            />
                            <FormHelperText id="outlined-weight-helper-text">Password</FormHelperText>
                        </FormControl>
                    </Box>

                    {isGlobalError && <Typography className="text-danger my-2">{globalError} </Typography>}

                    <Box>
                        <FormGroup style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            paddingTop: "1rem",
                            paddingBottom: "1rem"
                        }}>
                            <FormControlLabel
                                onChange={formik.handleChange}
                                value={formik.values.remember}
                                name="remember"
                                control={<Checkbox />}
                                label="Remember" />
                        </FormGroup>
                    </Box>

                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                        disabled={isSubmitting}>
                        Login
                    </Button>
                </form>
                <Box>
                    <Typography>Not Registered Yet? <Link color="inherit" href="register">Create an Account</Link></Typography>
                </Box>
            </Box >
        </Container>
    );
}
