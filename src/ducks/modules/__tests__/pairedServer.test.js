/* eslint-env jest */
import reducer, { actionCreators, actionTypes } from '../pairedServer';

const initialState = null;
const mockServer = { addresses: ['localhost'], port: 9999 };

describe('pairedServer reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(null);
  });

  it('returns the set server', () => {
    const reduced = reducer(initialState, { type: actionTypes.SET_SERVER, server: mockServer });
    expect(reduced).toEqual(mockServer);
  });

  it('decorates with client info', () => {
    const deviceId = 'deviceId';
    const deviceSecret = 'deviceSecret';
    const action = { type: actionTypes.SET_SERVER, server: mockServer, deviceId, deviceSecret };
    const reduced = reducer(initialState, action);
    expect(reduced).toEqual({ ...mockServer, deviceId, deviceSecret });
  });
});

describe('pairedServer action creator', () => {
  it('supports setting a paired server', () => {
    const expectedAction = { type: actionTypes.SET_SERVER, server: mockServer };
    expect(actionCreators.setPairedServer(mockServer)).toEqual(expectedAction);
  });
});
