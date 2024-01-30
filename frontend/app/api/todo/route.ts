import { NextResponse } from 'next/server';

import { API_BASE_URL } from '../../../constants';
import { APIException, APIExceptionCode } from '../../../exception/APIException';

// Create new todo item
export async function POST(request: Request) {
  const { id, user_id, description } = await request.json();

  try {
    const response = await fetch(`${API_BASE_URL}/todo`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id: id.toString(),
        user_id,
        description
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

// Delete a todo item
export async function DELETE(
  request: Request
) {
  const { id, user_id } = await request.json();

  try {
    const response = await fetch(`${API_BASE_URL}/todo`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        id,
        user_id
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