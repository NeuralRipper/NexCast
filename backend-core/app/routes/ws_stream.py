"""
WebSocket endpoint for real-time frame processing
Receives frames, sends back audio commentary
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..services.pipeline import process_frame

router = APIRouter()

# In-memory session storage: {session_id: {"preferences": {...}}}
sessions = {}


@router.websocket("/ws/{session_id}")
async def websocket_stream(websocket: WebSocket, session_id: int):
    """
    WebSocket handler for live commentary streaming

    Protocol:
        1. Client connects
        2. Client sends initial preferences: {"type": "init", "preferences": {...}}
        3. Client sends frames: {"type": "frame", "frame": "base64..."}
        4. Server responds with: {"type": "audio", "audio": "base64..."}
    """
    await websocket.accept()
    print(f"[{session_id}] WebSocket connected")

    try:
        # Wait for initial handshake with preferences
        init_data = await websocket.receive_json()
        if init_data.get("type") == "init":
            sessions[session_id] = {"preferences": init_data.get("preferences", {})}
            print(f"[{session_id}] Session initialized with preferences")
            await websocket.send_json({"type": "ready"})

        # Main frame processing loop
        while True:
            data = await websocket.receive_json()

            if data.get("type") == "frame":
                frame_base64 = data["frame"]
                preferences = sessions[session_id]["preferences"]

                # Process through pipeline
                print(f"[{session_id}] Processing frame...")
                audio_base64 = await process_frame(session_id, frame_base64, preferences)

                # Send audio back
                await websocket.send_json({"type": "audio", "audio": audio_base64})

    except WebSocketDisconnect:
        # Cleanup session
        if session_id in sessions:
            del sessions[session_id]
        print(f"[{session_id}] WebSocket disconnected")
    except Exception as e:
        print(f"[{session_id}] Error: {e}")
        if session_id in sessions:
            del sessions[session_id]
        raise
