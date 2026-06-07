

import os

def gf8_mul(a: int, b: int) -> int:
    p = 0
    a &= 0xff
    b &= 0xff
    for _ in range(8):
        if b & 1:
            p ^= a
        carry = a & 0x80
        a = (a << 1) & 0xff
        if carry:
            a ^= 0x1b
        b >>= 1
    return p


def gf8_inv(a: int) -> int:
    a &= 0xff
    if a == 0:
        raise ValueError("Không thể chia cho 0 trong Trường Galois GF(256)")
    for i in range(1, 256):
        if gf8_mul(a, i) == 1:
            return i
    return 0

def split_secret(secret_str: str, n: int, k: int) -> list:
    if k < 2:
        raise ValueError("Ngưỡng tối thiểu K phải từ 2 trở lên.")
    if n < k:
        raise ValueError("Tổng số phần N phải >= Ngưỡng tối thiểu K.")
    if n > 255:
        raise ValueError("Tổng số phần chia tối đa hỗ trợ trong GF(256) là 255.")

    secret_bytes = secret_str.encode('utf-8')
    num_bytes = len(secret_bytes)
    
    
    shares_data = {x: bytearray(num_bytes) for x in range(1, n + 1)}

    for byte_idx in range(num_bytes):
        secret_byte = secret_bytes[byte_idx]
        
        
        coeffs = [secret_byte]
        for _ in range(1, k):
            coeffs.append(int(os.urandom(1)[0]))

      
        for x in range(1, n + 1):
            y = coeffs[k - 1]
            for i in range(k - 2, -1, -1):
                y = gf8_mul(y, x) ^ coeffs[i]
            shares_data[x][byte_idx] = y

    formatted_shares = []
    for x, data in shares_data.items():
        hex_payload = data.hex()
        formatted_shares.append(f"{x}-{hex_payload}")
    
    return formatted_shares

def reconstruct_secret(shares: list) -> str:

    if not shares:
        raise ValueError("Danh sách phần chia rỗng.")

    parsed_shares = []
    expected_len = -1

    for s in shares:
        s = s.strip()
        if not s:
            continue
        parts = s.split('-')
        if len(parts) != 2:
            raise ValueError(f"Định dạng phần chia rỗng hoặc sai: '{s}'. Định dạng đúng: 'X-Payload_Hex'")
        
        try:
            x = int(parts[0])
        except ValueError:
            raise ValueError(f"Tọa độ X không hợp lệ: '{parts[0]}'")
            
        if x < 1 or x > 255:
            raise ValueError(f"Tọa độ X phải nằm trong khoảng [1, 255]")

        try:
            payload_bytes = bytearray.fromhex(parts[1])
        except ValueError:
            raise ValueError(f"Payload Hex không hợp lệ cho phần {x}")

        if expected_len == -1:
            expected_len = len(payload_bytes)
        elif len(payload_bytes) != expected_len:
            raise ValueError("Độ dài dữ liệu giữa các phần chia không đồng nhất. Bạn có nhập nhầm phần chia?")

        if any(p[0] == x for p in parsed_shares):
            raise ValueError(f"Trùng lặp tọa độ X = {x}.")

        parsed_shares.append((x, payload_bytes))

    if not parsed_shares:
        raise ValueError("Không tìm thấy phần chia hợp lệ nào.")

    k = len(parsed_shares)
    reconstructed = bytearray(expected_len)
    for byte_idx in range(expected_len):
        secret_byte_val = 0
        for i in range(k):
            xi, yi_bytes = parsed_shares[i]
            yi = yi_bytes[byte_idx]
            li = 1
            for j in range(k):
                if i == j:
                    continue
                xj = parsed_shares[j][0]
                
               
                num = xj
                den = xj ^ xi
                li = gf8_mul(li, gf8_mul(num, gf8_inv(den)))
            
            secret_byte_val ^= gf8_mul(yi, li)
        
        reconstructed[byte_idx] = secret_byte_val

    return reconstructed.decode('utf-8')
