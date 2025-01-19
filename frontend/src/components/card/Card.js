import React from 'react';
import PropTypes from 'prop-types';
import './card.css'; // Create a CSS file for styling the card

const Card = ({ children }) => {
    return (
        <div className="card">
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired
};

export default Card;
