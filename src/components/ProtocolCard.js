import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ProtocolCard as UIProtocolCard } from '@codaco/ui/lib/components/Cards';
import { actionCreators as dialogActions } from '../ducks/modules/dialogs';
import { APP_SUPPORTED_SCHEMA_VERSIONS, APP_SCHEMA_VERSION } from '../config';

const ProtocolCard = (props) => {
  const {
    attributes,
    onClickHandler,
    openDialog,
    condensed,
  } = props;

  const {
    schemaVersion,
    lastModified,
    installationDate,
    name,
    description,
  } = attributes;

  const isOutdatedProtocol = () =>
    schemaVersion !== APP_SCHEMA_VERSION &&
    APP_SUPPORTED_SCHEMA_VERSIONS.includes(schemaVersion);

  const isObsoleteProtocol = () => false; // To be implemented in future, as needed.

  const handleSchemaOutdatedInfo = () => {
    openDialog({
      type: 'Notice',
      title: 'Schema can be updated',
      canCancel: false,
      message: (
        <React.Fragment>
          <p>
            This protocol uses an older version of the protocol file format, or &quot;schema&quot;.
          </p>
          <p>
            Newer schema versions support additional features in Network Canvas. During the beta
            phase, we kindly request that you update your protocols to the latest version, and
            evaluate the newest features as we implement them. To do this, open the original
            protocol file it in the latest version of Architect, and follow the migration
            instructions. Once migrated, install the new version of the protocol on this device.
          </p>
          <p>
            For documentation on this issue, please see our documentation site.
          </p>
          <p>
            In the meantime, you can continue to use this protocol to start interviews or
            export data.
          </p>
        </React.Fragment>
      ),
    });
  };

  const handleSchemaObsoleteInfo = () => {
    openDialog({
      type: 'Error',
      title: 'Obsolete Protocol Schema',
      canCancel: false,
      message: (
        <React.Fragment>
          <p>
            This protocol uses an obsolete version of the protocol file format, or
            &quot;schema&quot;.
          </p>
          <p>
            The version of the schema used by this protocol is incompatible with this version of
            Network Canvas. You may still export interview data that has already been collected,
            but you may not start additional interviews.
          </p>
          <p>
            If you require the ability to start interviews, you can either (1) install an updated
            version of this protocol that uses the latest schema, or (2) downgrade your version
            of Network Canvas to a version that supports this protocol schema version.
          </p>
          <p>
            For documentation on this issue, please see our documentation site.
          </p>
        </React.Fragment>
      ),
    });
  };

  const handleStatusClick = () => {
    if (isObsoleteProtocol()) {
      handleSchemaObsoleteInfo();
      return;
    }

    handleSchemaOutdatedInfo();
  };

  console.log('protocolcard', props);
  return (
    <UIProtocolCard
      schemaVersion={schemaVersion}
      lastModified={lastModified}
      installationDate={installationDate}
      name={name}
      condensed={condensed}
      description={description}
      isOutdated={isOutdatedProtocol()}
      isObsolete={isObsoleteProtocol()}
      onStatusClickHandler={() => handleStatusClick}
      onClickHandler={onClickHandler}
    />
  );
};

ProtocolCard.defaultProps = {
  onClickHandler: () => {},
  description: null,
  condensed: false,
};

ProtocolCard.propTypes = {
  onClickHandler: PropTypes.func,
  openDialog: PropTypes.func.isRequired,
  condensed: PropTypes.bool,
  attributes: PropTypes.shape({
    schemaVersion: PropTypes.number.isRequired,
    lastModified: PropTypes.string.isRequired,
    installationDate: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,

};

const mapDispatchToProps = {
  openDialog: dialogActions.openDialog,
};

export default connect(null, mapDispatchToProps)(ProtocolCard);

