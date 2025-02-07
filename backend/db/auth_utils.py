import requests


def get_capyx_token(auth_header, email):
    try:
        response = requests.get(
            f"https://api.capyx.be/v1/users/{email}",
            headers={"Authorization": auth_header},
        )
        return response
    except Exception:
        return False


def validate_token(response):
    return response.status_code == 200
