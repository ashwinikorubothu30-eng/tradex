import React from 'react';
import { Form } from 'react-bootstrap';
import { useCurrency } from '../context/CurrencyContext';

const CurrencySelector = ({ size = 'sm', className = '' }) => {
  const { currency, currencies, setCurrency, ratesLoading } = useCurrency();

  return (
    <Form.Select
      size={size}
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className={className}
      style={{ minWidth: '110px' }}
      title="Display currency (converted from USD at live rates)"
      disabled={ratesLoading}
    >
      {currencies.map((c) => (
        <option key={c.code} value={c.code}>
          {c.symbol} {c.code}
        </option>
      ))}
    </Form.Select>
  );
};

export default CurrencySelector;
