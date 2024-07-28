import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { Card, Button, Col } from "react-bootstrap";
// import { Principal } from "@dfinity/principal";
import GymInfoModal from "./GymInfoModal";
import { getGymById, gymMembershipRegistration, getAllEnrollesByGymId, addGymService, getAllServicesById } from "../../utils/marketplace";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";

const Gym = ({ product, deleteGym, fetchGymDetailsById }) => {
  const { id, gymImgUrl, gymLocation, gymName } = product;
  const [gymDetailsModal, setGymDetailsModal] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const closeGymDetailsModal = () => setGymDetailsModal(false);
  const closeEnrollModal = () => setShowEnrollModal(false);
  const [gymDetails, setGymDetails] = useState({});
  const [gymMembers, setGymMembers] = useState([])
  const [gymServices, setGymServices] = useState([])
  const [loading, setLoading] = useState(false);


  const getProductById = useCallback(async (id) => {
    try {
      setLoading(true);
      setGymDetails(await getGymById(id));
      setGymDetailsModal(true);
    } catch (error) {
      console.log({ error });
    } finally {
    }
  });



  const enroll = async (data) => {
    try {
      const response = await gymMembershipRegistration(data);
      console.log(response);

      if ('Err' in response) {
        const error = response.Err;

        if (error.AlreadyExist) {
          console.error("User already exists:", error.AlreadyExist);
          toast(<NotificationError text="User already exists." />);
        } else if (error.NotFound) {
          console.error("Gym not found:", error.NotFound);
          toast(<NotificationError text="Gym not found." />);
        } else if (error.InvalidPayload) {
          console.error("Invalid payload:", error.InvalidPayload);
          toast(<NotificationError text="Invalid payload." />);
        } else {
          console.error("Unknown error:", error);
          toast(<NotificationError text="An unknown error occurred." />);
        }
      } else if ('Ok' in response) {
        const gym = response.Ok;
        console.log("Registration successful:", gym);
        toast(<NotificationSuccess text="User added successfully." />);
        getMembers(data.gymId); // Fetch the updated list of members
      }
    } catch (error) {
      console.error("User already exists.", error);
      toast(<NotificationError text="User already exists." />);
    } finally {

    }
  };


  const registerService = async (data) => {
    try {
      const response = await addGymService(data);
      console.log(response);

      if ('Err' in response) {
        const error = response.Err;

        if (error.AlreadyExist) {
          console.error("User already exists:", error.AlreadyExist);
          toast(<NotificationError text="User already exists." />);
        } else if (error.NotFound) {
          console.error("Gym not found:", error.NotFound);
          toast(<NotificationError text="Gym not found." />);
        } else if (error.InvalidPayload) {
          console.error("Invalid payload:", error.InvalidPayload);
          toast(<NotificationError text="Invalid payload." />);
        } else {
          console.error("Unknown error:", error);
          toast(<NotificationError text="An unknown error occurred." />);
        }
      } else if ('Ok' in response) {
        const gym = response.Ok;
        console.log("Registration successful:", gym);
        toast(<NotificationSuccess text="service added successfully." />);
        getServicesById(data.gymId); // Fetch the updated list of members
      }
    } catch (error) {
      console.error(error);
      toast(<NotificationError text="an error occured." />);
    } finally {

    }
  };


  const getMembers = useCallback(async (id) => {
    try {
      const response = await getAllEnrollesByGymId(id);
      setGymMembers(response.Ok);
      console.log('gymMembers1', response.Ok);
    } catch (error) {
      console.log({ error });
    } finally {
      console.log('Completed fetching members');
    }
  }, [setGymMembers]);


  const getServicesById = useCallback(async (id) => {
    try {
      const response = await getAllServicesById(id);
      setGymServices(response.Ok);
      console.log('gymMembers1', response.Ok);
    } catch (error) {
      console.log({ error });
    } finally {
      console.log('Completed fetching members');
    }
  }, [setGymServices]);



  return (
    <>
      <GymInfoModal closeGymDetailsModal={closeGymDetailsModal} gymDetailsModal={gymDetailsModal}
        gymDetails={gymDetails} getProductById={getProductById} enroll={enroll} getMembers={getMembers}
        gymMembers={gymMembers} deleteGym={deleteGym} registerService={registerService} gymServices={gymServices} getServicesById={getServicesById} />

      <Col key={id}>
        <Card className=" h-100">
          <div className=" ratio ratio-4x3">
            <img src={gymImgUrl} alt="barber_icon" style={{ objectFit: "cover" }} />
          </div>
          <Card.Body className="d-flex  flex-column text-justify" style={{ textTransform: 'capitalize', fontSize: 12 }}>
            <Card.Text ><b>Gym Name:</b> {gymName}</Card.Text>
            <Card.Text><b>Gym Location:</b> {gymLocation}</Card.Text>
            <Button
              variant="outline-dark"
              onClick={() => getProductById(id)}
              className="w-100 py-3"
            >
              View
            </Button>

            <Button
              variant="outline-dark"
              onClick={() => fetchGymDetailsById(id)}
              className="w-100 py-3"
            >
              Update
            </Button>

          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

Gym.propTypes = {
  product: PropTypes.instanceOf(Object).isRequired,
};

export default Gym;
