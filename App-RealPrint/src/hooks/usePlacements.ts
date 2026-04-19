import { useState, useEffect } from 'react';
import { placementService } from '../services/placementService';

export const usePlacements = (category = null) => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlacements = async () => {
      if (!category) {
        setPlacements([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await placementService.getByCategory(category);
        setPlacements(data || []);
      } catch (err) {
        console.error('Error fetching placements:', err);
        setError(err instanceof Error ? err.message : 'Error loading placements');
        setPlacements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, [category]);

  return { placements, loading, error };
};

