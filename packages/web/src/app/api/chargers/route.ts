import { NextResponse } from 'next/server';
import { sampleChargers } from '@charge-spec/shared';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Get query parameters
  const search = searchParams.get('search') || '';
  const brand = searchParams.get('brand');
  const minPower = searchParams.get('minPower');
  const maxPower = searchParams.get('maxPower');
  const protocol = searchParams.get('protocol');

  let results = sampleChargers;

  // Apply search filter
  if (search) {
    const query = search.toLowerCase();
    results = results.filter((charger) => {
      return (
        charger.brand.toLowerCase().includes(query) ||
        charger.power.maxPower.toString().includes(query) ||
        charger.model.toLowerCase().includes(query) ||
        charger.displayName.toLowerCase().includes(query) ||
        charger.protocols.some((p) => p.toLowerCase().includes(query))
      );
    });
  }

  // Apply brand filter
  if (brand) {
    results = results.filter((charger) =>
      charger.brand.toLowerCase() === brand.toLowerCase()
    );
  }

  // Apply power range filter
  if (minPower) {
    results = results.filter(
      (charger) => charger.power.maxPower >= parseInt(minPower)
    );
  }

  if (maxPower) {
    results = results.filter(
      (charger) => charger.power.maxPower <= parseInt(maxPower)
    );
  }

  // Apply protocol filter
  if (protocol) {
    results = results.filter((charger) =>
      charger.protocols.some((p) => p.toLowerCase() === protocol.toLowerCase())
    );
  }

  return NextResponse.json({
    chargers: results,
    total: results.length,
    filters: {
      search,
      brand,
      minPower,
      maxPower,
      protocol,
    },
  });
}
