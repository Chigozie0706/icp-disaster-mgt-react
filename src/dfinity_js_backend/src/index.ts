import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import { Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal } from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

// Define the structure of the DisasterReport payload
const DisasterReportPayload = Record({
    reporterName: text,
    contact: text,
    email: text,
    disasterType: text,
    imgUrl : text,
    latitude: text,
    longitude: text,
    city: text,
    state: text,
    date: text,
    severity: text,
    impact: text,
});

// Define the structure of the  payload
const DisasterImagesPayload = Record({
    disasterId: text,
    timestamp: text,
    disasterImageUrl : text
});

// Define the structure of the DisasterReport object
const DisasterReport = Record({
    disasterId: text,
    reporterId: Principal,
    reporterName: text,
    contact: text,
    email: text,
    disasterType: text,
    imgUrl : text,
    latitude: text,
    longitude: text,
    city: text,
    state: text,
    date: text,
    severity: text,
    impact: text,
    disasterImages: Vec(DisasterImagesPayload),
});

// Define the possible message variants for errors and notifications
const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    AlreadyExist: text,
    NotAuthorized: text
});

const disasterReportStorage = StableBTreeMap(0, text, DisasterReport);

export default Canister({

    // Query to get all disaster reports
    getAllDisasterReports: query([], Vec(DisasterReport), () => {
        return disasterReportStorage.values();
    }),

    // Query to get a specific disaster report by ID
    getDisasterReportById: query([text], Result(DisasterReport, Message), (id) => {
        if (!isValidUuid(id)) {
            return Err({ InvalidPayload: `id=${id} is not in the valid format.` });
        }

        const report = disasterReportStorage.get(id);
        if ("None" in report) {
            return Err({ NotFound: `disaster report with id=${id} not found` });
        }
        return Ok(report.Some);
    }),

    // Update method to create a new disaster report
    createDisasterReport: update([DisasterReportPayload], Result(DisasterReport, Message), (payload) => {
        // @ts-ignore
        const validatePayloadErrors = validateDisasterReportPayload(payload);
        if (validatePayloadErrors.length) {
            return Err({
                InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
            });
        }

        const report = { disasterId: uuidv4(), reporterId: ic.caller(), disasterImages : [],  ...payload };

        disasterReportStorage.insert(report.disasterId, report);
        return Ok(report);
    }),

    // Update method to update an existing disaster report by ID
    updateDisasterReportById: update([text, DisasterReportPayload], Result(DisasterReport, Message), (id, payload) => {
        if (!isValidUuid(id)) {
            return Err({ InvalidPayload: `id=${id} is not in the valid format.` });
        }
        // @ts-ignore
        const validatePayloadErrors = validateDisasterReportPayload(payload);
        if (validatePayloadErrors.length) {
            return Err({
                InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
            });
        }

        const reportOpt = disasterReportStorage.get(id);
        if ("None" in reportOpt) {
            return Err({ NotFound: `cannot update report: disaster report with id=${id} not found` });
        }

        if (reportOpt.Some.reporterId.toText() !== ic.caller().toText()) {
            return Err({ NotAuthorized: `you are not the reporter of this disaster report with id=${id}` });
        }

        const existingReport = reportOpt.Some;

        const updatedReport = {
            ...existingReport,
            ...payload
        };

        disasterReportStorage.insert(id, updatedReport);
        return Ok(updatedReport);
    }),


    // Update method to add disaster images with timestamp
addDisasterImages: update([DisasterImagesPayload], Result(DisasterReport, Message), (payload) => {
    if (!isValidUuid(payload.disasterId)) {
        return Err({
            InvalidPayload: `payload.disasterId=${payload.disasterId} is not in the valid format.`,
        });
    }

    // @ts-ignore
    const validatePayloadErrors = validateDisasterImagesPayload(payload);
    if (validatePayloadErrors.length) {
        return Err({
            InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
        });
    }

    const { disasterId, disasterImageUrl, timestamp } = payload;
    const disasterOpt = disasterReportStorage.get(disasterId);

    if ("None" in disasterOpt) {
        return Err({ NotFound: `Disaster with id=${disasterId} not found` });
    }

    if (disasterOpt.Some.reporterId.toText() !== ic.caller().toText()) {
        return Err({ NotAuthorized: `you are not authorized to add images to this disaster with id=${disasterId} ` });
    }

    disasterOpt.Some.disasterImages.push({disasterId, timestamp, disasterImageUrl  });
    disasterReportStorage.insert(disasterId, disasterOpt.Some);
    return Ok(disasterOpt.Some);
}),


    // Update method to delete disaster images by Id
deleteDisasterImageById: update([DisasterImagesPayload], Result(DisasterReport, Message), (payload) => {
  if (!isValidUuid(payload.disasterId)) {
    return Err({
      InvalidPayload: `payload.disasterId=${payload.disasterId} is not in the valid format.`,
    });
  }

  const { disasterId, timestamp, disasterImageUrl } = payload;
  const disasterOpt = disasterReportStorage.get(disasterId);

  if ("None" in disasterOpt) {
    return Err({ NotFound: `Disaster with id=${disasterId} not found` });
  }

  if (disasterOpt.Some.reporterId.toText() !== ic.caller().toText()) {
    return Err({ NotAuthorized: `you are not authorized to delete images from this disaster with id=${disasterId} ` });
  }

      // @ts-ignore
  const imageIndex = disasterOpt.Some.disasterImages.findIndex((image) => image.timestamp === timestamp && image.disasterImageUrl === disasterImageUrl
  );
  if (imageIndex === -1) {
    return Err({ NotFound: `Image with timestamp=${timestamp} and disasterImageUrl=${disasterImageUrl} not found in disaster with id=${disasterId}` });
  }

  disasterOpt.Some.disasterImages.splice(imageIndex, 1);
  disasterReportStorage.insert(disasterId, disasterOpt.Some);
  return Ok(disasterOpt.Some);
}),

    /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
getAddressFromPrincipal: query([Principal], text, (principal) => {
    return hexAddressFromPrincipal(principal, 0);
}),

});

// Helper function to hash input
function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
}




// Helper function to generate a correlation ID
function generateCorrelationId(reportId: text): nat64 {
    const correlationId = `${reportId}_${ic.caller().toText()}_${ic.time()}`;
    return hash(correlationId);
}

// Helper function to discard by timeout
function discardByTimeout(memo: nat64, delay: Duration) {
    ic.setTimer(delay, () => {
        const order = disasterReportStorage.remove(memo);
        console.log(`Order discarded ${order}`);
    });
}

// Helper function to check if a string is invalid
function isInvalidString(str: text): boolean {
    return str.trim().length === 0;
}

// Helper function to validate UUID
function isValidUuid(id: string): boolean {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(id);
}


/**
 * Helper function to validate the DisasterImagesPayload
 */
function validateDisasterImagesPayload(
    payload: typeof DisasterImagesPayload
): Vec<string> {
    const errors: Vec<text> = [];

    // @ts-ignore
    if (isInvalidString(payload.disasterId)) {
        errors.push(`disasterId='${payload.disasterId}' cannot be empty.`);
    }
    
    // @ts-ignore
    if (isInvalidString(payload.timestamp)) {
        errors.push(`timestamp='${payload.timestamp}' cannot be empty.`);
    }
    
    // @ts-ignore
    if (isInvalidString(payload.disasterImageUrl)) {
        errors.push(`imageUrl='${payload.disasterImageUrl}' cannot be empty.`);
    }
    
    return errors;
}


// Helper function to validate DisasterReportPayload
function validateDisasterReportPayload(payload: typeof DisasterReportPayload): Vec<string> {
    const errors: Vec<text> = [];

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


    // @ts-ignore
    if (isInvalidString(payload.reporterName)) {
        errors.push(`reporterName='${payload.reporterName}' cannot be empty.`);
    }

    // @ts-ignore
    if (isInvalidString(payload.contact)) {
        errors.push(`contact='${payload.contact}' cannot be empty.`);
    }

    // @ts-ignore
    if (!emailRegex.test(payload.email)) {
        errors.push(`email='${payload.email}' is not in the valid format.`);
    }

    // @ts-ignore
    if (isInvalidString(payload.disasterType)) {
        errors.push(`disasterType='${payload.disasterType}' cannot be empty.`);
    }

        // @ts-ignore
        if (isInvalidString(payload.imgUrl)) {
            errors.push(`imgUrl='${payload.imgUrl}' cannot be empty.`);
        }

    // @ts-ignore
    if (isInvalidString(payload.city)) {
        errors.push(`city='${payload.city}' cannot be empty.`);
    }

    // @ts-ignore
    if (isInvalidString(payload.state)) {
        errors.push(`state='${payload.state}' cannot be empty.`);
    }

    // @ts-ignore
    if (isInvalidString(payload.date)) {
        errors.push(`date='${payload.date}' cannot be empty.`);
    }

    // @ts-ignore
    if (isInvalidString(payload.severity)) {
        errors.push(`severity='${payload.severity}' cannot be empty.`);
    }

    // @ts-ignore
    if (isInvalidString(payload.impact)) {
        errors.push(`impact='${payload.impact}' cannot be empty.`);
    }

    return errors;
}
