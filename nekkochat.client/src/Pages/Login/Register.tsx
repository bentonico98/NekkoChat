import { Formik, Form, Field, ErrorMessage } from 'formik';
import RegisterSchemas from '../../Schemas/RegisterSchemas';
import UserAuthServices from '../../Utils/UserAuthServices';
import { useState, useEffect } from "react";
import { ErrorInterface } from '../../Constants/Types/CommonTypes';
import { useAppDispatch } from '../../Hooks/storeHooks';
import { useNavigate } from 'react-router-dom';
import { login, toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification } from '../../Store/Slices/userSlice';
import useDisplayMessage from '../../Hooks/useDisplayMessage';

export default function Register() {

    const dispatch = useAppDispatch();

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

    const handleSubmit = async (values: RegisterSchemas) => {
        setDisplayInfo({ isLoading: true });

        const res = await UserAuthServices.Register(values);
        setLoggedIn(res.success);
        setCurrentUser(res);
        if (res.success) {
            await UserAuthServices.SetUserStatusTo(res.user.id, 0);
            setDisplayInfo({
                hasMsj: true,
                msj: res.message + " Registration.",
                isLoading: false
            });
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
        }
        return res.success;
    }
    useEffect(() => {
        if (loggedIn) {
            dispatch(login(currentUser));
            navigate("/inbox");
        }
    }, [loggedIn]);

    return (
        <main>
            <h1>Register</h1>
            <hr />
            <Formik
                initialValues={new RegisterSchemas("", "", "", "", "")}
                validate={values => {
                    const errors: ErrorInterface = {};
                    if (!values.email) {
                        errors.email = 'Email Required';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Invalid email address';
                    }
                    if (!values.username) {
                        errors.username = 'Username Required';
                    }
                    if (!values.password) {
                        errors.password = 'Password Required';
                    }
                    if (!values.confirmpassword) {
                        errors.confirmpassword = 'Please, Confirm your password';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 400);
                    console.log(values);
                    handleSubmit(values);
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label>Username</label>
                        <Field type="text" name="username" />
                        <ErrorMessage name="username" component="div" />

                        <label>Email</label>
                        <Field type="email" name="email" />
                        <ErrorMessage name="email" component="div" />

                        <label>Password</label>
                        <Field type="password" name="password" />
                        <ErrorMessage name="password" component="div" />

                        <label>Confirm Password</label>
                        <Field type="password" name="confirmpassword" />
                        <ErrorMessage name="confirmpassword" component="div" />

                        <label>Phone Number</label>
                        <Field type="text" name="phoneNumber" />
                        <ErrorMessage name="phoneNumber" component="div" />

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>

        </main>
    );
}
