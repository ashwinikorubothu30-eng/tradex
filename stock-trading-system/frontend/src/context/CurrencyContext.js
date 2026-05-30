import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getExchangeRates } from '../services/currencyService';
import { updateProfile } from '../services/authService';
import { useAuth } from './AuthContext';
import { CURRENCIES, detectCurrencyFromLocale, getCurrencyMeta } from '../utils/currencies';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};

export const CurrencyProvider = ({ children }) => {
  const { user, isAuthenticated, updateUserState } = useAuth();
  const [currency, setCurrencyState] = useState(() => detectCurrencyFromLocale());
  const [rates, setRates] = useState({ USD: 1 });
  const [ratesLoading, setRatesLoading] = useState(true);

  const fetchRates = useCallback(async () => {
    try {
      const { data } = await getExchangeRates();
      setRates(data.data.rates || { USD: 1 });
    } catch {
      setRates({ USD: 1, INR: 83.5, EUR: 0.92, GBP: 0.79 });
    } finally {
      setRatesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  useEffect(() => {
    if (user?.preferredCurrency) {
      setCurrencyState(user.preferredCurrency);
      localStorage.setItem('tradex_currency', user.preferredCurrency);
    } else if (user && !user.preferredCurrency) {
      const detected = detectCurrencyFromLocale();
      setCurrencyState(detected);
    }
  }, [user?.preferredCurrency, user]);

  const setCurrency = async (code) => {
    const upper = code.toUpperCase();
    if (!CURRENCIES.some((c) => c.code === upper)) return;

    setCurrencyState(upper);
    localStorage.setItem('tradex_currency', upper);

    if (isAuthenticated) {
      try {
        const { data } = await updateProfile({ preferredCurrency: upper });
        updateUserState({ preferredCurrency: data.data.preferredCurrency });
      } catch {
        /* preference kept locally */
      }
    }
  };

  const convert = useCallback(
    (amountUsd) => {
      const rate = rates[currency] ?? 1;
      const raw = (amountUsd || 0) * rate;
      if (currency === 'JPY' || currency === 'KRW') return Math.round(raw);
      return parseFloat(raw.toFixed(2));
    },
    [currency, rates]
  );

  const formatMoney = useCallback(
    (amountUsd, options = {}) => {
      const { compact = false, showCode = false } = options;
      const value = convert(amountUsd);
      const meta = getCurrencyMeta(currency);
      const fractionDigits = currency === 'JPY' || currency === 'KRW' ? 0 : 2;

      let formatted;
      try {
        formatted = new Intl.NumberFormat(meta.locale, {
          style: 'currency',
          currency,
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
          notation: compact && Math.abs(value) >= 1000000 ? 'compact' : 'standard',
        }).format(value);
      } catch {
        formatted = `${meta.symbol}${value.toLocaleString(undefined, {
          minimumFractionDigits: fractionDigits,
          maximumFractionDigits: fractionDigits,
        })}`;
      }

      return showCode ? `${formatted} ${currency}` : formatted;
    },
    [currency, convert]
  );

  const formatSignedMoney = useCallback(
    (amountUsd) => {
      const sign = (amountUsd || 0) >= 0 ? '+' : '-';
      return `${sign}${formatMoney(Math.abs(amountUsd || 0))}`;
    },
    [formatMoney]
  );

  const meta = getCurrencyMeta(currency);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        symbol: meta.symbol,
        currencies: CURRENCIES,
        rates,
        ratesLoading,
        setCurrency,
        convert,
        formatMoney,
        formatSignedMoney,
        baseCurrency: 'USD',
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
