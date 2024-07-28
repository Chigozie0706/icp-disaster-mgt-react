import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import RegisterGym from "./RegisterGym";
import Gym from "./Gym";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import { getAllGyms, createGymProfile, getGymById, updateGymById, deleteGymById } from "../../utils/marketplace";


const Gyms = () => {
  const [gymName, setGymName] = useState("");
  const [gymImgUrl, setGymImgUrl] = useState("");
  const [gymLocation, setGymLocation] = useState("");
  const [gymDescription, setGymDescription] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [id, setId] = useState("")
  const [text, setText] = useState("register")


  const [gymDetails, setGymDetails] = useState({});

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);


  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setGymName("");
    setGymImgUrl("");
    setGymLocation("");
    setGymDescription("");
    setEmailAddress("");
    setText("register");
  }
  const handleShow = () => setShow(true);

  const isFormFilled = () => gymName && gymImgUrl && gymLocation && gymDescription && emailAddress;


  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProducts(await getAllGyms());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, []);

  const createGym = async (data) => {
    try {
      setLoading(true);
      createGymProfile(data).then((resp) => {
        getProducts();
        toast(<NotificationSuccess text="Gym created successfully." />);
        setGymDetails("");
        setGymName("");
        setGymImgUrl("");
        setGymLocation("");
        setGymDescription("");
        setEmailAddress("");
      });

    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a product." />);
    } finally {
      setLoading(false);
    }
  };



  const fetchGymDetailsById = useCallback(async (id) => {
    try {
      const details = await getGymById(id);
      if (details.Ok) {
        setGymDetails(details.Ok);
        setGymName(details.Ok.gymName);
        setGymImgUrl(details.Ok.gymImgUrl);
        setGymLocation(details.Ok.gymLocation);
        setGymDescription(details.Ok.gymDescription);
        setEmailAddress(details.Ok.emailAddress);
        setId(details.Ok.id);
        setText("update");
        handleShow();
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);



  const updateGym = async (id, data) => {
    try {
      setLoading(true);
      await updateGymById(id, data);
      await getProducts();
      toast(<NotificationSuccess text="Gym updated successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to update gym." />);
    } finally {
      setLoading(false);
      setGymDetails("");
      setGymName("");
      setGymImgUrl("");
      setGymLocation("");
      setGymDescription("");
      setEmailAddress("");
      setText("register")
    }
  };


  const deleteGym = async (id) => {
    try {
      setLoading(true);
      await deleteGymById(id);
      await getProducts();
      toast(<NotificationSuccess text="Gym deleted successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to delete gym." />);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getProducts();
  }, [getProducts]);


  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">GymFusion</h1>
            <RegisterGym
              save={createGym}
              gymName={gymName}
              setGymName={setGymName}
              gymImgUrl={gymImgUrl}
              setGymImgUrl={setGymImgUrl}
              gymLocation={gymLocation}
              setGymLocation={setGymLocation}
              gymDescription={gymDescription}
              setGymDescription={setGymDescription}
              emailAddress={emailAddress}
              setEmailAddress={setEmailAddress}
              show={show}
              handleClose={handleClose}
              handleShow={handleShow}
              isFormFilled={isFormFilled}
              updateGym={updateGym}
              id={id}
              text={text}
            />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {products.map((_product) => (
              <Gym
                product={{
                  ..._product,
                }}

                gymName1={gymName}
                setGymName={setGymName}
                gymImgUrl1={gymImgUrl}
                setGymImgUrl={setGymImgUrl}
                fetchGymDetailsById={fetchGymDetailsById}
                deleteGym={deleteGym}
                View
              />
            ))}
          </Row>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Gyms;
