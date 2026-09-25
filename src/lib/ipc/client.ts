import { invoke } from "@tauri-apps/api/core";
import { decodeAppError, decodeFoundationStatus, type AppError, type FoundationStatus } from "./contracts";

export type FoundationResult =
  | { ok: true; status: FoundationStatus }
  | { ok: false; kind: "application"; error: AppError }
  | { ok: false; kind: "transport" | "contract"; message: string };

export async function getFoundationStatus(): Promise<FoundationResult> {
  let value: unknown;
  try {
    value = await invoke<unknown>("get_foundation_status");
  } catch (error: unknown) {
    const applicationError = decodeAppError(error);
    return applicationError
      ? { ok: false, kind: "application", error: applicationError }
      : { ok: false, kind: "transport", message: "The desktop backend is unavailable. Open File Intelligence through Tauri." };
  }
  try {
    return { ok: true, status: decodeFoundationStatus(value) };
  } catch {
    return { ok: false, kind: "contract", message: "The desktop backend returned an unsupported response." };
  }
}
