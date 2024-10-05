import { Formik, Form, Field, ErrorMessage } from 'formik';
import RegisterSchemas from '../../Schemas/RegisterSchemas';
import UserAuthServices from '../../Utils/UserAuthServices';
import { useState, useEffect } from "react";
import { ErrorInterface } from '../../Constants/Types/CommonTypes';

export default function Register() {
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const handleSubmit = async (values: RegisterSchemas) => {
        const res = await UserAuthServices.Register(values);
        setLoggedIn(res.success);
        return res;
    }
    useEffect(() => {
        if (loggedIn) {
            window.location.href = "/inbox"
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
