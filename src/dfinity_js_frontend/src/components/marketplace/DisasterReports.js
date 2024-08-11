import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import RegisterDisasterReport from "./RegisterDisasterReport";
import DisasterReport from "./DisasterReport";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getAllDisasterReports,
  createDisasterReport,
  getDisasterReportById,
  updateDisasterReportById,
  deleteDisasterReportById,
} from "../../utils/marketplace";

const DisasterReports = () => {
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
  const [id, setId] = useState("");
  const [text, setText] = useState("register");
  const [reportDetails, setReportDetails] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setReporterName("");
    setContact("");
    setEmail("");
    setDisasterType("");
    setImgUrl("");
    setLatitude(0);
    setLongitude(0);
    setCity("");
    setState("");
    setDate("");
    setSeverity("");
    setImpact("");
    setText("register");
  };
  const handleShow = () => setShow(true);

  const isFormFilled = () =>
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
    impact;

  const getReports = useCallback(async () => {
    try {
      setLoading(true);
      setReports(await getAllDisasterReports());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = async (data) => {
    try {
      setLoading(true);
      createDisasterReport(data).then((resp) => {
        getReports();
        toast(
          <NotificationSuccess text="Disaster report created successfully." />
        );
        handleClose();
      });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a report." />);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportDetailsById = useCallback(async (id) => {
    try {
      const details = await getDisasterReportById(id);
      if (details.Ok) {
        setReportDetails(details.Ok);
        setReporterName(details.Ok.reporterName);
        setContact(details.Ok.contact);
        setEmail(details.Ok.email);
        setDisasterType(details.Ok.disasterType);
        setLatitude(details.Ok.latitude);
        setLongitude(details.Ok.longitude);
        setCity(details.Ok.city);
        setState(details.Ok.state);
        setDate(details.Ok.date);
        setSeverity(details.Ok.severity);
        setImpact(details.Ok.impact);
        setId(details.Ok.id);
        setText("update");
        handleShow();
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  const updateReport = async (id, data) => {
    try {
      setLoading(true);
      await updateDisasterReportById(id, data);
      await getReports();
      toast(
        <NotificationSuccess text="Disaster report updated successfully." />
      );
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to update report." />);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const deleteReport = async (id) => {
    try {
      setLoading(true);
      await deleteDisasterReportById(id);
      await getReports();
      toast(
        <NotificationSuccess text="Disaster report deleted successfully." />
      );
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to delete report." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReports();
  }, [getReports]);

  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0 mt-4">Disaster Reports</h1>
            <RegisterDisasterReport
              save={createReport}
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
            />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
            {reports.map((report) => (
              <DisasterReport
                key={report.disasterId}
                report={{
                  ...report,
                }}
                fetchReportDetailsById={fetchReportDetailsById}
                deleteReport={deleteReport}
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

export default DisasterReports;
