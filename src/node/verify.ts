import { timingSafeEqual } from "crypto";
import { Buffer } from "buffer";

import { sign } from "./sign";
import { VERSION } from "../version";
import { getAlgorithm } from "../utils";

export async function verify(
  secret: string,
  eventPayload: string,
  signature: string
): Promise<boolean> {
  if (!secret || !eventPayload || !signature) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret, eventPayload & signature required"
    );
  }

  const signatureBuffer = Buffer.from(signature);
  const algorithm = getAlgorithm(signature);

  const verificationBuffer = Buffer.from(
    await sign({ secret, algorithm }, eventPayload)
  );

  if (signatureBuffer.length !== verificationBuffer.length) {
    return false;
  }

  // constant time comparison to prevent timing attachs
  // https://stackoverflow.com/a/31096242/206879
  // https://en.wikipedia.org/wiki/Timing_attack
  return timingSafeEqual(signatureBuffer, verificationBuffer);
}

verify.VERSION = VERSION;
