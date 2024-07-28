import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const ServiceForm = ({ registerService, showEnrollModal, gymDetails }) => {
    const [serviceName, setServiceName] = useState("")
    const [serviceDescription, setServiceDescription] = useState("");
    const [operatingDaysStart, setOperatingDaysStart] = useState("")
    const [operatingDaysEnd, setOperatingDaysEnd] = useState("")

    const isFormFilled = () => serviceName && serviceDescription && operatingDaysStart && operatingDaysEnd



    return (
        <>
            <Form>
                <FloatingLabel
                    controlId="serviceName"
                    label="ServiceName"
                    className="mb-3"
                >
                    <Form.Control
                        type="text"
                        onChange={(e) => {
                            setServiceName(e.target.value);
                        }}
                        placeholder="Enter name of service"
                    />
                </FloatingLabel>

                <FloatingLabel
                    controlId="serviceDescription"
                    label="Service Description"
                    className="mb-3"
                >

                    <Form.Control
                        as="textarea"
                        placeholder="Enter service description"
                        value={serviceDescription}
                        onChange={(e) => {
                            setServiceDescription(e.target.value);
                        }}
                    />
                </FloatingLabel>

                <FloatingLabel
                    controlId="operatingDaysStart"
                    label="Operating Days Start"
                    className="mb-3"
                >

                    <Form.Select
                        value={operatingDaysStart}
                        onChange={(e) => {
                            setOperatingDaysStart(e.target.value);
                        }}
                    >
                        <option value="">Select a day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                    </Form.Select>
                </FloatingLabel>

                <FloatingLabel
                    controlId="operatingDaysEnd"
                    label="Operating Days End"
                    className="mb-3"
                >
                    <Form.Select
                        value={operatingDaysEnd}
                        onChange={(e) => {
                            setOperatingDaysEnd(e.target.value);
                        }}
                    >
                        <option value="">Select a day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                    </Form.Select>
                </FloatingLabel>

            </Form>

            <Button
                variant="primary"
                disabled={!isFormFilled()}
                onClick={() => {
                    registerService({
                        gymId: gymDetails.Ok.id,
                        serviceName,
                        serviceDescription,
                        operatingDaysStart,
                        operatingDaysEnd
                    });
                }}
            >
                Register Service
            </Button>

        </>
    );
};

ServiceForm.propTypes = {
    registerService: PropTypes.func.isRequired,
};

export default ServiceForm;
