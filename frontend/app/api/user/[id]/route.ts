import { NextResponse } from 'next/server';

import { API_BASE_URL } from '../../../../constants';
import { APIException, APIExceptionCode } from '../../../../exception/APIException';

// Retrieve a user's details.
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {

  try {
    const userId = params.id;
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
      cache: 'no-store'
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
