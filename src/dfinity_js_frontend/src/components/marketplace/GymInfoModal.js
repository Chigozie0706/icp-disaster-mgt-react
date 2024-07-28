import React, { useState, useEffect } from "react";
import { Modal, Card, Button } from "react-bootstrap";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import EnrollForm from "./EnrollForm";
import ServiceForm from "./ServiceForm";


const GymInfoModal = ({ closeGymDetailsModal, gymDetailsModal, gymDetails, enroll,
    getMembers, gymMembers, deleteGym, registerService, gymServices, getServicesById }) => {
    const [key, setKey] = useState('details');


    useEffect(() => {
        if (gymDetails?.Ok?.id) {
            getMembers(gymDetails.Ok.id);
        }
    }, [gymDetails?.Ok?.id, getMembers]);

    useEffect(() => {
        if (gymDetails?.Ok?.id) {
            getServicesById(gymDetails.Ok.id);
        }
    }, [gymDetails?.Ok?.id, getServicesById]);


    return (
        <>
            {Object.keys(gymDetails).length !== 0 &&
                <>
                    <Modal show={gymDetailsModal} onHide={closeGymDetailsModal} centered backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: 12 }}>Gym's Profile: {gymDetails.Ok.id}</Modal.Title>

                            <Button
                                variant="danger"
                                size="sm"
                                style={{ marginLeft: 'auto' }}
                                onClick={() => {
                                    deleteGym(gymDetails.Ok.id);
                                    closeGymDetailsModal()
                                }}
                            >
                                Delete
                            </Button>

                        </Modal.Header>
                        <Modal.Body>
                            <Card className=" h-100">
                                <div className=" ratio ratio-4x3">
                                    <img src={gymDetails.Ok.gymImgUrl} alt="barber_icon" style={{ objectFit: "cover" }} />
                                </div>
                                <Card.Body className="d-flex  flex-column text-justify" style={{ fontSize: 12 }}>

                                    <Tabs
                                        id="controlled-tab-example"
                                        activeKey={key}
                                        onSelect={(k) => setKey(k)}
                                        className="mb-3"
                                    >
                                        <Tab eventKey="details" title="Details">
                                            <Card.Text ><b>Gym Name:</b> {" "}{gymDetails.Ok.gymName}</Card.Text>
                                            <Card.Text ><b>Gym Email:</b> {" "}{gymDetails.Ok.emailAddress}</Card.Text>
                                            <Card.Text ><b>Location:</b> {" "}{gymDetails.Ok.gymLocation}</Card.Text>
                                            <Card.Text ><b>Description:</b> {" "}{gymDetails.Ok.gymDescription}</Card.Text>

                                            <p className="text-center">Gym Members</p>

                                            <ol>
                                                {gymMembers.map((member) => (
                                                    <li key={member.userId}>
                                                        <Card.Text className="text-capitalize "><b>FULLNAME:</b> {member.fullName}</Card.Text>
                                                        <Card.Text>USER_NAME: {member.userName}</Card.Text>
                                                        <Card.Text>USER_ID: {member.userId}</Card.Text>
                                                    </li>
                                                ))}
                                            </ol>


                                        </Tab>
                                        <Tab eventKey="enroll" title="Enroll">
                                            <EnrollForm save={enroll} gymDetails={gymDetails} />
                                        </Tab>

                                        <Tab eventKey="services" title="Services">
                                            <p className="text-capitalize ">Services offered </p>
                                            <ol>
                                                {gymServices.map((service) => (
                                                    <li key={service.userId}>
                                                        <Card.Text className="text-capitalize "><b>Service name:</b> {service.serviceName}</Card.Text>
                                                        <Card.Text className="text-capitalize "><b>Service description:</b> {service.serviceDescription}</Card.Text>
                                                        <Card.Text className="text-capitalize "><b>Opening day:</b> {service.operatingDaysStart}</Card.Text>
                                                        <Card.Text className="text-capitalize mb-4"><b>Closing day:</b> {service.operatingDaysEnd}</Card.Text>
                                                    </li>
                                                ))}
                                            </ol>

                                            <hr />
                                            <p className="text-capitalize ">Service form </p>
                                            <ServiceForm registerService={registerService} gymDetails={gymDetails} />
                                        </Tab>
                                    </Tabs>

                                </Card.Body>
                            </Card>
                        </Modal.Body>
                    </Modal>
                </>
            }

        </>
    );
};


export default GymInfoModal;
