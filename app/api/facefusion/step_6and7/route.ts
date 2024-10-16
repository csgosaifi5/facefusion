import { getUserById, updateUser } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";
import { encodeCredentials, wait } from "@/lib/helpers/facefusion";
const API_BASE_URL = "https://instance-manager.onrender.com"; // Replace with your actual API base URL
const AUTH_USERNAME = "admin"; // Replace with your username
const AUTH_PASSWORD = "secret"; // Replace with your password

// username root
// sshkeypath vastai


// STEP 6
export const POST = async (request: Request) => {
  try {
    const { user_id, managerId, sessionId } = await request.json();
    const command: string = "logs";

    const runCommandResponse = await fetch(`${API_BASE_URL}/managers/${managerId}/sessions/${sessionId}/commands/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: encodeCredentials(AUTH_USERNAME, AUTH_PASSWORD),
      },
      body: JSON.stringify({ command }),
    });

    if (!runCommandResponse.ok) {
      throw new Error(`Failed to run command '${command}': ${runCommandResponse.statusText}`);
    }

    const runCommandData = await runCommandResponse.json();

    return new NextResponse(JSON.stringify(runCommandData), { status: 200 });
  } catch (error) {
    console.error("Error in POST:", error);
    // Return an error response in case of failure
    return new NextResponse(JSON.stringify({ error: error }), { status: 500 });
  }
};


//STEP 7

export const PUT = async (request: Request) => {
  try {
    const { user_id, managerId, sessionId } = await request.json();

    const fetchLogsResponse = await fetch(`${API_BASE_URL}/managers/${managerId}/sessions/${sessionId}/logs/`, {
      method: "GET",
      headers: {
        Authorization: encodeCredentials(AUTH_USERNAME, AUTH_PASSWORD),
      },
    });

    if (!fetchLogsResponse.ok) {
      throw new Error(`Failed to fetch logs: ${fetchLogsResponse.statusText}`);
    }

    const fetchLogsData = await fetchLogsResponse.json();

    return new NextResponse(JSON.stringify({ data: fetchLogsData, message :"Logs fetched" }), { status: 200 });
  } catch (error) {
    console.error("Error in POST:", error);
    // Return an error response in case of failure
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};