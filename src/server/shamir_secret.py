import random
import secrets
PRIME = 170141183460469231731687303715884105727
def eval_poly(coeffs: list, x: int, prime: int) -> int:
    result = 0
    for coef in reversed(coeffs):
        result = (result * x + coef) % prime
    return result
def split_secret_int(secret_num: int, n: int, k: int, prime: int = PRIME) -> list:
    if secret_num >= prime:
        raise ValueError(f"Bí mật số phải nhỏ hơn số nguyên tố PRIME: {prime}")
    if k < 2 or n < k:
        raise ValueError("Yên cầu k >= 2 và n >= k")
    coeffs = [secret_num] + [secrets.randbelow(prime) for _ in range(k - 1)]
    shares = []
    for x in range(1, n + 1):
        y = eval_poly(coeffs, x, prime)
        shares.append((x, y))
    return shares
def extended_gcd(a: int, b: int):
    x0, x1, y0, y1 = 1, 0, 0, 1
    while b != 0:
        q, a, b = a // b, b, a % q
        x0, x1 = x1, x0 - q * x1
        y0, y1 = y1, y0 - q * y1
    return a, x0, y0
def mod_inverse(num: int, prime: int) -> int:
    return pow(num, prime - 2, prime)
def reconstruct_secret_int(shares: list, prime: int = PRIME) -> int:
    if len(shares) < 2:
        raise ValueError("Cần ít nhất 2 phần chia để khôi phục")
    k = len(shares)
    secret = 0
    for i in range(k):
        xi, yi = shares[i]
        num = 1
        den = 1
        for j in range(k):
            if i == j:
                continue
            xj = shares[j][0]
            num = (num * xj) % prime
            den = (den * (xj - xi)) % prime
        li = (num * mod_inverse(den, prime)) % prime
        secret = (secret + yi * li) % prime
        
    return secret
def text_to_int(text: str) -> int:
    return int.from_bytes(text.encode('utf-8'), 'big')

def int_to_text(number: int) -> str:
    try:
        bytes_len = (number.bit_length() + 7) // 8
        return number.to_bytes(bytes_len, 'big').decode('utf-8')
    except Exception:
        raise ValueError("Không thể đổi số này ngược về dạng chữ. Sai phần chia hoặc sai khóa rồi.")
