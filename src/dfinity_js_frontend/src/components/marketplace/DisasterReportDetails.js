import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  getDisasterReportById,
  updateDisasterReportById,
  addDisasterImages,
  deleteDisasterImageById,
} from "../../utils/marketplace";
import Loader from "../utils/Loader";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import { toast } from "react-toastify";
import { Card, Row, Col } from "react-bootstrap";
import UpdateDisasterReport from "./UpdateDisasterReport";
import {
  GeoAlt,
  Calendar,
  ExclamationCircle,
  PersonCircle,
  PinMap,
  Trash,
} from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DisasterCard.css";

const DisasterReportDetails = () => {
  const { disasterId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reporterName, setReporterName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [disasterType, setDisasterType] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [date, setDate] = useState("");
  const [severity, setSeverity] = useState("");
  const [impact, setImpact] = useState("");
  const [reporterId, setReporterId] = useState("");
  const [show, setShow] = useState(false);
  const [disasterImageUrl, setDisasterImageUrl] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the query params from the current URL
    const searchParams = new URLSearchParams(location.search);

    // If the canisterId is not already present, add it
    if (!searchParams.has("canisterId")) {
      searchParams.set("canisterId", "br5f7-7uaaa-aaaaa-qaaca-cai");
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });
    }
    // Empty dependency array ensures this effect runs only once when the component mounts
  }, [location.pathname, navigate]);

  const fetchReportDetails = useCallback(async () => {
    try {
      const reportData = await getDisasterReportById(disasterId);
      if (reportData.Ok) {
        setReport(reportData.Ok);
        setReporterName(reportData.Ok.reporterName);
        setReporterId(reportData.Ok.reporterId);
        setContact(reportData.Ok.contact);
        setEmail(reportData.Ok.email);
        setDisasterType(reportData.Ok.disasterType);
        setImgUrl(reportData.Ok.imgUrl);
        setLatitude(reportData.Ok.latitude);
        setLongitude(reportData.Ok.longitude);
        setCity(reportData.Ok.city);
        setState(reportData.Ok.state);
        setDate(reportData.Ok.date);
        setSeverity(reportData.Ok.severity);
        setImpact(reportData.Ok.impact);
      } else {
        toast(<NotificationError text="Failed to fetch report details." />);
      }
    } catch (error) {
      console.error(error);
      toast(<NotificationError text="Failed to fetch report details." />);
    } finally {
      setLoading(false);
    }
  }, [disasterId]);

  useEffect(() => {
    fetchReportDetails();
  }, [fetchReportDetails]);

  const updateReport = async (disasterId, data) => {
    try {
      setLoading(true);
      await updateDisasterReportById(disasterId, data);
      setReport(data);
      toast(
        <NotificationSuccess text="Disaster report updated successfully." />
      );
      fetchReportDetails();
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to update report." />);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const addImages = async (data) => {
    try {
      const response = await addDisasterImages(data);
      console.log(response);
      const report = response.Ok;
      console.log("Registration successful:", report);
      toast(<NotificationSuccess text="image added successfully." />);
      fetchReportDetails();
    } catch (error) {
      console.error(error);
      toast(<NotificationError text="an error occured." />);
    } finally {
    }
  };

  const deleteImage = async (payload) => {
    try {
      if (
        !payload.disasterId ||
        !payload.timestamp ||
        !payload.disasterImageUrl
      ) {
        throw new Error("Invalid payload: Missing required fields.");
      }

      const response = await deleteDisasterImageById(payload);
      console.log(response);
      const report = response.Ok;
      console.log(" success:", report);
      toast(<NotificationSuccess text="image deleted . . ." />);
      fetchReportDetails();
    } catch (error) {
      console.error(error);
      toast(<NotificationError text="an error occured." />);
    } finally {
    }
  };

  const isFormFilled = () => {
    return (
      reporterName &&
      contact &&
      email &&
      disasterType &&
      imgUrl &&
      latitude &&
      longitude &&
      city &&
      state &&
      date &&
      severity &&
      impact
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {report ? (
        <>
          <UpdateDisasterReport
            reporterName={reporterName}
            setReporterName={setReporterName}
            contact={contact}
            setContact={setContact}
            email={email}
            setEmail={setEmail}
            disasterType={disasterType}
            setDisasterType={setDisasterType}
            imgUrl={imgUrl}
            setImgUrl={setImgUrl}
            latitude={latitude}
            setLatitude={setLatitude}
            longitude={longitude}
            setLongitude={setLongitude}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            date={date}
            setDate={setDate}
            severity={severity}
            setSeverity={setSeverity}
            impact={impact}
            setImpact={setImpact}
            show={show}
            handleClose={handleClose}
            handleShow={handleShow}
            isFormFilled={isFormFilled}
            updateReport={updateReport}
            disasterId={disasterId}
          />
          <Card
            className="mb-4 mt-3 shadow-sm"
            style={{
              fontSize: "12px",
              fontFamily: "Roboto, sans-serif",
              lineHeight: "1.5",
              color: "#343a40",
            }}
          >
            <Card.Header className="card-header bg-dark text-white">
              Disaster ID: {disasterId}
            </Card.Header>
            <Card.Img variant="top" src={imgUrl} />
            <Card.Body>
              <Card.Title
                className="text-capitalize"
                style={{ fontWeight: "bold", fontSize: "14px" }}
              >
                {disasterType}
              </Card.Title>
              <Card.Subtitle
                className="mb-2 text-muted"
                style={{ fontSize: "13px" }}
              >
                <Calendar className="me-2" />
                {date}
              </Card.Subtitle>
              <Card.Text style={{ marginBottom: "1rem" }}>
                <strong>Reported by:</strong> {reporterName} <br />
                {/* <strong>Reporter ID:</strong> {reporterId} <br /> */}
                <strong>Contact:</strong> {contact} <br />
                <strong>Email:</strong> {email}
              </Card.Text>
              <Card.Text>
                <GeoAlt className="me-2" />
                {city}, {state} <br />
                <ExclamationCircle className="me-2" />
                Severity:{" "}
                <span
                  style={{ fontWeight: "bold" }}
                  className="text-capitalize"
                >
                  {severity}
                </span>{" "}
                <br />
                <PersonCircle className="me-2" />
                Impact: <span style={{ fontWeight: "bold" }}>{impact}</span>
              </Card.Text>
              {/* Image Upload Section */}
              <div>
                <strong>Upload Disaster Image:</strong> <br />
                <input
                  type="text"
                  placeholder="Enter Image URL"
                  value={disasterImageUrl}
                  onChange={(e) => setDisasterImageUrl(e.target.value)}
                  style={{ width: "100%", marginBottom: "10px" }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  size="sm"
                  onClick={() =>
                    addImages({
                      disasterId,
                      timestamp: new Date().toISOString(),
                      disasterImageUrl,
                      reporterId,
                    })
                  }
                >
                  Add Image
                </button>
              </div>{" "}
              {/* Display Uploaded Images */}
              <Card.Text>
                <strong>Uploaded Images:</strong> <br />
              </Card.Text>
              <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                {report?.disasterImages && report.disasterImages.length > 0 ? (
                  report.disasterImages.map((image, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        marginBottom: "10px",
                      }}
                    >
                      <img
                        src={image.disasterImageUrl}
                        alt={`Disaster image ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          marginBottom: "10px",
                        }}
                      />
                      <small>
                        Uploaded on:{" "}
                        {new Date(image.timestamp).toLocaleString()}
                      </small>

                      <button
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                        size="sm"
                        onClick={() =>
                          deleteImage({
                            disasterId,
                            timestamp: image.timestamp,
                            disasterImageUrl: image.disasterImageUrl,
                          })
                        }
                      >
                        <Trash color="red" />
                      </button>
                    </div>
                  ))
                ) : (
                  <span>No images uploaded yet.</span>
                )}
              </div>
            </Card.Body>
            <Card.Footer className="text-muted">
              <Row>
                <Col>
                  <PinMap className="me-2" />
                  <strong>Latitude:</strong> {latitude}
                </Col>
                <Col>
                  <PinMap className="me-2" />
                  <strong>Longitude:</strong> {longitude}
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </>
      ) : (
        <p>No report details found.</p>
      )}
    </>
  );
};

export default DisasterReportDetails;
