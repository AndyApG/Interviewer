import { CancellationError } from 'builder-util-runtime';

import downloadProtocol from '../../utils/protocol/downloadProtocol';
import extractProtocol from '../../utils/protocol/extractProtocol';
import parseProtocol from '../../utils/protocol/parseProtocol';
import checkExistingProtocol from '../../utils/protocol/checkExistingProtocol';

const DOWNLOAD_PROTOCOL = 'DOWNLOAD_PROTOCOL';
const EXTRACT_PROTOCOL = 'EXTRACT_PROTOCOL';
const PARSE_PROTOCOL = 'PARSE_PROTOCOL';
const CHECK_EXISTING_PROTOCOL = 'CHECK_EXISTING_PROTOCOL';
const IMPORT_PROTOCOL_START = 'IMPORT_PROTOCOL_START';
const IMPORT_PROTOCOL_FAILED = 'IMPORT_PROTOCOL_FAILED';
const IMPORT_PROTOCOL_COMPLETE = 'IMPORT_PROTOCOL_COMPLETE';
const RESET_IMPORT = 'RESET_IMPORT';

export const initialState = {
  status: 'inactive',
  step: 0,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case IMPORT_PROTOCOL_FAILED:
    case RESET_IMPORT:
      return initialState;
    case IMPORT_PROTOCOL_START:
      return {
        statusText: 'Initializing protocol import...',
        step: 1,
      };
    case DOWNLOAD_PROTOCOL:
      return {
        statusText: 'Downloading protocol...',
        step: 2,
      };
    case EXTRACT_PROTOCOL:
      return {
        statusText: 'Extracting protocol to temporary storage...',
        step: 3,
      };
    case PARSE_PROTOCOL:
      return {
        statusText: 'Parsing and validating protocol...',
        step: 4,
      };
    case CHECK_EXISTING_PROTOCOL:
      return {
        statusText: 'Checking for previous installation...',
        step: 5,
      };
    case IMPORT_PROTOCOL_COMPLETE:
      return {
        statusText: 'Protocol imported successfully!',
        step: 6,
      };
    default:
      return state;
  }
}

function downloadProtocolAction() {
  return {
    type: DOWNLOAD_PROTOCOL,
  };
}

function extractProtocolAction() {
  return {
    type: EXTRACT_PROTOCOL,
  };
}

function parseProtocolAction() {
  return {
    type: PARSE_PROTOCOL,
  };
}

function checkExistingProtocolAction() {
  return {
    type: CHECK_EXISTING_PROTOCOL,
  };
}

function importProtocolStartAction() {
  return {
    type: IMPORT_PROTOCOL_START,
  };
}

function importProtocolFailedAction(error) {
  return {
    type: IMPORT_PROTOCOL_FAILED,
    error,
  };
}

function importProtocolCompleteAction(protocolData) {
  return {
    type: IMPORT_PROTOCOL_COMPLETE,
    protocolData,
  };
}

function resetImportAction() {
  return {
    type: RESET_IMPORT,
  };
}

const cancelledImport = () => Promise.reject(new CancellationError('Import cancelled.'));

const catchError = error => Promise.reject(error);

const importProtocolFromURI = (uri, usePairedServer) => (dispatch, getState) => {
  let pairedServer;

  if (usePairedServer) {
    pairedServer = getState().pairedServer;
  }

  dispatch(importProtocolStartAction());
  dispatch(downloadProtocolAction());
  return downloadProtocol(uri, pairedServer)
    .then((tempLocation) => {
      if (getState().importProtocol.step === 0) return cancelledImport();
      dispatch(extractProtocolAction());
      return extractProtocol(tempLocation);
    }, catchError)
    .then((protocolPath) => {
      if (getState().importProtocol.step === 0) return cancelledImport();
      dispatch(parseProtocolAction());
      return parseProtocol(protocolPath);
    }, catchError)
    .then((protocolContent) => {
      if (getState().importProtocol.step === 0) return cancelledImport();
      dispatch(checkExistingProtocolAction());
      return checkExistingProtocol(dispatch, getState(), protocolContent);
    })
    .then((protocolContent) => {
      if (getState().importProtocol.step === 0) return cancelledImport();
      return dispatch(importProtocolCompleteAction(protocolContent));
    }, catchError)
    .catch(
      (error) => {
        if (error instanceof CancellationError) {
          dispatch(resetImportAction());
        } else {
          dispatch(importProtocolFailedAction(error));
        }
      },
    );
};

const importProtocolFromFile = filePath => (dispatch, getState) => {
  dispatch(importProtocolStartAction());
  dispatch(extractProtocolAction());
  return extractProtocol(filePath)
    .then((protocolPath) => {
      if (getState().importProtocol.step === 0) return cancelledImport();
      dispatch(parseProtocolAction());
      return parseProtocol(protocolPath);
    }, catchError)
    .then((protocolContent) => {
      if (getState().importProtocol.step === 0) return cancelledImport();
      dispatch(checkExistingProtocolAction());
      return checkExistingProtocol(dispatch, getState(), protocolContent);
    })
    .then((protocolContent) => {
      if (getState().importProtocol.step === 0) return cancelledImport();
      return dispatch(importProtocolCompleteAction(protocolContent));
    }, catchError)
    .catch(
      (error) => {
        if (error instanceof CancellationError) {
          dispatch(resetImportAction());
        } else {
          dispatch(importProtocolFailedAction(error));
        }
      },
    );
};


const actionCreators = {
  importProtocolFromURI,
  importProtocolFromFile,
  parseProtocol: parseProtocolAction,
  extractProtocol: extractProtocolAction,
  downloadProtocol: downloadProtocolAction,
  checkExistingProtocol: checkExistingProtocolAction,
  importProtocolStart: importProtocolStartAction,
  importProtocolComplete: importProtocolCompleteAction,
  importProtocolFailed: importProtocolFailedAction,
  resetImportProtocol: resetImportAction,
};

const actionTypes = {
  EXTRACT_PROTOCOL,
  DOWNLOAD_PROTOCOL,
  PARSE_PROTOCOL,
  CHECK_EXISTING_PROTOCOL,
  IMPORT_PROTOCOL_START,
  IMPORT_PROTOCOL_FAILED,
  IMPORT_PROTOCOL_COMPLETE,
  RESET_IMPORT,
};

export {
  actionCreators,
  actionTypes,
};
