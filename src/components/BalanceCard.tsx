import React, { useState, useEffect } from 'react';
import { Horizon } from '@stellar/stellar-sdk';

export interface BalanceCardProps {
  publicKey: string;
  network?: 'testnet' | 'mainnet' | 'futurenet';
  horizonUrl?: string; // Optional custom URL
  className?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  publicKey,
  network = 'testnet',
  horizonUrl,
  className = '',
}) => {
  const [balances, setBalances] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isMounted = true;
    
    async function fetchBalances() {
      setLoading(true);
      setError(null);
      
      try {
        let url = horizonUrl;
        if (!url) {
          if (network === 'mainnet') url = 'https://horizon.stellar.org';
          else if (network === 'testnet') url = 'https://horizon-testnet.stellar.org';
          else url = 'https://horizon-futurenet.stellar.org';
        }
        
        const server = new Horizon.Server(url);
        const account = await server.accounts().accountId(publicKey).call();
        
        if (isMounted) {
          setBalances(account.balances);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMsg = (err as any)?.response?.data?.detail || (err as Error)?.message || 'Failed to fetch balances';
          setError(errorMsg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (publicKey) {
      fetchBalances();
    }
  }, [publicKey, network, horizonUrl]);

  return (
    <div
      className={`astral-balance-card ${className}`}
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '400px',
        fontFamily: 'sans-serif',
        backgroundColor: '#ffffff',
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#1a202c' }}>Account Balance</h3>
      <p
        style={{
          margin: '0 0 16px 0',
          fontSize: '0.85rem',
          color: '#718096',
          wordBreak: 'break-all',
        }}
      >
        {publicKey}{' '}
        <span
          style={{
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: '#edf2f7',
            fontSize: '0.7rem',
            textTransform: 'uppercase'
          }}
        >
          {network}
        </span>
      </p>

      {loading && <p style={{ color: '#a0aec0' }}>Loading balances...</p>}
      
      {error && (
        <div style={{ padding: '8px', backgroundColor: '#fed7d7', color: '#c53030', borderRadius: '4px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && balances.length === 0 && (
        <p style={{ color: '#a0aec0' }}>No balances found.</p>
      )}

      {!loading && !error && balances.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {balances.map((b, i) => {
            const assetCode = b.asset_type === 'native' ? 'XLM' : b.asset_code;
            return (
              <li
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: i === balances.length - 1 ? 'none' : '1px solid #edf2f7',
                }}
              >
                <strong style={{ color: '#2d3748' }}>{assetCode}</strong>
                <span style={{ color: '#4a5568' }}>{b.balance}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
