import { NextResponse } from 'next/server';

import { API_BASE_URL } from '../../../constants';
import { APIException, APIExceptionCode } from '../../../exception/APIException';

// Get weather data from the API
export async function GET(request: Request) {
  try {
    const response = await fetch(`${API_BASE_URL}/weather?zip_code=30309`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.log('Error from API side: ' + response.statusText);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Error retrieving API response: ' + error);

    return NextResponse.json(
      new APIException(
        APIExceptionCode.UNKNOWN_ERROR,
        error instanceof Error ? error.message : 'Unknown Error'
      ).toJSON()
    );
  }
}
