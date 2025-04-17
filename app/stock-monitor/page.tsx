'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function Page() {
  const [watchlist, setWatchlist] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      watchlist.forEach(stock => {
        axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${stock.symbol}`)
          .then(res => {
            const currentPrice = res.data.quoteResponse.result[0].regularMarketPrice;
            if (currentPrice <= stock.targetPrice) {
              setAlerts(prev => [...prev, `${stock.symbol} dropped to RM ${currentPrice} (target: RM ${stock.targetPrice})`]);
            }
          });
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [watchlist]);

  const handleAdd = () => {
    if (symbol && targetPrice) {
      setWatchlist([...watchlist, { symbol, targetPrice: parseFloat(targetPrice) }]);
      setSymbol("");
      setTargetPrice("");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">📈 股票价格监控系统</h1>

      <div className="flex space-x-2">
        <Input placeholder="股票代码 (如 HARTA.KL)" value={symbol} onChange={e => setSymbol(e.target.value)} />
        <Input placeholder="目标价 (如 2.10)" type="number" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} />
        <Button onClick={handleAdd}>加入监控</Button>
      </div>

      <div>
        <h2 className="font-semibold">🕵️‍♂️ 当前监控列表：</h2>
        {watchlist.map((item, idx) => (
          <Card key={idx} className="my-2">
            <CardContent>
              {item.symbol} 目标价：RM {item.targetPrice.toFixed(2)}
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="font-semibold">🚨 触发提醒：</h2>
        {alerts.map((alert, idx) => (
          <p key={idx} className="text-red-500">{alert}</p>
        ))}
      </div>
    </div>
  );
}
