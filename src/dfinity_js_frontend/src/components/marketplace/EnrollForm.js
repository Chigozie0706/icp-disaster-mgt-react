import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const EnrollForm = ({ save, showEnrollModal, gymDetails }) => {
    const [fullName, setFullName] = useState("")
    const [userName, setUserName] = useState("");
    const [emailAddress, setEmailAddress] = useState("")
    const isFormFilled = () => fullName && userName && emailAddress



    return (
        <>
            <Form>
                <FloatingLabel
                    controlId="fullName"
                    label="Fullname"
                    className="mb-3"
                >
                    <Form.Control
                        type="text"
                        onChange={(e) => {
                            setFullName(e.target.value);
                        }}
                        placeholder="Enter fullname"
                    />
                </FloatingLabel>

                <FloatingLabel
                    controlId="userName"
                    label="Username"
                    className="mb-3"
                >
                    <Form.Control
                        type="text"
                        onChange={(e) => {
                            setUserName(e.target.value);
                        }}
                        placeholder="Enter username"
                    />
                </FloatingLabel>

                <FloatingLabel
                    controlId="emailAddress"
                    label="EmailAddress"
                    className="mb-3"
                >
                    <Form.Control
                        type="text"
                        onChange={(e) => {
                            setEmailAddress(e.target.value);
                        }}
                        placeholder="Enter email address"
                    />
                </FloatingLabel>
            </Form>

            <Button
                variant="primary"
                disabled={!isFormFilled()}
                onClick={() => {
                    save({
                        gymId: gymDetails.Ok.id,
                        userName,
                        fullName,
                        emailAddress,
                        userId: ''
                    });
                }}
            >
                Submit
            </Button>

        </>
    );
};

EnrollForm.propTypes = {
    save: PropTypes.func.isRequired,
};

export default EnrollForm;
