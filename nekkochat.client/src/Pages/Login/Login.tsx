import { Formik, Form, Field, ErrorMessage } from 'formik';
import UserAuthServices from '../../Utils/UserAuthServices';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginSchema from '../../Schemas/LoginSchema';
import { ErrorInterface } from '../../Constants/Types/CommonTypes';
import {  useAppDispatch } from "../../Hooks/storeHooks";
import { login, toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification } from "../../Store/Slices/userSlice";
import useDisplayMessage from '../../Hooks/useDisplayMessage';
export default function Login() {

    const dispatch = useAppDispatch();

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

    const handleSubmit = async (values: LoginSchema) => {
        setDisplayInfo({ isLoading: true });

        const res = await UserAuthServices.Login(values);
        setLoggedIn(res.success);
        setCurrentUser(res);
        if (res.success) {
            await UserAuthServices.SetUserStatusTo(res.user.id, 0);
            setDisplayInfo({
                hasMsj: true,
                msj: res.message + " Authentication.",
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
        return res;
    }

    useEffect(() => {
        if (loggedIn) {
            dispatch(login(currentUser));
            navigate("/inbox");
        }
    }, [loggedIn]);
    
    return (
        <main>
            <h1>Login</h1>
            <hr />
            <Formik
                initialValues={new LoginSchema("", "") }
                validate={(values) => {
                    const errors: ErrorInterface = {};
                    if (!values.username) {
                        errors.username = "Required";
                    }
                    if (!values.password) {
                        errors.password = "Required";
                    }
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        setSubmitting(false);
                    }, 400);
                    handleSubmit(values);
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <label>Username</label>
                        <Field type="email" name="username" />
                        <ErrorMessage name="username" component="div" />

                        <br />

                        <label>Password</label>
                        <Field type="password" name="password" />
                        <ErrorMessage name="password" component="div" />

                        <br />

                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </Form>
                )}
            </Formik>

        </main>
    );
}
