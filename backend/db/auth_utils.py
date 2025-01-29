import requests


def validate_token(auth_header, email):
    try:
        response = requests.get(
            f"https://api.capyx.be/v1/users/{email}",
            headers={"Authorization": auth_header},
        )
        return response.status_code == 200
    except Exception:
        return False
