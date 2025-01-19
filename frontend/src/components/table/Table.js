import React from 'react';
import PropTypes from 'prop-types';
import './table.css'; // Create a CSS file for styling the card

const Table = ({ children }) => {
    return (
        <div className="table-container">
            {children}
        </div>
    );
};

Table.propTypes = {
    children: PropTypes.node.isRequired
};

export default Table;
