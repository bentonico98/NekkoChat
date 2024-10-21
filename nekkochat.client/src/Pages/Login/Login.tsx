import { Formik, Form, Field, ErrorMessage } from 'formik';
import UserAuthServices from '../../Utils/UserAuthServices';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginSchema from '../../Schemas/LoginSchema';
import { ErrorInterface } from '../../Constants/Types/CommonTypes';
import {  useAppDispatch } from "../../Hooks/storeHooks";
import { login } from "../../Store/Slices/userSlice";
export default function Login() {

    const dispatch = useAppDispatch();

    const [currentUser, setCurrentUser] = useState<any>({ success: false, user: {} });
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (values: LoginSchema) => {
        const res = await UserAuthServices.Login(values);
        setLoggedIn(res.success);
        setCurrentUser(res);
        if (res.success) {
            await UserAuthServices.SetUserStatusTo(res.user.id, 0);
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
