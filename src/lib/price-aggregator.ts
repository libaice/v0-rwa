import { calculateWeightedAverage, calculateMedian } from './utils';

export interface PriceSource {
  source: string;
  price: number;
  timestamp: Date;
  confidence: number;
}

export interface AggregationResult {
  finalPrice: number;
  method: 'weighted_average' | 'median' | 'mean';
  sourceCount: number;
  confidenceScore: number;
  outliers: PriceSource[];
}

export class PriceAggregator {
  private outlierThreshold: number = 0.1; // 10% deviation threshold

  aggregatePrices(
    sources: PriceSource[],
    method: 'weighted_average' | 'median' | 'mean' = 'weighted_average'
  ): AggregationResult {
    if (sources.length === 0) {
      throw new Error('No price sources provided');
    }

    // Filter out stale data (older than 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const validSources = sources.filter(s => s.timestamp > fiveMinutesAgo);

    if (validSources.length === 0) {
      throw new Error('All price sources are stale');
    }

    // Calculate initial price estimate
    const prices = validSources.map(s => s.price);
    const initialEstimate = calculateMedian(prices);

    // Detect outliers
    const outliers = this.detectOutliers(validSources, initialEstimate);
    const cleanSources = validSources.filter(s => !outliers.includes(s));

    // Calculate final price based on method
    let finalPrice: number;

    switch (method) {
      case 'weighted_average':
        finalPrice = calculateWeightedAverage(
          cleanSources.map(s => ({ price: s.price, weight: s.confidence }))
        );
        break;
      case 'median':
        finalPrice = calculateMedian(cleanSources.map(s => s.price));
        break;
      case 'mean':
        finalPrice = cleanSources.reduce((sum, s) => sum + s.price, 0) / cleanSources.length;
        break;
    }

    // Calculate overall confidence score
    const confidenceScore = this.calculateConfidenceScore(cleanSources, outliers.length);

    return {
      finalPrice,
      method,
      sourceCount: cleanSources.length,
      confidenceScore,
      outliers,
    };
  }

  private detectOutliers(sources: PriceSource[], referencePrice: number): PriceSource[] {
    return sources.filter(source => {
      const deviation = Math.abs(source.price - referencePrice) / referencePrice;
      return deviation > this.outlierThreshold;
    });
  }

  private calculateConfidenceScore(sources: PriceSource[], outlierCount: number): number {
    if (sources.length === 0) return 0;

    // Factor 1: Average confidence of sources
    const avgConfidence = sources.reduce((sum, s) => sum + s.confidence, 0) / sources.length;

    // Factor 2: Number of sources (more is better, up to a point)
    const sourceFactor = Math.min(sources.length / 10, 1);

    // Factor 3: Outlier ratio (fewer outliers is better)
    const totalSources = sources.length + outlierCount;
    const outlierFactor = 1 - (outlierCount / totalSources);

    // Weighted combination
    return (avgConfidence * 0.5) + (sourceFactor * 0.3) + (outlierFactor * 0.2);
  }

  validatePriceChange(
    currentPrice: number,
    newPrice: number,
    maxChangePercent: number = 20
  ): boolean {
    const changePercent = Math.abs((newPrice - currentPrice) / currentPrice) * 100;
    return changePercent <= maxChangePercent;
  }
}