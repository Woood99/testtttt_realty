import React from 'react';

import styles from './CounterSlider.module.scss';

const CounterSlider = ({ current, total }) => {
   return (
      <div>
         <span>{current}</span>
         <span>из</span>
         <span>{total}</span>
      </div>
   );
};

export default CounterSlider;
