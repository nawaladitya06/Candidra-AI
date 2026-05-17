"use server";

export async function executeCode(params: {
  language: string;
  version: string;
  source_code: string;
  stdin?: string;
}) {
  const PISTON_API_URL = "https://emkc.org/api/v2/piston";

  const res = await fetch(`${PISTON_API_URL}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: params.language,
      version: params.version,
      files: [{ content: params.source_code }],
      stdin: params.stdin || "",
    }),
  });

  if (!res.ok) throw new Error("Code execution failed");
  const data = await res.json() as any;
  
  return {
    stdout: data.run?.stdout || "",
    stderr: data.run?.stderr || "",
    output: data.run?.output || "",
    code: data.run?.code,
    compile_output: data.compile?.output || "",
    time: data.run?.time !== undefined ? String(data.run.time) : "0.05",
    memory: data.run?.memory !== undefined ? String(data.run.memory) : "120",
  };
}
