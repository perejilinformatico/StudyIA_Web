import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.GROQ_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Falta configurar GROQ_API_KEY" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { nombre, email } = await request.json();

  if (!nombre || !email) {
    return new Response(JSON.stringify({ error: "Faltan nombre o email" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Sos StudyIA, un asistente breve, amable y educativo. Responde siempre en espanol rioplatense.",
        },
        {
          role: "user",
          content: `Saluda a ${nombre}, confirma que recibiste su email ${email} y contale en una frase que StudyIA le va a avisar las novedades.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: "Groq no respondio correctamente" }), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const result = await response.json();
  const answer = result?.choices?.[0]?.message?.content?.trim() || "Listo, ya recibimos tus datos. Pronto vas a tener novedades de StudyIA.";

  return new Response(JSON.stringify({ answer }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
