import uuid from 'uuid/v4';
import { orderBy, values, mapValues } from 'lodash';
import { createSelector } from 'reselect';
import { isPreview } from '../utils/Environment';
import { getActiveSession, getLastActiveSession } from './session';
import { entityAttributesProperty } from '../ducks/modules/network';

const DefaultFinishStage = {
  // `id` is used as component key; must be unique from user input
  id: uuid(),
  type: 'FinishSession',
  label: 'Finish Interview',
};

export const getInstalledProtocols = state => state.installedProtocols;

export const getCurrentSessionProtocol = createSelector(
  (state, props) => getActiveSession(state, props),
  getInstalledProtocols,
  (session, protocols) => {
    if (!session) {
      return {};
    }
    return protocols[session.protocolUID];
  },
);

// Use the protocol associated with the last active session, unless there is a protocol with
// an `installationDate` that is more recent.
export const getLastActiveProtocol = (state) => {
  const installedProtocols = getInstalledProtocols(state);

  if (Object.keys(installedProtocols).length === 0) {
    return null;
  }

  const lastActiveSession = getLastActiveSession(state);

  const protocolsCollection = values(mapValues(installedProtocols, (protocol, protocolUID) => ({
    protocolUID,
    ...protocol,
  })));

  const lastInstalledProtocol = orderBy(protocolsCollection, ['installationDate'], ['desc'])[0];

  if (
    lastActiveSession[entityAttributesProperty] &&
    lastActiveSession[entityAttributesProperty].updatedAt && // Last active session exists
    lastActiveSession[entityAttributesProperty].updatedAt > lastInstalledProtocol.installationDate
  ) {
    return {
      ...installedProtocols[lastActiveSession[entityAttributesProperty].protocolUID],
      protocolUID: lastActiveSession[entityAttributesProperty].protocolUID,
    };
  }

  return lastInstalledProtocol;
};

export const getActiveProtocolName = createSelector(
  getCurrentSessionProtocol,
  protocol => protocol && protocol.name,
);

export const getAssetManifest = createSelector(
  getCurrentSessionProtocol,
  protocol => protocol.assetManifest,
);


export const getProtocolCodebook = createSelector(
  getCurrentSessionProtocol,
  protocol => protocol.codebook,
);

const withFinishStage = (stages = []) => {
  if (!stages) { return []; }
  if (isPreview()) { return stages; }

  return [...stages, DefaultFinishStage];
};

export const getProtocolStages = createSelector(
  getCurrentSessionProtocol,
  protocol => withFinishStage(protocol.stages),
);
