"""
Binance broker - fetches real OHLC data from Binance API.
"""
import httpx
from typing import List, Dict, Any, Optional
from brokers.base import BrokerBase
from core.candle import Candle


class BinanceBroker(BrokerBase):
    """
    Binance broker implementation.
    
    Fetches real market data from Binance public API.
    No API keys required for public endpoints.
    """
    
    BASE_URL = "https://api.binance.com/api/v3"
    PAGE_SIZE = 1000       # Binance per-request maximum
    MAX_CANDLES = 10000    # Hard safety cap across paginated requests

    def __init__(self):
        """Initialize the Binance broker."""
        self.name = "binance"

    def get_name(self) -> str:
        """Get the broker name."""
        return self.name

    def get_ohlc(
        self,
        symbol: str,
        interval: str,
        limit: Optional[int] = None,
        start_time: Optional[int] = None,
        end_time: Optional[int] = None
    ) -> List[Candle]:
        """
        Fetch OHLC data from Binance, paginating past the 1000-candle
        per-request limit when a larger range is requested.

        Args:
            symbol: Trading symbol (e.g., "BTCUSDT", "ETHUSDT")
            interval: Time interval (e.g., "1m", "5m", "1h", "1d")
            limit: Total number of candles to return (default: 500, max: 10000)
            start_time: Start timestamp in milliseconds (optional)
            end_time: End timestamp in milliseconds (optional)

        Returns:
            List of Candle objects with normalized format
        """
        if limit is None:
            limit = 500 if not (start_time and end_time) else self.MAX_CANDLES
        limit = min(limit, self.MAX_CANDLES)

        normalized_interval = self._normalize_interval(interval)

        # Binance without startTime returns only the latest window, so requests
        # beyond one page need an explicit anchor to paginate forward from.
        if start_time is None and limit > self.PAGE_SIZE:
            import time
            anchor = end_time if end_time else int(time.time() * 1000)
            start_time = anchor - limit * self._interval_ms(normalized_interval)

        candles: List[Candle] = []
        cursor = start_time

        try:
            with httpx.Client(timeout=15.0) as client:
                while len(candles) < limit:
                    page_limit = min(self.PAGE_SIZE, limit - len(candles))
                    params = {
                        "symbol": symbol.upper(),
                        "interval": normalized_interval,
                        "limit": page_limit,
                    }
                    if cursor:
                        params["startTime"] = cursor
                    if end_time:
                        params["endTime"] = end_time

                    response = client.get(f"{self.BASE_URL}/klines", params=params)
                    response.raise_for_status()
                    data = response.json()

                    if not data:
                        break

                    for raw in data:
                        candles.append(Candle(
                            timestamp=int(raw[0]),   # Open time
                            open=float(raw[1]),
                            high=float(raw[2]),
                            low=float(raw[3]),
                            close=float(raw[4]),
                            volume=float(raw[5])
                        ))

                    # Without a start cursor Binance returns the latest window;
                    # there is nothing further to paginate.
                    if cursor is None:
                        break
                    if len(data) < page_limit:
                        break  # Reached the end of available data
                    cursor = int(data[-1][0]) + 1  # Next page starts after last open time

            return candles

        except httpx.HTTPStatusError as e:
            raise Exception(f"Binance API error: {e.response.status_code} - {e.response.text}")
        except httpx.RequestError as e:
            raise Exception(f"Network error connecting to Binance: {str(e)}")
        except Exception as e:
            raise Exception(f"Error fetching Binance data: {str(e)}")
    
    def place_order(
        self,
        symbol: str,
        side: str,
        order_type: str,
        quantity: float,
        price: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Place a trading order (not implemented - requires authentication).
        
        Args:
            symbol: Trading symbol
            side: "BUY" or "SELL"
            order_type: "MARKET" or "LIMIT"
            quantity: Order quantity
            price: Limit price (required for LIMIT orders)
            
        Returns:
            Order response dictionary
            
        Raises:
            NotImplementedError: Order placement requires API keys
        """
        raise NotImplementedError(
            "Order placement requires Binance API keys and authentication. "
            "This feature is not implemented in the public endpoint."
        )
    
    def _interval_ms(self, interval: str) -> int:
        """Milliseconds per candle for a Binance interval string."""
        unit = interval[-1]
        value = int(interval[:-1])
        per_unit = {"m": 60_000, "h": 3_600_000, "d": 86_400_000, "w": 604_800_000, "M": 2_592_000_000}
        return value * per_unit.get(unit, 3_600_000)

    def _normalize_interval(self, interval: str) -> str:
        """
        Normalize interval to Binance format.
        
        Args:
            interval: Interval string (e.g., "1h", "5m", "1d")
            
        Returns:
            Binance interval format
        """
        # Binance supports: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
        interval_map = {
            "1m": "1m",
            "3m": "3m",
            "5m": "5m",
            "15m": "15m",
            "30m": "30m",
            "1h": "1h",
            "2h": "2h",
            "4h": "4h",
            "6h": "6h",
            "8h": "8h",
            "12h": "12h",
            "1d": "1d",
            "3d": "3d",
            "1w": "1w",
            "1M": "1M",
        }
        
        # Check if interval is already in Binance format
        if interval in interval_map:
            return interval
        
        # Try to convert common formats
        interval_lower = interval.lower()
        if interval_lower in interval_map:
            return interval_map[interval_lower]
        
        # Default to 1h if not recognized
        return "1h"
