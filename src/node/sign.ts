import { createHmac } from "crypto";
import { Algorithm, SignOptions } from "../types";
import { VERSION } from "../version";

export async function sign(
  options: SignOptions | string,
  payload: string
): Promise<string> {
  const { secret, algorithm } =
    typeof options === "object"
      ? {
          secret: options.secret,
          algorithm: options.algorithm || Algorithm.SHA256,
        }
      : { secret: options, algorithm: Algorithm.SHA256 };

  if (!secret || !payload) {
    throw new TypeError(
      "[@octokit/webhooks-methods] secret & payload required for sign()"
    );
  }

  if (!Object.values(Algorithm).includes(algorithm as Algorithm)) {
    throw new TypeError(
      `[@octokit/webhooks] Algorithm ${algorithm} is not supported. Must be  'sha1' or 'sha256'`
    );
  }

  return `${algorithm}=${createHmac(algorithm, secret)
    .update(payload)
    .digest("hex")}`;
}

sign.VERSION = VERSION;
