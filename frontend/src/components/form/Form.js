import React from 'react';
import PropTypes from 'prop-types';
import "./form.css";


function Form({children}) {
  return (
    <div className='form'>
      {children}
    </div>
  )
}

Form.prototype = {
  children: PropTypes.node.isRequired
};

export default Form;