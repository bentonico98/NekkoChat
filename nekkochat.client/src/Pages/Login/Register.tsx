import UserAuthServices from '../../Utils/UserAuthServices';
import { useState, useEffect } from "react";
import { useAppDispatch } from '../../Hooks/storeHooks';
import { useNavigate } from 'react-router-dom';
import { login, toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification } from '../../Store/Slices/userSlice';
import useDisplayMessage from '../../Hooks/useDisplayMessage';
import { Button, Typography, Box, FormHelperText, FormControl, OutlinedInput, Container, Divider, FormGroup, Checkbox, FormControlLabel, Link } from '@mui/material';
import * as yup from 'yup';
import { iRegisterTypes } from '../../Constants/Types/CommonTypes';
import ErrorBanner from '../Shared/ErrorBanner';
import { useFormik } from 'formik';

import nekkoAlt from "../../assets/nekkoAlt.png";

export default function Register() {

    const dispatch = useAppDispatch();

    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const [isGlobalError, setIsGlobalError] = useState<boolean>(false);
    const [globalError, setGlobalError] = useState<string>("");

    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<any>({ success: false, user: {} });

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

    const handleSubmit = async (values: iRegisterTypes) => {
        setDisplayInfo({ isLoading: true });

        const res = await UserAuthServices.Register(values);

        setLoggedIn(res.success);

        if (res.success) {
            setCurrentUser(res.singleUser);

            await UserAuthServices.SetUserStatusTo(res.singleUser.id, 0);
            setDisplayInfo({
                hasMsj: true,
                msj: res.message + " Registration.",
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
        return res.success;
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
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'Passwords Must Match.')
            .min(8, 'Password must be of minimum 8 characters long')
            .max(12, 'Password must be less than 12 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/,
                'Password must contain uppercare letter, a number & special character.')
            .required('Password is required'),
        lname: yup
            .string()
            .max(15, 'First Name is too long.')
            .required('First Name is Required.'),
        fname: yup
            .string()
            .max(15, 'Last Name is too long')
            .required('Last Name is Required.'),
        about: yup
            .string()
            .max(240, 'About is too long, Must be less the 240 characters')
            .nullable(),
        profilePhotoUrl: yup
            .string()
            .default('/src/assets/avatar.png')
            .nullable(),
        phoneNumber: yup
            .string()
            .matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                'Phone Number must match valid.')
            .required('Phone Number is Required.'),
        remember: yup
            .boolean()
            .default(false)
            .nullable(),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            fname: '',
            lname: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            remember: false,
            profilePhotoUrl: '',
            about: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setSubmitting(true);
            handleSubmit(values);
        },
    });

    return (
        <Container sx={{ padding: '2em' }} className="fluidContainer">
            <Box className="AuthPageMainContainer">
                <Box className="AuthPageProfileHeader">
                    <img
                        src={nekkoAlt}
                        width="100"
                        height="100"
                        className="d-inline-block align-top"
                        style={{ cursor: 'pointer' }}
                        onClick={() => { navigate('/'); }}
                    />{' '}
                    <Divider />
                    <Typography variant="body1" component="h3">Join Us Today. Create An Account, It's Free. Miaw!</Typography>
                </Box>

                <form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(); }}>
                    <Box className="Two-Row-Container">

                        <Box className="Two-Row-Container-Second-Item">
                            <Box className="Two-Row-Container">
                                <Box className="Two-Row-Container-Second-Item">
                                    {formik.errors.fname && <ErrorBanner error={formik.errors.fname} />}
                                    <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                        <OutlinedInput
                                            name="fname"
                                            id="outlined-adornment-weight1"
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'weight',
                                            }}
                                            value={formik.values.fname}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.fname && Boolean(formik.errors.fname)}
                                        />
                                        <FormHelperText id="outlined-weight-helper-text">First Name</FormHelperText>
                                    </FormControl>
                                </Box>

                                <Box className="Two-Row-Container-Second-Item">
                                    {formik.errors.lname && <ErrorBanner error={formik.errors.lname} />}
                                    <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                        <OutlinedInput
                                            name="lname"
                                            id="outlined-adornment-weight2"
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'weight',
                                            }}
                                            value={formik.values.lname}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.lname && Boolean(formik.errors.lname)}
                                        />
                                        <FormHelperText id="outlined-weight-helper-text">Last Name</FormHelperText>
                                    </FormControl>
                                </Box>
                            </Box>

                            <Box>
                                {formik.errors.email && <ErrorBanner error={formik.errors.email} />}
                                <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                    <OutlinedInput
                                        name="email"
                                        type="email"
                                        id="outlined-adornment-weight3"
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


                            <Box className="Two-Row-Container">
                                <Box className="Two-Row-Container-Second-Item">
                                    {formik.errors.password && <ErrorBanner error={formik.errors.password} />}

                                    <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                        <OutlinedInput
                                            name="password"
                                            type="password"
                                            id="outlined-adornment-weight4"
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
                                <Box className="Two-Row-Container-Second-Item">
                                    {formik.errors.confirmPassword && <ErrorBanner error={formik.errors.confirmPassword} />}

                                    <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                        <OutlinedInput
                                            name="confirmPassword"
                                            type="password"
                                            id="outlined-adornment-weight5"
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                'aria-label': 'weight',
                                            }}
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                        />
                                        <FormHelperText id="outlined-weight-helper-text">Confirm Password</FormHelperText>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Box>

                        <Box className="Two-Row-Container-Second-Item">
                            <Box >
                                {formik.errors.phoneNumber && <ErrorBanner error={formik.errors.phoneNumber} />}
                                <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                    <OutlinedInput
                                        name="phoneNumber"
                                        id="outlined-adornment-weight6"
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{
                                            'aria-label': 'weight',
                                        }}
                                        value={formik.values.phoneNumber}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                    />
                                    <FormHelperText id="outlined-weight-helper-text">Phone Number</FormHelperText>
                                </FormControl>
                            </Box>

                            <Box>
                                {formik.errors.profilePhotoUrl && <ErrorBanner error={formik.errors.profilePhotoUrl} />}
                                <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                    <OutlinedInput
                                        name="profilePhotoUrl"
                                        type="file"
                                        id="outlined-adornment-weight7"
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{
                                            'aria-label': 'weight',
                                        }}
                                        value={formik.values.profilePhotoUrl}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.profilePhotoUrl && Boolean(formik.errors.profilePhotoUrl)}
                                    />
                                    <FormHelperText id="outlined-weight-helper-text">Profile Picture</FormHelperText>
                                </FormControl>
                            </Box>

                            <Box>
                                {formik.errors.about && <ErrorBanner error={formik.errors.about} />}
                                <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                                    <OutlinedInput
                                        name="about"
                                        type="textarea"
                                        id="outlined-adornment-weight8"
                                        aria-describedby="outlined-weight-helper-text"
                                        inputProps={{
                                            'aria-label': 'weight',
                                        }}
                                        value={formik.values.about}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.about && Boolean(formik.errors.about)}
                                    />
                                    <FormHelperText id="outlined-weight-helper-text">Tell more about yourself</FormHelperText>
                                </FormControl>
                            </Box>
                        </Box>
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
                        Register
                    </Button>
                </form>
                <Box>
                    <Typography>Already Registered? <Link color="inherit" href="login">Login</Link></Typography>
                </Box>
            </Box>
        </Container>
    );
}
