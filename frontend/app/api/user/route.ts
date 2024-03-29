import { NextResponse } from 'next/server';

import { API_BASE_URL } from '../../../constants';
import { APIException, APIExceptionCode } from '../../../exception/APIException';

// Register a new user.
export async function POST(request: Request) {
  const { id, name } = await request.json();

  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id,
        name
      }),
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

// Delete a user's account.
export async function DELETE(
  request: Request
) {
  const { id } = await request.json();

  try {
    const response = await fetch(`${API_BASE_URL}/user/`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id
      }),
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