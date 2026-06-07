export function gf8_mul(a: number, b: number): number {
  let p = 0;
  let tempA = a & 0xff;
  let tempB = b & 0xff;
  while (tempB > 0) {
    if (tempB & 1) {
      p ^= tempA;
    }
    const carry = tempA & 0x80;
    tempA = (tempA << 1) & 0xff;
    if (carry) {
      tempA ^= 0x1b; // 0x11b
    }
    tempB >>= 1;
  }
  return p;
}

export function gf8_inv(a: number): number {
  const byteVal = a & 0xff;
  if (byteVal === 0) {
    throw new Error("Không thể chia cho 0 trong Trường Galois GF(256)");
  }
  for (let i = 1; i < 256; i++) {
    if (gf8_mul(byteVal, i) === 1) {
      return i;
    }
  }
  return 0;
}

export function stringToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function bytesToString(bytes: Uint8Array): string {
  try {
    return new TextDecoder().decode(bytes);
  } catch (error) {
    throw new Error("Không thể giải mã chuỗi UTF-8 từ các byte khôi phục.");
  }
}

function getRandomByte(): number {
  return Math.floor(Math.random() * 256);
}

export function splitSecret(secret: string, n: number, k: number): string[] {
  if (k < 2) {
    throw new Error("Ngưỡng tối thiểu (K) phải từ 2 trở lên.");
  }
  if (n < k) {
    throw new Error("Tổng số phần chia (N) phải lớn hơn hoặc bằng Ngưỡng (K).");
  }
  if (n > 255) {
    throw new Error("Tổng số phần chia tối đa là 255.");
  }

  const secretBytes = stringToBytes(secret);
  const len = secretBytes.length;

  const sharesData: Uint8Array[] = Array.from(
    { length: n },
    () => new Uint8Array(len),
  );

  for (let byteIdx = 0; byteIdx < len; byteIdx++) {
    const secretByte = secretBytes[byteIdx];

    const coeffs: number[] = [secretByte];
    for (let c = 1; c < k; c++) {
      coeffs.push(getRandomByte());
    }

    for (let x = 1; x <= n; x++) {
      // Use Horner's method
      let y = coeffs[k - 1];
      for (let i = k - 2; i >= 0; i--) {
        y = gf8_mul(y, x) ^ coeffs[i];
      }
      sharesData[x - 1][byteIdx] = y;
    }
  }

  return sharesData.map((bytes, idx) => {
    const xCoord = idx + 1;
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `${xCoord}-${hex}`;
  });
}

export function reconstructSecret(shares: string[]): string {
  if (shares.length === 0) {
    throw new Error("Vui lòng nhập ít nhất một phần chia.");
  }

  // Parse shares
  const parsedShares: { x: number; bytes: number[] }[] = [];
  let byteLength = -1;

  for (const part of shares) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const parts = trimmed.split("-");
    if (parts.length !== 2) {
      throw new Error(
        `Định dạng phần chia không hợp lệ: "${trimmed}". Phải có dạng "x-payloadHEX".`,
      );
    }

    const x = parseInt(parts[0], 10);
    if (isNaN(x) || x < 1 || x > 255) {
      throw new Error(
        `Tọa độ x không hợp lệ: "${parts[0]}". Phải nằm trong khoảng 1-255.`,
      );
    }

    const hex = parts[1];
    if (hex.length % 2 !== 0) {
      throw new Error(`Payload hex không hợp lệ (độ dài lẻ): "${hex}".`);
    }

    const bytes: number[] = [];
    for (let i = 0; i < hex.length; i += 2) {
      const b = parseInt(hex.substring(i, i + 2), 16);
      if (isNaN(b)) {
        throw new Error(
          `Mã hex không hợp lệ trong payload: "${hex.substring(i, i + 2)}".`,
        );
      }
      bytes.push(b);
    }

    if (byteLength === -1) {
      byteLength = bytes.length;
    } else if (bytes.length !== byteLength) {
      throw new Error(
        "Các phần chia có độ dài dữ liệu khác nhau. Bạn đã nhập nhầm phần chia từ một bí mật khác?",
      );
    }

    if (parsedShares.some((s) => s.x === x)) {
      throw new Error(
        `Phát hiện trùng lặp tọa độ x = ${x}. Vui lòng nhập các phần chia khác nhau.`,
      );
    }

    parsedShares.push({ x, bytes });
  }

  if (parsedShares.length === 0) {
    throw new Error("Không tìm thấy phần chia hợp lệ.");
  }

  const k = parsedShares.length;
  const decodedBytes = new Uint8Array(byteLength);

  for (let byteIdx = 0; byteIdx < byteLength; byteIdx++) {
    let secretByteVal = 0;

    for (let i = 0; i < k; i++) {
      const xi = parsedShares[i].x;
      const yi = parsedShares[i].bytes[byteIdx];
      let li = 1;
      for (let j = 0; j < k; j++) {
        if (i === j) continue;
        const xj = parsedShares[j].x;
        const num = xj;
        const den = xj ^ xi;
        li = gf8_mul(li, gf8_mul(num, gf8_inv(den)));
      }

      secretByteVal ^= gf8_mul(yi, li);
    }

    decodedBytes[byteIdx] = secretByteVal;
  }

  return bytesToString(decodedBytes);
}
