import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, telefono, tipologia, mensaje } = body;

    // Validate inputs
    if (!nombre || !email) {
      return NextResponse.json(
        { ok: false, error: "Nombre y Email son obligatorios" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
    const payload = {
      nombre,
      email,
      telefono: telefono || "",
      tipologia: tipologia || "Consulta general",
      mensaje: mensaje || "",
      proyecto: "Verona",
      fecha: new Date().toISOString()
    };

    if (!webhookUrl) {
      console.log("[VERONA API MOCK] SHEETS_WEBHOOK_URL is not set. Payload received:", payload);
      // Wait a small bit to simulate latency
      await new Promise(resolve => setTimeout(resolve, 800));
      return NextResponse.json({ ok: true, mock: true });
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Sheets webhook returned status: ${response.status}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error sending message to sheets webhook:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
