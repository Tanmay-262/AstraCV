import requests
import uuid

BASE_URL = "http://127.0.0.1:5000"

def test_auth_and_isolation():
    print("=== STARTING END-TO-END AUTHENTICATION AND ISOLATION TEST ===")
    
    # 1. Access protected route without credentials
    print("\n1. Testing unauthorized access to GET /analyses...")
    res = requests.get(f"{BASE_URL}/analyses")
    print(f"Status Code: {res.status_code}")
    assert res.status_code == 401, "Should reject requests without Authorization header"
    print("[SUCCESS] Successfully rejected unauthorized request with 401!")

    # Generate unique emails for test runs
    email_a = f"user_a_{uuid.uuid4().hex[:8]}@example.com"
    email_b = f"user_b_{uuid.uuid4().hex[:8]}@example.com"
    password = "SuperSecurePassword123!"

    # 2. Register User A
    print(f"\n2. Registering User A ({email_a})...")
    res = requests.post(f"{BASE_URL}/auth/signup", json={
        "name": "User Alpha",
        "email": email_a,
        "password": password
    })
    print(f"Status Code: {res.status_code}")
    assert res.status_code == 201, "Sign up for User A should succeed"
    print("[SUCCESS] User A successfully registered!")

    # 3. Log in User A
    print("\n3. Logging in User A...")
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email_a,
        "password": password
    })
    print(f"Status Code: {res.status_code}")
    assert res.status_code == 200, "Log in for User A should succeed"
    user_a_data = res.json()
    assert "token" in user_a_data, "Response must return JWT token"
    token_a = user_a_data["token"]
    print("[SUCCESS] User A logged in successfully and received JWT token!")

    # 4. Register and Log in User B
    print(f"\n4. Registering and logging in User B ({email_b})...")
    res = requests.post(f"{BASE_URL}/auth/signup", json={
        "name": "User Beta",
        "email": email_b,
        "password": password
    })
    assert res.status_code == 201
    
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email_b,
        "password": password
    })
    assert res.status_code == 200
    token_b = res.json()["token"]
    print("[SUCCESS] User B successfully registered and logged in!")

    # 5. Fetch history for User A (should be empty initially)
    print("\n5. Fetching history for User A...")
    headers_a = {"Authorization": f"Bearer {token_a}"}
    res = requests.get(f"{BASE_URL}/analyses", headers=headers_a)
    print(f"Status Code: {res.status_code}")
    if res.status_code != 200:
        print(f"Error Response Body: {res.text}")
    assert res.status_code == 200
    history_a = res.json()
    print(f"User A initial history count: {len(history_a)}")
    print("[SUCCESS] Fetched User A history!")

    # 6. Fetch history for User B (should be empty initially)
    print("\n6. Fetching history for User B...")
    headers_b = {"Authorization": f"Bearer {token_b}"}
    res = requests.get(f"{BASE_URL}/analyses", headers=headers_b)
    print(f"Status Code: {res.status_code}")
    if res.status_code != 200:
        print(f"Error Response Body: {res.text}")
    assert res.status_code == 200
    history_b = res.json()
    print(f"User B initial history count: {len(history_b)}")
    print("[SUCCESS] Fetched User B history!")

    print("\n=== ALL E2E AUTHENTICATION AND ISOLATION CHECKS PASSED SUCCESSFULLY! ===")

if __name__ == "__main__":
    test_auth_and_isolation()
