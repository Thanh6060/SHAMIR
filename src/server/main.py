

import sys
import os
import shamir_secret_galois as SSS_GF8
import shamir_secret as SSS_Prime

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_banner():
    print("=" * 60)
    print("      SHAMIR'S SECRET SHARING ENGINE (GF256 & PRIME)")
    print("=" * 60)
    print(" Công cụ phân tách thông tin bảo mật cục bộ cực đơn giản.")
    print("=" * 60)

def main_menu():
    while True:
        clear_screen()
        print_banner()
        print("  1. Chia nhỏ bí mật (Split Secret) - Khuyên dùng GF(256)")
        print("  2. Khôi phục bí mật (Reconstruct Secret)")
        print("  3. Thử nghiệm Demo chuyển đổi Số <-> Chữ (Classic Prime)")
        print("  4. Thoát chương trình")
        print("-" * 60)
        
        choice = input("Vui lòng nhập lựa chọn của bạn (1-4): ").strip()
        
        if choice == '1':
            handle_split()
        elif choice == '2':
            handle_reconstruct()
        elif choice == '3':
            handle_demo_prime()
        elif choice == '4':
            print("\nCám ơn bạn đã sử dụng chương trình tối mật SSS! Tạm biệt.")
            break
        else:
            input("\nLựa chọn không hợp lệ. Nhấn Enter để thử lại...")

def handle_split():
    clear_screen()
    print_banner()
    print(">>> CHỨC NĂNG: CHIA NHỎ BÍ MẬT")
    print("-" * 60)
    
    secret = input("Nhập chuỗi văn bản bí mật cần bảo vệ:\n=> ").strip()
    if not secret:
        print("Lỗi: Bí mật không thể để trống!")
        input("\nNhấn Enter để quay lại...")
        return
        
    try:
        n = int(input("\nNhập tổng số phần phân chia muốn tạo ra (N, ví dụ 5): ").strip())
        k = int(input("Nhập số phần tối thiểu cần để mở khóa (Ngưỡng K, ví dụ 3): ").strip())
    except ValueError:
        print("Lỗi: Vui lòng nhập số nguyên hợp lệ!")
        input("\nNhấn Enter để quay lại...")
        return
        
    if k < 2 or n < k:
        print(f"Lỗi không hợp lệ: Yêu cầu K >= 2 và N >= K (bạn nhập N={n}, K={k})")
        input("\nNhấn Enter để quay lại...")
        return
        
    print("\n--- Đang mã hóa và phân tách (GF256) ---")
    try:
        shares = SSS_GF8.split_secret(secret, n, k)
        print(f"\nPhân tách thành công cơ chế ({k}-trong-{n})!")
        print("\nDƯỚI ĐÂY LÀ DANH SÁCH CÁC PHẦN CHIA (Hãy lưu trữ ở các nơi khác nhau):")
        print("-" * 60)
        for share in shares:
            print(share)
        print("-" * 60)
        print("Mẹo: Định dạng mẫu là 'X_tọa_độ-mã_hex_dữ_liệu'.")
    except Exception as e:
        print(f"Có lỗi xảy ra: {e}")
        
    input("\nNhấn Enter để quay về menu chính...")

def handle_reconstruct():
    clear_screen()
    print_banner()
    print(">>> CHỨC NĂNG: KHÔI PHỤC BÍ MẬT BAN ĐẦU")
    print("-" * 60)
    print("Nhập các phần chia của bạn (mỗi dòng một phần chia).")
    print("Khi nhập xong, gõ dòng chữ 'DONE' hoặc Enter hai lần để bắt đầu dịch mã:")
    print("-" * 60)
    
    shares_input = []
    while True:
        line = input().strip()
        if line.upper() == 'DONE' or (line == '' and len(shares_input) > 0):
            break
        if line == '' and len(shares_input) == 0:
            print("(Đang đợi dữ liệu phần chia... Hãy dán các chuỗi dạng '1-ax88...' vào đây)")
            continue
        shares_input.append(line)
        
    print(f"\nĐang giải mã {len(shares_input)} phần chia đã nhận...")
    try:
        reconstructed = SSS_GF8.reconstruct_secret(shares_input)
        print("=" * 60)
        print("🔓 GIẢI MÃ THÀNH CÔNG!")
        print(f"Bí mật nguyên bản của bạn thu lại là: \n\n*** {reconstructed} ***\n")
        print("=" * 60)
    except Exception as e:
        print(f"\n❌ Giải mã thất bại: {e}")
        print("Bạn có thể đã nhập thiếu số lượng phần chia tối thiểu K, hoặc nhập sai dòng dữ liệu.")
        
    input("\nNhấn Enter để quay về menu chính...")

def handle_demo_prime():
    clear_screen()
    print_banner()
    print(">>> DEMO TOÁN HỌC TRÊN SỐ NGUYÊN (CLASSIC PRIME FIELD)")
    print("-" * 60)
    print("Mô phỏng thuật toán trên số nguyên tố PRIME khổng lồ:")
    print(f"PRIME = {SSS_Prime.PRIME}")
    print("-" * 60)
    
    secret_text = input("Nhập một từ khóa tiếng Việt ngắn (ví dụ: 'ToiYeuPy'): ").strip()
    if not secret_text:
        secret_text = "ToiYeuPy"
        
    # Translate text to a huge integer
    secret_int = SSS_Prime.text_to_int(secret_text)
    print(f"\n1. Văn bản '{secret_text}' chuyển thành số nguyên lớn:\n=> {secret_int}")
    
    # Split
    shares = SSS_Prime.split_secret_int(secret_int, 5, 3)
    print("\n2. Phân chia thành (3-trong-5) phần chia tọa độ (X, Y):")
    for i, (x, y) in enumerate(shares):
        print(f"   Phần {i+1}: X = {x}, Y = {y}")
        
    # Let's take just 3 points to reconstruct (e.g. 1st, 3rd, 5th)
    subset = [shares[0], shares[2], shares[4]]
    print(f"\n3. Tiến hành khôi phục chỉ sử dụng 3 phần chia: Phần 1, Phần 3 và Phần 5...")
    
    recovered_int = SSS_Prime.reconstruct_secret_int(subset)
    recovered_text = SSS_Prime.int_to_text(recovered_int)
    
    print(f"\n4. Kết quả số khôi phục được: {recovered_int}")
    print(f"   Kết quả chữ phiên dịch: *** {recovered_text} ***")
    print("=" * 60)
    print("Thử nghiệm toán học chứng minh hoàn hảo!")
    
    input("\nNhấn Enter để quay về menu chính...")

if __name__ == '__main__':
    try:
        main_menu()
    except KeyboardInterrupt:
        print("\nĐã hủy bỏ chương trình. Tạm biệt!")
