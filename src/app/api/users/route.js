// src/app/api/users/route.js
import { adminDb } from "../../../../lib/firebaseAdmin";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("users").get();
    const users = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (err) {
    console.error("api/users GET error", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}