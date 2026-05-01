import { NextResponse } from "next/server";

type LoginRequest = {
  registration?: string;
  password?: string;
};

type ControllerLoginSuccessResponse = {
  sessionId?: string;
};

type LoginSuccessResponse = {
  sessionId: string;
};

type LoginErrorResponse = {
  message?: string;
  code?: string;
  status?: number;
};

const DEFAULT_ERROR_MESSAGE = "Nao foi possivel realizar o login. Tente novamente.";

function buildErrorResponse(message: string, status: number, code?: string) {
  const body: LoginErrorResponse = {
    message,
    status,
  };

  if (code) {
    body.code = code;
  }

  return NextResponse.json(body, { status });
}

function normalizeErrorMessage(error?: LoginErrorResponse) {
  if (error?.code === "INVALID_CREDENTIALS" || error?.status === 401) {
    return "Matricula ou senha invalidos.";
  }

  return error?.message || DEFAULT_ERROR_MESSAGE;
}

export async function POST(request: Request) {
  let body: LoginRequest;

  try {
    body = (await request.json()) as LoginRequest;
  } catch {
    return buildErrorResponse("Dados de login invalidos.", 400, "INVALID_REQUEST_BODY");
  }

  const registration = body.registration?.trim();
  const password = body.password;

  if (!registration || !password) {
    return buildErrorResponse("Informe matricula e senha para continuar.", 400, "MISSING_CREDENTIALS");
  }

  const apiBaseUrl = process.env.CHATBOT_API_BASE_URL;

  if (!apiBaseUrl) {
    return buildErrorResponse("Servico de login nao configurado.", 500, "API_BASE_URL_NOT_CONFIGURED");
  }

  try {
    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registration,
        password,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as ControllerLoginSuccessResponse & LoginErrorResponse;

    if (!response.ok) {
      return buildErrorResponse(normalizeErrorMessage(data), response.status, data.code);
    }

    if (!data.sessionId) {
      return buildErrorResponse("Resposta de login invalida.", 502, "INVALID_LOGIN_RESPONSE");
    }

    const successBody: LoginSuccessResponse = {
      sessionId: data.sessionId,
    };

    return NextResponse.json(successBody);
  } catch {
    return buildErrorResponse("Nao foi possivel conectar ao servico de login.", 503, "LOGIN_SERVICE_UNAVAILABLE");
  }
}
